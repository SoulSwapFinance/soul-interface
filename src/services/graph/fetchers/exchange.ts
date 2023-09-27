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
// import { useActiveWeb3React } from 'services/web3'

// √ works
export const exchange = async (chainId, query, variables = {}) => 
pager(`https://api.thegraph.com/subgraphs/name/soulswapfinance/${chainId == ChainId.AVALANCHE ? 'avalanche' : 'fantom'}-swap`, query, variables)

// √ works
export const getPairs = async (chainId, variables = undefined, query = pairsQuery) => {
  console.log(`getPairs(f): [${chainId}]`)
  const { pairs } = await exchange(chainId, query, variables)
  return pairs
}

// √ works
export const getPairDayData = async (chainId, variables) => {
  console.log(`getPairDayData(f): [${chainId}]`)
  const { pairDayDatas } = await exchange(chainId, pairDayDatasQuery, variables)
  return pairDayDatas
}

export const getTokenSubset = async (chainId, variables) => {
  console.log(`getTokenSubset(f): [${chainId}]`)
  const { tokens } = await exchange(chainId, tokenSubsetQuery, variables)
  return tokens
}

// √ works
export const getTokens = async (chainId, variables) => {
  console.log(`getTokens(f): [${chainId}]`)
  const { tokens } = await exchange(chainId, tokensQuery, variables)
  return tokens
}

export const getToken = async (chainId, query = tokenQuery, variables) => {
  console.log(`getToken(f): [${chainId}]`)
  const { token } = await exchange(chainId, query, variables)
  return token
}

// √ works
export const getTokenDayData = async (chainId, variables) => {
  console.log(`getTokenDayData(f): [${chainId}]`)
  const { tokenDayDatas } = await exchange(chainId, tokenDayDatasQuery, variables)
  return tokenDayDatas
}

export const getTokenPrices = async (chainId, variables) => {
  console.log(`getTokenPrices(f): [${chainId}]`)
  const { tokens } = await exchange(chainId, tokenPriceQuery, variables)
  return tokens.map((token) => token?.derivedETH)
}

export const getTokenPrice = async (chainId, query, variables) => {
  console.log(`getTokenPrice(f): [${chainId}]`)
  const nativePrice = await getNativePrice(chainId)

  const { token } = await exchange(chainId, query, variables)
  return token?.derivedETH * nativePrice
}

// √ works
export const getNativePrice = async (chainId, variables = undefined) => {
  console.log(`getNativePrice(f): [${chainId}]`)
  const data = await getBundle(chainId, undefined, variables)
  return data?.bundles[0]?.ethPrice
}

// export const getPrice = (tokenAddress: string) => async (variables = {}) => {
//   return getTokenPrice(ChainId.FANTOM, tokenPriceQuery, {
//     id: tokenAddress,
//     ...variables,
//   })
// }

// √ works
export const getBundle = async (
  chainId,
  query = ethPriceQuery,
  variables = {
    id: 1,
  }
) => {
  console.log(`getBundle(f): [${chainId}]`)
  return exchange(chainId, query, variables)
}

export const getLiquidityPositions = async (chainId, variables) => {
  console.log(`getLiquidityPositions(f): [${chainId}]`)
  const { liquidityPositions } = await exchange(chainId, liquidityPositionsQuery, variables)
  return liquidityPositions
}

// √ works
export const getDayData = async (chainId, variables = undefined) => {
  console.log(`getDayData(f): [${chainId}]`)
  const { dayDatas } = await exchange(chainId, dayDatasQuery, variables)
  return dayDatas
}

// √ works
export const getFactory = async (chainId, variables = undefined) => {
  const { factories } = await exchange(chainId, factoryQuery, variables)
  return factories[0]
}

// √ works
export const getTransactions = async (chainId, variables = undefined) => {
  console.log(`getTransactions(f): [${chainId}]`)
  const { swaps } = await exchange(chainId, transactionsQuery, variables)
  return swaps
}

export const getTokenPairs = async (chainId, variables = undefined) => {
  console.log(`getTokenPairs(f): [${chainId}]`)
  const { pairs0, pairs1 } = await exchange(chainId, tokenPairsQuery, variables)
  return pairs0 || pairs1 ? [...(pairs0 ? pairs0 : []), ...(pairs1 ? pairs1 : [])] : undefined
}