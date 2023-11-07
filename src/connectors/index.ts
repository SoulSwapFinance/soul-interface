import { ChainId } from 'sdk'
import { FortmaticConnector } from 'entities/connectors/FortmaticConnector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from 'entities/connectors/NetworkConnector'
import { PortisConnector } from '@web3-react/portis-connector'
import { TorusConnector } from '@web3-react/torus-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { Web3Provider } from '@ethersproject/providers'
import { CloverConnector } from '@clover-network/clover-connector'

export const RPC = {
  [ChainId.ETHEREUM]: 'https://eth-mainnet.alchemyapi.io/v2/q1gSNoSMEzJms47Qn93f9-9Xg5clkmEC',
  [ChainId.TELOS]: 'https://rpc1.us.telos.net/evm',
  [ChainId.BSC]: 'https://bsc-dataseed.binance.org/',
  [ChainId.FANTOM]: 'https://rpc.ftm.tools',
  // [ChainId.FANTOM]: 'https://rpcapi.fantom.network',
  // [ChainId.FANTOM]: 'https://rpc.ankr.com/fantom',
  [ChainId.MATIC]: 'https://rpc.ankr.com/polygon', // 'https://rpc-mainnet.maticvigil.com',
  // [ChainId.MATIC]: 'https://apis.ankr.com/e22bfa5f5a124b9aa1f911b742f6adfe/c06bb163c3c2a10a4028959f4d82836d/polygon/full/main',
  // [ChainId.MATIC_TESTNET]: 'https://rpc-mumbai.matic.today',
  // [ChainId.BSC_TESTNET]: 'https://data-seed-prebsc-2-s3.binance.org:8545',
  // [ChainId.MOONBEAM_TESTNET]: 'https://rpc.testnet.moonbeam.network',
  // [ChainId.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
  [ChainId.AVALANCHE]: 'https://rpc.ankr.com/avalanche',
  //[ChainId.MOONRIVER]: 'https://rpc.moonriver.moonbeam.network',
  [ChainId.MOONRIVER]: 'https://rpc.ankr.com/moonbeam', 
  // [ChainId.AVALANCHE_TESTNET]: 'https://api.avax-test.network/ext/bc/C/rpc',
  [ChainId.ARBITRUM]: 'https://rpc.ankr.com/arbitrum', // 'https://arb1.arbitrum.io/rpc',
}

export function getNetwork(defaultChainId, urls = RPC) {
  return new NetworkConnector({
    defaultChainId,
    urls,
  })
}

export const network = new NetworkConnector({
  defaultChainId: 1,
  urls: RPC,
})

let networkLibrary: Web3Provider | undefined

export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

const supportedChainIds = [
  1, // mainnet
  56, // binance smart chain
  250, // fantom
  // 4002, // fantom testnet
  137, // matic
  43114, // avalanche
  // 43113, // fuji
  42161, // arbitrum
  1285, // moonriver
]

export const injected = new InjectedConnector({
  supportedChainIds,
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: RPC[ChainId.FANTOM],
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

export const clover = new CloverConnector({ supportedChainIds: [1, 250] })
