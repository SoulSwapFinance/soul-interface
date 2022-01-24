import { ChainId } from 'sdk'
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
  [ChainId.MAINNET]: 'sushiswap/exchange',
  // [ChainId.XDAI]: 'sushiswap/xdai-exchange',
  // [ChainId.MATIC]: 'sushiswap/matic-exchange',
  [ChainId.FANTOM]: 'soulswapfinance/fantom-exchange',
  // [ChainId.FANTOM]: 'sushiswap/fantom-exchange',
  [ChainId.BSC]: 'sushiswap/bsc-exchange',
  // [ChainId.HARMONY]: 'sushiswap/harmony-exchange',
  // [ChainId.AVALANCHE]: 'sushiswap/avalanche-exchange',
  // [ChainId.CELO]: 'jiro-ono/sushitestsubgraph',
  // [ChainId.ARBITRUM]: 'sushiswap/arbitrum-exchange',
  // [ChainId.MOONRIVER]: 'sushiswap/moonriver-exchange',
  // [ChainId.OKEX]: 'okex-exchange/oec',
  // [ChainId.HECO]: 'heco-exchange/heco',
  // [ChainId.FUSE]: 'sushiswap/fuse-exchange',
}

// @ts-ignore TYPE NEEDS FIXING
export const exchange = async (chainId = ChainId.FANTOM, query, variables = {}) =>
  // @ts-ignore TYPE NEEDS FIXING
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${EXCHANGE[chainId]}`, query, variables)

export const getPairs = async (chainId = ChainId.FANTOM, variables = undefined, query = pairsQuery) => {
  const { pairs } = await exchange(chainId, query, variables)
  return pairs
}

// @ts-ignore TYPE NEEDS FIXING
export const getPairDayData = async (chainId = ChainId.FANTOM, variables) => {
  // console.log('getTokens')
  const { pairDayDatas } = await exchange(chainId, pairDayDatasQuery, variables)
  return pairDayDatas
}

// @ts-ignore TYPE NEEDS FIXING
export const getTokenSubset = async (chainId = ChainId.FANTOM, variables) => {
  // console.log('getTokenSubset')
  const { tokens } = await exchange(chainId, tokenSubsetQuery, variables)
  return tokens
}

// @ts-ignore TYPE NEEDS FIXING
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
  // console.log('getEthPrice')
  const data = await getBundle(chainId, undefined, variables)
  return data?.bundles[0]?.ethPrice
}

export const getEthPrice = async (variables = undefined) => {
  return getNativePrice(ChainId.FANTOM, variables)
}

export const getSoulPrice = async (variables = {}) => {
  // console.log('getSoulPrice')
  return getTokenPrice(ChainId.FANTOM, tokenPriceQuery, {
    id: '0xe2fb177009ff39f52c0134e8007fa0e4baacbd07',
    ...variables,
  })
}

export const getFantomPrice = async () => {
  return getTokenPrice(ChainId.FANTOM, tokenPriceQuery, {
    id: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
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