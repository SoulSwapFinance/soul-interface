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