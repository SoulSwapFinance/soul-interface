import { BigintIsh } from '../../types'
// import { Currency } from './Currency'
import { Fraction } from '../Fraction'
import { JSBI } from 'sdk'
import { MaxUint256 } from '../../constants'
// import { Rounding } from '../enums'
import { xToken } from './xToken'
import _Big from 'big.js'
import invariant from 'tiny-invariant'
import toFormat from 'toformat'

const Big = toFormat(_Big)

Big.strict = true

export class xTokenAmount<T extends xToken> extends Fraction {
  public readonly currency: T
  public readonly decimalScale: JSBI

  /**
   * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
   * @param currency the currency in the amount
   * @param rawAmount the raw token or ether amount
   */
  public static fromRawAmount<T extends xToken>(currency: T, rawAmount: BigintIsh): xTokenAmount<T> {
    return new xTokenAmount(currency, rawAmount)
  }

  /**
   * Construct a currency amount with a denominator that is not equal to 1
   * @param currency the currency
   * @param numerator the numerator of the fractional token amount
   * @param denominator the denominator of the fractional token amount
   */
  public static fromFractionalAmount<T extends xToken>(
    currency: T,
    numerator: BigintIsh,
    denominator: BigintIsh
  ): xTokenAmount<T> {
    return new xTokenAmount(currency, numerator, denominator)
  }

  protected constructor(currency: T, numerator: BigintIsh, denominator?: BigintIsh) {
    super(numerator, denominator)
    invariant(JSBI.lessThanOrEqual(this.quotient, MaxUint256), 'AMOUNT')
    this.currency = currency
    this.decimalScale = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency.decimals))
  }

  public add(other: xTokenAmount<T>): xTokenAmount<T> {
    invariant(this.currency.equals(other.currency), 'CURRENCY')
    const added = super.add(other)
    return xTokenAmount.fromFractionalAmount(this.currency, added.numerator, added.denominator)
  }

  public subtract(other: xTokenAmount<T>): xTokenAmount<T> {
    invariant(this.currency.equals(other.currency), 'CURRENCY')
    const subtracted = super.subtract(other)
    return xTokenAmount.fromFractionalAmount(this.currency, subtracted.numerator, subtracted.denominator)
  }
}
