import { ETHER_ADDRESS } from "constants/index"
import { ChainId, Currency, NativeCurrency, Token, WETH } from "sdk"
import { WrappedTokenInfo } from "state/lists/wrappedTokenInfo"

export const isTokenNative = (
    currency: Currency | WrappedTokenInfo | undefined,
    chainId: ChainId | undefined,
  ): currency is NativeCurrency => {
    if (currency?.isNative || currency.wrapped.address === ETHER_ADDRESS)
      return true
    // case multichain token
    return chainId
      ? WETH[chainId]?.address === currency?.wrapped.address &&
          currency instanceof WrappedTokenInfo &&
          currency.multichainInfo?.tokenType === 'NATIVE'
      : false
  }


export const getFormattedAddress = (chainId: ChainId, address?: string, fallback?: string): string => {
    try {
      if (!address) return fallback || ''
      return new Token(chainId, address, 0).address || ''
    } catch (e) {
      return fallback || address || ''
    }
  }


export const getTokenAddress = (currency: Currency) =>
currency.isNative ? (ETHER_ADDRESS) : currency?.wrapped.address ?? ''

export const getTokenSymbolWithHardcode = (
chainId: ChainId | undefined,
address: string | undefined,
defaultSymbol: string | undefined,
) => {
const formatAddress = address?.toLowerCase()
if (
  // (chainId === ChainId.OPTIMISM && formatAddress === '0x4518231a8fdf6ac553b9bbd51bbb86825b583263'.toLowerCase()) ||
  (chainId === ChainId.ARBITRUM && formatAddress === '0x316772cFEc9A3E976FDE42C3Ba21F5A13aAaFf12'.toLowerCase())
) {
  return 'mKNC'
}
if (chainId === ChainId.ARBITRUM && formatAddress === '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8') return 'USDC.e'
return defaultSymbol ?? ''
}

export const getProxyTokenLogo = (logoUrl: string | undefined) =>
logoUrl ? `https://proxy.kyberswap.com/token-logo?url=${logoUrl}` : ''