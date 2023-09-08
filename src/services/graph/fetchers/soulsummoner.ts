import {
  soulSummonerPairAddressesQuery,
  poolsSummonerQuery,
} from '../queries'

import { ChainId } from '../../../sdk'
import { GRAPH_HOST } from '../constants'
import { request } from 'graphql-request'

export const SOUL_SUMMONER = {
  [ChainId.FANTOM]: 'soulswapfinance/soul-summoner',
}

export const soulSummoner = async (query, chainId = ChainId.FANTOM) =>
  request(`${GRAPH_HOST[chainId ?? ChainId.FANTOM]}/subgraphs/name/${SOUL_SUMMONER[chainId ?? ChainId.FANTOM]}`, query)

export const getSoulSummonerPairAddreses = async () => {
  const { pools } = await soulSummoner(soulSummonerPairAddressesQuery)
  return pools
}

export const getSoulSummonerFarms = async () => {
  const { pools } = await soulSummoner(poolsSummonerQuery)
  return pools
}
