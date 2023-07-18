import { ChainId, Currency, CurrencyAmount, JSBI, Price, Token } from 'sdk'

import { useActiveWeb3React } from 'services/web3'
import { useMemo } from 'react'
import { useV2TradeExactOut } from './useV2Trades'

import { tryParseAmount } from 'functions'
import { BNB, LUXOR, MIM, AVAX, SEANCE, SOUL, FUSD, USDC, LZUSDC, AXLUSDC, WBTC, WETH, WFTM, WLUM, SURV, DAI, SOR } from 'constants/tokens'
import { AVAX_ADDRESS, BNB_ADDRESS, FUSD_ADDRESS, LUX_ADDRESS, SEANCE_ADDRESS, WFTM_ADDRESS, 
  SOUL_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS, WLUM_ADDRESS, SURV_ADDRESS } 
  from 'constants/addresses'
import { usePrice } from 'hooks/usePrice'

// AMOUNT_OUT = amounts used when calculating spot price for a given currency.
// The amount is large enough to filter low liquidity pairs.

const STABLECOIN_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.ETHEREUM]: CurrencyAmount.fromRawAmount(USDC[ChainId.ETHEREUM], 100_000e6),
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(LZUSDC[ChainId.FANTOM], 100_000e6),
  [ChainId.AVALANCHE]: CurrencyAmount.fromRawAmount(USDC[ChainId.AVALANCHE], 100_000e6),
}

const DAI_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(DAI[ChainId.FANTOM], 100_000e6),
  [ChainId.AVALANCHE]: CurrencyAmount.fromRawAmount(DAI[ChainId.AVALANCHE], 100_000e6),
}

const SOR_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(SOR[ChainId.FANTOM], 100_000e6),
}

const MIM_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(MIM[ChainId.FANTOM], 100_000e6),
}

const FUSD_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(FUSD[ChainId.FANTOM], 100_000e6),
}

const SOUL_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(SOUL[ChainId.FANTOM], 100_000e6),
  [ChainId.AVALANCHE]: CurrencyAmount.fromRawAmount(SOUL[ChainId.AVALANCHE], 100_000e6)
}

const SEANCE_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(SEANCE[ChainId.FANTOM], 100_000e6),
  [ChainId.AVALANCHE]: CurrencyAmount.fromRawAmount(SEANCE[ChainId.AVALANCHE], 100_000e6)
}

const LUXOR_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(LUXOR[ChainId.FANTOM], 100_000e6)
}

const SURV_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(SURV[ChainId.FANTOM], 100_000e6)
}

const WLUM_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(WLUM[ChainId.FANTOM], 100_000e6)
}

// const WETH_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
//   [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(WETH[ChainId.FANTOM], 100_000e6),
//   [ChainId.AVALANCHE]: CurrencyAmount.fromRawAmount(WETH[ChainId.AVALANCHE], 100_000e6)
// }

// const WBTC_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
//   [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(WBTC[ChainId.FANTOM], 100_000e6),
//   [ChainId.AVALANCHE]: CurrencyAmount.fromRawAmount(WBTC[ChainId.AVALANCHE], 100_000e6)
// }

const WFTM_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(WFTM[ChainId.FANTOM], 100_000e6)
}

const BNB_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(BNB[ChainId.FANTOM], 100_000e6),
  [ChainId.AVALANCHE]: CurrencyAmount.fromRawAmount(BNB[ChainId.AVALANCHE], 100_000e6)
}

// const CRV_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
//   [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(CRV[ChainId.FANTOM], 100_000e6)
// }

// const GRIMEVO_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
//   [ChainId.FANTOM]: CurrencyAmount.fromRawAmount(GRIMEVO[ChainId.FANTOM], 100_000e6)
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

  const soulPrice = usePrice(SOUL_ADDRESS[chainId])
  const seancePrice = usePrice(SEANCE_ADDRESS[chainId])

  const luxorPrice = usePrice(LUX_ADDRESS[250])
  const wLumensPrice = usePrice(WLUM_ADDRESS[250])
  const wftmPrice = usePrice(WFTM_ADDRESS[250])
  const survPrice = usePrice(SURV_ADDRESS[250])
  const fusdPrice = usePrice(FUSD_ADDRESS[250])
  // const crvPrice = usePrice(CRV_ADDRESS[250])
  // const grimEvoPrice = usePrice(GRIMEVO_ADDRESS[250])
 
  // const wethPrice = usePrice(WETH_ADDRESS[chainId])
  // const wbtcPrice = usePrice(WBTC_ADDRESS[chainId])
  const bnbPrice = usePrice(BNB_ADDRESS[chainId])
  const avaxPrice = usePrice(AVAX_ADDRESS[chainId])
  
  const sorAmountOut = chainId ? SOR_AMOUNT_OUT[250] : undefined
  const fusdAmountOut = chainId ? FUSD_AMOUNT_OUT[250] : undefined
  const mimAmountOut = chainId ? MIM_AMOUNT_OUT[250] : undefined
  const luxorAmountOut = chainId ? LUXOR_AMOUNT_OUT[250] : undefined
  const survAmountOut = chainId ? SURV_AMOUNT_OUT[250] : undefined
  const wlumAmountOut = chainId ? WLUM_AMOUNT_OUT[250] : undefined
  const wftmAmountOut = chainId ? WFTM_AMOUNT_OUT[250] : undefined
  // const crvAmountOut = chainId ? CRV_AMOUNT_OUT[250] : undefined
  // const grimEVOAmountOut = chainId ? GRIMEVO_AMOUNT_OUT[250] : undefined
  
  const amountOut = chainId ? STABLECOIN_AMOUNT_OUT[chainId] : undefined
  const daiAmountOut = chainId ? DAI_AMOUNT_OUT[chainId] : undefined
  const soulAmountOut = chainId ? SOUL_AMOUNT_OUT[chainId] : undefined
  const seanceAmountOut = chainId ? SEANCE_AMOUNT_OUT[chainId] : undefined
  // const wethAmountOut = chainId ? WETH_AMOUNT_OUT[chainId] : undefined
  // const wbtcAmountOut = chainId ? WBTC_AMOUNT_OUT[chainId] : undefined
  const bnbAmountOut = chainId ? BNB_AMOUNT_OUT[chainId] : undefined
  const avaxAmountOut = chainId ? AVAX_AMOUNT_OUT[chainId] : undefined

  // TOKENS
  const stablecoin = amountOut?.currency
  const sor = sorAmountOut?.currency
  const dai = daiAmountOut?.currency
  const fusd = fusdAmountOut?.currency
  const mim = mimAmountOut?.currency
  const soul = soulAmountOut?.currency
  const seance = seanceAmountOut?.currency
  const luxor = luxorAmountOut?.currency
  const wlum = wlumAmountOut?.currency
  const wftm = wftmAmountOut?.currency
  const surv = survAmountOut?.currency
  const bnb = bnbAmountOut?.currency
  const avax = avaxAmountOut?.currency

  // const weth = wethAmountOut?.currency
  // const wbtc = wbtcAmountOut?.currency
  // const crv = crvAmountOut?.currency
  // const grimEVO = grimEVOAmountOut?.currency

  // const WBTC_MULTIPLIER = chainId == ChainId.FANTOM ? 2 : ChainId.AVALANCHE ? 3.5 : 0

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

    // handle dai
    if (currency?.wrapped.equals(dai)) {
      return new Price(dai, dai, '1', '1')
    }

    // handle sor
    if (currency?.wrapped.equals(sor)) {
      return new Price(sor, sor, '1', '1')
    }

    // handle mim
    if (currency?.wrapped.equals(mim)) {
      return new Price(mim, mim, '1', '1')
    }

    // handle fusd
    if (currency?.wrapped.equals(fusd)) {
      return new Price(fusd, fusd, '100', Number(fusdPrice * 100).toFixed())
    }

    // handle soul
    if (currency?.wrapped.equals(soul)) {
      return new Price(soul, soul, '100000', Number(soulPrice * 100_000).toFixed())
    }

    // handle seance
    if (currency?.wrapped.equals(seance)) {
      return new Price(seance, seance, '1000', Number(seancePrice * 1000).toFixed())
    }

    // handle luxor
    if (currency?.wrapped.equals(luxor)) {
      return new Price(luxor, luxor, '100', Number(luxorPrice * 100).toFixed())
    }

    // handle wlum
    if (currency?.wrapped.equals(wlum)) {
      return new Price(wlum, wlum, '100', Number(wLumensPrice * 100).toFixed())
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
    // if (currency?.wrapped.equals(weth)) {
    //   return new Price(weth, weth, '1000', Number(wethPrice * 1000).toFixed())
    // }

    // // handle wbtc
    // if (currency?.wrapped.equals(wbtc)) {
    //   return new Price(wbtc, wbtc, '1', Number(wbtcPrice * WBTC_MULTIPLIER).toFixed())
    // }
    
    // handle bnb
    if (currency?.wrapped.equals(bnb)) {
      return new Price(bnb, bnb, '10', Number(bnbPrice * 10).toFixed())
    }

    // handle crv
    // if (currency?.wrapped.equals(crv)) {
    //   return new Price(crv, crv, '10', Number(crvPrice * 10).toFixed())
    // }
  
    // handle grimEVO
    // if (currency?.wrapped.equals(grimEVO)) {
    //   return new Price(grimEVO, grimEVO, '10', Number(grimEvoPrice * 10).toFixed())
    // }
    
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

