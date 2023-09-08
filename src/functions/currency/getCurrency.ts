import { ChainId } from '../../sdk'
import { AddressZero } from '@ethersproject/constants'

type Currency = { address: string; decimals: number }

// Pricing currency
// TODO: Check decimals and finish table
export const USD_CURRENCY: { [chainId in ChainId]?: Currency } = {
  [ChainId.ETHEREUM]: { // USDT
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
  },
  [ChainId.FANTOM]: { // FUSDT
    address: '0x049d68029688eAbF473097a2fC38ef61633A3C7A',
    decimals: 6,
  }
}

export function getCurrency(chainId: ChainId): Currency {
  return (
    USD_CURRENCY[chainId ?? ChainId.FANTOM] || {
      address: AddressZero,
      decimals: 18,
    }
  )
}