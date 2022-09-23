import { ChainId, WNATIVE_ADDRESS } from '../sdk'

const Fantom = 'https://cryptologos.cc/logos/fantom-ftm-logo.svg'
const Mainnet = 'https://cryptologos.cc/logos/ethereum-eth-logo.svg'
const Telos = '/images/networks/Telos.jpg'
const Bsc = 'https://cryptologos.cc/logos/bnb-bnb-logo.svg'
// const Arbitrum = '/images/networks/arbitrum-network.jpg'
const Avalanche = 'https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/avalanche/Avalanche.svg'
const Moonriver = 'https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/moonriver/Moonriver.svg'
// const Matic = '/images/networks/matic-network.jpg'
// const Moonbeam = '/images/networks/moonbeam-network.jpg'
const Polygon = '/images/networks/polygon-network.jpg'

export const NETWORK_ICON = {
  [ChainId.ETHEREUM]: Mainnet,
  [ChainId.TELOS]: Telos,
  [ChainId.BSC]: Bsc,
  [ChainId.FANTOM]: Fantom,
  [ChainId.AVALANCHE]: Avalanche,
  [ChainId.MOONRIVER]: Moonriver,
  [ChainId.MATIC]: Polygon,
  // [ChainId.FANTOM_TESTNET]: Fantom,
  // [ChainId.ROPSTEN]: Ropsten,
  // [ChainId.RINKEBY]: Rinkeby,
  // [ChainId.GÖRLI]: Goerli,
  // [ChainId.KOVAN]: Kovan,
  // [ChainId.MATIC_TESTNET]: Matic,
  // [ChainId.ARBITRUM]: Arbitrum,
  // [ChainId.ARBITRUM_TESTNET]: Arbitrum,
  // [ChainId.MOONBEAM_TESTNET]: Moonbeam,
  // [ChainId.AVALANCHE_TESTNET]: Avalanche,
}

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.TELOS]: 'Telos',
  [ChainId.BSC]: 'Binance',
  [ChainId.FANTOM]: 'Fantom',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.MOONRIVER]: 'Moonriver',
  [ChainId.MATIC]: 'Polygon',
  // [ChainId.FANTOM_TESTNET]: 'Fantom Testnet',
  // [ChainId.MATIC_TESTNET]: 'Matic Testnet',
  // [ChainId.ARBITRUM_TESTNET]: 'Arbitrum Testnet',
  // [ChainId.MOONBEAM_TESTNET]: 'Moonbase',
  // [ChainId.AVALANCHE_TESTNET]: 'Fuji',
}

export const NATIVE_TOKEN_TICKER = {
  [ChainId.ETHEREUM]: 'ETH',
  [ChainId.TELOS]: 'TLOS',
  [ChainId.BSC]: 'BNB',
  [ChainId.FANTOM]: 'FTM',
  [ChainId.AVALANCHE]: 'AVAX',
  [ChainId.MOONRIVER]: 'MOVR',
}

export const NATIVE_WRAPPED_TOKEN_ADDRESS = {
  [ChainId.ETHEREUM]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [ChainId.BSC]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  [ChainId.TELOS]: WNATIVE_ADDRESS[40],
  [ChainId.FANTOM]: WNATIVE_ADDRESS[250],
  [ChainId.AVALANCHE]: WNATIVE_ADDRESS[43114],
  [ChainId.MOONRIVER]: WNATIVE_ADDRESS[1285],
}
