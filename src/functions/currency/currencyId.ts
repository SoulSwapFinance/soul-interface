import { ZERO_ADDRESS } from 'constants/index'
import { Currency, NATIVE } from 'sdk'

export function currencyId(currency: Currency): string {
  if (currency?.isNative) return currency.symbol
  if (currency?.isToken && currency.address != ZERO_ADDRESS) return currency.address

  throw new Error('invalid currency')
}