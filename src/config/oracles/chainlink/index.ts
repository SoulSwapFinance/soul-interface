import { ChainId } from 'sdk'

// import ARBITRUM from './mappings/arbitrum'
// import AVALANCHE from './mappings/avalanche'
import BSC from './mappings/bsc'
// import HECO from './mappings/heco'
import FANTOM from './mappings/fantom'
// import KOVAN from './mappings/kovan'
import ETHEREUM from './mappings/ethereum'
// import MATIC from './mappings/matic'
// import XDAI from './mappings/xdai'

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
  [ChainId.FANTOM]: FANTOM,
  // [ChainId.KOVAN]: KOVAN,
//   [ChainId.HECO]: HECO,
//   [ChainId.MATIC]: MATIC,
//   [ChainId.XDAI]: XDAI,
//   [ChainId.ARBITRUM]: ARBITRUM,
//   [ChainId.AVALANCHE]: AVALANCHE,
}