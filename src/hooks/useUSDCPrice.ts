import { ChainId, Currency, CurrencyAmount, JSBI, Price, Token } from 'sdk'

import { useActiveWeb3React } from 'services/web3'
import { useMemo } from 'react'
import { useV2TradeExactOut } from './useV2Trades'

import { tryParseAmount } from 'functions'
import { ANY, BNB, CRV, LUXOR, MIM, SEANCE, SOUL, FUSD, USDT, UNIDX, WBTC, WETH, WLUM, REAPER, GRIM, GRIMEVO, DAI } from 'constants/tokens'
import { ANY_ADDRESS, BNB_ADDRESS, CRV_ADDRESS, FUSD_ADDRESS, GRIM_ADDRESS, GRIMEVO_ADDRESS, LUX_ADDRESS, REAPER_ADDRESS, SEANCE_ADDRESS, SOUL_ADDRESS, UNIDX_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS, WLUM_ADDRESS } from 'constants/addresses'
import { usePrice } from 'hooks/usePrice'
// import { SupportedChainId } from '../constants/chains'
// import { useBestV2Trade } from './useBestV2Trade'

const USDC = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'USDC', 'USD Coin'),
  [ChainId.BSC]: new Token(ChainId.BSC, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 6, 'USDC', 'USD Coin'),
}

// AMOUNT_OUT = amounts used when calculating spot price for a given currency.
// The amount is large enough to filter low liquidity pairs.

const STABLECOIN_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.ETHEREUM]: CurrencyAmount.fromRawAmount(USDC[ChainId.ETHEREUM], 100_000e6),
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(USDC[ChainId.FANTOM], 100_000e6),
}

const USDT_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(USDT[ChainId.FANTOM], 100_000e6),
}

const DAI_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(DAI[ChainId.FANTOM], 100_000e18),
}

// const MIM_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
//   [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(MIM[ChainId.FANTOM], 100_000e6),
// }

const FUSD_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(FUSD[ChainId.FANTOM], 100_000e6),
}

const SOUL_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(SOUL[ChainId.FANTOM], 100_000e18)
}

const SEANCE_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(SEANCE[ChainId.FANTOM], 100_000e6)
}

const LUXOR_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(LUXOR[ChainId.FANTOM], 100_000e6)
}

const WLUM_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(WLUM[ChainId.FANTOM], 100_000e6)
}

const WETH_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(WETH[ChainId.FANTOM], 100_000e6)
}

const WBTC_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(WBTC[ChainId.FANTOM], 100_000e6)
}

const BNB_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(BNB[ChainId.FANTOM], 100_000e6)
}

const ANY_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(ANY[ChainId.FANTOM], 100_000e6)
}

const CRV_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(CRV[ChainId.FANTOM], 100_000e6)
}

const UNIDX_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(UNIDX[ChainId.FANTOM], 100_000e6)
}

const REAPER_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(REAPER[ChainId.FANTOM], 100_000e6)
}

const GRIM_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(GRIM[ChainId.FANTOM], 100_000e6)
}

const GRIMEVO_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(GRIMEVO[ChainId.FANTOM], 100_000e6)
}

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useUSDCPrice(currency?: Currency): Price<Currency, Token> | undefined {
  const chainId = currency?.chainId

  const soulPrice = usePrice(SOUL[chainId]?.address)
  const seancePrice = usePrice(SEANCE_ADDRESS[chainId])

  const luxorPrice = usePrice(LUX_ADDRESS[chainId])
  const wLumensPrice = usePrice(WLUM_ADDRESS[chainId])

  const wethPrice = usePrice(WETH_ADDRESS[chainId])
  const wbtcPrice = usePrice(WBTC_ADDRESS[chainId])
  const bnbPrice = usePrice(BNB_ADDRESS[chainId])
  const anyPrice = usePrice(ANY_ADDRESS[chainId])
  const crvPrice = usePrice(CRV_ADDRESS[chainId])
  const fusdPrice = usePrice(FUSD_ADDRESS[chainId])
  const unidxPrice = usePrice(UNIDX_ADDRESS[chainId])
  const reaperPrice = usePrice(REAPER_ADDRESS[chainId])
  const grimPrice = usePrice(GRIM_ADDRESS[chainId])
  const grimEvoPrice = usePrice(GRIMEVO_ADDRESS[chainId])
  
  const amountOut = chainId ? STABLECOIN_AMOUNT_OUT[chainId] : undefined
  const usdtAmountOut = chainId ? USDT_AMOUNT_OUT[chainId] : undefined
  const daiAmountOut = chainId ? DAI_AMOUNT_OUT[chainId] : undefined
  const fusdAmountOut = chainId ? FUSD_AMOUNT_OUT[chainId] : undefined
  // const mimAmountOut = chainId ? MIM_AMOUNT_OUT[chainId] : undefined
  
  const soulAmountOut = chainId ? SOUL_AMOUNT_OUT[chainId] : undefined
  const seanceAmountOut = chainId ? SEANCE_AMOUNT_OUT[chainId] : undefined
  
  const luxorAmountOut = chainId ? LUXOR_AMOUNT_OUT[chainId] : undefined
  const wlumAmountOut = chainId ? WLUM_AMOUNT_OUT[chainId] : undefined

  const wethAmountOut = chainId ? WETH_AMOUNT_OUT[chainId] : undefined
  const wbtcAmountOut = chainId ? WBTC_AMOUNT_OUT[chainId] : undefined
  const bnbAmountOut = chainId ? BNB_AMOUNT_OUT[chainId] : undefined
  const anyAmountOut = chainId ? ANY_AMOUNT_OUT[chainId] : undefined
  const crvAmountOut = chainId ? CRV_AMOUNT_OUT[chainId] : undefined
  const unidxAmountOut = chainId ? UNIDX_AMOUNT_OUT[chainId] : undefined
  const grimAmountOut = chainId ? GRIM_AMOUNT_OUT[chainId] : undefined
  const grimEVOAmountOut = chainId ? GRIMEVO_AMOUNT_OUT[chainId] : undefined
  const reaperAmountOut = chainId ? REAPER_AMOUNT_OUT[chainId] : undefined

  // TOKENS
  const stablecoin = amountOut?.currency
  const usdt = usdtAmountOut?.currency
  const dai = daiAmountOut?.currency
  const fusd = fusdAmountOut?.currency
  // const mim = mimAmountOut?.currency
  const soul = soulAmountOut?.currency
  const seance = seanceAmountOut?.currency
  const luxor = luxorAmountOut?.currency
  const wlum = wlumAmountOut?.currency
  const weth = wethAmountOut?.currency
  const wbtc = wbtcAmountOut?.currency
  const bnb = bnbAmountOut?.currency
  const any = anyAmountOut?.currency
  const crv = crvAmountOut?.currency
  const unidx = unidxAmountOut?.currency
  const grim = grimAmountOut?.currency
  const grimEVO = grimEVOAmountOut?.currency
  const reaper = reaperAmountOut?.currency

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
   
    // handle usdt
    if (currency?.wrapped.equals(usdt)) {
      return new Price(usdt, usdt, '1', '1')
    }

    // handle dai
    if (currency?.wrapped.equals(dai)) {
      return new Price(dai, dai, '1', '1')
    }

    // handle mim
    // if (currency?.wrapped.equals(mim)) {
    //   return new Price(mim, mim, '1', '1')
    // }

    // handle fusd
    if (currency?.wrapped.equals(fusd)) {
      return new Price(fusd, fusd, '100', Number(fusdPrice * 100).toFixed())
    }

    // handle soul
    if (currency?.wrapped.equals(soul)) {
      return new Price(soul, soul, '100', Number(soulPrice * 100).toFixed())
    }

    // handle seance
    if (currency?.wrapped.equals(seance)) {
      return new Price(seance, seance, '100', Number(seancePrice * 100).toFixed())
    }

    // handle luxor
    if (currency?.wrapped.equals(luxor)) {
      return new Price(luxor, luxor, '100', Number(luxorPrice * 100).toFixed())
    }

    // handle wlum
    if (currency?.wrapped.equals(wlum)) {
      return new Price(wlum, wlum, '1', Number(wLumensPrice * 1).toFixed())
    }

    // handle weth
    if (currency?.wrapped.equals(weth)) {
      return new Price(weth, weth, '1', Number(wethPrice).toFixed())
    }

    // handle wbtc
    if (currency?.wrapped.equals(wbtc)) {
      return new Price(wbtc, wbtc, '1', Number(wbtcPrice * 1.35).toFixed()) // TODO: fix
    }
    
    // handle bnb
    if (currency?.wrapped.equals(bnb)) {
      return new Price(bnb, bnb, '10', Number(bnbPrice * 10).toFixed())
    }

    // handle any
    if (currency?.wrapped.equals(any)) {
      return new Price(any, any, '10', Number(anyPrice * 10).toFixed())
    }

    // handle crv
    if (currency?.wrapped.equals(crv)) {
      return new Price(crv, crv, '10', Number(crvPrice * 10).toFixed())
    }

    // handle unidx
    if (currency?.wrapped.equals(unidx)) {
      return new Price(unidx, unidx, '10', Number(unidxPrice * 10).toFixed())
    }

    // handle grim
    if (currency?.wrapped.equals(grim)) {
      return new Price(grim, grim, '10', Number(grimPrice * 10).toFixed())
    }

    // handle grimEVO
    if (currency?.wrapped.equals(grimEVO)) {
      return new Price(grimEVO, grimEVO, '10', Number(grimEvoPrice * 10).toFixed())
    }

    // handle reaper
    if (currency?.wrapped.equals(reaper)) {
      return new Price(reaper, reaper, '100', Number(reaperPrice * 100).toFixed())
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
  const stablecoin = chainId ? STABLECOIN_AMOUNT_OUT[chainId]?.currency : undefined

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

