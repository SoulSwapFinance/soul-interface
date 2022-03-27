import { ChainId } from 'sdk'

import BSC from './mappings/bsc'
import FANTOM from './mappings/fantom'
import ETHEREUM from './mappings/ethereum'

export type ChainlinkPriceFeedEntry = {
  from: string
  to: string
  decimals: number
  fromDecimals: number
  toDecimals: number
  warning?: string
  address?: string
}

export type ChainlinkPriceFeedMap = {
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

export const CHAINLINK_PRICE_FEED_MAP: {
  [chainId in ChainId]?: ChainlinkPriceFeedMap
} = {
  [ChainId.ETHEREUM]: ETHEREUM,
  [ChainId.BSC]: BSC,
  [ChainId.FANTOM]: FANTOM
}