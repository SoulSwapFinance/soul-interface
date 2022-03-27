import { ChainId, Currency } from 'sdk'

export function currencyId(currency: Currency): string {
  // if ([ChainId.CELO].includes(currency.chainId)) {
  //   return currency.wrapped.address
  // }

  if (currency.isNative) return 'FTM'

  if (currency.isToken) return currency.address

  throw new Error('invalid currency')
}