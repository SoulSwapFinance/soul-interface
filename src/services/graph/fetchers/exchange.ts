import { ChainId, SOUL_ADDRESS, WNATIVE_ADDRESS } from 'sdk'
import { GRAPH_HOST } from 'services/graph/constants'
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
import { pager } from './pager'

export const EXCHANGE = {
  // [ChainId.ETHEREUM]: 'sushiswap/exchange',
  [ChainId.ETHEREUM]: 'soulswapfinance/fantom-exchange',
  [ChainId.FANTOM]: 'soulswapfinance/fantom-exchange',
  [ChainId.AVALANCHE]: 'soulswapfinance/avalanche-exchange',
  [ChainId.BSC]: 'soulswapfinance/fantom-exchange',
  // [ChainId.BSC]: 'sushiswap/bsc-exchange',
}

export const exchange = async (chainId = ChainId.AVALANCHE, query, variables = {}) =>
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${EXCHANGE[chainId]}`, query, variables)

export const getPairs = async (chainId = ChainId.AVALANCHE, variables = undefined, query = pairsQuery) => {
  
  const { pairs } = await exchange(chainId, query, variables)
  return pairs
}

export const getPairDayData = async (chainId = ChainId.AVALANCHE, variables) => {
  // console.log('getTokens')
  const { pairDayDatas } = await exchange(chainId, pairDayDatasQuery, variables)
  return pairDayDatas
}

export const getTokenSubset = async (chainId = ChainId.AVALANCHE, variables) => {
  // console.log('getTokenSubset')
  const { tokens } = await exchange(chainId, tokenSubsetQuery, variables)
  return tokens
}

export const getTokens = async (chainId = ChainId.AVALANCHE, variables) => {
  // console.log('getTokens')
  const { tokens } = await exchange(chainId, tokensQuery, variables)
  return tokens
}

// @ts-ignore TYPE NEEDS FIXING
export const getToken = async (chainId = ChainId.AVALANCHE, query = tokenQuery, variables) => {
  // console.log('getTokens')
  const { token } = await exchange(chainId, query, variables)
  return token
}

// @ts-ignore TYPE NEEDS FIXING
export const getTokenDayData = async (chainId = ChainId.AVALANCHE, variables) => {
  // console.log('getTokens')
  const { tokenDayDatas } = await exchange(chainId, tokenDayDatasQuery, variables)
  return tokenDayDatas
}

// @ts-ignore TYPE NEEDS FIXING
export const getTokenPrices = async (chainId = ChainId.AVALANCHE, variables) => {
  // console.log('getTokenPrice')
  const { tokens } = await exchange(chainId, tokensQuery, variables)
  // @ts-ignore TYPE NEEDS FIXING
  return tokens.map((token) => token?.derivedETH)
}

// @ts-ignore TYPE NEEDS FIXING
export const getTokenPrice = async (chainId = ChainId.AVALANCHE, query, variables) => {
  // console.log('getTokenPrice')
  const nativePrice = await getNativePrice(chainId)

  const { token } = await exchange(chainId, query, variables)
  return token?.derivedETH * nativePrice
}

export const getNativePrice = async (chainId = ChainId.AVALANCHE, variables = undefined) => {
  // console.log('getEthPrice')
  const data = await getBundle(chainId, undefined, variables)
  return data?.bundles[0]?.ethPrice
}

export const getEthPrice = async (variables = undefined) => {
  return getNativePrice(ChainId.ETHEREUM, variables)
}

// export const getPrice = (tokenAddress: string) => async (variables = {}) => {
//   return getTokenPrice(ChainId.FANTOM, tokenPriceQuery, {
//     id: tokenAddress,
//     ...variables,
//   })
// }

export const getSoulPrice = async (variables = {}) => {
  // console.log('getSoulPrice')
  return getTokenPrice(ChainId.AVALANCHE, tokenPriceQuery, {
    id: SOUL_ADDRESS[ChainId.AVALANCHE],
    ...variables,
  })
}

export const getFantomPrice = async () => {
  return getTokenPrice(ChainId.FANTOM, tokenPriceQuery, {
    id: WNATIVE_ADDRESS[ChainId.FANTOM],
  })
}

export const getBundle = async (
  chainId = ChainId.AVALANCHE,
  query = ethPriceQuery,
  variables = {
    id: 1,
  }
) => {
  return exchange(chainId, query, variables)
}

// @ts-ignore TYPE NEEDS FIXING
export const getLiquidityPositions = async (chainId = ChainId.AVALANCHE, variables) => {
  const { liquidityPositions } = await exchange(chainId, liquidityPositionsQuery, variables)
  return liquidityPositions
}

export const getDayData = async (chainId = ChainId.AVALANCHE, variables = undefined) => {
  const { dayDatas } = await exchange(chainId, dayDatasQuery, variables)
  return dayDatas
}

export const getFactory = async (chainId = ChainId.AVALANCHE, variables = undefined) => {
  const { factories } = await exchange(chainId, factoryQuery, variables)
  return factories[0]
}

export const getTransactions = async (chainId = ChainId.AVALANCHE, variables = undefined) => {
  const { swaps } = await exchange(chainId, transactionsQuery, variables)
  return swaps
}

export const getTokenPairs = async (chainId = ChainId.AVALANCHE, variables = undefined) => {
  const { pairs0, pairs1 } = await exchange(chainId, tokenPairsQuery, variables)
  return pairs0 || pairs1 ? [...(pairs0 ? pairs0 : []), ...(pairs1 ? pairs1 : [])] : undefined
}