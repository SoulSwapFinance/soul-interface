import { Currency } from 'sdk'

export function currencyId(currency: Currency): string {

  if (currency.isNative) return 'FTM'
  if (currency.isToken) return currency.address

  throw new Error('invalid currency')
}