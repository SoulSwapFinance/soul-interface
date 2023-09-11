// CONVENTION isFoo -> boolean

import { TokenAddressMap } from 'state/lists/reducer'
import { ChainId, Token } from '../sdk'

import { BigNumber } from '@ethersproject/bignumber'
// import { TokenAddressMap } from '../state/lists/hooks'
// import { getAddress } from '@ethersproject/address'

/**
 * Returns true if the string value is zero in hex
 * @param hexNumberString
 */
export function isZero(hexNumberString: string): boolean {
  return /^0x0*$/.test(hexNumberString)
}

export const isEmptyValue = (text: string) =>
  BigNumber.isBigNumber(text)
    ? BigNumber.from(text).isZero()
    : text === '' || text.replace(/0/g, '').replace(/\./, '') === ''

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(chainId: ChainId, value: any): string | false {
  try {
    // return getAddress(value)
    return new Token(chainId, value, 0).address
  } catch {
    return false
  }
}

// // returns the checksummed address if the address is valid, otherwise returns false
// export function isAddress_CrossChain(chainId: ChainId, value: any): string | false {
//   try {
//     return new Token(chainId, value, 0).address
//   } catch {
//     return false
//   }
// }

export function isAddressString_CrossChain(chainId: ChainId, value: any): string {
  try {
    return new Token(chainId, value, 0).address
  } catch {
    return ''
  }
}

export function isTokenOnList(tokenAddressMap: TokenAddressMap, token?: Token): boolean {
  return Boolean(token?.isToken && tokenAddressMap[token.chainId]?.[token.address])
}
