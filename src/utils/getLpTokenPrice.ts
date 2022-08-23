import { parseUnits } from '@ethersproject/units'
import {
  _100,
  CoWTrade,
  Currency,
  CurrencyAmount,
  CurveTrade,
  Fraction,
  JSBI,
  Pair,
  Percent,
  Price,
  TokenAmount,
  Trade,
  UniswapTrade,
  UniswapV2Trade,
  ZERO,
  ZeroXTrade,
} from '@swapr/sdk'

import {
} from 'sdk'
import _Decimal from 'decimal.js-light'
import toFormat from 'toformat'

import {
  ALLOWED_FIAT_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_LOW,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
  NO_PRICE_IMPACT,
  PRICE_IMPACT_HIGH,
  PRICE_IMPACT_LOW,
  PRICE_IMPACT_MEDIUM,
  PRICE_IMPACT_NON_EXPERT,
} from '../constants'
import { Field } from 'state/swap/types'

const Decimal = toFormat(_Decimal)

const ONE_HUNDRED_PERCENT = new Percent('10000', '10000')

interface TradePriceBreakdown {
  priceImpactWithoutFee?: Percent
  realizedLPFee?: Percent
  realizedLPFeeAmount?: CurrencyAmount
}

// computes price breakdown for the trade
export function computeTradePriceBreakdown(trade?: Trade): TradePriceBreakdown {
  // early exit
  if (!trade) {
    return {}
  }

  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
  const realizedLPFee: Percent | undefined = computeRealizedLPFee(trade)

  function computeRealizedLPFee(trade: Trade) {
    if (trade instanceof UniswapV2Trade) {
      const totalRoutesFee = trade.route.pairs.reduce<Fraction>(
        (currentFee: Fraction, currentIndex: Pair): Fraction => {
          return currentFee.multiply(
            ONE_HUNDRED_PERCENT.subtract(new Percent(JSBI.BigInt(currentIndex.swapFee.toString()), '10000')).toString()
          )
        },
        ONE_HUNDRED_PERCENT
      )
      return ONE_HUNDRED_PERCENT.subtract(totalRoutesFee.toString())
    } else if (trade instanceof CoWTrade || trade instanceof UniswapTrade || trade instanceof ZeroXTrade) {
      return trade.fee
    } else if (trade instanceof CurveTrade) {
      return ONE_HUNDRED_PERCENT.subtract(ONE_HUNDRED_PERCENT.subtract(trade.fee.toString()))
    } else return undefined
  }
  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction = trade && realizedLPFee ? trade.priceImpact.subtract(realizedLPFee.toString()) : undefined

  // the x*y=k impact
  const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
    ? new Percent(priceImpactWithoutFeeFraction?.numerator.toString(), priceImpactWithoutFeeFraction?.denominator.toString())
    : undefined

  function computeRealizedLPFeeAmount(trade: Trade, realizedLPFee?: Fraction) {
    if (!realizedLPFee) return undefined

    if (trade instanceof CoWTrade) return (trade as CoWTrade).feeAmount
    else if (trade.inputAmount instanceof TokenAmount)
      return new TokenAmount(trade.inputAmount.token, realizedLPFee.multiply(trade.inputAmount.raw).quotient)
    else return CurrencyAmount.nativeCurrency(realizedLPFee.multiply(trade.inputAmount.raw).quotient, trade.chainId)
  }
  const realizedLPFeeAmount = computeRealizedLPFeeAmount(trade, realizedLPFee)

  return {
    priceImpactWithoutFee: priceImpactWithoutFeePercent,
    realizedLPFee: realizedLPFee ? new Percent(realizedLPFee.numerator, realizedLPFee.denominator) : undefined,
    realizedLPFeeAmount,
  }
}

// calculates teh protocol fee for a pair and amount
export function calculateProtocolFee(
  pair: Pair | null | undefined,
  amount?: CurrencyAmount,
  chainId?: number
): { protocolFee?: Fraction; protocolFeeAmount?: CurrencyAmount } {
  const protocolFee = pair ? new Percent(
    //   pair.swapFee, 
        pair.swapFee.toString(),
        _100.toString())
      .divide(
          pair.protocolFeeDenominator.toString()
        ) : undefined

  // the amount of the input that accrues to LPs
  const protocolFeeAmount =
    protocolFee && amount && chainId
      ? amount instanceof TokenAmount
        ? new TokenAmount(amount.token,
            (Number(protocolFee) * Number(amount) / 10000 ).toString()
            )
            : CurrencyAmount.nativeCurrency(
            (Number(protocolFee) * Number(amount) / 10000 ).toString(),
            chainId
        )
      : undefined

  return { protocolFee, protocolFeeAmount }
}

// computes the minimum amount out and maximum amount in for a trade given a user specified allowed slippage in bips
export function computeSlippageAdjustedAmounts(trade: Trade | undefined): { [field in Field]?: CurrencyAmount } {
  return {
    [Field.INPUT]: trade?.maximumAmountIn(),
    [Field.OUTPUT]: trade?.minimumAmountOut(),
  }
}

export function warningSeverity(priceImpact: Percent | undefined): 0 | 1 | 2 | 3 | 4 {
  if (!priceImpact?.lessThan(new Percent('4'))) return PRICE_IMPACT_NON_EXPERT
  if (!priceImpact?.lessThan(new Percent('3'))) return PRICE_IMPACT_HIGH
  if (!priceImpact?.lessThan(new Percent('2'))) return PRICE_IMPACT_MEDIUM
  if (!priceImpact?.lessThan(new Percent('1'))) return PRICE_IMPACT_LOW
  return NO_PRICE_IMPACT
}

export function simpleWarningSeverity(priceImpact: Percent | undefined): 0 | 3 {
  if (!priceImpact?.lessThan(new Percent('3'))) return PRICE_IMPACT_HIGH
  return NO_PRICE_IMPACT
}

export function formatExecutionPrice(trade?: Trade, inverted?: boolean): string {
  if (!trade) {
    return ''
  }
  return inverted
    ? `${trade.executionPrice.invert().toSignificant(6)} ${trade.inputAmount.currency.symbol} / ${
        trade.outputAmount.currency.symbol
      }`
    : `${trade.executionPrice.toSignificant(6)} ${trade.outputAmount.currency.symbol} / ${
        trade.inputAmount.currency.symbol
      }`
}

export function sortTradesByExecutionPrice(trades: (Trade | undefined)[]): (Trade | undefined)[] {
  return trades.sort((a, b) => {
    if (a === undefined || a === null) {
      return 1
    }
    if (b === undefined || b === null) {
      return -1
    }

    if (a.executionPrice.lessThan(b.executionPrice)) {
      return 1
    } else if (a.executionPrice.equalTo(b.executionPrice)) {
      return 0
    } else {
      return -1
    }
  })
}

export function getLpTokenPrice(
  pair: Pair,
  nativeCurrency: Currency,
  totalSupply: string,
  reserveNativeCurrency: string
): Price {
  const decimalTotalSupply = new Decimal(totalSupply)
  // the following check avoids division by zero when total supply is zero
  // (case in which a pair has been created but liquidity has never been proviided)
  const priceDenominator = decimalTotalSupply.isZero()
    ? '1'
    : parseUnits(
        new Decimal(totalSupply).toFixed(pair.liquidityToken.decimals),
        pair.liquidityToken.decimals
      ).toString()
  return new Price({
    baseCurrency: pair.liquidityToken,
    quoteCurrency: nativeCurrency,
    denominator: priceDenominator,
    numerator: parseUnits(
      new Decimal(reserveNativeCurrency).toFixed(nativeCurrency.decimals),
      nativeCurrency.decimals
    ).toString(),
  })
}

/**
 * Returns trimmed fraction value to limit number of decimal places
 * @param value Fraction value to trim
 * @param significantDigits Limit number of decimal places
 * @param rounding Rounding mode
 */
export const limitNumberOfDecimalPlaces = (
  value?: CurrencyAmount | Fraction,
  significantDigits = 6,
  format = { groupSeparator: '' },
  rounding = Decimal.ROUND_DOWN
): string | undefined => {
  if (!value || value.equalTo(ZERO)) return undefined
  if (value instanceof CurrencyAmount && value.currency.decimals < significantDigits)
    significantDigits =
      typeof value.currency.decimals === 'string' ? parseInt(value.currency.decimals) : value.currency.decimals

  const fixedQuotient = value.toFixed(significantDigits)
  Decimal.set({ precision: significantDigits + 1, rounding })
  const quotient = new Decimal(fixedQuotient).toSignificantDigits(6)

  return quotient.toFormat(quotient.decimalPlaces(), format)
}