import { ChainId } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
import stringify from 'fast-json-stable-stringify'
import useSWR, { SWRConfiguration } from 'swr'

import {
  getAlcxPrice,
  getBundle,
  getCvxPrice,
  getDayData,
  getFactory,
  getFantomPrice,
  getLiquidityPositions,
  getNativePrice,
  getPairDayData,
  getPairs,
  getRulerPrice,
  getSoulPrice,
  getSpellPrice,
  getTokenDayData,
  getTokenPairs,
  getTokens,
  getTruPrice,
} from '../fetchers'
import { GraphProps } from '../interfaces'
import { ethPriceQuery } from '../queries'

export function useFactory({
  chainId = ChainId.MAINNET,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['factory', chainId, stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    () => getFactory(chainId, variables),
    swrConfig
  )
  return data
}

export function useNativePrice({
  chainId = ChainId.MAINNET,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['nativePrice', chainId, stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    () => getNativePrice(chainId, variables),
    swrConfig
  )

  return data
}

// @ts-ignore TYPE NEEDS FIXING
export function useEthPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['ethPrice'], () => getNativePrice(variables), swrConfig)
  return data
}

// @ts-ignore TYPE NEEDS FIXING
export function useSpellPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR('spellPrice', () => getSpellPrice(), swrConfig)
  return data
}

// @ts-ignore TYPE NEEDS FIXING
export function useFantomPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.FANTOM
  const { data } = useSWR(shouldFetch ? 'fantomPrice' : null, () => getFantomPrice(), swrConfig)
  return data
}

// @ts-ignore TYPE NEEDS FIXING
// export function useMovrPrice(swrConfig: SWRConfiguration = undefined) {
//   const { chainId } = useActiveWeb3React()
//   const shouldFetch = chainId && chainId === ChainId.MOONRIVER
//   const { data } = useSWR(shouldFetch ? 'movrPrice' : null, () => getMovrPrice(), swrConfig)
//   return data
// }

// @ts-ignore TYPE NEEDS FIXING
export function useRulerPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.MAINNET
  const { data } = useSWR(shouldFetch ? ['rulerPrice'] : null, () => getRulerPrice(), swrConfig)
  return data
}

// @ts-ignore TYPE NEEDS FIXING
export function useTruPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(chainId && chainId === ChainId.MAINNET ? ['truPrice'] : null, () => getTruPrice(), swrConfig)
  return data
}

// @ts-ignore TYPE NEEDS FIXING
export function useAlcxPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.MAINNET
  const { data } = useSWR(shouldFetch ? ['aclxPrice'] : null, () => getAlcxPrice(), swrConfig)
  return data
}

// @ts-ignore TYPE NEEDS FIXING
export function useCvxPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.MAINNET
  const { data } = useSWR(shouldFetch ? ['cvxPrice'] : null, () => getCvxPrice(), swrConfig)
  return data
}

// @ts-ignore TYPE NEEDS FIXING
// export function useSushiPrice(swrConfig: SWRConfiguration = undefined) {
//   const { data } = useSWR(['sushiPrice'], () => getSushiPrice(), swrConfig)
//   return data
// }

// @ts-ignore TYPE NEEDS FIXING
export function useSoulPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['soulPrice'], () => getSoulPrice(), swrConfig)
  return data
}


// @ts-ignore TYPE NEEDS FIXING
export function useBundle(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(chainId ? [chainId, ethPriceQuery, stringify(variables)] : null, () => getBundle(), swrConfig)
  return data
}

export function useLiquidityPositions({
  chainId = ChainId.MAINNET,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['liquidityPositions', chainId, stringify(variables)] : null,
    (_, chainId) => getLiquidityPositions(chainId, variables),
    swrConfig
  )
  return data
}

export function useSoulPairs({
  chainId = ChainId.MAINNET,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['soulPairs', chainId, stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    (_, chainId) => getPairs(chainId, variables),
    swrConfig
  )
  return data
}

export function useTokens({
  chainId = ChainId.MAINNET,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['tokens', chainId, stringify(variables)] : null,
    (_, chainId) => getTokens(chainId, variables),
    swrConfig
  )
  return data
}

export function usePairDayData({
  chainId = ChainId.MAINNET,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch && !!chainId ? ['pairDayData', chainId, stringify(variables)] : null,
    (_, chainId) => getPairDayData(chainId, variables),
    swrConfig
  )
  return data
}

export function useTokenDayData(
  { chainId, variables, shouldFetch = true }: GraphProps,
  // @ts-ignore TYPE NEEDS FIXING
  swrConfig: SWRConfiguration = undefined
) {
  const { data } = useSWR(
    shouldFetch && !!chainId ? ['tokenDayData', chainId, stringify(variables)] : null,
    (_, chainId) => getTokenDayData(chainId, variables),
    swrConfig
  )
  return data
}

export function useDayData({ chainId, variables, shouldFetch = true, swrConfig = undefined }: GraphProps) {
  const { data } = useSWR(
    shouldFetch && !!chainId ? ['dayData', chainId, stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    (_, chainId) => getDayData(chainId, variables),
    swrConfig
  )
  return data
}

export function useTokenPairs({
  chainId = ChainId.MAINNET,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['tokenPairs', chainId, stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    (_, chainId) => getTokenPairs(chainId, variables),
    swrConfig
  )
  return data
}