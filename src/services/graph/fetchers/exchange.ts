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

// export const EXCHANGE_URL = () => {
//   const {chainId } = useActiveWeb3React()
//   let URL = 'soulswapfinance/fantom-swap'
//   return URL
// }

// √ works
export const exchange = async (chainId, query, variables = {}) => {
  // const URL = EXCHANGE_URL()
  // console.log(URL)
  // console.log(chainId)
  let URL
  chainId == ChainId.AVALANCHE ? URL = 'soulswapfinance/avalanche-swap' : URL = 'soulswapfinance/fantom-swap'
  // console.log(URL)
  return pager(`https://api.thegraph.com/subgraphs/name/${URL}`, query, variables)
}

// √ works
export const getPairs = async (chainId, variables = undefined, query = pairsQuery) => {
  // console.log('getPairs')
  // console.log('chain', chainId)
  const { pairs } = await exchange(chainId, query, variables)
  return pairs
}

// √ works
export const getPairDayData = async (chainId, variables) => {
  // console.log('getPairDayData')
  // console.log('chain', chainId)
  const { pairDayDatas } = await exchange(chainId, pairDayDatasQuery, variables)
  return pairDayDatas
}

export const getTokenSubset = async (chainId, variables) => {
  console.log('getTokenSubset')
  const { tokens } = await exchange(chainId, tokenSubsetQuery, variables)
  return tokens
}

// √ works
export const getTokens = async (chainId, variables) => {
  // console.log('getTokens')
  // console.log('chain', chainId)

  const { tokens } = await exchange(chainId, tokensQuery, variables)
  return tokens
}

export const getToken = async (chainId, query = tokenQuery, variables) => {
  console.log('getToken')
  console.log('chain', chainId)
  const { token } = await exchange(chainId, query, variables)
  return token
}

// √ works
export const getTokenDayData = async (chainId, variables) => {
  // console.log('getTokenDayData')
  // console.log('chain', chainId)
  const { tokenDayDatas } = await exchange(chainId, tokenDayDatasQuery, variables)
  return tokenDayDatas
}

export const getTokenPrices = async (chainId, variables) => {
  console.log('getTokenPrices')
  const { tokens } = await exchange(chainId, tokenPriceQuery, variables)
  return tokens.map((token) => token?.derivedETH)
}

export const getTokenPrice = async (chainId, query, variables) => {
  console.log('fetcher: getTokenPrice')
  console.log('chain', chainId)
  const nativePrice = await getNativePrice(chainId)

  const { token } = await exchange(chainId, query, variables)
  return token?.derivedETH * nativePrice
}

// √ works
export const getNativePrice = async (chainId, variables = undefined) => {
  // console.log('getNativePrice')
  // console.log('chain', chainId)
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

// √ works
export const getBundle = async (
  chainId,
  query = ethPriceQuery,
  variables = {
    id: 1,
  }
) => {
  // console.log('getBundle')
  // console.log('chain', chainId)
  return exchange(chainId, query, variables)
}

export const getLiquidityPositions = async (chainId, variables) => {
  console.log('getLiquidityPositions')

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

// √ works
export const getFactory = async (chainId, variables = undefined) => {
  // console.log('getFactory')
  // console.log('chain', chainId)
  const { factories } = await exchange(chainId, factoryQuery, variables)
  return factories[0]
}

// √ works
export const getTransactions = async (chainId, variables = undefined) => {
  // console.log('getTransactions')
  // console.log('chain', chainId)

  const { swaps } = await exchange(chainId, transactionsQuery, variables)
  return swaps
}

export const getTokenPairs = async (chainId, variables = undefined) => {
  console.log('getTokenPairs')
  const { pairs0, pairs1 } = await exchange(chainId, tokenPairsQuery, variables)
  return pairs0 || pairs1 ? [...(pairs0 ? pairs0 : []), ...(pairs1 ? pairs1 : [])] : undefined
}