import { Currency, NATIVE } from 'sdk'

export function currencyId(currency: Currency): string {
  
  if (currency?.isNative) return currency.symbol
  if (currency?.isToken) return currency.address

  throw new Error('invalid currency')
}