import { ChainId } from '../sdk'

const rpc = {
  [ChainId.ETHEREUM]: 'https://eth-mainnet.alchemyapi.io/v2/q1gSNoSMEzJms47Qn93f9-9Xg5clkmEC',
  [ChainId.TELOS]: 'https://rpc1.us.telos.net/evm',
  [ChainId.BSC]: 'https://bsc-dataseed.binance.org/',
  [ChainId.FANTOM]: 'https://rpcapi.fantom.network',
  [ChainId.FANTOM_TESTNET]: 'https://rpc.testnet.fantom.network',
  [ChainId.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
  [ChainId.MOONRIVER]: 'https://moonriver.public.blastapi.io',
}

export default rpc
