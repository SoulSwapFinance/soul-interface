import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import {
  ChainId,
  Currency,
  CurrencyAmount,
  Percent,
  DAI,
  FTM,
  SOUL,
  Trade as V2Trade,
  TradeType,
  USDC,
  NATIVE,
} from 'sdk'
import { tryParseAmount } from 'functions/parse'
import { isAddress } from 'functions/validate'
import { useCurrency } from 'hooks/Tokens'
import useENS from 'hooks/useENS'
import useParsedQueryString from 'hooks/useParsedQueryString'
import useSwapSlippageTolerance from 'hooks/useSwapSlippageTollerence'
import { useV2TradeExactIn as useTradeExactIn, useV2TradeExactOut as useTradeExactOut } from 'hooks/useV2Trades'
import { useActiveWeb3React } from 'services/web3'
import { AppState } from 'state'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { useExpertModeManager, useUserSingleHopOnly } from 'state/user/hooks'
import { ParsedQs } from 'qs'
import { useCallback, useEffect, useState } from 'react'

// import {
//   EstimatedSwapCall,
//   SuccessfulCall,
//   useSwapCallArguments,
// } from "../../hooks/useSwapCallback";
import { Field, replaceSwapState, selectCurrency, setRecipient, switchCurrencies, typeInput } from './actions'
import { SwapState } from './reducer'
import { useCurrencyBalances } from 'state/wallet/hooks'

export function useSwapState(): AppState['swap'] {
  return useAppSelector((state) => state.swap)
}

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
  onChangeRecipient: (recipient?: string | null) => void
} {
  const dispatch = useAppDispatch()
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency.isToken
            ? currency.address
            : currency.isNative ? NATIVE[currency.chainId].symbol
            //  && currency.chainId == ChainId.ETHEREUM
            //  ? 'ETH' 
            // && currency.chainId !== ChainId.CELO
            // : currency.isNative
            //  && currency.chainId == ChainId.FANTOM
            //  ? 'FTM'
            : '' 
        })
      )
    },
    [dispatch]
  )

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  const onChangeRecipient = useCallback(
    (recipient?: string) => {
      dispatch(setRecipient({recipient}))
    },
    [dispatch]
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  }
}

// TODO: Switch for ours...
const BAD_RECIPIENT_ADDRESSES: { [chainId: string]: { [address: string]: true } } = {
  [ChainId.ETHEREUM]: {
    '0x794d858b0b152fb68a5CE465451D729EFfA67f08': true, // v2 factory
    '0x2a8B48a8B8a8a8E4a184280333c418BcdcE72dE9': true, // v2 router 02
  },
  [ChainId.FANTOM]: {
    '0x1120e150dA9def6Fe930f4fEDeD18ef57c0CA7eF': true, // v2 factory
    '0x6b3d631B87FE27aF29efeC61d2ab8CE4d621cCBF': true, // v2 router 02
  },
  [ChainId.AVALANCHE]: {
    '0x5BB2a9984de4a69c05c996F7EF09597Ac8c9D63a': true, // v2 factory
    '0xa4594460A9d3D41e8B85542D34E23AdAbc3c86Ef': true, // v2 router 02
  }
}

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade: V2Trade<Currency, Currency, TradeType>, checksummedAddress: string): boolean {
  const path = trade.route.path
  return (
    path.some((token) => token.address === checksummedAddress) ||
    (trade instanceof V2Trade
      ? trade.route.pairs.some((pair) => pair.liquidityToken.address === checksummedAddress)
      : false)
  )
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(): {
  to?: string
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmount: CurrencyAmount<Currency> | undefined
  inputError?: string
  v2Trade: V2Trade<Currency, Currency, TradeType> | undefined
  allowedSlippage: Percent
} {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const [singleHopOnly] = useUserSingleHopOnly()
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const recipientLookup = useENS(recipient ?? undefined)

  const to = (recipient === null ? account : recipientLookup.address) ?? undefined

  const relevantTokenBalances 
    = 
   useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])

  const isExactIn: boolean = independentField === Field.INPUT

  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)

  const bestTradeExactIn = useTradeExactIn(isExactIn ? parsedAmount : undefined, outputCurrency ?? undefined, {
    maxHops: singleHopOnly ? 1 : undefined,
  })

  const bestTradeExactOut = useTradeExactOut(inputCurrency ?? undefined, !isExactIn ? parsedAmount : undefined, {
    maxHops: singleHopOnly ? 1 : undefined,
  })

  const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }

  let inputError: string | undefined

  if (!account) {
    inputError = 'Connect Wallet'
  }

  if (!parsedAmount) {
    inputError = inputError ?? i18n._(t`Enter Amount`)
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? i18n._(t`Select Token`)
  }

  const formattedTo = isAddress(to)
  if (!to || !formattedTo) {
    inputError = inputError ?? i18n._(t`Enter Recipient`)
  } else {
    if (
      BAD_RECIPIENT_ADDRESSES?.[chainId]?.[formattedTo] ||
      (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
      (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))
    ) {
      inputError = inputError ?? i18n._(t`Invalid Recipient`)
    }
  }

  const allowedSlippage = useSwapSlippageTolerance(v2Trade)

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [currencyBalances[Field.INPUT], v2Trade?.maximumAmountIn(allowedSlippage)]

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = i18n._(t`Insufficient Balance`)
  }

  return {
    to,
    currencies,
    currencyBalances,
    parsedAmount,
    inputError,
    v2Trade: v2Trade ?? undefined,
    allowedSlippage,
  }
}

function parseCurrencyFromURLParameter(urlParam: any): string {
  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam)
    if (valid) return valid
    if (urlParam.toUpperCase() === 'FTM') return 'FTM'
  }
  return ''
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
}

const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
function validatedRecipient(recipient: any): string | undefined {
  if (typeof recipient !== 'string') return undefined
  const address = isAddress(recipient)
  if (address) return address
  if (ENS_NAME_REGEX.test(recipient)) return recipient
  if (ADDRESS_REGEX.test(recipient)) return recipient
  return undefined
}
export function queryParametersToSwapState(parsedQs: ParsedQs, chainId: ChainId = ChainId.ETHEREUM): SwapState {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency)
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency)
  const input 
    = chainId === ChainId.FANTOM ? 'FTM' 
    : chainId === ChainId.BSC ? 'BSC'
    : chainId === ChainId.AVALANCHE ? 'AVAX'
    : 'ETH'
  //chainId === ChainId.CELO ? WNATIVE_ADDRESS[chainId] : 
  const output 
      = chainId == ChainId.FANTOM 
         ? SOUL[ChainId.FANTOM].address
         : chainId == ChainId.ETHEREUM
         ? FTM[ChainId.ETHEREUM].address
         : chainId == ChainId.AVALANCHE
         ? USDC[ChainId.AVALANCHE].address
         : chainId == ChainId.BSC
         ? USDC[ChainId.BSC].address
         : DAI[chainId].address
         
  if (inputCurrency === '' && outputCurrency === '') {
    inputCurrency = input
    outputCurrency = output
  } else if (inputCurrency === '') {
    inputCurrency = outputCurrency === input ? output : input
  } else if (outputCurrency === '' || inputCurrency === outputCurrency) {
    outputCurrency = inputCurrency === input ? output : input
  }

  const recipient = validatedRecipient(parsedQs.recipient)

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency,
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient,
  }
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | {
      inputCurrencyId: string | undefined
      outputCurrencyId: string | undefined
    }
  | undefined {
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const parsedQs = useParsedQueryString()
  const [expertMode] = useExpertModeManager()
  const [result, setResult] = useState<
    | {
        inputCurrencyId: string | undefined
        outputCurrencyId: string | undefined
      }
    | undefined
  >()

  useEffect(() => {
    if (!chainId) return
    const parsed = queryParametersToSwapState(parsedQs, chainId)

    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        recipient: expertMode ? parsed.recipient : null,
      })
    )

    setResult({
      inputCurrencyId: parsed[Field.INPUT].currencyId,
      outputCurrencyId: parsed[Field.OUTPUT].currencyId,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId])

  return result
}