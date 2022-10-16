import { ChainId, Currency, NATIVE, Token, WNATIVE } from 'sdk'

export function currencyId(currency?: Currency, chainId?: ChainId): string {
  if (currency?.isNative && !!chainId) return NATIVE[chainId].symbol as string
  if (currency instanceof Token) return currency.address
  return ''
}

export function currencyIdFromAddress(address: string, chainId?: ChainId): string {
  if (
    (chainId === ChainId.ETHEREUM) &&
    WNATIVE[chainId].address.toLowerCase() === address.toLowerCase()
  ) {
    return 'ETH'
  }

  if (
    (chainId === ChainId.MATIC) &&
    WNATIVE[chainId].address.toLowerCase() === address.toLowerCase()
  ) {
    return 'MATIC'
  }

  if (
    (chainId === ChainId.BSC) &&
    WNATIVE[chainId].address.toLowerCase() === address.toLowerCase()
  ) {
    return 'BNB'
  }

  if (
    (chainId === ChainId.AVALANCHE) &&
    WNATIVE[chainId].address.toLowerCase() === address.toLowerCase()
  ) {
    return 'AVAX'
  }

  if (chainId === ChainId.FANTOM && WNATIVE[chainId].address.toLowerCase() === address.toLowerCase()) {
    return 'FTM'
  }

  return address
}
