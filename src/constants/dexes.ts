import { ChainId } from 'sdk'

export const DEX_TO_COMPARE: { [chainId in ChainId]?: string } = {
  [ChainId.BSC]: 'pancake',
  [ChainId.MATIC]: 'quickswap',
  [ChainId.AVALANCHE]: 'traderjoe',
  [ChainId.ETHEREUM]: 'uniswapv3',
  [ChainId.FANTOM]: 'spookyswap',
  [ChainId.ARBITRUM]: 'sushiswap',
}

export const soulswapDexes = [
  {
    name: 'SoulSwap',
    id: 'soulswap',
    logoURL: 'https://soulswap.finance/favicon.ico',
  },
]

export const ELASTIC_NOT_SUPPORTED: { [key: string]: string } = {
  // [ChainId.AURORA]: t`Elastic is not supported on Aurora. Please switch to other chains`,
  // [ChainId.VELAS]: t`Elastic will be available soon`,
}