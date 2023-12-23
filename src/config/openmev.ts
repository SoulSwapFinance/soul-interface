import { ChainId } from 'sdk'

export const OPENMEV_ENABLED = true

export const OPENMEV_SUPPORTED_NETWORKS = []
// export const OPENMEV_SUPPORTED_NETWORKS = [ChainId.ETHEREUM]

export const OPENMEV_URI: { [chainId in ChainId]?: string } = {
  [ChainId.ETHEREUM]: 'https://api.sushirelay.com/v1',
}