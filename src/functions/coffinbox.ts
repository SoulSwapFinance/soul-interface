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

export function toAmount(rebase: Rebase, shares: number | BigNumber): BigNumber {
  // console.log('toAmount', token, shares)
  return Number(rebase.elastic) > 0 
  ? BigNumber.from(Number(shares) * Number(rebase.elastic) / Number(rebase.base))
  : BigNumber.from(0)
  // return shares.mulDiv(BigNumber.from(rebase.elastic || 0), BigNumber.from(rebase.base || 0))
}

export function toShare(rebase: Rebase, amount: BigNumber): BigNumber {
  // console.log('toShare', token, shares)
  return BigNumber.from(Number(amount) * Number(rebase.base) / Number(rebase.elastic) || 0)
  // return BigNumber.from(amount)?.mul(Number(rebase.base) / (Number(rebase.elastic)) || BigNumber.from(0))
  // return BigNumber.from(Number(amount) * Number(rebase.base) / Number(rebase.elastic) || 0)

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