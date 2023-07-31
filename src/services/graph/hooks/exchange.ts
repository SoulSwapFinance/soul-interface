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
  getTokenDayData,
  getTokenPairs,
  getTokenPrice,
  getTokens,
} from '../fetchers'
import { GraphProps } from '../interfaces'
import { dayDatasQuery, ethPriceQuery, pairDayDatasQuery, pairsQuery, tokenDayDatasQuery, tokenPriceQuery, tokensQuery } from '../queries'

export function useFactory({
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(
    shouldFetch ? ['factory', chainId, stringify(variables)] : null,
    () => getFactory(chainId, variables),
    swrConfig
  )
  return data
}

export function useNativePrice({
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(
    shouldFetch ? ['nativePrice', chainId, stringify(variables)] : null,
    () => getNativePrice(chainId, variables),
    swrConfig
  )

  return data
}

export function useEthPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(['ethPrice'], () => getNativePrice(chainId, variables), swrConfig)
  return data
}

export function useBundle(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const chainId = useActiveWeb3React()
  const { data } = useSWR(chainId ? [chainId, ethPriceQuery, stringify(variables)] : null, () => getBundle(
    chainId,
  ), swrConfig)
  return data
}

export function useLiquidityPositions({
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(
    shouldFetch ? ['liquidityPositions', chainId, stringify(variables)] : null,
    (_, chainId) => getLiquidityPositions(chainId, variables),
    swrConfig
  )
  return data
}

export function usePairs({
  // chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(chainId ? [chainId, pairsQuery, stringify(variables)] : null, () => getPairs(
    chainId,
    variables
  ), swrConfig)
  return data
}

export function useTokens({
  // chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(chainId ? [chainId, tokensQuery, stringify(variables)] : null, () => getTokens(
    chainId,
    variables
  ), swrConfig)
  return data
}

export function useTokenPrice({
  // chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(chainId ? [chainId, tokenPriceQuery, stringify(variables)] : null, () => getTokenPrice(
    chainId,
    tokenPriceQuery,
    variables
  ), swrConfig)
  return data
}

export function usePairDayData({
  // chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(chainId ? [chainId, pairDayDatasQuery, stringify(variables)] : null, () => getPairDayData(
    chainId,
    variables,
  ), swrConfig)
  return data
}

// export function useTokenDayData(
//   { variables, shouldFetch = true }: GraphProps,
//   swrConfig: SWRConfiguration = undefined
// ) {
//   const { chainId } = useActiveWeb3React()

//   const { data } = useSWR(
//     shouldFetch && !!chainId ? ['tokenDayData', chainId, stringify(variables)] : null,
//     (_, chainId) => getTokenDayData(chainId, variables),
//     swrConfig
//   )
//   return data
// }

export function useTokenDayData({
  // chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(chainId ? [chainId, tokenDayDatasQuery, stringify(variables)] : null, () => getTokenDayData(
    chainId,
    variables
  ), swrConfig)
  return data
}

// √ works
export function useDayData({
  // chainId,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(chainId ? [chainId, dayDatasQuery, stringify(variables)] : null, () => getDayData(
    chainId,
    variables
  ), swrConfig)
  return data
}

export function useTokenPairs({
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(
    shouldFetch ? ['tokenPairs', chainId, stringify(variables)] : null,
    (_, chainId) => getTokenPairs(chainId, variables),
    swrConfig
  )
  return data
}