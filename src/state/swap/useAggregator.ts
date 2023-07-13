import { ChainId, Currency, CurrencyAmount } from 'sdk'
import { useMemo } from 'react'

// import { BAD_RECIPIENT_ADDRESSES } from 'constants/index'
import { useActiveWeb3React } from 'services/web3'
import { useCurrency } from 'hooks/Tokens'
import { useTradeExactInV2 } from 'hooks/Trades'
import useENS from 'hooks/useENS'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { Aggregator } from 'utils/swap/aggregator'
import { computeSlippageAdjustedAmounts } from 'utils/prices'

// import { useUserSlippageTolerance } from '../user/hooks'
import { Field } from './actions'
import { BAD_RECIPIENT_ADDRESSES, useSwapState } from './hooks'
import { AggregationComparer } from './types'
import { isAddress } from 'functions/validate'
import { tryParseAmount } from 'functions/parse'
import { INITIAL_ALLOWED_SLIPPAGE } from 'constants/index'

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfoV2(chainId: ChainId): {
  currencies: { [field in Field]?: Currency }
  chainId: ChainId
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmount: CurrencyAmount<Currency> | undefined
  v2Trade: Aggregator | undefined
  tradeComparer: AggregationComparer | undefined
  inputError?: string
  onRefresh: (resetRoute: boolean, minimumLoadingTime: number) => void
  loading: boolean
  isPairNotfound: boolean
} {
  const { account } = useActiveWeb3React()

//   temp solution
const allowedSlippage = INITIAL_ALLOWED_SLIPPAGE
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
    saveGas,
  } = useSwapState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const recipientLookup = useENS(recipient ?? undefined)
  const to: string | null = (recipient === null || recipient === '' ? account : recipientLookup.address) ?? null

  const relevantTokenBalances = useCurrencyBalances(
    chainId,
    account ?? undefined,
    useMemo(() => [inputCurrency ?? undefined, outputCurrency ?? undefined], [inputCurrency, outputCurrency]),
  )

  const isExactIn: boolean = independentField === Field.INPUT

  const currency = isExactIn ? inputCurrency : outputCurrency
  const parsedAmount = useMemo(() => {
    return tryParseAmount(typedValue, currency ?? undefined)
  }, [typedValue, currency])

//   const [allowedSlippage] = useUserSlippageTolerance()

  const {
    trade: bestTradeExactIn,
    comparer: baseTradeComparer,
    onUpdateCallback,
    loading,
  } = useTradeExactInV2(isExactIn ? parsedAmount : undefined, outputCurrency ?? undefined, saveGas, to, allowedSlippage)

  const tradeComparer = useMemo((): AggregationComparer | undefined => {
    if (
      bestTradeExactIn?.outputAmount?.greaterThan(0) &&
      baseTradeComparer?.outputAmount?.greaterThan(0)
    //   bestTradeExactIn?.outputAmount?.greaterThan(JSBI.BigInt(0)) &&
    //   baseTradeComparer?.outputAmount?.greaterThan(JSBI.BigInt(0))
      // && baseTradeComparer?.outputPriceUSD
    ) {
      try {
        const diffAmount = bestTradeExactIn.outputAmount.subtract(baseTradeComparer.outputAmount)
        const diffAmountUSD = bestTradeExactIn.receivedUsd - parseFloat(baseTradeComparer.receivedUsd)
        if (
          diffAmount.greaterThan(0) &&
        //   diffAmount.greaterThan(JSBI.BigInt(0)) &&
          bestTradeExactIn.receivedUsd > 0 &&
          parseFloat(baseTradeComparer.receivedUsd) > 0 &&
          diffAmountUSD > 0
        ) {
          const savedUsd = diffAmountUSD
          // const savedUsd = parseFloat(diffAmount.toFixed()) * parseFloat(baseTradeComparer.outputPriceUSD.toString())
          if (savedUsd) {
            return Object.assign({}, baseTradeComparer, {
              tradeSaved: {
                usd: savedUsd.toString(),
                percent: (savedUsd / bestTradeExactIn.receivedUsd) * 100,
              },
            })
          }
        }
      } catch (e) {}
    }
    return baseTradeComparer ?? undefined
  }, [bestTradeExactIn, baseTradeComparer])

  const v2Trade = isExactIn ? bestTradeExactIn : undefined

  const currencyBalances = useMemo(() => {
    return {
      [Field.INPUT]: relevantTokenBalances[0],
      [Field.OUTPUT]: relevantTokenBalances[1],
    }
  }, [relevantTokenBalances])

  const currencies: { [field in Field]?: Currency } = useMemo(() => {
    return {
      [Field.INPUT]: inputCurrency ?? undefined,
      [Field.OUTPUT]: outputCurrency ?? undefined,
    }
  }, [inputCurrency, outputCurrency])

  let inputError: string | undefined
  if (!account) {
    inputError = `Connect Wallet`
  }

  if (!parsedAmount) {
    if (typedValue) inputError = inputError ?? `Invalid amount`
    else inputError = inputError ?? `Enter an amount`
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? `Select a token`
  }

  const formattedTo = isAddress(to)
  if (!to || !formattedTo) {
    inputError = inputError ?? `Enter Recipient`
  } else {
      // todo: verify below
    // if (BAD_RECIPIENT_ADDRESSES[chainId] == formattedTo) 
    {
      inputError = inputError ?? `Invalid Recipient`
    }
  }

  const slippageAdjustedAmounts = v2Trade && allowedSlippage && computeSlippageAdjustedAmounts(v2Trade, allowedSlippage)

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [
    currencyBalances[Field.INPUT],
    slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null,
  ]

  if (amountIn && ((balanceIn && balanceIn.lessThan(amountIn)) || !balanceIn)) {
    inputError = `Insufficient ${amountIn.currency.symbol} Balance`
  }

  // inputCurrency/outputCurrency null is loading, undefined is not found, see useToken for detail
  const isPairNotfound = inputCurrency === undefined && outputCurrency === undefined

  return useMemo(
    () => ({
      currencies,
      chainId,
      currencyBalances,
      parsedAmount,
      v2Trade: v2Trade ?? undefined,
      tradeComparer,
      inputError,
      onRefresh: onUpdateCallback,
      loading,
      isPairNotfound,
    }),
    [
      currencies,
      chainId,
      currencyBalances,
      inputError,
      loading,
      onUpdateCallback,
      parsedAmount,
      tradeComparer,
      v2Trade,
      isPairNotfound,
    ],
  )
}