import { ChainId, SOUL_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS } from 'sdk'
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
  [ChainId.ETHEREUM]: 'soulswapfinance/fantom-swap',
  [ChainId.FANTOM]: 'soulswapfinance/fantom-swap',
  [ChainId.AVALANCHE]: 'soulswapfinance/avalanche-swap',
  [ChainId.BSC]: 'soulswapfinance/fantom-swap',
}

// const getExchange = () => {
//   const { chainId } = useActiveWeb3React()
//   let exchange = EXCHANGE[chainId ?? ChainId.FANTOM]
//   console.log(exchange)
//   return exchange
// }

export const exchange = async (chainId = ChainId.FANTOM, query, variables = {}) => {
  // const URL = EXCHANGE_URL()
  // console.log(URL)
  // console.log(chainId)
  let URL
  chainId == ChainId.AVALANCHE ? URL = 'soulswapfinance/avalanche-swap' : URL = 'soulswapfinance/fantom-swap' ?? 'soulswapfinance/fantom-swap'
  // console.log('exchange URL: %s', URL)
  return pager(`https://api.thegraph.com/subgraphs/name/${URL}`, query, variables)
}

export const getPairs = async (chainId, variables = undefined, query = pairsQuery) => {
  // const { chainId } = useActiveWeb3React()
  const { pairs } = await exchange(chainId, query, variables)
  return pairs
}

export const getPairDayData = async (chainId, variables) => {
  // console.log('getTokens')
  const { pairDayDatas } = await exchange(chainId, pairDayDatasQuery, variables)
  return pairDayDatas
}

export const getTokenSubset = async (chainId, variables) => {
  // console.log('getTokenSubset')
  const { tokens } = await exchange(chainId, tokenSubsetQuery, variables)
  return tokens
}

export const getTokens = async (chainId, variables) => {
  // console.log('getTokens')
  const { tokens } = await exchange(chainId, tokensQuery, variables)
  return tokens
}

// @ts-ignore TYPE NEEDS FIXING
export const getToken = async (chainId, query = tokenQuery, variables) => {
  // console.log('getTokens')
  const { token } = await exchange(chainId, query, variables)
  return token
}

export const getPair = async (chainId, query = pairQuery, variables) => {
  // console.log('getTokens')
  const { pair } = await exchange(chainId, query, variables)
  return pair
}

// @ts-ignore TYPE NEEDS FIXING
export const getTokenDayData = async (chainId, variables) => {
  // console.log('getTokens')
  const { tokenDayDatas } = await exchange(chainId, tokenDayDatasQuery, variables)
  return tokenDayDatas
}

export const getTokenPrices = async (chainId, variables) => {
  console.log('getTokenPrices')
  const { tokens } = await exchange(chainId, tokensQuery, variables)
  // @ts-ignore TYPE NEEDS FIXING
  return tokens.map((token) => token?.derivedETH)
}

// √ reports chainId
export const getTokenPrice = async (chainId, query, variables) => {
  // console.log('hooks: getTokenPrice')
  // console.log('chain', chainId)
  const nativePrice = await getNativePrice(chainId)

  const { token } = await exchange(chainId, query, variables)
  return token?.derivedETH * nativePrice
}

export const getPairPrice = async (chainId, query, variables) => {
  const { pair } = await exchange(chainId, query, variables)
  return pair?.reserveUSD
}

// @ts-ignore TYPE NEEDS FIXING
// export const getPairPrice = async (chainId, query, variables) => {
//   // console.log('getPairPrice')
//   const nativePrice = await getNativePrice(chainId)

//   const { pair } = await exchange(chainId, query, variables)
//   return pair?.reserveETH * nativePrice
// }

export const getNativePrice = async (chainId, variables = undefined) => {
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
    id: SOUL_ADDRESS[chainId ?? ChainId.FANTOM].toLowerCase(),
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

export const getWrappedLumPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.FANTOM, tokenPriceQuery, {
    id: '0xa69557e01b0a6b86e5b29be66d730c0bfff68208',
    ...variables,
  })
}

export const getSeancePrice = async (variables = {}) => {
  return getTokenPrice(ChainId.FANTOM, tokenPriceQuery, {
    id: '0x124b06c5ce47de7a6e9efda71a946717130079e6',
    ...variables,
  })
}

export const getFantomPrice = async () => {
  return getTokenPrice(ChainId.FANTOM, tokenPriceQuery, {
    id: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  })
}

export function getTokensPrice(chainId, address: string) {
  // const { chainId } = useActiveWeb3React()
  return getTokenPrice(chainId, tokenPriceQuery, {
    id: address,
  })
}

export function getPairsPrice(chainId, address: string) {
  // const { chainId } = useActiveWeb3React()
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
  chainId,
  query = ethPriceQuery,
  variables = {
    id: 1,
  }
) => {
  return exchange(chainId, query, variables)
}

export const getLiquidityPositions = async (chainId, variables) => {
  const { liquidityPositions } = await exchange(chainId, liquidityPositionsQuery, variables)
  return liquidityPositions
}

// √ works
export const getDayData = async (chainId, variables = undefined) => {
  // console.log('getDayData')
  // console.log('chain', chainId)
  const { dayDatas } = await exchange(chainId, dayDatasQuery, variables)
  return dayDatas
}

export const getFactory = async (chainId, variables = undefined) => {
  const { factories } = await exchange(chainId, factoryQuery, variables)
  return factories[0]
}

export const getTransactions = async (chainId, variables = undefined) => {
  const { swaps } = await exchange(chainId, transactionsQuery, variables)
  return swaps
}

export const getTokenPairs = async (variables = undefined) => {
  const { chainId } = useActiveWeb3React()
  const { pairs0, pairs1 } = await exchange(chainId, tokenPairsQuery, variables)
  return pairs0 || pairs1 ? [...(pairs0 ? pairs0 : []), ...(pairs1 ? pairs1 : [])] : undefined
}

// USE HOOKS

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

export function useSoulPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['soulPrice'], () => getSoulPrice(), swrConfig)
  return data
}

export function useTokenPrice(tokenAddress: string, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(['tokenPrice'], () => getTokensPrice(chainId, tokenAddress), swrConfig)
  return data
}

// export function useTokenPrice({
//   // chainId,
//   variables,
//   shouldFetch = true,
//   swrConfig = undefined,
// }: GraphProps) {
//   const { chainId } = useActiveWeb3React()
//   const { data } = useSWR(chainId ? [chainId, tokenPriceQuery, stringify(variables)] : null, () => getTokenPrice(
//     chainId,
//     tokenPriceQuery,
//     variables
//   ), swrConfig)
//   return data
// }

// reserveUSD
export function usePairPrice(chainId, pairAddress: string, swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['pairPrice'], () => getPairsPrice(chainId, pairAddress), swrConfig)
  return data
}

export function useSeancePrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['seancePrice'], () => getSeancePrice(), swrConfig)
  return data
}

export function useWrappedLumPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['wLumPrice'], () => getWrappedLumPrice(), swrConfig)
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

export function useFantomPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['fantomPrice'], () => getFantomPrice(), swrConfig)
  return data
}

// PAIR PRICES //

// export function usePairPrice(swrConfig: SWRConfiguration = undefined) {
//   const { data } = useSWR(['pairPrice'], () => getPairsPrice(), swrConfig)
//   return data
// }

// @ts-ignore TYPE NEEDS FIXING
// export function useSeancePrice(swrConfig: SWRConfiguration = undefined) {
//   const { chainId } = useActiveWeb3React()
//   const { data } = useSWR(chainId && chainId === ChainId.FANTOM 
//     ? ['seancePrice'] : null, () => getSeancePrice(), swrConfig)
//   return data
// }