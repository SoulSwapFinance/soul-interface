import { BNB_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS } from 'constants/addresses'
import { ChainId, DAI_ADDRESS, SEANCE_ADDRESS, SOUL_ADDRESS, SOUL_NATIVE_ADDRESS, USDC_NATIVE_ADDRESS, USDC_ADDRESS, WNATIVE_ADDRESS } from '../sdk'

export type TokenInfo = {
  id: string
  name: string
  symbol: string
  decimals?: number
}

type PairInfo = {
  id: number
  token0: TokenInfo
  token1?: TokenInfo
  name?: string
  symbol?: string
}

type AddressMap = {
  [chainId: number]: {
    [address: string]: PairInfo
  }
}

export const BONDS: AddressMap = {

// AVALANCHE BONDS //
  [ChainId.AVALANCHE]: {
    SOUL_NATIVE_ADDRESS[ChainId.AVALANCHE]: { // SOUL-AVAX
      id: 0, // 250
      token0: {
        id: WNATIVE_ADDRESS[ChainId.AVALANCHE],
        name: 'Wrapped Avalanche',
        symbol: 'WFTM',
        decimals: 18,
      },
      token1: {
        id: SOUL_ADDRESS[ChainId.AVALANCHE],
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
    },
    '0x922fcADa825Dc669798206A35D2D2B455f9A64E7': { // SOUL-USDC
      id: 1, // 150
      token0: {
        id: SOUL_ADDRESS[ChainId.AVALANCHE],
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
      token1: {
        id: USDC_ADDRESS[ChainId.AVALANCHE],
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
    },
  },
 
// FANTOM BONDS //
  [ChainId.FANTOM]: {
SOUL_NATIVE_ADDRESS[ChainId.FANTOM]: { // SOUL-FTM
      id: 0, // 2400
      token0: {
        id: WNATIVE_ADDRESS[ChainId.FANTOM],
        name: 'Wrapped Fantom',
        symbol: 'WFTM',
        decimals: 18,
      },
      token1: {
        id: SOUL_ADDRESS[ChainId.FANTOM],
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
    },
    '0xC0A301f1E5E0Fe37a31657e8F60a41b14d01B0Ef': {  // SOUL-USDC
      id: 1, //
      token0: {
        id: SOUL_ADDRESS[ChainId.FANTOM],
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
      token1: {
        id: USDC_ADDRESS[ChainId.FANTOM],
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
    },
    '0x8542bEAC34282aFe5Bb6951Eb6DCE0B3783b7faB': {  // SEANCE-FTM
      id: 2, // 1200
      token0: {
        id: SEANCE_ADDRESS[ChainId.FANTOM],
        name: 'Seance Circle',
        symbol: 'SEANCE',
        decimals: 18,
      },
      token1: {
        id: WNATIVE_ADDRESS[ChainId.FANTOM],
        name: 'Wrapped Fantom',
        symbol: 'WFTM',
        decimals: 18,
      },
    },
    USDC_NATIVE_ADDRESS[ChainId.FANTOM]: { // FTM-USDC 
      id: 3,
      token0: {
        id: USDC_ADDRESS[ChainId.FANTOM],
        name: 'USDC Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      token1: {
        id: WNATIVE_ADDRESS[ChainId.FANTOM],
        name: 'Wrapped Fantom',
        symbol: 'WFTM',
        decimals: 18,
      },
    },
    '0xF3d6E8Ecece8647B456d57375Ce0B51B8F0cD40b': {  // FTM-DAI
      id: 4, // 600
      token0: {
        id: WNATIVE_ADDRESS[ChainId.FANTOM],
        name: 'Wrapped Fantom',
        symbol: 'WFTM',
        decimals: 18,
      },
      token1: {
        id: DAI_ADDRESS[ChainId.FANTOM],
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
    },
    '0x52966a12e3211c92909C28603ca3df8465c06c82': {  // BNB-FTM
      id: 5, // 600
      token0: {
        id: BNB_ADDRESS[ChainId.FANTOM],
        name: 'Binance',
        symbol: 'BNB',
        decimals: 18,
      },
      token1: {
        id: WNATIVE_ADDRESS[ChainId.FANTOM],
        name: 'Wrapped Fantom',
        symbol: 'WFTM',
        decimals: 18,
      },
    },
    '0xC615a5fd68265D9Ec6eF60805998fa5Bb71972Cb': { // FTM-ETH
      id: 6,
      token0: {
        id: WNATIVE_ADDRESS[ChainId.FANTOM],
        name: 'Wrapped Fantom',
        symbol: 'WFTM',
        decimals: 18,
      },
      token1: {
        id: WETH_ADDRESS[ChainId.FANTOM],
        name: 'Wrapped ETH',
        symbol: 'WETH',
        decimals: 18,
      },  
    },
    '0xecB41D6B5885E75a149EDA173e92267aa271D895': {  // FTM-BTC
      id: 7,
      token0: {
        id: WNATIVE_ADDRESS[ChainId.FANTOM],
        name: 'Wrapped Fantom',
        symbol: 'WFTM',
        decimals: 18,
      },
      token1: {
        id: WBTC_ADDRESS[ChainId.FANTOM],
        name: 'Wrapped Bitcoin',
        symbol: 'WBTC',
        decimals: 8,
      },
    },
    '0x406dE3A93f6B4179E3B21a3d81226B43e1918fd9': {  // DAI-USDC
      id: 8, // 200
      token0: {
        id: DAI_ADDRESS[ChainId.FANTOM],
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
      token1: {
        id: USDC_ADDRESS[ChainId.FANTOM],
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
    },
  }
}
