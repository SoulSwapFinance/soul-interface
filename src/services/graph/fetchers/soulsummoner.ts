// TODO: update all

import {
  soulSummonerPairAddressesQuery,
  poolsSummonerQuery,
} from '../queries'

import { ChainId } from '@soulswap/sdk'
import { GRAPH_HOST } from '../constants'
import { request } from 'graphql-request'

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
