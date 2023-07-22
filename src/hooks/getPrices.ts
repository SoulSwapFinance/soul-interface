import { ChainId, SOUL_ADDRESS, WBTC_ADDRESS } from 'sdk'
import { GRAPH_HOST } from 'services/graph/constants'
import { pager } from 'services/graph/fetchers/pager'
import { GraphProps } from 'services/graph/interfaces'
import {
  dayDatasQuery,
  ethPriceQuery,
  factoryQuery,
  liquidityPositionsQuery,
  pairDayDatasQuery,
  pairReserveQuery,
  pairQuery,
  pairsQuery,
  tokenDayDatasQuery,
  tokenPairsQuery,
  tokenPriceQuery,
  tokenQuery,
  tokensQuery,
  tokenSubsetQuery,
  transactionsQuery,
} from 'services/graph/queries'
// import { useActiveWeb3React } from 'services/web3'
import useSWR, { SWRConfiguration } from 'swr'
import stringify from 'fast-json-stable-stringify'
import { useActiveWeb3React } from 'services/web3'

export const EXCHANGE = {
  [ChainId.ETHEREUM]: 'soulswapfinance/fantom-exchange',
  [ChainId.FANTOM]: 'soulswapfinance/fantom-exchange',
  [ChainId.AVALANCHE]: 'soulswapfinance/avalanche-exchange',
  [ChainId.BSC]: 'soulswapfinance/fantom-exchange',
}

export const exchange = async (chainId = ChainId.FANTOM, query, variables = {}) =>
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${EXCHANGE[chainId]}`, query, variables)

export const getPairs = async (chainId = ChainId.FANTOM, variables = undefined, query = pairsQuery) => {
  const { pairs } = await exchange(chainId, query, variables)
  return pairs
}

export const getPairDayData = async (chainId = ChainId.FANTOM, variables) => {
  // console.log('getTokens')
  const { pairDayDatas } = await exchange(chainId, pairDayDatasQuery, variables)
  return pairDayDatas
}

export const getTokenSubset = async (chainId = ChainId.FANTOM, variables) => {
  // console.log('getTokenSubset')
  const { tokens } = await exchange(chainId, tokenSubsetQuery, variables)
  return tokens
}

export const getTokens = async (chainId = ChainId.FANTOM, variables) => {
  // console.log('getTokens')
  const { tokens } = await exchange(chainId, tokensQuery, variables)
  return tokens
}

// @ts-ignore TYPE NEEDS FIXING
export const getToken = async (chainId = ChainId.FANTOM, query = tokenQuery, variables) => {
  // console.log('getTokens')
  const { token } = await exchange(chainId, query, variables)
  return token
}

export const getPair = async (chainId = ChainId.FANTOM, query = pairQuery, variables) => {
  // console.log('getTokens')
  const { pair } = await exchange(chainId, query, variables)
  return pair
}

// @ts-ignore TYPE NEEDS FIXING
export const getTokenDayData = async (chainId = ChainId.FANTOM, variables) => {
  // console.log('getTokens')
  const { tokenDayDatas } = await exchange(chainId, tokenDayDatasQuery, variables)
  return tokenDayDatas
}

// @ts-ignore TYPE NEEDS FIXING
export const getTokenPrices = async (chainId = ChainId.FANTOM, variables) => {
  // console.log('getTokenPrice')
  const { tokens } = await exchange(chainId, tokensQuery, variables)
  // @ts-ignore TYPE NEEDS FIXING
  return tokens.map((token) => token?.derivedETH)
}

// @ts-ignore TYPE NEEDS FIXING
export const getTokenPrice = async (chainId = ChainId.FANTOM, query, variables) => {
  // console.log('getTokenPrice')
  const nativePrice = await getNativePrice(chainId)

  const { token } = await exchange(chainId, query, variables)
  return token?.derivedETH * nativePrice
}

export const getPairPrice = async (chainId = ChainId.FANTOM, query, variables) => {
  const { pair } = await exchange(chainId, query, variables)
  return pair?.reserveUSD
}

// @ts-ignore TYPE NEEDS FIXING
// export const getPairPrice = async (chainId = ChainId.FANTOM, query, variables) => {
//   // console.log('getPairPrice')
//   const nativePrice = await getNativePrice(chainId)

//   const { pair } = await exchange(chainId, query, variables)
//   return pair?.reserveETH * nativePrice
// }

export const getNativePrice = async (chainId = ChainId.FANTOM, variables = undefined) => {
  const data = await getBundle(chainId, undefined, variables)
  return data?.bundles[0]?.ethPrice
}

// export const getPrice = (tokenAddress: string) => async (variables = {}) => {
//   return getTokenPrice(ChainId.FANTOM, tokenPriceQuery, {
//     id: tokenAddress,
//     ...variables,
//   })
// }

// export function useTokenPrice(id: string) {
//   const price = async (variables = {}) => {
//     return getTokenPrice(ChainId.FANTOM, tokenPriceQuery, {
//       id,
//       ...variables,
//     })
//   }

//   return price
// }

export const getSoulPrice = async (variables = {}) => {
  const { chainId } = useActiveWeb3React()
  return getTokenPrice(chainId, tokenPriceQuery, {
    id: SOUL_ADDRESS[chainId].toLowerCase(),
    ...variables,
  })
}

export const getEnchantPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.FANTOM, tokenPriceQuery, {
    id: '0x6a1a8368d607c7a808f7bba4f7aed1d9ebde147a',
    ...variables,
  })
}

export const getLuxorPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.FANTOM, tokenPriceQuery, {
    id: '0x6671e20b83ba463f270c8c75dae57e3cc246cb2b',
    ...variables,
  })
}

export const getBinancePrice = async () => {
  return getTokenPrice(ChainId.FANTOM, tokenPriceQuery, {
    id: '0xd67de0e0a0fd7b15dc8348bb9be742f3c5850454',
  })
}

export const getWrappedEthPrice = async () => {
  return getTokenPrice(ChainId.FANTOM, tokenPriceQuery, {
    id: '0x74b23882a30290451a17c44f4f05243b6b58c76d',
  })
}

export const getWrappedBtcPrice = async () => {
  const { chainId } = useActiveWeb3React()
  return getTokenPrice(chainId, tokenPriceQuery, {
    id: WBTC_ADDRESS[chainId].toLowerCase(),
  })
}

export function getTokensPrice(address: string) {
  const { chainId } = useActiveWeb3React()
  return getTokenPrice(chainId, tokenPriceQuery, {
    id: address,
  })
}

export function getPairsPrice(address: string) {
  const { chainId } = useActiveWeb3React()
  return getPairPrice(chainId, pairReserveQuery, {
    id: address,
  })
}

// export function getPairsPrice(address: string) {
//   return getPairPrice(ChainId.FANTOM, pairReserveQuery, {
//     id: address,
//   })
// }

export const getBundle = async (
  chainId = ChainId.FANTOM,
  query = ethPriceQuery,
  variables = {
    id: 1,
  }
) => {
  return exchange(chainId, query, variables)
}

// @ts-ignore TYPE NEEDS FIXING
export const getLiquidityPositions = async (chainId = ChainId.FANTOM, variables) => {
  const { liquidityPositions } = await exchange(chainId, liquidityPositionsQuery, variables)
  return liquidityPositions
}

export const getDayData = async (chainId = ChainId.FANTOM, variables = undefined) => {
  const { dayDatas } = await exchange(chainId, dayDatasQuery, variables)
  return dayDatas
}

export const getFactory = async (chainId = ChainId.FANTOM, variables = undefined) => {
  const { factories } = await exchange(chainId, factoryQuery, variables)
  return factories[0]
}

export const getTransactions = async (chainId = ChainId.FANTOM, variables = undefined) => {
  const { swaps } = await exchange(chainId, transactionsQuery, variables)
  return swaps
}

export const getTokenPairs = async (chainId = ChainId.FANTOM, variables = undefined) => {
  const { pairs0, pairs1 } = await exchange(chainId, tokenPairsQuery, variables)
  return pairs0 || pairs1 ? [...(pairs0 ? pairs0 : []), ...(pairs1 ? pairs1 : [])] : undefined
}

// USE HOOKS

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

export function useSoulPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['soulPrice'], () => getSoulPrice(), swrConfig)
  return data
}

export function useTokenPrice(tokenAddress: string, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['tokenPrice'], () => getTokensPrice(tokenAddress), swrConfig)
  return data
}

// reserveUSD
export function usePairPrice(pairAddress: string, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['pairPrice'], () => getPairsPrice(pairAddress), swrConfig)
  return data
}

export function useLuxorPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['luxorPrice'], () => getLuxorPrice(), swrConfig)
  return data
}

export function useEnchantPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['enchantPrice'], () => getEnchantPrice(), swrConfig)
  return data
}

export function useBinancePrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['binancePrice'], () => getBinancePrice(), swrConfig)
  return data
}

export function useWrappedEthPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['wethPrice'], () => getWrappedEthPrice(), swrConfig)
  return data
}

export function useWrappedBtcPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['btcPrice'], () => getWrappedBtcPrice(), swrConfig)
  return data
}

// PAIR PRICES //

// export function usePairPrice(swrConfig: SWRConfiguration = undefined) {
//   const { data } = useSWR(['pairPrice'], () => getPairsPrice(), swrConfig)
//   return data
// }