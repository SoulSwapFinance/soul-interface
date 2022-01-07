import { ChainId } from '../../../sdk'
const THE_GRAPH = 'https://api.thegraph.com'

export const GRAPH_HOST = {
  [ChainId.MAINNET]: THE_GRAPH,
  [ChainId.FANTOM]: THE_GRAPH
}
