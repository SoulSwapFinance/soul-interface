// TODO: update all

import {
  miniSummonerPairAddressesQuery,
  miniSummonerPoolsQuery,
  soulSummonerPairAddressesQuery,
  poolsSummonerQuery,
} from '../queries'

import { ChainId } from '@soulswap/sdk'
import { GRAPH_HOST } from '../constants'
import { request } from 'graphql-request'

export const MINISUMMONER = {
  [ChainId.MATIC]: 'sushiswap/matic-minichef',
  [ChainId.XDAI]: 'matthewlilley/xdai-minichef',
  [ChainId.HARMONY]: 'sushiswap/harmony-minichef',
}

export const miniSummoner = async (query, chainId = ChainId.MAINNET) =>
  request(`${GRAPH_HOST[chainId]}/subgraphs/name/${MINISUMMONER[chainId]}`, query)

export const SOUL_SUMMONER = {
  [ChainId.MAINNET]: 'sushiswap/master-chefv2',
}

export const soulSummoner = async (query, chainId = ChainId.MAINNET) =>
  request(`${GRAPH_HOST[chainId]}/subgraphs/name/${SOUL_SUMMONER[chainId]}`, query)

export const getSoulSummonerPairAddreses = async () => {
  const { pools } = await soulSummoner(soulSummonerPairAddressesQuery)
  return pools
}

export const getSoulSummonerFarms = async () => {
  const { pools } = await soulSummoner(poolsSummonerQuery)
  return pools
}

export const getMiniSummonerFarms = async (chainId = ChainId.MAINNET) => {
  const { pools } = await miniSummoner(miniSummonerPoolsQuery, chainId)
  return pools
}

export const getMiniSummonerPairAddreses = async (chainId = ChainId.MAINNET) => {
  console.debug('getMiniSummonerPairAddreses')
  const { pools } = await miniSummoner(miniSummonerPairAddressesQuery, chainId)
  return pools
}
