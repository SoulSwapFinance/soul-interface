import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import {
  ChainId,
  Currency,
  CurrencyAmount,
  JSBI,
  NATIVE,
  Price,
  SOUL,
  Trade,
  TradeType,
  WNATIVE_ADDRESS,
  ZERO,
} from 'sdk'
import { isAddress, tryParseAmount } from 'functions'
import { useCurrency } from 'hooks/Tokens'
import { useCoffinOrWalletBalance } from 'hooks/useCoffinOrWalletBalance'
import useENS from 'hooks/useENS'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useV2TradeExactIn as useTradeExactIn, useV2TradeExactOut as useTradeExactOut } from 'hooks/useV2Trades'
import { useActiveWeb3React } from 'services/web3'
import { useAppDispatch } from 'state/hooks'
import { useUserSingleHopOnly } from 'state/user/hooks'
import { ParsedQs } from 'qs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  Field,
  LimitPrice,
  replaceLimitOrderState,
  selectCurrency,
  setRecipient,
  switchCurrencies,
  typeInput,
} from './actions'
import { LimitOrderState, OrderExpiration, selectLimitOrder } from './reducer'

export function useLimitOrderActionHandlers(): {
  onCurrencySelection(field: Field, currency: Currency): void
  onSwitchTokens(): void
  onUserInput(field: Field, typedValue: string): void
  onChangeRecipient(recipient?: string): void
} {
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency.isToken ? currency.address : currency.isNative ? NATIVE[chainId].symbol : '',
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
      dispatch(setRecipient(recipient))
    },
    [dispatch]
  )

  return useMemo(() => {
    return {
      onSwitchTokens,
      onCurrencySelection,
      onUserInput,
      onChangeRecipient,
    }
  }, [onChangeRecipient, onCurrencySelection, onSwitchTokens, onUserInput])
}

export function useLimitOrderState(): LimitOrderState {
  return useSelector(selectLimitOrder)
}

function parseCurrencyFromURLParameter(urlParam: any): string {
  const { chainId } = useActiveWeb3React()
  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam)
    if (valid) return valid
    if (urlParam.toUpperCase() === NATIVE[chainId].symbol) return NATIVE[chainId].symbol
  }
  return ''
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
}

function parseBooleanFieldParameter(urlParam: any): boolean {
  if (typeof urlParam !== 'string') return false
  if (urlParam.toLowerCase() === 'true') return true
  if (urlParam.toLowerCase() === 'false') return false
  return false
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

export function queryParametersToSwapState(chainId: ChainId, parsedQs: ParsedQs) {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency)
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency)
  const eth = NATIVE[chainId].symbol
  const soul = SOUL[chainId].address
  if (inputCurrency === '' && outputCurrency === '') {
    inputCurrency = eth
    outputCurrency = soul
  } else if (inputCurrency === '') {
    inputCurrency = outputCurrency === eth ? soul : eth
  } else if (outputCurrency === '' || inputCurrency === outputCurrency) {
    outputCurrency = inputCurrency === eth ? soul : eth
  }

  return {
    inputCurrencyId: inputCurrency,
    outputCurrencyId: outputCurrency,
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient: validatedRecipient(parsedQs.recipient),
    limitPrice: parseTokenAmountURLParameter(parsedQs.exactRate),
    fromCoffinBalance: parseBooleanFieldParameter(parsedQs.fromCoffin),
    orderExpiration: { value: OrderExpiration.never, label: i18n._(t`Never`) },
  }
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch() {
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const parsedQs = useParsedQueryString()
  const [result, setResult] = useState<
    | {
        inputCurrencyId?: string
        outputCurrencyId?: string
      }
    | undefined
  >()

  useEffect(() => {
    if (!chainId) return

    const parsed = queryParametersToSwapState(chainId, parsedQs)
    dispatch(
      replaceLimitOrderState({
        ...parsed,
        recipient: undefined,
      })
    )

    setResult({
      inputCurrencyId: parsed.inputCurrencyId,
      outputCurrencyId: parsed.outputCurrencyId,
    })

  }, [dispatch, chainId, parsedQs])

  return result
}

type UseLimitOrderDerivedCurrencies = () => { inputCurrency?: Currency; outputCurrency?: Currency }
export const useLimitOrderDerivedCurrencies: UseLimitOrderDerivedCurrencies = () => {
  const { chainId } = useActiveWeb3React()
  const { inputCurrencyId, outputCurrencyId } = useLimitOrderState()
  const inputCurrency =
    useCurrency(inputCurrencyId === 'SOUL' ? SOUL[chainId].address : inputCurrencyId) ?? undefined
  const outputCurrency =
    useCurrency(outputCurrencyId === 'SOUL' ? SOUL[chainId].address : outputCurrencyId) ?? undefined

  return useMemo(() => {
    return {
      inputCurrency,
      outputCurrency,
    }
  }, [inputCurrency, outputCurrency])
}

type UseLimitOrderDerivedLimitPrice = () => Price<Currency, Currency> | undefined
export const useLimitOrderDerivedLimitPrice: UseLimitOrderDerivedLimitPrice = () => {
  const { limitPrice, invertRate } = useLimitOrderState()
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()

  return useMemo(() => {
    const baseAmount = tryParseAmount(invertRate ? limitPrice : '1', inputCurrency)
    const quoteAmount = tryParseAmount(invertRate ? '1' : limitPrice, outputCurrency)

    return baseAmount && quoteAmount && inputCurrency && outputCurrency
      ? new Price({ baseAmount, quoteAmount })
      : undefined
  }, [inputCurrency, invertRate, limitPrice, outputCurrency])
}

type UseLimitOrderDerivedParsedAmounts = ({
  rate,
  trade,
}: {
  rate?: Price<Currency, Currency>
  trade?: Trade<Currency, Currency, TradeType>
}) => {
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
}

export const useLimitOrderDerivedParsedAmounts: UseLimitOrderDerivedParsedAmounts = ({ rate, trade }) => {
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()
  const { typedField, typedValue } = useLimitOrderState()

  return useMemo(() => {
    const _rate = rate || trade?.executionPrice
    const exactIn = typedField === Field.INPUT
    const typedAmountCurrency = exactIn ? inputCurrency : outputCurrency
    const typedAmount = tryParseAmount(typedValue, typedAmountCurrency ?? undefined)

    const otherAmount =
      inputCurrency && outputCurrency && _rate && typedAmount
        ? exactIn
          ? _rate.quote(typedAmount)
          : _rate.invert().quote(typedAmount)
        : undefined

    return {
      inputAmount: exactIn ? typedAmount : otherAmount,
      outputAmount: exactIn ? otherAmount : typedAmount,
    }
  }, [inputCurrency, outputCurrency, rate, trade?.executionPrice, typedField, typedValue])
}

type UseLimitOrderDerivedTypedInputAmount = () => CurrencyAmount<Currency> | undefined
export const useLimitOrderDerivedTypedInputAmount: UseLimitOrderDerivedTypedInputAmount = () => {
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()
  const { typedField, typedValue } = useLimitOrderState()

  return useMemo(() => {
    const exactIn = typedField === Field.INPUT
    return tryParseAmount(typedValue, (exactIn ? inputCurrency : outputCurrency) ?? undefined)
  }, [inputCurrency, outputCurrency, typedField, typedValue])
}

type UseLimitOrderDerivedInputError = ({ trade }: { trade?: Trade<Currency, Currency, TradeType> }) => string
export const useLimitOrderDerivedInputError: UseLimitOrderDerivedInputError = ({ trade }) => {
  const { recipient, orderExpiration, fromCoffinBalance, limitPrice, typedValue } = useLimitOrderState()
  const { account } = useActiveWeb3React()
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()
  const recipientLookup = useENS(recipient)
  const to = !recipient ? account : recipientLookup.address
  const parsedRate = useLimitOrderDerivedLimitPrice()
  const balance = useCoffinOrWalletBalance(account ?? undefined, inputCurrency, !fromCoffinBalance)

  return useMemo(() => {
    return !account
      ? 'Connect Wallet'
      : !trade?.inputAmount.greaterThan(ZERO) || !typedValue
      ? i18n._(t`Enter Amount`)
      : !inputCurrency || !outputCurrency
      ? i18n._(t`Select Token`)
      : !to || !isAddress(to)
      ? i18n._(t`Enter Recipient`)
      : limitPrice !== LimitPrice.CURRENT && parsedRate?.equalTo(ZERO)
      ? i18n._(t`Select Rate`)
      : !orderExpiration
      ? i18n._(t`Select Order Expiration`)
      : !balance
      ? i18n._(t`Loading Balance`)
      : balance && trade?.inputAmount && balance.lessThan(trade.inputAmount)
      ? i18n._(t`Insufficient Balance`)
      : ''
  }, [
    account,
    balance,
    inputCurrency,
    limitPrice,
    orderExpiration,
    outputCurrency,
    parsedRate,
    to,
    trade?.inputAmount,
    typedValue,
  ])
}

type UseLimitOrderDerivedTrade = () => Trade<Currency, Currency, TradeType> | undefined
export const useLimitOrderDerivedTrade: UseLimitOrderDerivedTrade = () => {
  const { typedField } = useLimitOrderState()
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()
  const typedInputAmount = useLimitOrderDerivedTypedInputAmount()
  const [singleHopOnly] = useUserSingleHopOnly()
  const exactIn = typedField === Field.INPUT

  // To get the initial rate we need to enter a default value
  const inputAmount = inputCurrency
    ? typedInputAmount ||
      CurrencyAmount.fromRawAmount(
        inputCurrency,
        JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(inputCurrency.decimals))
      )
    : undefined

  const bestTradeExactIn = useTradeExactIn(exactIn ? inputAmount : undefined, outputCurrency ?? undefined, {
    maxHops: singleHopOnly ? 1 : undefined,
  })

  const bestTradeExactOut = useTradeExactOut(inputCurrency ?? undefined, !exactIn ? inputAmount : undefined, {
    maxHops: singleHopOnly ? 1 : undefined,
  })

  return useMemo(() => {
    return (exactIn ? bestTradeExactIn : bestTradeExactOut) ?? undefined
  }, [bestTradeExactIn, bestTradeExactOut, exactIn])
}

export default useLimitOrderDerivedCurrencies