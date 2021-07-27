// TODO: update all

import { ChainId } from '@soulswap/sdk'
// import { GRAPH_HOST } from '../constants'
import { request } from 'graphql-request'

const SPELL = {
  [ChainId.MAINNET]: 'matthewlilley/bar',
}

export const spell = async (query, chainId = ChainId.MAINNET) =>
  request(`https://api.thegraph.com/subgraphs/name/${SPELL[chainId]}`, query)
