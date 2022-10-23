import { ChainId, WETH9, Currency, NATIVE } from 'sdk'

import { useActiveWeb3React } from 'services/web3'

export function useNativeCurrency(chainId?: ChainId): Currency {
  const { chainId: activeChainId } = useActiveWeb3React()
  const selectedChainId = chainId ?? activeChainId
  // fallback to ether if chain id is not defined
  if (!selectedChainId) return WETH9[chainId || 250]
  return NATIVE[selectedChainId || 250] ||WETH9[selectedChainId || 250]
}