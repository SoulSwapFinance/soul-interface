import { Currency as SwaprCurrency, TokenAmount, Token as SwaprToken } from '@swapr/sdk'
import { Currency, CurrencyAmount, Token,  } from 'sdk'
  
export function wrappedCurrency(currency: Currency | undefined, chainId: number): SwaprToken | undefined {
  if (!chainId || !currency || !SwaprCurrency.isNative(currency)) return currency instanceof SwaprToken ? currency : undefined
  return SwaprToken.getNativeWrapper(chainId)
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount<Token> | undefined,
  chainId: number
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, 250) : undefined
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.toString()) : undefined
//   return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedToken(token?: SwaprToken): SwaprCurrency | undefined {
  if (!token) return undefined
  if (SwaprCurrency.isNative(token)) return token
  if (SwaprToken.getNativeWrapper(token.chainId).equals(token)) return SwaprCurrency.getNative(token.chainId)
  return token
}