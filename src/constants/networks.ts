import { ChainId, WNATIVE_ADDRESS } from '../sdk'

const Fantom = '/images/networks/fantom-network.jpg'
const Mainnet = '/images/networks/mainnet-network.jpg'
const Bsc = '/images/networks/bsc.png'

// const Arbitrum = '/images/networks/arbitrum-network.jpg'
// const Avalanche = '/images/networks/avalanche-network.jpg'
// const Goerli = '/images/networks/goerli-network.jpg'
// const Harmony = '/images/networks/harmonyone-network.jpg'
// const Heco = '/images/networks/heco-network.jpg'
// const Kovan = '/images/networks/kovan-network.jpg'
// const Matic = '/images/networks/matic-network.jpg'
// const Moonbeam = '/images/networks/moonbeam-network.jpg'
// const OKEx = '/images/networks/okex-network.jpg'
// const Polygon = '/images/networks/polygon-network.jpg'
// const Rinkeby = '/images/networks/rinkeby-network.jpg'
// const Ropsten = '/images/networks/ropsten-network.jpg'
// const xDai = '/images/networks/xdai-network.jpg'
// const Celo = '/images/networks/celo-network.jpg'

export const NETWORK_ICON = {
  [ChainId.ETHEREUM]: Mainnet,
  [ChainId.BSC]: Bsc,
  [ChainId.FANTOM]: Fantom,
  [ChainId.FANTOM_TESTNET]: Fantom,
  // [ChainId.ROPSTEN]: Ropsten,
  // [ChainId.RINKEBY]: Rinkeby,
  // [ChainId.GÖRLI]: Goerli,
  // [ChainId.KOVAN]: Kovan,
  // [ChainId.MATIC]: Polygon,
  // [ChainId.MATIC_TESTNET]: Matic,
  // [ChainId.XDAI]: xDai,
  // [ChainId.ARBITRUM]: Arbitrum,
  // [ChainId.ARBITRUM_TESTNET]: Arbitrum,
  // [ChainId.MOONBEAM_TESTNET]: Moonbeam,
  // [ChainId.AVALANCHE]: Avalanche,
  // [ChainId.AVALANCHE_TESTNET]: Avalanche,
  // [ChainId.HECO]: Heco,
  // [ChainId.HECO_TESTNET]: Heco,
  // [ChainId.HARMONY]: Harmony,
  // [ChainId.HARMONY_TESTNET]: Harmony,
  // [ChainId.OKEX]: OKEx,
  // [ChainId.OKEX_TESTNET]: OKEx,
  // [ChainId.CELO]: Celo,
}

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.BSC]: 'Binance',
  [ChainId.FANTOM]: 'Fantom',
  [ChainId.FANTOM_TESTNET]: 'Fantom Testnet',
  // [ChainId.RINKEBY]: 'Rinkeby',
  // [ChainId.ROPSTEN]: 'Ropsten',
  // [ChainId.GÖRLI]: 'Görli',
  // [ChainId.KOVAN]: 'Kovan',
  // [ChainId.MATIC]: 'Polygon (Matic)',
  // [ChainId.MATIC_TESTNET]: 'Matic Testnet',
  // [ChainId.XDAI]: 'xDai',
  // [ChainId.ARBITRUM]: 'Arbitrum',
  // [ChainId.ARBITRUM_TESTNET]: 'Arbitrum Testnet',
  // [ChainId.MOONBEAM_TESTNET]: 'Moonbase',
  // [ChainId.AVALANCHE]: 'Avalanche',
  // [ChainId.AVALANCHE_TESTNET]: 'Fuji',
  // [ChainId.HECO]: 'HECO',
  // [ChainId.HECO_TESTNET]: 'HECO Testnet',
  // [ChainId.HARMONY]: 'Harmony',
  // [ChainId.HARMONY_TESTNET]: 'Harmony Testnet',
  // [ChainId.OKEX]: 'OKEx',
  // [ChainId.OKEX_TESTNET]: 'OKEx',
  // [ChainId.CELO]: 'Celo',
}

export const NATIVE_TOKEN_TICKER = {
  [ChainId.ETHEREUM]: 'ETH',
  [ChainId.BSC]: 'BNB',
  [ChainId.FANTOM]: 'FTM',
}

export const NATIVE_WRAPPED_TOKEN_ADDRESS = {
  [ChainId.ETHEREUM]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [ChainId.FANTOM]: WNATIVE_ADDRESS[250],
}
