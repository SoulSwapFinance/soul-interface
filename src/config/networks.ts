import { ChainId } from '../sdk'

const Mainnet = '/images/networks/mainnet-network.jpg'
const Telos = '/images/networks/telos.png'
const Avalanche = 'https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/avalanche/Avalanche.svg'
const Polygon = 'https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/polygon/Polygon.svg'
const Arbitrum = 'https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/arbitrum/Arbitrum.png'
const Binance = '/images/networks/bsc.png'
const Fantom = '/images/networks/fantom-network.jpg'

export const NETWORK_ICON = {
  [ChainId.ETHEREUM]: Mainnet,
  [ChainId.TELOS]: Telos,
  [ChainId.BSC]: Binance,
  [ChainId.FANTOM]: Fantom,
  [ChainId.FANTOM_TESTNET]: Fantom,
  [ChainId.AVALANCHE]: Avalanche,
  [ChainId.MATIC]: Polygon,
  [ChainId.ARBITRUM]: Arbitrum,
}

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.TELOS]: 'Telos',
  [ChainId.BSC]: 'Binance',
  [ChainId.FANTOM]: 'Fantom',
  [ChainId.FANTOM_TESTNET]: 'Testnet',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.MATIC]: 'Polygon',
  [ChainId.ARBITRUM]: 'Arbitrum',
}
