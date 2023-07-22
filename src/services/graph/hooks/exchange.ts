import { ChainId } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
import stringify from 'fast-json-stable-stringify'
import useSWR, { SWRConfiguration } from 'swr'

import {
  getBundle,
  getDayData,
  getFactory,
  getLiquidityPositions,
  getNativePrice,
  getPairDayData,
  getPairs,
  getSoulPrice,
  getTokenDayData,
  getTokenPairs,
  getTokens,
} from '../fetchers'
import { GraphProps } from '../interfaces'
import { ethPriceQuery } from '../queries'

export function useFactory({
  chainId = ChainId.FANTOM,
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
  chainId = ChainId.FANTOM,
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

export function useSoulPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(['soulPrice'], () => getSoulPrice(chainId), swrConfig)
  return data
}

export function useBundle(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(chainId ? [chainId, ethPriceQuery, stringify(variables)] : null, () => getBundle(chainId), swrConfig)
  return data
}

export function useLiquidityPositions({
  chainId = ChainId.FANTOM,
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
  chainId = ChainId.FANTOM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['soulPairs', chainId, stringify(variables)] : null,
    (_, chainId) => getPairs(chainId, variables),
    swrConfig
  )
  return data
}

export function useTokens({
  chainId = ChainId.FANTOM,
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
  chainId = ChainId.FANTOM,
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
    (_, chainId) => getDayData(chainId, variables),
    swrConfig
  )
  return data
}

export function useTokenPairs({
  chainId = ChainId.FANTOM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['tokenPairs', chainId, stringify(variables)] : null,
    (_, chainId) => getTokenPairs(chainId, variables),
    swrConfig
  )
  return data
}