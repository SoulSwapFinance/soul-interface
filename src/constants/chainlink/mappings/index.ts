import { ChainId } from '../../../sdk'
import ETHEREUM from './ethereum'
import MATIC from './matic'

export type ChainlinkMappingList = {
  readonly [address: string]: {
    from: string
    to: string
    decimals: number
    fromDecimals: number
    toDecimals: number
    warning?: string
    address?: string
  }
}

export const CHAINLINK_MAPPING: {
  [chainId in ChainId]?: ChainlinkMappingList
} = {
  [ChainId.ETHEREUM]: ETHEREUM,
  // [ChainId.KOVAN]: KOVAN,
  // [ChainId.HECO]: HECO,
  [ChainId.MATIC]: MATIC,
  // [ChainId.XDAI]: XDAI,
}
