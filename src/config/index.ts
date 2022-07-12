import { ChainId } from 'sdk'

const config = {
  // Global configuration
  defaultChainId: ChainId.FANTOM,
  blockedAddresses: [
    // SDN OFAC addresses
    '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
    '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
    '0x901bb9583b24D97e995513C6778dc6888AB6870e',
    '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  ],
  // Network specific configuration
  [ChainId.ETHEREUM]: {
    name: 'Ethereum Mainnet',
    nativeTicker: 'ETH',
    nodeRpc: 'https://eth-mainnet.alchemyapi.io/v2/q1gSNoSMEzJms47Qn93f9-9Xg5clkmEC',
    networkLogo: 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/0x74b23882a30290451A17c44f4F05243b6b58C76d/logo.png',
    isOpenBridge: true,
    bridgeApi: 'https://bridgeapi.anyswap.exchange',
    averageBlockTimeInSeconds: 13,
    underworld: { blacklistedTokens: [], blacklistedOracles: ['0x8f2CC3376078568a04eBC600ae5F0a036DBfd812'] },
  },
  [ChainId.TELOS]: {
    averageBlockTimeInSeconds: 0.5,
    nodeRpc: 'https://rpc1.us.telos.net/evm',
    isOpenBridge: false,
    underworld: { blacklistedTokens: [], blacklistedOracles: [] },
  },
  [ChainId.FANTOM]: {
    name: 'Fantom Opera',
    nativeTicker: 'FTM',
    networkLogo: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=003',
    nodeRpc: 'https://rpcapi.fantom.network',
    isOpenBridge: true,
    bridgeApi: 'https://bridgeapi.anyswap.exchange',
    averageBlockTimeInSeconds: 1,
    underworld: { blacklistedTokens: [], blacklistedOracles: [] },
  },
  [ChainId.AVALANCHE]: {
    name: 'Avalanche',
    nativeTicker: 'AVAX',
    networkLogo: 'https://github.com/sushiswap/list/blob/master/logos/token-logos/network/telos/0x7C598c96D02398d89FbCb9d41Eab3DF0C16F227D.jpg',
    nodeRpc: 'https://api.avax.network/ext/bc/C/rpc',
    isOpenBridge: false,
    averageBlockTimeInSeconds: 2,
    underworld: { blacklistedTokens: [], blacklistedOracles: [] },
  },
  // [ChainId.MATIC]: {
  //   averageBlockTimeInSeconds: 13,
  //   underworld: { blacklistedTokens: ['0xC6d54D2f624bc83815b49d9c2203b1330B841cA0'], blacklistedOracles: [] },
  // },
}

export default config
