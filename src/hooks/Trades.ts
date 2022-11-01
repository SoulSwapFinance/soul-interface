import { Currency, CurrencyAmount, Pair, RoutablePlatform, Token, Trade, TradeType } from 'sdk'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { sortTradesByExecutionPrice } from '../utils/prices'
// import { useIsMultihop } from '../state/user/hooks'

import { ZERO_ADDRESS } from 'constants/index'
import { NETWORKS_INFO } from 'constants/networks'
import { PairState, usePairs } from 'data/Reserves'
import { useActiveWeb3React } from 'services/web3'
import { useAllCurrencyCombinations } from 'hooks/useAllCurrencyCombinations'
import useDebounce from 'hooks/useDebounce'
import { AppState } from 'state'
import { useAllDexes, useExcludeDexes } from 'state/customizeDexes/hooks'
import { useSwapState } from 'state/swap/hooks'
import { AggregationComparer } from 'state/swap/types'
import { Aggregator } from 'utils/swap/aggregator'
import { isAddress } from 'functions/validate'
import { BASES_TO_CHECK_TRADES_AGAINST } from 'config/routing'
import { flatMap } from 'lodash'

// TODO: fix ignores
function useAllCommonPairs(currencyA?: Currency, currencyB?: Currency, platform?: any): Pair[][] {
  const allPairCombinations = useAllCurrencyCombinations(currencyA, currencyB)

  const allPairs = usePairs(allPairCombinations)

  // only pass along valid pairs, non-duplicated pairs
  return useMemo(
    () =>
      allPairs.reduce<Pair[][]>((res, poolArray) => {
        const t = Object.values(
          poolArray
            // @ts-ignore
            .filter((result): result is [PairState.EXISTS, Pair] =>
              Boolean(result[0] === PairState.EXISTS && result[1]),
            )
            // @ts-ignore
            .reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
              memo[curr.liquidityToken.address] = memo[curr.liquidityToken.address] ?? curr
              return memo
            }, {}),
        )
        res.push(t)
        return res
      }, []),
    [allPairs],
  )
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useTradeExactIn(
  currencyAmountIn?: CurrencyAmount<Currency>,
  currencyOut?: Currency,
): Trade<Currency, Currency, TradeType> | null {
  const currencyIn = useMemo(() => currencyAmountIn?.currency, [currencyAmountIn])
  const allCommonPairs = useAllCommonPairs(currencyIn, currencyOut)
  const allowedPairs = useMemo(() => allCommonPairs.filter(item => item.length > 0), [allCommonPairs])
  const [trade, setTrade] = useState<Trade<Currency, Currency, TradeType> | null>(null)

  useEffect(() => {
    let timeout: any
    const fn = async function () {
      timeout = setTimeout(() => {
        if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
          if (process.env.REACT_APP_MAINNET_ENV === 'staging') {
            console.log('trade amount: ', currencyAmountIn.toSignificant(10))
          }

          setTrade(
              // @ts-ignore
            Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
              maxHops: 3,
              maxNumResults: 1,
            })[0] ?? null,
          )
        } else setTrade(null)
      }, 100)
    }
    fn()
    return () => {
      clearTimeout(timeout)
    }
  }, [currencyAmountIn, currencyOut, allowedPairs])

  return trade
}

let controller = new AbortController()
/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useTradeExactInV2(
  currencyAmountIn: CurrencyAmount<Currency> | undefined,
  currencyOut: Currency | undefined,
  saveGas: boolean,
  recipient: string | null,
  allowedSlippage: number,
): {
  trade: Aggregator | null
  comparer: AggregationComparer | null
  onUpdateCallback: (resetRoute: boolean, minimumLoadingTime: number) => void
  loading: boolean
} {
  const { account, chainId } = useActiveWeb3React()

  const allDexes = useAllDexes()
  const [excludeDexes] = useExcludeDexes()

  const selectedDexes = allDexes?.filter(item => !excludeDexes.includes(item.id)).map(item => item.id)

  const dexes =
    selectedDexes?.length === allDexes?.length
      ? ''
      : selectedDexes?.join(',').replace('kyberswapv1', 'kyberswap,kyberswap-static') || ''

  const [trade, setTrade] = useState<Aggregator | null>(null)
  const [comparer, setComparer] = useState<AggregationComparer | null>(null)
  const [loading, setLoading] = useState(false)

  const debounceCurrencyAmountIn = useDebounce(currencyAmountIn, 300)

  const routerApi = useMemo((): string => {
    return (chainId && NETWORKS_INFO[chainId].routerUri) || ''
  }, [chainId])

  const ttl = useSelector<AppState, number>(state => state.user.userDeadline)

  const { feeConfig } = useSwapState()

  const onUpdateCallback = useCallback(
    async (resetRoute: boolean, minimumLoadingTime: number) => {
      if (
        debounceCurrencyAmountIn &&
        currencyOut &&
        (debounceCurrencyAmountIn.currency as Token)?.address !== (currencyOut as Token)?.address
      ) {
        if (resetRoute) setTrade(null)
        controller.abort()

        controller = new AbortController()
        const signal = controller.signal

        setLoading(true)

        const to = (isAddress(recipient) ? (recipient as string) : account) ?? ZERO_ADDRESS

        const deadline = Math.round(Date.now() / 1000) + ttl

        const [state, comparedResult] = await Promise.all([
          Aggregator.bestTradeExactIn(
            routerApi,
            debounceCurrencyAmountIn,
            currencyOut,
            saveGas,
            dexes,
            allowedSlippage,
            deadline,
            to,
            feeConfig,
            signal,
            minimumLoadingTime,
          ),
          Aggregator.compareDex(
            routerApi,
            debounceCurrencyAmountIn,
            currencyOut,
            allowedSlippage,
            deadline,
            to,
            feeConfig,
            signal,
            minimumLoadingTime,
          ),
        ])

        if (!signal.aborted) {
          setTrade(state)
          setComparer(comparedResult)
        }
        setLoading(false)
      } else {
        setTrade(null)
        setComparer(null)
      }
    },
    [
      debounceCurrencyAmountIn,
      currencyOut,
      recipient,
      account,
      routerApi,
      saveGas,
      dexes,
      allowedSlippage,
      ttl,
      feeConfig,
    ],
  )

  useEffect(() => {
    onUpdateCallback(false, 0)
  }, [onUpdateCallback])

  return {
    trade,
    comparer,
    onUpdateCallback,
    loading,
  }
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
 export function useTradeExactInEco(
  currencyAmountIn?: CurrencyAmount<Currency>,
  currencyOut?: Currency,
  platform: RoutablePlatform = RoutablePlatform.SOULSWAP
): Trade<Currency, Currency, TradeType> | undefined {
  const { chainId } = useActiveWeb3React()
  const allowedPairs = useAllCommonPairs(currencyAmountIn?.currency, currencyOut, platform)
  const multihop = true
  // const multihop = useIsMultihop()

  return useMemo(() => {
    if (currencyAmountIn && currencyOut && allowedPairs.length > 0 && chainId && platform.supportsChain(chainId)) {
      return (
        // @ts-ignore
        Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
          maxHops: multihop ? 3 : 1,
          maxNumResults: 1
        })[0] ?? null
      )
    }
    return undefined
  }, [currencyAmountIn, currencyOut, allowedPairs, chainId, platform, multihop])
}

/**
 * Returns the best trade for the token in to the exact amount of token out
 */
export function useTradeExactOutEco(
  currencyIn?: Currency,
  currencyAmountOut?: CurrencyAmount<Currency>,
  platform: RoutablePlatform = RoutablePlatform.SOULSWAP
): Trade<Currency, Currency, TradeType> | undefined {
  const { chainId } = useActiveWeb3React()
  const allowedPairs = useAllCommonPairs(currencyIn, currencyAmountOut?.currency, platform)
  const multihop = true
  // const multihop = useIsMultihop()

  return useMemo(() => {
    if (currencyIn && currencyAmountOut && allowedPairs.length > 0 && chainId && platform.supportsChain(chainId)) {
      return (
        // @ts-ignore
        Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, {
          maxHops: multihop ? 3 : 1,
          maxNumResults: 1
        })[0] ?? null
      )
    }
    return undefined
  }, [currencyIn, currencyAmountOut, allowedPairs, chainId, platform, multihop])
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 * for each supported platform. Order is by lowest price ascending.
 */
 export function useTradeExactInAllPlatforms(
  currencyAmountIn?: CurrencyAmount<Currency>,
  currencyOut?: Currency
): (Trade<Currency, Currency, TradeType> | undefined)[] {
  const bestTrades = [
    useTradeExactInEco(currencyAmountIn, currencyOut, RoutablePlatform.SOULSWAP),
    useTradeExactInEco(currencyAmountIn, currencyOut, RoutablePlatform.UNISWAP),
  ]
  return sortTradesByExecutionPrice(bestTrades).filter(trade => !!trade)
}

/**
 * Returns the best trade for the token in to the exact amount of token out
 * for each supported platform. Order is by lowest price ascending.
 */
export function useTradeExactOutAllPlatforms(
  currencyIn?: Currency,
  currencyAmountOut?: CurrencyAmount<Currency>
): (Trade<Currency, Currency, TradeType>  | undefined)[] {
  const bestTrades = [
    useTradeExactOutEco(currencyIn, currencyAmountOut, RoutablePlatform.SOULSWAP),
    useTradeExactOutEco(currencyIn, currencyAmountOut, RoutablePlatform.UNISWAP),
  ]
  return sortTradesByExecutionPrice(bestTrades).filter(trade => !!trade)
}