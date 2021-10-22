import { Web3Provider } from '@ethersproject/providers'
import { BscConnector } from '@binance-chain/bsc-connector'
// import { ChainId } from '../sdk'
// import { FortmaticConnector } from './Fortmatic'
import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from './NetworkConnector'
import { PortisConnector } from '@web3-react/portis-connector'
import { TorusConnector } from '@web3-react/torus-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

enum ChainId { // TODO
  MAINNET = 1,
  BSC = 56,
  FANTOM = 250,
  // FANTOM_TESTNET = 4002
}

export const RPC = {
  [ChainId.MAINNET]: 'https://eth-mainnet.alchemyapi.io/v2/q1gSNoSMEzJms47Qn93f9-9Xg5clkmEC',
  // [ChainId.MAINNET]: 'https://eth-mainnet.alchemyapi.io/v2/nj9dkG3QULVVIs_hIMq26wL0ZwV4dJ3x',
  [ChainId.BSC]: 'https://bsc-dataseed.binance.org/',
  [ChainId.FANTOM]: 'https://rpc.ftm.tools',
  // [ChainId.FANTOM_TESTNET]: 'https://rpc.testnet.fantom.network',
  // [ChainId.ROPSTEN]: 'https://eth-ropsten.alchemyapi.io/v2/cidKix2Xr-snU3f6f6Zjq_rYdalKKHmW',
  // [ChainId.RINKEBY]: 'https://eth-rinkeby.alchemyapi.io/v2/XVLwDlhGP6ApBXFz_lfv0aZ6VmurWhYD',
  // [ChainId.GÖRLI]: 'https://eth-goerli.alchemyapi.io/v2/Dkk5d02QjttYEoGmhZnJG37rKt8Yl3Im',
  // [ChainId.KOVAN]: 'https://eth-kovan.alchemyapi.io/v2/6OVAa_B_rypWWl9HqtiYK26IRxXiYqER',
  // [ChainId.MATIC]: 'https://rpc-mainnet.maticvigil.com',
  // [ChainId.MATIC_TESTNET]: 'https://rpc-mumbai.matic.today',
  // [ChainId.XDAI]: 'https://rpc.xdaichain.com',
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
}

export const network = new NetworkConnector({
  defaultChainId: 250,
  urls: RPC,
})

let networkLibrary: Web3Provider | undefined

export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [
    // 1, // mainnet
    // 56, // bsc
    250, // fantom
    // 4002, // fantom testnet
    // 3, // ropsten
    // 4, // rinkeby
    // 5, // goreli
    // 42, // kovan
    // 137, // matic
    // 80001, // matic testnet
    // 100, // xdai
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
  ],
})

export const bridgeInjected = new InjectedConnector({
  supportedChainIds: [
    1, // mainnet
    // 3, // ropsten
    // 4, // rinkeby
    // 5, // goreli
    // 42, // kovan
    250, // fantom
    // 4002, // fantom testnet
    // 137, // matic
    // 80001, // matic testnet
    // 100, // xdai
    56, // binance smart chain
    // 97, // binance smart chain testnet
    // 1287, // moonbase
    // 1285, // moonriver
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
  ],
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { [ChainId.FANTOM]: RPC[ChainId.FANTOM] },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000,
})

// // mainnet only
// export const fortmatic = new FortmaticConnector(
//   {
//   apiKey: process.env.NEXT_PUBLIC_FORTMATIC_API_KEY ?? '',
//   chainId: 1, 
//   }
// )

// mainnet only
export const portis = new PortisConnector({
  dAppId: process.env.NEXT_PUBLIC_PORTIS_ID ?? '',
  networks: [1],
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: RPC[ChainId.MAINNET],
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
