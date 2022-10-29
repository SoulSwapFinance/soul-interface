import { BigintIsh } from '../../types'
import { xCurrency } from './xCurrency'
import { Fraction } from '../Fraction'
import { JSBI } from 'sdk'
import { MaxUint256 } from '../../constants'
import { Rounding } from '../../enums'
import { xToken } from './xToken'
import _Big from 'big.js'
import invariant from 'tiny-invariant'
import toFormat from 'toformat'

const Big = toFormat(_Big)

Big.strict = true

export class xCurrencyAmount<T extends xCurrency> extends Fraction {
  public readonly currency: T
  public readonly decimalScale: JSBI

  /**
   * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
   * @param currency the currency in the amount
   * @param rawAmount the raw token or ether amount
   */
  public static fromRawAmount<T extends xCurrency>(currency: T, rawAmount: BigintIsh): xCurrencyAmount<T> {
    return new xCurrencyAmount(currency, rawAmount)
  }

  /**
   * Construct a currency amount with a denominator that is not equal to 1
   * @param currency the currency
   * @param numerator the numerator of the fractional token amount
   * @param denominator the denominator of the fractional token amount
   */
  public static fromFractionalAmount<T extends xCurrency>(
    currency: T,
    numerator: BigintIsh,
    denominator: BigintIsh
  ): xCurrencyAmount<T> {
    return new xCurrencyAmount(currency, numerator, denominator)
  }

  protected constructor(currency: T, numerator: BigintIsh, denominator?: BigintIsh) {
    super(numerator, denominator)
    invariant(JSBI.lessThanOrEqual(this.quotient, MaxUint256), 'AMOUNT')
    this.currency = currency
    this.decimalScale = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency.decimals))
  }

  public add(other: xCurrencyAmount<T>): xCurrencyAmount<T> {
    invariant(this.currency.equals(other.currency), 'CURRENCY')
    const added = super.add(other)
    return xCurrencyAmount.fromFractionalAmount(this.currency, added.numerator, added.denominator)
  }

  public subtract(other: xCurrencyAmount<T>): xCurrencyAmount<T> {
    invariant(this.currency.equals(other.currency), 'CURRENCY')
    const subtracted = super.subtract(other)
    return xCurrencyAmount.fromFractionalAmount(this.currency, subtracted.numerator, subtracted.denominator)
  }

  public multiply(other: Fraction | BigintIsh): xCurrencyAmount<T> {
    const multiplied = super.multiply(other)
    return xCurrencyAmount.fromFractionalAmount(this.currency, multiplied.numerator, multiplied.denominator)
  }

  public divide(other: Fraction | BigintIsh): xCurrencyAmount<T> {
    const divided = super.divide(other)
    return xCurrencyAmount.fromFractionalAmount(this.currency, divided.numerator, divided.denominator)
  }

  public toSignificant(
    significantDigits: number = 6,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    return super.divide(this.decimalScale).toSignificant(significantDigits, format, rounding)
  }

  public toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS')
    return super.divide(this.decimalScale).toFixed(decimalPlaces, format, rounding)
  }

  public toExact(format: object = { groupSeparator: '' }): string {
    Big.DP = this.currency.decimals
    return new Big(this.quotient.toString()).div(this.decimalScale.toString()).toFormat(format)
  }

  public get wrapped(): xCurrencyAmount<xToken> {
    if (this.currency.isToken) return this as xCurrencyAmount<xToken>
    return xCurrencyAmount.fromFractionalAmount(this.currency.wrapped, this.numerator, this.denominator)
  }

  /**
   * Returns a string representation of the address and currency amount.
   * Useful in cases where a dependency is needed to detect changes (e.g. useEffect).
   * @return string [0x6B3595068778DD592e39A122f4f5a5cF09C90fE2 - 1323.94]
   */
  public serialize(): string {
    return `[${this.currency.wrapped.address} - ${this.toExact()}]`
  }
}
