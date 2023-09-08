import { ChainId, JSBI, Percent, TradeType, TradeVersion, WNATIVE, ZERO } from 'sdk'
import { selectTridentSwap, TypedField } from 'features/trident/swap/swapSlice'
import useCurrenciesFromURL from 'features/trident/useCurrenciesFromURL'
import { maxAmountSpend, toAmountCurrencyAmount } from 'functions'
import { getTradeVersion } from 'functions/getTradeVersion'
import { tryParseAmount } from 'functions/parse'
import { useCoffinOrWalletBalance } from 'hooks/useCoffinOrWalletBalance'
import useCoffinRebases from 'hooks/useCoffinRebases'
import { useBestTridentTrade } from 'hooks/useBestTridentTrade'
import { useActiveWeb3React } from 'services/web3'
import { useAppSelector } from 'state/hooks'
import { useMemo } from 'react'

/*
  Private hook, specific for the Swap page component, do not use anywhere else for performance reasons.
  If you need anything from this hook, use useDerivedTridentSwapContext() instead
 */
export const _useSwapPage = () => {
  const { value, typedField, spendFromWallet } = useAppSelector(selectTridentSwap)
  const { account, chainId } = useActiveWeb3React()
  const {
    currencies: [currencyA, currencyB],
  } = useCurrenciesFromURL(chainId)
  const { rebases, loading: rebasesLoading } = useCoffinRebases([currencyA, currencyB])

  const inputCurrencyAmount = useMemo(() => {
    return tryParseAmount(value, typedField === TypedField.A ? currencyA : currencyB)
  }, [currencyA, currencyB, typedField, value])

  const isWrap = useMemo(
    () =>
      currencyA &&
      currencyB &&
      chainId &&
      ((currencyA?.isNative && WNATIVE[chainId ?? ChainId.FANTOM].address === currencyB?.wrapped.address) ||
        (currencyB?.isNative && WNATIVE[chainId ?? ChainId.FANTOM].address === currencyA?.wrapped.address)),
    [chainId, currencyA, currencyB]
  )

  const { trade, priceImpact: _priceImpact } = useBestTridentTrade(
    typedField === TypedField.A ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    inputCurrencyAmount,
    typedField === TypedField.A ? currencyA : currencyB,
    typedField === TypedField.A ? currencyB : currencyA
  )

  const priceImpact = useMemo(
    () =>
      _priceImpact
        ? new Percent(
            _priceImpact.toString().toBigNumber(18).toString(),
            JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))
          )
        : undefined,
    [_priceImpact]
  )

  // trade.output but in normal amounts instead of shares
  const tradeOutputAmount = useMemo(() => {
    if (!trade) return undefined
    if (getTradeVersion(trade) === TradeVersion.INSTANT) return trade.outputAmount
    if (
      getTradeVersion(trade) === TradeVersion.TRIDENT &&
      !rebasesLoading &&
      trade.outputAmount?.currency.wrapped.address &&
      rebases[trade?.outputAmount?.currency.wrapped.address]
    )
    // @ts-ignore FIX TYPE
      return toAmountCurrencyAmount(rebases[trade.outputAmount?.currency.wrapped.address], trade.outputAmount.wrapped)

    return undefined
  }, [rebases, rebasesLoading, trade])

  const balance = useCoffinOrWalletBalance(chainId, account ?? undefined, currencyA, spendFromWallet)

  const formattedAmounts = useMemo(() => {
    if (isWrap) return [value, value]

    return [
      typedField === TypedField.A ? value : tradeOutputAmount?.toSignificant(6) ?? '',
      typedField === TypedField.B ? value : tradeOutputAmount?.toSignificant(6) ?? '',
    ]
  }, [isWrap, tradeOutputAmount, typedField, value])

  const parsedAmounts = useMemo(() => {
    if (isWrap) return [inputCurrencyAmount, inputCurrencyAmount]

    return [inputCurrencyAmount, tradeOutputAmount]
  }, [isWrap, inputCurrencyAmount, tradeOutputAmount])

  let error = useMemo(
    () =>
      !account
        ? `Connect Wallet`
        : maxAmountSpend(balance)?.equalTo(ZERO)
        ? `Insufficient balance to cover for fees`
        : !trade?.inputAmount[0]?.greaterThan(ZERO) && !parsedAmounts[1]?.greaterThan(0)
        ? `Enter Amount`
        : trade === undefined && !isWrap
        ? `No Route Found`
        : balance && trade && inputCurrencyAmount && maxAmountSpend(balance)?.lessThan(inputCurrencyAmount)
        ? `Insufficient Balance`
        : '',
    [account, balance, inputCurrencyAmount, isWrap, parsedAmounts, trade]
  )

  return useMemo(
    () => ({
      isWrap,
      error,
      trade,
      priceImpact,
      formattedAmounts,
      parsedAmounts,
    }),
    [priceImpact, isWrap, error, trade, formattedAmounts, parsedAmounts]
  )
}

export default _useSwapPage