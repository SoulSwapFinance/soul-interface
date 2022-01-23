import { ChainId } from 'sdk'

export const OPENMEV_ENABLED = true

export const OPENMEV_SUPPORTED_NETWORKS = [ChainId.MAINNET]

export const OPENMEV_URI: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: 'https://api.sushirelay.com/v1',
}