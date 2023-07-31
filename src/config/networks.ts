import { ChainId } from '../sdk'

const Ethereum = '/images/networks/ethereum-white.svg'
const Telos = '/images/networks/telos.png'
const Avalanche = '/images/networks/avalanche-white.svg'
const Polygon = '/images/networks/polygon.svg'
const Arbitrum = `/images/networks/arbitrum.svg`
const Binance = '/images/networks/binance.svg'
// const Binance = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/network/bsc.svg'
// const Binance = 'https://cryptologos.cc/logos/bnb-bnb-logo.svg'

const Fantom = '/images/networks/fantom-white.svg'
const Moonriver = '/images/networks/moonriver.svg'

export const NETWORK_ICON = {
  [ChainId.ETHEREUM]: Ethereum,
  [ChainId.TELOS]: Telos,
  [ChainId.BSC]: Binance,
  [ChainId.FANTOM]: Fantom,
  [ChainId.AVALANCHE]: Avalanche,
  [ChainId.MATIC]: Polygon,
  [ChainId.ARBITRUM]: Arbitrum,
  [ChainId.MOONRIVER]: Moonriver,
}

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.TELOS]: 'Telos',
  [ChainId.BSC]: 'Binance',
  [ChainId.FANTOM]: 'Fantom',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.MATIC]: 'Polygon',
  [ChainId.ARBITRUM]: 'Arbitrum',
  [ChainId.MOONRIVER]: 'Moonriver',
}
