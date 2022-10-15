import {
  Currency,
  NATIVE,
} from 'sdk'
import { useMemo } from 'react'
import { useActiveWeb3React } from 'services/web3'

export const feeRangeCalc = (amp: number): string => {
  let baseFee = 0
  if (amp > 20) baseFee = 4
  if (amp <= 20 && amp > 5) baseFee = 10
  if (amp <= 5 && amp > 2) baseFee = 20
  if (amp <= 2) baseFee = 30

  return `${(baseFee / 2 / 100).toPrecision()}% - ${((baseFee * 2) / 100).toPrecision()}%`
}

export const getTradingFeeAPR = (liquidity?: string, feeOneDay?: string): number => {
  return !feeOneDay || !liquidity || parseFloat(liquidity) === 0
    ? 0
    : (parseFloat(feeOneDay) * 365 * 100) / parseFloat(liquidity)
}

export function useCurrencyConvertedToNative(currency?: Currency): Currency | undefined {
  const { chainId } = useActiveWeb3React()
  return useMemo(() => {
    if (!!currency && !!chainId) {
      return currency.isNative ? NATIVE[chainId] : currency
    }
    return undefined
  }, [chainId, currency])
}

export function errorFriendly(text: string): string {
  const error = text.toLowerCase()
  if (error.includes('router: expired')) {
    return 'An error occurred. Refresh the page and try again '
  } else if (
    error.includes('mintotalamountout') ||
    error.includes('err_limit_out') ||
    error.includes('return amount is not enough') ||
    error.includes('code=call_exception') ||
    error.includes('none of the calls threw an error')
  ) {
    return 'An error occurred. Try refreshing the price rate or increase max slippage'
  } else if (error.includes('header not found') || error.includes('swap failed') || error.includes('json-rpc error')) {
    return 'An error occurred. Refresh the page and try again. If the issue still persists, it might be an issue with your RPC node settings in Metamask.'
  } else return text
}