import { BNB_ADDRESS, SOUL_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS, WNATIVE_ADDRESS } from 'constants/addresses'
import { ChainId, DAI_ADDRESS, SEANCE_ADDRESS, USDC_ADDRESS, MULTI_USDC_ADDRESS, MULTI_DAI_ADDRESS } from '../sdk'

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
  '0x6Da1AD717C7577AAB46C19aB6d3d9C31aff32A00': { // SOUL-AVAX
      id: 0, // 250
      token0: {
        id: WNATIVE_ADDRESS[ChainId.AVALANCHE],
        name: 'Wrapped Avalanche',
        symbol: 'WAVAX',
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
    '0x864384a54ea644852603778c0C200eF2D6F2Ac2f': { // USDC-AVAX
      id: 2, // 150
      token0: {
        id: WNATIVE_ADDRESS[ChainId.AVALANCHE],
        name: 'Wrapped Avalanche',
        symbol: 'WAVAX',
        decimals: 18,
      },
      token1: {
        id: USDC_ADDRESS[ChainId.AVALANCHE],
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
    },
    '0x8C162C3Bdd7354b5Cb1A0b18eDBB5725CFE762A3': { // BTC-AVAX √
      id: 3, // 150
      token0: {
        id: WNATIVE_ADDRESS[ChainId.AVALANCHE],
        name: 'Wrapped Avalanche',
        symbol: 'WAVAX',
        decimals: 18,
      },
      token1: {
        id: WBTC_ADDRESS[ChainId.AVALANCHE],
        name: 'Wrapped Bitcoin',
        symbol: 'WBTC',
        decimals: 8,
      },
    },
    '0x5796Bf89f6C7C47811E4E59Ecd7aCACC8A5B9dEF': { // ETH-AVAX √
      id: 4, // 150
      token0: {
        id: WNATIVE_ADDRESS[ChainId.AVALANCHE],
        name: 'Wrapped Avalanche',
        symbol: 'WAVAX',
        decimals: 18,
      },
      token1: {
        id: WETH_ADDRESS[ChainId.AVALANCHE],
        name: 'Wrapped ETH',
        symbol: 'WETH',
        decimals: 18,
      }, 
    },
    '0xE9807645aDA66F2f3d4f2d2A79223701F3cC0903': { // USDC-DAI √
      id: 5, // 150
      token0: {
        id: DAI_ADDRESS[ChainId.AVALANCHE],
        name: 'Dai Stablecoin',
        symbol: 'DAI',
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
  '0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57': { // SOUL-FTM
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
        id: MULTI_USDC_ADDRESS[ChainId.FANTOM],
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
    '0x160653F02b6597E7Db00BA8cA826cf43D2f39556': { // FTM-USDC 
      id: 3,
      token0: {
        id: MULTI_USDC_ADDRESS[ChainId.FANTOM],
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
        id: MULTI_DAI_ADDRESS[ChainId.FANTOM],
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
        id: MULTI_DAI_ADDRESS[ChainId.FANTOM],
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
      token1: {
        id: MULTI_USDC_ADDRESS[ChainId.FANTOM],
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
    },
  }
}
