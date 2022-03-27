import { BscConnector } from '@binance-chain/bsc-connector'
// import { ChainId } from 'sdk'
import { FortmaticConnector } from 'entities/connectors/FortmaticConnector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from 'entities/connectors/NetworkConnector'
import { PortisConnector } from '@web3-react/portis-connector'
import { TorusConnector } from '@web3-react/torus-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { Web3Provider } from '@ethersproject/providers'
import { CloverConnector } from '@clover-network/clover-connector'

enum ChainId { // TODO
  ETHEREUM = 1,
  BSC = 56,
  FANTOM = 250,
  // FANTOM_TESTNET = 4002
}

export const RPC = {
  [ChainId.ETHEREUM]: 'https://eth-mainnet.alchemyapi.io/v2/q1gSNoSMEzJms47Qn93f9-9Xg5clkmEC',
  [ChainId.BSC]: 'https://bsc-dataseed.binance.org/',
  // [ChainId.FANTOM]: 'https://rpc.ftm.tools/',
  [ChainId.FANTOM]: 'https://rpcapi.fantom.network',
  // [ChainId.FANTOM_TESTNET]: 'https://rpc.testnet.fantom.network',
  // [ChainId.ROPSTEN]: 'https://eth-ropsten.alchemyapi.io/v2/cidKix2Xr-snU3f6f6Zjq_rYdalKKHmW',
  // [ChainId.RINKEBY]: 'https://eth-rinkeby.alchemyapi.io/v2/XVLwDlhGP6ApBXFz_lfv0aZ6VmurWhYD',
  // [ChainId.GÖRLI]: 'https://eth-goerli.alchemyapi.io/v2/Dkk5d02QjttYEoGmhZnJG37rKt8Yl3Im',
  // [ChainId.KOVAN]: 'https://eth-kovan.alchemyapi.io/v2/6OVAa_B_rypWWl9HqtiYK26IRxXiYqER',
  // [ChainId.FANTOM]: 'https://rpcapi.fantom.network',
  // [ChainId.MATIC]: 'https://rpc-mainnet.maticvigil.com',
  // [ChainId.MATIC]:
  //     'https://apis.ankr.com/e22bfa5f5a124b9aa1f911b742f6adfe/c06bb163c3c2a10a4028959f4d82836d/polygon/full/main',
  // [ChainId.MATIC_TESTNET]: 'https://rpc-mumbai.matic.today',
  // [ChainId.XDAI]: 'https://rpc.xdaichain.com',
  // [ChainId.BSC_TESTNET]: 'https://data-seed-prebsc-2-s3.binance.org:8545',
  // [ChainId.MOONBEAM_TESTNET]: 'https://rpc.testnet.moonbeam.network',
  // [ChainId.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
  // [ChainId.AVALANCHE_TESTNET]: 'https://api.avax-test.network/ext/bc/C/rpc',
  // [ChainId.HECO]: 'https://http-mainnet.hecochain.com',
  // [ChainId.HECO_TESTNET]: 'https://http-testnet.hecochain.com',
  // [ChainId.HARMONY]: 'https://api.harmony.one',
  // [ChainId.HARMONY_TESTNET]: 'https://api.s0.b.hmny.io',
  // [ChainId.OKEX]: 'https://exchainrpc.okex.org',
  // [ChainId.OKEX_TESTNET]: 'https://exchaintestrpc.okex.org',
  // [ChainId.ARBITRUM]: 'https://arb1.arbitrum.io/rpc',
  // [ChainId.PALM]: 'https://palm-mainnet.infura.io/v3/da5fbfafcca14b109e2665290681e267',
}

export function getNetwork(defaultChainId, urls = RPC) {
  return new NetworkConnector({
    defaultChainId,
    urls,
  })
}

export const network = new NetworkConnector({
  defaultChainId: 250,
  urls: RPC,
})

let networkLibrary: Web3Provider | undefined

export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

const supportedChainIds = [
  // 1, // mainnet
  // 56, // binance smart chain
  250, // fantom
  // 4002, // fantom testnet
  // 3, // ropsten
  // 4, // rinkeby
  // 5, // goreli
  // 42, // kovan
  // 137, // matic
  // 80001, // matic testnet
  // 100, // xdai
  // 97, // binance smart chain testnet
  // 1287, // moonbase
  // 43114, // avalanche
  // 43113, // fuji
  // 128, // heco
  // 256, // heco testnet
  // 1666600000, // harmony
  // 1666700000, // harmony testnet
  // 66, // okex testnet
  // 65, // okex testnet
  // 42161, // arbitrum
  // 42220, // celo
  // 11297108109, // palm
  // 1285, // moonriver
]


export const injected = new InjectedConnector({
  supportedChainIds,
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: RPC,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  supportedChainIds,
  // pollingInterval: 5000,
})

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: process.env.NEXT_PUBLIC_FORTMATIC_API_KEY ?? '',
  chainId: 1,
})

// mainnet only
export const portis = new PortisConnector({
  dAppId: process.env.NEXT_PUBLIC_PORTIS_ID ?? '',
  networks: [1],
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: RPC[ChainId.FANTOM],
  appName: 'SoulSwap',
  appLogoUrl:
  'https://raw.github.com/SoulSwapFinance/icons/master/token/soul.jpg',
})

// mainnet only
export const torus = new TorusConnector({
  chainId: 1,
})

// binance only
export const binance = new BscConnector({ supportedChainIds: [56] })

export const clover = new CloverConnector({ supportedChainIds: [1, 250] })
