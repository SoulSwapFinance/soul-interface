import { AVAX_ORACLE_ADDRESS, BTC_ORACLE_ADDRESS, ChainId, Currency, CurrencyAmount, ETH_ORACLE_ADDRESS, JSBI, LZ_WETH_ADDRESS, Price, Token } from 'sdk'

import { useActiveWeb3React } from 'services/web3'
import { useMemo } from 'react'
import { useV2TradeExactOut } from './useV2Trades'

import { tryParseAmount } from 'functions'
import { BNB, MIM, AVAX, SOUL, FUSD, USDC, LZUSDC, WBTC, WETH, WFTM, SURV, DAI } from 'constants/tokens'
import { AVAX_ADDRESS, BNB_ADDRESS, WFTM_ADDRESS, 
  SOUL_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS, SURV_ADDRESS } 
  from 'constants/addresses'
import { usePrice } from 'hooks/usePrice'
import { useOraclePrice } from './useOraclePrice'

// AMOUNT_OUT = amounts used when calculating spot price for a given currency.
// The amount is large enough to filter low liquidity pairs.

const STABLECOIN_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.ETHEREUM]: CurrencyAmount.fromRawAmount(USDC[ChainId.ETHEREUM], 100_000e6),
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(USDC[ChainId.FANTOM], 100_000e6),
  [ChainId.AVALANCHE]: CurrencyAmount.fromRawAmount(USDC[ChainId.AVALANCHE], 100_000e6),
}

const SOUL_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(SOUL[ChainId.FANTOM], 100_000e6),
  [ChainId.AVALANCHE]: CurrencyAmount.fromRawAmount(SOUL[ChainId.AVALANCHE], 100_000e6)
}

const SURV_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(SURV[ChainId.FANTOM], 100_000e6)
}

const WETH_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(WETH[ChainId.FANTOM], 100_000e6),
  [ChainId.AVALANCHE]: CurrencyAmount.fromRawAmount(WETH[ChainId.AVALANCHE], 100_000e6)
}

const WBTC_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(WBTC[ChainId.FANTOM], 100_000e6),
  [ChainId.AVALANCHE]: CurrencyAmount.fromRawAmount(WBTC[ChainId.AVALANCHE], 100_000e6)
}

const WFTM_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(WFTM[ChainId.FANTOM], 100_000e6)
}

// const BNB_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
//   [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(BNB[ChainId.FANTOM], 100_000e6),
//   [ChainId.AVALANCHE]: CurrencyAmount.fromRawAmount(BNB[ChainId.AVALANCHE], 100_000e6)
// }

const AVAX_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(AVAX[ChainId.FANTOM], 100_000e6),
  [ChainId.AVALANCHE]: CurrencyAmount.fromRawAmount(AVAX[ChainId.AVALANCHE], 100_000e6)
}

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useUSDCPrice(currency?: Currency, toChain?: ChainId): Price<Currency, Token> | undefined {
  const chainId = currency?.chainId

  const soulPrice = usePrice(SOUL_ADDRESS[chainId ?? ChainId.FANTOM])

  const wftmPrice = usePrice(WFTM_ADDRESS[250])
  const survPrice = usePrice(SURV_ADDRESS[250])
  const wethPrice = useOraclePrice(ETH_ORACLE_ADDRESS[250])
  const wbtcPrice = useOraclePrice(BTC_ORACLE_ADDRESS[250])
  const avaxPrice = usePrice(AVAX_ORACLE_ADDRESS[43114])

  const survAmountOut = chainId ? SURV_AMOUNT_OUT[250] : undefined
  const wftmAmountOut = chainId ? WFTM_AMOUNT_OUT[250] : undefined

  const amountOut = chainId ? STABLECOIN_AMOUNT_OUT[chainId ?? ChainId.FANTOM] : undefined
  const soulAmountOut = chainId ? SOUL_AMOUNT_OUT[chainId ?? ChainId.FANTOM] : undefined
  const wethAmountOut = chainId ? WETH_AMOUNT_OUT[chainId ?? ChainId.FANTOM] : undefined
  const wbtcAmountOut = chainId ? WBTC_AMOUNT_OUT[chainId ?? ChainId.FANTOM] : undefined
  const avaxAmountOut = chainId ? AVAX_AMOUNT_OUT[chainId ?? ChainId.FANTOM] : undefined

  // TOKENS
  const stablecoin = amountOut?.currency
  const soul = soulAmountOut?.currency
  const wftm = wftmAmountOut?.currency
  const surv = survAmountOut?.currency
  const avax = avaxAmountOut?.currency

  const weth = wethAmountOut?.currency
  const wbtc = wbtcAmountOut?.currency

  // TODO(#2808): remove dependency on useBestV2Trade
  /* const v2USDCTrade = useBestV2Trade(TradeType.EXACT_OUTPUT, amountOut, currency, {
    maxHops: 2,
  }) */
  
  const v2USDCTrade = useV2TradeExactOut(currency, amountOut, {
    maxHops: 3,
  })

  return useMemo(() => {
    if (!currency || !stablecoin) {
      return undefined
    }

    // handle usdc
    if (currency?.wrapped.equals(stablecoin)) {
      return new Price(stablecoin, stablecoin, '1', '1')
    }

    // handle soul
    if (currency?.wrapped.equals(soul)) {
      return new Price(soul, soul, '100000', Number(soulPrice * 100_000).toFixed())
    }
    
    // handle wftm
    if (currency?.wrapped.equals(wftm)) {
      return new Price(wftm, wftm, '100', Number(wftmPrice * 100).toFixed())
    }

    // handle surv
    if (currency?.wrapped.equals(surv)) {
      return new Price(surv, surv, '1000', Number(survPrice * 1000).toFixed())
    }

    // handle weth
    if (currency?.wrapped.equals(weth)) {
      return new Price(weth, weth, '1000', Number(wethPrice * 1000).toFixed())
    }

    // handle wbtc
    if (currency?.wrapped.equals(wbtc)) {
      return new Price(wbtc, wbtc, '100000', Number(wbtcPrice * 100000).toFixed())
    }
    
    // handle AVAX
    if (currency?.wrapped.equals(avax)) {
      return new Price(avax, avax, '10', Number(avaxPrice * 10).toFixed())
    }

    // use v2 price if available
    if (v2USDCTrade) {
      const { numerator, denominator } = v2USDCTrade.route.midPrice
      return new Price(currency, stablecoin, denominator, numerator)
    }

    return undefined

  }, [currency, stablecoin, v2USDCTrade])
}

export function useUSDCValue(currencyAmount: CurrencyAmount<Currency> | undefined | null) {
  const price = useUSDCPrice(currencyAmount?.currency)

  return useMemo(() => {
    if (!price || !currencyAmount) return null
    try {
      return price.quote(currencyAmount)
    } catch (error) {
      return null
    }
  }, [currencyAmount, price])
}


export function useUSDCPriceWithLoadingIndicator(currency?: Currency) {
  const price = useUSDCPrice(currency)
  return useMemo(() => {
    if (!price || !currency) return { price: undefined, loading: false }
    try {
      return { price, loading: false }
    } catch (error) {
      return { price: undefined, loading: false }
    }
  }, [currency, price])
}

export function useUSDCValueWithLoadingIndicator(currencyAmount: CurrencyAmount<Currency> | undefined) {
  const price = useUSDCPrice(currencyAmount?.currency)
  return useMemo(() => {
    if (!price || !currencyAmount) return { value: undefined, loading: false }
    try {
      return { value: price.quote(currencyAmount), loading: false }
    } catch (error) {
      return { value: undefined, loading: false }
    }
  }, [currencyAmount, price])

}

/**
 *
 * @param fiatValue string representation of a USD amount
 * @returns CurrencyAmount where currency is stablecoin on active chain
 */
export function useStablecoinAmountFromFiatValue(fiatValue: string | null | undefined) {
  const { chainId } = useActiveWeb3React()
  const stablecoin = chainId ? STABLECOIN_AMOUNT_OUT[chainId | 250]?.currency : undefined

  if (fiatValue === null || fiatValue === undefined || !chainId || !stablecoin) {
    return undefined
  }

  // trim for decimal precision when parsing
  const parsedForDecimals = parseFloat(fiatValue).toFixed(stablecoin.decimals).toString()

  try {
    // parse USD string into CurrencyAmount based on stablecoin decimals
    return tryParseAmount(parsedForDecimals, stablecoin)
  } catch (error) {
    return undefined
  }
}

