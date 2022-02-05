import { ChainId } from '../../../sdk'
// import { GRAPH_HOST } from '../constants'
import { request } from 'graphql-request'

const SPELL = {
  [ChainId.ETHEREUM]: 'matthewlilley/bar',
}

export const spell = async (query, chainId = ChainId.ETHEREUM) =>
  request(`https://api.thegraph.com/subgraphs/name/${SPELL[chainId]}`, query)
