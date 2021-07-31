import {
  masterChefV2PairAddressesQuery,
  miniChefPairAddressesQuery,
  miniChefPoolsQuery,
  poolsV2Query,
} from '../queries'

import { ChainId } from '@soulswap/sdk'
import { GRAPH_HOST } from '../constants'
import { request } from 'graphql-request'

export const MINICHEF = {
  [ChainId.MATIC]: 'sushiswap/matic-minichef',
  [ChainId.XDAI]: 'matthewlilley/xdai-minichef',
  [ChainId.HARMONY]: 'sushiswap/harmony-minichef',
}

export const miniChef = async (query, chainId = ChainId.MAINNET) =>
  request(`${GRAPH_HOST[chainId]}/subgraphs/name/${MINICHEF[chainId]}`, query)

export const MASTERCHEF_V2 = {
  [ChainId.MAINNET]: 'sushiswap/master-chefv2',
}
export const masterChefV2 = async (query, chainId = ChainId.MAINNET) =>
  request(`${GRAPH_HOST[chainId]}/subgraphs/name/${MASTERCHEF_V2[chainId]}`, query)

export const getMasterChefV2Farms = async () => {
  const { pools } = await masterChefV2(poolsV2Query)
  return pools
}

export const getMasterChefV2PairAddreses = async () => {
  const { pools } = await masterChefV2(masterChefV2PairAddressesQuery)
  return pools
}

export const getMiniChefFarms = async (chainId = ChainId.MAINNET) => {
  const { pools } = await miniChef(miniChefPoolsQuery, chainId)
  return pools
}

export const getMiniChefPairAddreses = async (chainId = ChainId.MAINNET) => {
  console.debug('getMiniChefPairAddreses')
  const { pools } = await miniChef(miniChefPairAddressesQuery, chainId)
  return pools
}
