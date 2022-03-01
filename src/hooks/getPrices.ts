import { ChainId } from 'sdk'
import { GRAPH_HOST } from 'services/graph/constants'
import { pager } from 'services/graph/fetchers/pager'
import {
  dayDatasQuery,
  ethPriceQuery,
  factoryQuery,
  liquidityPositionsQuery,
  pairDayDatasQuery,
  pairsQuery,
  tokenDayDatasQuery,
  tokenPairsQuery,
  tokenPriceQuery,
  tokenQuery,
  tokensQuery,
  tokenSubsetQuery,
  transactionsQuery,
} from 'services/graph/queries'
import { useActiveWeb3React } from 'services/web3'
import useSWR, { SWRConfiguration } from 'swr'

export const EXCHANGE = {
  [ChainId.ETHEREUM]: 'soulswapfinance/fantom-exchange',
  [ChainId.FANTOM]: 'soulswapfinance/fantom-exchange',
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
  return getTokenPrice(ChainId.FANTOM, tokenPriceQuery, {
    id: '0xe2fb177009ff39f52c0134e8007fa0e4baacbd07',
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
    id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
  })
}

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
export const getLiquidityPositions = async (chainId = ChainId.ETHEREUM, variables) => {
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


export function useSoulPrice(swrConfig: SWRConfiguration = undefined) {
  const { data } = useSWR(['soulPrice'], () => getSoulPrice(), swrConfig)
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

// @ts-ignore TYPE NEEDS FIXING
// export function useSeancePrice(swrConfig: SWRConfiguration = undefined) {
//   const { chainId } = useActiveWeb3React()
//   const { data } = useSWR(chainId && chainId === ChainId.FANTOM 
//     ? ['seancePrice'] : null, () => getSeancePrice(), swrConfig)
//   return data
// }