import { ChainId } from '../../../sdk'

import ETHEREUM from './mainnet'

export type ChainlinkToken = {
  symbol: string
  name: string
  address: string
  decimals: number
}

export const CHAINLINK_TOKENS: { [chainId in ChainId]?: ChainlinkToken[] } = {
  [ChainId.ETHEREUM]: ETHEREUM
}
