import { BigNumber } from '@ethersproject/bignumber'
import { CurrencyAmount, JSBI, Rebase, Token, ZERO } from 'sdk'

// export function toAmount(token, shares: BigNumber): BigNumber {
//   // console.log('toAmount', token, shares)
//   return shares.mulDiv(token.coffinAmount, token.coffinShare)
// }

// export function toShare(token, amount: BigNumber): BigNumber {
//   // console.log('toShare', token, shares)
//   return amount.mulDiv(token.coffinShare, token.coffinAmount)
// }

export function toAmount(rebase: Rebase, shares: BigNumber): BigNumber {
  // console.log('toAmount', token, shares)
  // return shares.mulDiv(BigNumber.from(rebase.elastic.toString()), BigNumber.from(rebase.base.toString()))
  return Number(rebase?.elastic) > 0 
  ? BigNumber.from(Number(shares) * Number(rebase.elastic) / Number(rebase.base))
  : BigNumber.from(0)
}

export function toShare(rebase: Rebase, amount: BigNumber): BigNumber {
  // console.log('toShare', token, shares)
  // return amount.mulDiv(BigNumber.from(rebase.base.toString()), BigNumber.from(rebase.elastic.toString()))
  return Number(rebase.elastic) > 0
  ? amount.mulDiv(BigNumber.from(rebase.base), BigNumber.from(rebase.elastic))
  : BigNumber.from(0)
}

export function toAmountJSBI(token: Rebase, shares: JSBI): JSBI {
  return JSBI.GT(token.base, 0) ? JSBI.divide(JSBI.multiply(shares, token.elastic), token.base) : ZERO
}

export function toShareJSBI(token: Rebase, amount: JSBI): JSBI {
  return JSBI.GT(token.elastic, 0) ? JSBI.divide(JSBI.multiply(amount, token.base), token.elastic) : ZERO
}

export function toAmountCurrencyAmount(token: Rebase, shares: CurrencyAmount<Token>) {
  const amount = toAmountJSBI(token, shares.quotient)
  return CurrencyAmount.fromRawAmount(shares.currency, amount)
}

export function toShareCurrencyAmount(token: Rebase, amount: CurrencyAmount<Token>) {
  const share = toShareJSBI(token, amount.quotient)
  return CurrencyAmount.fromRawAmount(amount.currency, share)
}