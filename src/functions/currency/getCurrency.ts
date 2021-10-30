import { ChainId } from '../../sdk'
import { ethers } from 'ethers'

type Currency = { address: string; decimals: number }

// Pricing currency
// TODO: Check decimals and finish table
export const USD_CURRENCY: { [chainId in ChainId]?: Currency } = {
  [ChainId.MAINNET]: { // USDT
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
  },
  [ChainId.FANTOM]: { // FUSDT
    address: '0x049d68029688eAbF473097a2fC38ef61633A3C7A',
    decimals: 18,
  }
}

export function getCurrency(chainId: ChainId | void): Currency {
  return (
    USD_CURRENCY[chainId || 1] || {
      address: ethers.constants.AddressZero,
      decimals: 18,
    }
  )
}
