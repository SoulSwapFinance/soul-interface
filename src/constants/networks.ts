import { ChainId, WNATIVE_ADDRESS } from 'sdk'
import { NetworkInfo } from './type'
import {
  arbitrum,
  avax,
  bsc,
  eth,
  ftm,
  matic,
} from './networks/index'

type NetToChain = { [p: string]: ChainId }

const Fantom = 'https://cryptologos.cc/logos/fantom-ftm-logo.svg'
const Mainnet = 'https://cryptologos.cc/logos/ethereum-eth-logo.svg'
const Telos = '/images/networks/Telos.jpg'
const Bsc = 'https://cryptologos.cc/logos/bnb-bnb-logo.svg'

// const Arbitrum = '/images/networks/arbitrum-network.jpg'
const Avalanche = 'https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/avalanche/Avalanche.svg'
const Moonriver = 'https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/moonriver/Moonriver.svg'
// const Goerli = '/images/networks/goerli-network.jpg'
// const Harmony = '/images/networks/harmonyone-network.jpg'
// const Heco = '/images/networks/heco-network.jpg'
// const Kovan = '/images/networks/kovan-network.jpg'
// const Matic = '/images/networks/matic-network.jpg'
// const Moonbeam = '/images/networks/moonbeam-network.jpg'
// const OKEx = '/images/networks/okex-network.jpg'
const Arbitrum = '/images/networks/arbitrum.svg'
const Polygon = '/images/networks/polygon-network.jpg'
const Base = '/images/networks/base.svg'
// const Rinkeby = '/images/networks/rinkeby-network.jpg'
// const Ropsten = '/images/networks/ropsten-network.jpg'
// const xDai = '/images/networks/xdai-network.jpg'
// const Celo = '/images/networks/celo-network.jpg'

export const NETWORK_ICON: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: Mainnet,
  [ChainId.TELOS]: Telos,
  [ChainId.BSC]: Bsc,
  [ChainId.FANTOM]: Fantom,
  [ChainId.AVALANCHE]: Avalanche,
  [ChainId.MOONRIVER]: Moonriver,
  [ChainId.MATIC]: Polygon,
  [ChainId.ARBITRUM]: Arbitrum,
  [ChainId.BASE]: Base,
  // [ChainId.ROPSTEN]: Ropsten,
  // [ChainId.RINKEBY]: Rinkeby,
  // [ChainId.GÖRLI]: Goerli,
  // [ChainId.KOVAN]: Kovan,
  // [ChainId.MATIC_TESTNET]: Matic,
  // [ChainId.XDAI]: xDai,
  // [ChainId.ARBITRUM]: Arbitrum,
  // [ChainId.ARBITRUM_TESTNET]: Arbitrum,
  // [ChainId.MOONBEAM_TESTNET]: Moonbeam,
  // [ChainId.AVALANCHE_TESTNET]: Avalanche,
  // [ChainId.HECO]: Heco,
  // [ChainId.HECO_TESTNET]: Heco,
  // [ChainId.HARMONY]: Harmony,
  // [ChainId.HARMONY_TESTNET]: Harmony,
  // [ChainId.OKEX]: OKEx,
  // [ChainId.OKEX_TESTNET]: OKEx,
  // [ChainId.CELO]: Celo,
}

export const NETWORK_LABEL: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.TELOS]: 'Telos',
  [ChainId.BSC]: 'Binance',
  [ChainId.FANTOM]: 'Fantom',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.MOONRIVER]: 'Moonriver',
  [ChainId.MATIC]: 'Polygon',
  [ChainId.ARBITRUM]: 'Arbitrum',
  [ChainId.BASE]: 'Base',
  // [ChainId.RINKEBY]: 'Rinkeby',
  // [ChainId.ROPSTEN]: 'Ropsten',
  // [ChainId.GÖRLI]: 'Görli',
  // [ChainId.KOVAN]: 'Kovan',
  // [ChainId.MATIC_TESTNET]: 'Matic Testnet',
  // [ChainId.XDAI]: 'xDai',
  // [ChainId.ARBITRUM]: 'Arbitrum',
  // [ChainId.ARBITRUM_TESTNET]: 'Arbitrum Testnet',
  // [ChainId.MOONBEAM_TESTNET]: 'Moonbase',
  // [ChainId.AVALANCHE_TESTNET]: 'Fuji',
  // [ChainId.HECO]: 'HECO',
  // [ChainId.HECO_TESTNET]: 'HECO Testnet',
  // [ChainId.HARMONY]: 'Harmony',
  // [ChainId.HARMONY_TESTNET]: 'Harmony Testnet',
  // [ChainId.OKEX]: 'OKEx',
  // [ChainId.OKEX_TESTNET]: 'OKEx',
  // [ChainId.CELO]: 'Celo',
}

export const NATIVE_TOKEN_TICKER: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: 'ETH',
  [ChainId.TELOS]: 'TLOS',
  [ChainId.BSC]: 'BNB',
  [ChainId.FANTOM]: 'FTM',
  [ChainId.MATIC]: 'MATIC',
  [ChainId.BASE]: 'ETH',
  [ChainId.ARBITRUM]: 'ETH',
  [ChainId.MOONRIVER]: 'MOVR',
  [ChainId.AVALANCHE]: 'AVAX',
}

export const NATIVE_WRAPPED_TOKEN_ADDRESS = {
  [ChainId.ETHEREUM]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [ChainId.BSC]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  [ChainId.TELOS]: WNATIVE_ADDRESS[40],
  [ChainId.FANTOM]: WNATIVE_ADDRESS[250],
  [ChainId.AVALANCHE]: WNATIVE_ADDRESS[43114],
  [ChainId.MOONRIVER]: WNATIVE_ADDRESS[1285],
  [ChainId.BASE]: WNATIVE_ADDRESS[ChainId.BASE],
}

//todo move this to NETWORKS_INFO
export const TRUESIGHT_NETWORK_TO_CHAINID: NetToChain = {
  eth: ChainId.ETHEREUM,
  bsc: ChainId.BSC,
  avax: ChainId.AVALANCHE,
  polygon: ChainId.MATIC,
  fantom: ChainId.FANTOM,
}

export const NETWORKS_INFO_CONFIG: { [chain in ChainId]: NetworkInfo } = {
  [ChainId.ETHEREUM]: eth,
    // todo: fix below
  [ChainId.TELOS]: eth,
  [ChainId.MATIC]: matic,
  [ChainId.BSC]: bsc,
  [ChainId.AVALANCHE]: avax,
  [ChainId.FANTOM]: ftm,
  // todo: fix below
  [ChainId.ARBITRUM]: arbitrum,
  // todo: fix below
  [ChainId.MOONRIVER]: arbitrum,
  // todo: fix below
  [ChainId.BASE]: arbitrum,
}

//this Proxy helps fallback undefined ChainId by Ethereum info
export const NETWORKS_INFO = new Proxy(NETWORKS_INFO_CONFIG, {
  get(target, p) {
    const prop = p as any as ChainId
    if (p && target[prop]) return target[prop]
    return target[ChainId.ETHEREUM]
  },
})

export const SUPPORTED_NETWORKS = Object.keys(NETWORKS_INFO).map(Number) as ChainId[]

export const chainIdMapping: Partial<Record<ChainId, string>> = {
  [ChainId.BSC]: 'bsc',
}

export const EVM_NETWORKS = SUPPORTED_NETWORKS

export type EVM_NETWORK = typeof EVM_NETWORKS[number]

export function isEVM(chainId?: ChainId): chainId is EVM_NETWORK {
  return true
}