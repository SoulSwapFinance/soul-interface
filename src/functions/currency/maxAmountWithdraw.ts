import { Currency, CurrencyAmount, JSBI } from '../../sdk'

const MIN_NATIVE_CURRENCY_FOR_GAS: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH

/**
 * Given some token amount, return the max that can be withdrawn of it from lending
 * @param currencyAmount to return max of
 */
export function maxAmountWithdraw(currencyAmount?: number): number | undefined {
  if (!currencyAmount) return undefined
  if (currencyAmount) {
      return currencyAmount
    }
  return currencyAmount
}
