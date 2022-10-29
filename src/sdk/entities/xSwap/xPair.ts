import { FACTORY_ADDRESS, FIVE, MINIMUM_LIQUIDITY, ONE, ZERO, _1000, _997 } from '../../constants'
import { InsufficientInputAmountError, InsufficientReservesError } from '../../errors'

import { BigintIsh } from '../../types'
import { xCurrencyAmount } from './xCurrencyAmount'
import { xPrice } from './xPrice'
import { xToken } from './xToken'
import { computePairAddress } from '../../functions/computePairAddress'
import invariant from 'tiny-invariant'
import { sqrt } from '../../functions/math'
import { JSBI } from 'sdk'

export class xPair {
  public readonly liquidityToken: xToken
  private readonly tokenAmounts: [xCurrencyAmount<xToken>, xCurrencyAmount<xToken>]
    fee: any

  public static getAddress(tokenA: xToken, tokenB: xToken): string {
    return computePairAddress({
      factoryAddress: FACTORY_ADDRESS[tokenA.chainId],
      tokenA,
      tokenB,
    })
  }

  public constructor(currencyAmountA: xCurrencyAmount<xToken>, currencyAmountB: xCurrencyAmount<xToken>) {
    const currencyAmounts = currencyAmountA.currency.sortsBefore(currencyAmountB.currency) // does safety checks
      ? [currencyAmountA, currencyAmountB]
      : [currencyAmountB, currencyAmountA]
    this.liquidityToken = new xToken(
      currencyAmounts[0].currency.chainId,
      xPair.getAddress(currencyAmounts[0].currency, currencyAmounts[1].currency),
      18,
      'SOUL-LP',
      'SoulSwap LP'
    )
    this.tokenAmounts = currencyAmounts as [xCurrencyAmount<xToken>, xCurrencyAmount<xToken>]
  }

  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  public involvesToken(token: xToken): boolean {
    return token.equals(this.token0) || token.equals(this.token1)
  }

  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
  public get token0Price(): xPrice<xToken, xToken> {
    const result = this.tokenAmounts[1].divide(this.tokenAmounts[0])
    return new xPrice(this.token0, this.token1, result.denominator, result.numerator)
  }

  /**
   * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
   */
  public get token1Price(): xPrice<xToken, xToken> {
    const result = this.tokenAmounts[0].divide(this.tokenAmounts[1])
    return new xPrice(this.token1, this.token0, result.denominator, result.numerator)
  }

  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  public priceOf(token: xToken): xPrice<xToken, xToken> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.token0Price : this.token1Price
  }

  /**
   * Returns the chain ID of the tokens in the pair.
   */
  public get chainId(): number {
    return this.token0.chainId
  }

  public get token0(): xToken {
    return this.tokenAmounts[0].currency
  }

  public get token1(): xToken {
    return this.tokenAmounts[1].currency
  }

  public get reserve0(): xCurrencyAmount<xToken> {
    return this.tokenAmounts[0]
  }

  public get reserve1(): xCurrencyAmount<xToken> {
    return this.tokenAmounts[1]
  }

  public reserveOf(token: xToken): xCurrencyAmount<xToken> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.reserve0 : this.reserve1
  }

  public getOutputAmount(inputAmount: xCurrencyAmount<xToken>): [xCurrencyAmount<xToken>, xPair] {
    invariant(this.involvesToken(inputAmount.currency), 'TOKEN')
    if (JSBI.equal(this.reserve0.quotient, ZERO) || JSBI.equal(this.reserve1.quotient, ZERO)) {
      throw new InsufficientReservesError()
    }
    const inputReserve = this.reserveOf(inputAmount.currency)
    const outputReserve = this.reserveOf(inputAmount.currency.equals(this.token0) ? this.token1 : this.token0)
    const inputAmountWithFee = JSBI.multiply(inputAmount.quotient, _997)
    const numerator = JSBI.multiply(inputAmountWithFee, outputReserve.quotient)
    const denominator = JSBI.add(JSBI.multiply(inputReserve.quotient, _1000), inputAmountWithFee)
    const outputAmount = xCurrencyAmount.fromRawAmount(
      inputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      JSBI.divide(numerator, denominator)
    )
    if (JSBI.equal(outputAmount.quotient, ZERO)) {
      throw new InsufficientInputAmountError()
    }
    return [outputAmount, new xPair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))]
  }

  public getInputAmount(outputAmount: xCurrencyAmount<xToken>): [xCurrencyAmount<xToken>, xPair] {
    invariant(this.involvesToken(outputAmount.currency), 'TOKEN')
    if (
      JSBI.equal(this.reserve0.quotient, ZERO) ||
      JSBI.equal(this.reserve1.quotient, ZERO) ||
      JSBI.greaterThanOrEqual(outputAmount.quotient, this.reserveOf(outputAmount.currency).quotient)
    ) {
      throw new InsufficientReservesError()
    }

    const outputReserve = this.reserveOf(outputAmount.currency)
    const inputReserve = this.reserveOf(outputAmount.currency.equals(this.token0) ? this.token1 : this.token0)
    const numerator = JSBI.multiply(JSBI.multiply(inputReserve.quotient, outputAmount.quotient), _1000)
    const denominator = JSBI.multiply(JSBI.subtract(outputReserve.quotient, outputAmount.quotient), _997)
    const inputAmount = xCurrencyAmount.fromRawAmount(
      outputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      JSBI.add(JSBI.divide(numerator, denominator), ONE)
    )
    return [inputAmount, new xPair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))]
  }

  public getLiquidityMinted(
    totalSupply: xCurrencyAmount<xToken>,
    tokenAmountA: xCurrencyAmount<xToken>,
    tokenAmountB: xCurrencyAmount<xToken>
  ): xCurrencyAmount<xToken> {
    invariant(totalSupply.currency.equals(this.liquidityToken), 'LIQUIDITY')
    const tokenAmounts = tokenAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]
    invariant(tokenAmounts[0].currency.equals(this.token0) && tokenAmounts[1].currency.equals(this.token1), 'TOKEN')

    let liquidity: JSBI
    if (JSBI.equal(totalSupply.quotient, ZERO)) {
      liquidity = JSBI.subtract(
        sqrt(JSBI.multiply(tokenAmounts[0].quotient, tokenAmounts[1].quotient)),
        MINIMUM_LIQUIDITY
      )
    } else {
      const amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].quotient, totalSupply.quotient), this.reserve0.quotient)
      const amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].quotient, totalSupply.quotient), this.reserve1.quotient)
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1

      // console.log({
      //   amount0: amount0.toString(),
      //   amount1: amount1.toString(),
      //   liquidity: liquidity.toString(),
      //   totalSupply: totalSupply.quotient.toString(),
      //   kLast: sqrt(JSBI.multiply(this.tokenAmounts[0].quotient, this.tokenAmounts[1].quotient)),
      // })
    }
    if (!JSBI.greaterThan(liquidity, ZERO)) {
      throw new InsufficientInputAmountError()
    }

    return xCurrencyAmount.fromRawAmount(this.liquidityToken, liquidity)
  }

  public getLiquidityValue(
    token: xToken,
    totalSupply: xCurrencyAmount<xToken>,
    liquidity: xCurrencyAmount<xToken>,
    feeOn: boolean = false,
    kLast?: BigintIsh
  ): xCurrencyAmount<xToken> {
    invariant(this.involvesToken(token), 'TOKEN')
    invariant(totalSupply.currency.equals(this.liquidityToken), 'TOTAL_SUPPLY')
    invariant(liquidity.currency.equals(this.liquidityToken), 'LIQUIDITY')
    invariant(JSBI.lessThanOrEqual(liquidity.quotient, totalSupply.quotient), 'LIQUIDITY')

    let totalSupplyAdjusted: xCurrencyAmount<xToken>
    if (!feeOn) {
      totalSupplyAdjusted = totalSupply
    } else {
      invariant(!!kLast, 'K_LAST')
      const kLastParsed = JSBI.BigInt(kLast)
      if (!JSBI.equal(kLastParsed, ZERO)) {
        const rootK = sqrt(JSBI.multiply(this.reserve0.quotient, this.reserve1.quotient))
        const rootKLast = sqrt(kLastParsed)
        if (JSBI.greaterThan(rootK, rootKLast)) {
          const numerator = JSBI.multiply(totalSupply.quotient, JSBI.subtract(rootK, rootKLast))
          const denominator = JSBI.add(JSBI.multiply(rootK, FIVE), rootKLast)
          const feeLiquidity = JSBI.divide(numerator, denominator)
          totalSupplyAdjusted = totalSupply.add(xCurrencyAmount.fromRawAmount(this.liquidityToken, feeLiquidity))
        } else {
          totalSupplyAdjusted = totalSupply
        }
      } else {
        totalSupplyAdjusted = totalSupply
      }
    }

    return xCurrencyAmount.fromRawAmount(
      token,
      JSBI.divide(JSBI.multiply(liquidity.quotient, this.reserveOf(token).quotient), totalSupplyAdjusted.quotient)
    )
  }
}