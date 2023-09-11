import { Currency, CurrencyAmount, Fraction,JSBI, Percent, TokenAmount } from 'sdk'

import { basisPointsToPercent } from 'utils'

export const minimumAmountAfterSlippage = (amount: CurrencyAmount<Currency>, slippage: number | Percent) => {
  const slippagePercent = typeof slippage === 'number' ? basisPointsToPercent(slippage) : slippage

  const slippageAdjustedAmount = new Fraction(amount.quotient).multiply(
    new Fraction(JSBI.BigInt(1)).subtract(slippagePercent),
  ).quotient
  return CurrencyAmount.fromRawAmount(amount.currency, slippageAdjustedAmount)
}

export const toCurrencyAmount = function (currency: Currency, value: string | number): CurrencyAmount<Currency> {
  try {
    return CurrencyAmount.fromRawAmount(currency, JSBI.BigInt(value))
  } catch (e) {
    return CurrencyAmount.fromRawAmount(currency, 0)
  }
}