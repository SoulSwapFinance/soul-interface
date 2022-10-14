import { ChainId } from 'sdk'

export const DEX_TO_COMPARE: { [chainId in ChainId]?: string } = {
  [ChainId.BSC]: 'pancake',
  [ChainId.MATIC]: 'quickswap',
  [ChainId.AVALANCHE]: 'traderjoe',
  [ChainId.ETHEREUM]: 'uniswapv3',
  [ChainId.FANTOM]: 'spookyswap',
  [ChainId.ARBITRUM]: 'sushiswap',
}

export const kyberswapDexes = [
  {
    name: 'KyberSwap Elastic',
    id: 'kyberswapv2',
    logoURL: 'https://kyberswap.com/favicon.ico',
  },
  {
    name: 'KyberSwap Classic',
    id: 'kyberswapv1',
    logoURL: 'https://kyberswap.com/favicon.ico',
  },
]