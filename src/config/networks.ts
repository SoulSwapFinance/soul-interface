import { ChainId } from '../sdk'

const Mainnet = 'https://cryptologos.cc/logos/ethereum-eth-logo.svg'
const Telos = '/images/networks/telos.png'
const Avalanche = 'https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/avalanche/Avalanche.svg'
const Polygon = 'https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/polygon/Polygon.svg'
const Arbitrum = 'https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/arbitrum/Arbitrum.png'
const Binance = 'https://cryptologos.cc/logos/bnb-bnb-logo.svg'
const Fantom = 'https://cryptologos.cc/logos/fantom-ftm-logo.svg'

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
