import { BigNumber } from '@ethersproject/bignumber'
import {
    PoolState, 
    ConstantProductPool, 
    ChainId, 
    Currency, 
    CurrencyAmount, 
    Pair, 
    TridentTrade as Trade, 
    Trade as LegacyTrade, 
    TradeType, 
    convertTinesSingleRouteToLegacyRoute,
    findMultiRouteExactIn,
    findMultiRouteExactOut,
    findSingleRouteExactIn,
    findSingleRouteExactOut,
    MultiRoute,
    RouteStatus,
    WNATIVE 
} from 'sdk'

import { PoolUnion } from 'features/trident/types'
import { toShareCurrencyAmount } from 'functions'
import { useCoffinRebase } from 'hooks/useCoffinRebases'
import { PairState, useV2Pairs } from 'hooks/useV2Pairs'
import { useActiveWeb3React } from 'services/web3'
import { useBlockNumber } from 'state/application/hooks'
import { TradeUnion } from 'types'
import { useEffect, useMemo, useState } from 'react'
import { atom, useSetRecoilState } from 'recoil'

import { useAllCurrencyCombinations } from './useAllCurrencyCombinations'
import { useConstantProductPoolsPermutations } from './useConstantProductPools'

export function useAllCommonPools(currencyA?: Currency, currencyB?: Currency): (PoolUnion | Pair)[] {
  const currencyCombinations = useAllCurrencyCombinations(currencyA, currencyB)
  const constantProductPools = useConstantProductPoolsPermutations(currencyCombinations)
  const allPairs = useV2Pairs(currencyCombinations)
  const pools = useMemo(() => [...constantProductPools, ...allPairs], [allPairs, constantProductPools])
  return useMemo(
    () => [
      ...Object.values(
        pools.reduce<(PoolUnion | Pair)[]>((acc, result) => {
          if (!Array.isArray(result) && result.state === PoolState.EXISTS && result.pool) {
            acc.push(result.pool)
          }

          if (Array.isArray(result) && result[0] === PairState.EXISTS && result[1]) {
            acc.push(result[1])
          }

          return acc
        }, [])
      ),
    ],
    [pools]
  )
}

export type UseBestTridentTradeOutput = {
  trade?: TradeUnion
  priceImpact?: number
}

export type RoutingInfo = {
  chainId?: ChainId
  allowedPools?: (PoolUnion | Pair)[]
  mode?: 'single' | 'multiple'
  route?: MultiRoute
}

export const routingInfo = atom<RoutingInfo | undefined>({
  key: 'routingInfo',
  default: undefined,
})

/**
 * Returns best trident trade for a desired swap.
 * @param tradeType whether we request an exact output amount or we provide an exact input amount
 * @param amountSpecified the exact amount to swap in/out
 * @param mainCurrency the desired input/payment currency
 * @param otherCurrency the desired output/payment currency
 */
export function useBestTridentTrade(
  tradeType: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT,
  amountSpecified?: CurrencyAmount<Currency>,
  mainCurrency?: Currency,
  otherCurrency?: Currency
): UseBestTridentTradeOutput {
  const { chainId, library } = useActiveWeb3React()
  const blockNumber = useBlockNumber()
  const setRoutingInfo = useSetRecoilState(routingInfo)
  const { rebase } = useCoffinRebase(amountSpecified?.currency)
  const [gasPrice, setGasPrice] = useState<number>()
  const [currencyIn, currencyOut] = useMemo(
    () => (tradeType === TradeType.EXACT_INPUT ? [mainCurrency, otherCurrency] : [otherCurrency, mainCurrency]),
    [tradeType, mainCurrency, otherCurrency]
  )
  const allowedPools = useAllCommonPools(currencyIn, currencyOut)

  useEffect(() => {
    if (!library) return

    const main = async () => {
      const gas = await library.getGasPrice()
      return gas.toNumber()
    }

    main().then((gasPrice) => setGasPrice(gasPrice))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, library])

  return useMemo(() => {
    if (
      gasPrice &&
      currencyIn &&
      currencyOut &&
      currencyIn.wrapped.address !== currencyOut.wrapped.address &&
      chainId &&
      amountSpecified &&
      otherCurrency &&
      rebase &&
      allowedPools.length > 0
    ) {
      const shareSpecified = CurrencyAmount.fromRawAmount(
        amountSpecified.currency,
        toShareCurrencyAmount(rebase, amountSpecified.wrapped).quotient.toString()
      )
      const tridentPools = allowedPools.filter((pool) => pool instanceof ConstantProductPool) as ConstantProductPool[]
      const legacyPools = allowedPools.filter((pair) => pair instanceof Pair) as Pair[]

      if (tradeType === TradeType.EXACT_INPUT) {
        const tridentRoute = findMultiRouteExactIn(
          currencyIn.wrapped,
          currencyOut.wrapped,
          BigNumber.from(shareSpecified.quotient.toString()),
          tridentPools,
          WNATIVE[shareSpecified.currency.chainId],
          gasPrice
        )

        const legacyRoute = findSingleRouteExactIn(
          currencyIn.wrapped,
          currencyOut.wrapped,
          BigNumber.from(amountSpecified.quotient.toString()),
          legacyPools,
          WNATIVE[amountSpecified.currency.chainId],
          gasPrice
        )

        if (tridentRoute.amountOutBN.gt(legacyRoute.amountOutBN)) {
          if (tridentRoute.status === RouteStatus.Success) {
            const priceImpact = tridentRoute.priceImpact
            setRoutingInfo({ chainId, allowedPools: tridentPools, route: tridentRoute, mode: 'multiple' })
            return {
              trade: Trade.bestTradeExactIn(tridentRoute, shareSpecified, currencyOut),
              priceImpact,
            }
          }
        } else {
          if (legacyRoute.status === RouteStatus.Success) {
            const priceImpact = legacyRoute.priceImpact
            setRoutingInfo({ chainId, allowedPools: legacyPools, route: legacyRoute, mode: 'single' })
            return {
              trade: LegacyTrade.exactIn(
                convertTinesSingleRouteToLegacyRoute(legacyRoute, legacyPools, currencyIn, currencyOut),
                amountSpecified
              ),
              priceImpact,
            }
          }
        }
      } else {
        const tridentRoute = findMultiRouteExactOut(
          currencyIn.wrapped,
          currencyOut.wrapped,
          BigNumber.from(shareSpecified.quotient.toString()),
          tridentPools,
          WNATIVE[shareSpecified.currency.chainId],
          gasPrice
        )

        const legacyRoute = findSingleRouteExactOut(
          currencyIn.wrapped,
          currencyOut.wrapped,
          BigNumber.from(amountSpecified.quotient.toString()),
          legacyPools,
          WNATIVE[amountSpecified.currency.chainId],
          gasPrice
        )

        if (tridentRoute.amountInBN.lt(legacyRoute.amountInBN)) {
          if (tridentRoute.status === RouteStatus.Success) {
            const priceImpact = tridentRoute.priceImpact
            setRoutingInfo({ chainId, allowedPools: tridentPools, route: tridentRoute, mode: 'multiple' })
            return {
              trade: Trade.bestTradeExactOut(tridentRoute, currencyIn, shareSpecified),
              priceImpact,
            }
          }
        } else {
          if (legacyRoute.status === RouteStatus.Success) {
            const priceImpact = legacyRoute.priceImpact
            setRoutingInfo({ chainId, allowedPools: legacyPools, route: legacyRoute, mode: 'single' })
            return {
              trade: LegacyTrade.exactOut(
                convertTinesSingleRouteToLegacyRoute(legacyRoute, legacyPools, currencyIn, currencyOut),
                amountSpecified
              ),
              priceImpact,
            }
          }
        }
      }
    }

    return {
      trade: undefined,
      priceImpact: undefined,
    }
  }, [
    allowedPools,
    amountSpecified,
    chainId,
    currencyIn,
    currencyOut,
    gasPrice,
    otherCurrency,
    rebase,
    setRoutingInfo,
    tradeType,
  ])
}