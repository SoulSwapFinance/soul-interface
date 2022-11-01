import type { BytesLike } from '@ethersproject/bytes'
import type { BestTradeOptions, Currency, CurrencyAmount, Pair, Percent, Trade, TradeType, RoutablePlatform } from 'sdk'

export type Multicall2TryAggregateResult = {
  success: boolean
  returnData: BytesLike
}

/**
 * Base interface
 */
export interface UniswapV2TradeBestTradeExactCommonParams {
  maxHops?: BestTradeOptions
  maximumSlippage: Percent
  platform: RoutablePlatform
}

export interface UniswapV2TradeBestTradeExactInParams extends UniswapV2TradeBestTradeExactCommonParams {
  currencyAmountIn: CurrencyAmount<Currency>
  currencyOut: Currency
}

export interface UniswapV2TradeBestTradeExactOutParams extends UniswapV2TradeBestTradeExactCommonParams {
  currencyIn: Currency
  currencyAmountOut: CurrencyAmount<Currency>
}

/**
 * Common params for computing trade routes
 */
export interface UniswapV2TradeComputeTradeCommonParams {
  // used in recursion.
  pairs: Pair[]
  currentPairs?: Pair[]
  bestTrades?: Trade<Currency, Currency, TradeType>[]
}

export type UniswapV2TradeComputeTradesExactInParams = UniswapV2TradeComputeTradeCommonParams &
  Omit<UniswapV2TradeBestTradeExactInParams, 'platform'> & {
    originalAmountIn?: CurrencyAmount<Currency>
  }

export type UniswapV2TradeComputeTradesExactOutParams = UniswapV2TradeComputeTradeCommonParams &
  Omit<UniswapV2TradeBestTradeExactOutParams, 'platform'> & {
    originalAmountOut?: CurrencyAmount<Currency>
  }
