import { ChainId, SOUL_ADDRESS } from '../sdk'

export type TokenInfo = {
  id: string
  name: string
  symbol: string
  decimals?: number
}

type PairInfo = {
  id: number
  lpToken: string
  token0: TokenInfo
  token1?: TokenInfo
  name?: string
  symbol?: string
}

type AddressMap = {
  [chainId: number]: {
    [id: string]: PairInfo
  }
}

export const VAULTS: AddressMap = {
  [ChainId.FANTOM]: {
    '0': {
      id: 0,
      lpToken: SOUL_ADDRESS[ChainId.FANTOM], // SOUL
      token0: {
        id: SOUL_ADDRESS[ChainId.FANTOM], // SOUL
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
    }
  },
}
