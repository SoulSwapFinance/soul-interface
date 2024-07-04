import { ChainId } from 'sdk'

const THE_GRAPH = 'https://api.thegraph.com'
export const THE_GRAPH_STUDIO = 'https://api.studio.thegraph.com'
const NAS_GRAPH = 'https://graph.kkt.one/node'
const HYPER_GRAPH = 'https://q.hg.network'

export const GRAPH_HOST = {
  [ChainId.ETHEREUM]: THE_GRAPH,
  [ChainId.TELOS]: THE_GRAPH,
  [ChainId.FANTOM]: THE_GRAPH,
  [ChainId.BSC]: THE_GRAPH,
  [ChainId.AVALANCHE]: THE_GRAPH,
}