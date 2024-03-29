import { ChainId, SOUL_ADDRESS, SOUL_NATIVE, SOUL_USDC, USDC_ADDRESS, WNATIVE_ADDRESS, USDC_NATIVE, MUSDC_NATIVE, BTC_NATIVE, ETH_NATIVE, DAI_USDC, WBTC_ADDRESS, FMULTI_ADDRESS, WETH_ADDRESS, DAI_ADDRESS, BNB_NATIVE, BNB_ADDRESS, LINK_ADDRESS, MULTI_WETH_ADDRESS, MULTI_USDC_ADDRESS, MULTI_AVAX_ADDRESS, MULTI_WBTC_ADDRESS, DAI_NATIVE, ETH_USDC, BTC_USDC, AXL_WBTC_ADDRESS, LZ_WBTC_ADDRESS, LZ_WETH_ADDRESS, AXL_WETH_ADDRESS, FMULTI_NATIVE } from '../sdk'
import { LZ_USDC_ADDRESS } from './addresses'

export type TokenInfo = {
  id: string
  name: string
  symbol: string
  decimals?: number
}

type PairInfo = {
  id: number
  address: string
  token0: TokenInfo
  token1?: TokenInfo
  name?: string
  symbol?: string
  type?: string
}

type AddressMap = {
  [chainId: number]: {
    [address: string]: PairInfo
  }
}

export const POOLS: AddressMap = {
  [ChainId.AVALANCHE]: {
    '0x11d6DD25c1695764e64F439E32cc7746f3945543': {
      id: 0,
      address: SOUL_ADDRESS[ChainId.AVALANCHE].toLowerCase(),
      token0: {
        id: SOUL_ADDRESS[ChainId.AVALANCHE], // SOUL
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
    },
    '0x6Da1AD717C7577AAB46C19aB6d3d9C31aff32A00': {
      id: 1,
      address: SOUL_NATIVE[ChainId.AVALANCHE].toLowerCase(),
      token0: {
        id: WNATIVE_ADDRESS[ChainId.AVALANCHE],
        name: 'Wrapped Avalanche',
        symbol: 'WAVAX',
        decimals: 18,
      },
      token1: {
        id: SOUL_ADDRESS[ChainId.AVALANCHE], // SOUL
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
    },
    '0x922fcADa825Dc669798206A35D2D2B455f9A64E7': {
      id: 2,
      address: SOUL_USDC[ChainId.AVALANCHE].toLowerCase(),
      token0: {
        id: SOUL_ADDRESS[ChainId.AVALANCHE],
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18
      },
      token1: {
        id: USDC_ADDRESS[ChainId.AVALANCHE],
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
    },
    '0x864384a54ea644852603778c0C200eF2D6F2Ac2f': {
      id: 3,
      address: USDC_NATIVE[ChainId.AVALANCHE].toLowerCase(),
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
    '0x8C162C3Bdd7354b5Cb1A0b18eDBB5725CFE762A3': {
      id: 4,
      address: BTC_NATIVE[ChainId.AVALANCHE].toLowerCase(),
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
    '0x5796Bf89f6C7C47811E4E59Ecd7aCACC8A5B9dEF': {
      id: 5,
      address: ETH_NATIVE[ChainId.AVALANCHE].toLowerCase(),
      token0: {
        id: WNATIVE_ADDRESS[ChainId.AVALANCHE],
        name: 'Wrapped Avalanche',
        symbol: 'WAVAX',
        decimals: 18,
      },
      token1: {
        id: WETH_ADDRESS[ChainId.AVALANCHE],
        name: 'Wrapped Ethereum',
        symbol: 'WETH',
        decimals: 18,
      },
    },

    '0xB3074D8b7f22439F337E2E2830864be9c8236866': {
      id: 6,
      address: BNB_NATIVE[ChainId.AVALANCHE].toLowerCase(),
      token0: {
        id: WNATIVE_ADDRESS[ChainId.AVALANCHE],
        name: 'Wrapped Avalanche',
        symbol: 'WAVAX',
        decimals: 18,
      },
      token1: {
        id: BNB_ADDRESS[ChainId.AVALANCHE],
        name: 'Binance',
        symbol: 'BNB',
        decimals: 18,
      },
    },
    '0xE9807645aDA66F2f3d4f2d2A79223701F3cC0903': {
      id: 7,
      address: DAI_USDC[ChainId.AVALANCHE].toLowerCase(),
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
    '0xEF1D48b24E87F8ccfF97f7C295B31B92E30F372B': {
      id: 12,
      address: DAI_NATIVE[ChainId.AVALANCHE].toLowerCase(),
      token0: {
        id: WNATIVE_ADDRESS[ChainId.AVALANCHE],
        name: 'Wrapped Avalanche',
        symbol: 'WAVAX',
        decimals: 18,
      },
      token1: {
        id: DAI_ADDRESS[ChainId.AVALANCHE],
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
    },  
    '0x351C6327F9639664C7962B94570D1A19F47b3f44': {
      id: 13,
      address: ETH_USDC[ChainId.AVALANCHE].toLowerCase(),
      token0: {
        id: WETH_ADDRESS[ChainId.AVALANCHE],
        name: 'Wrapped Ethereum',
        symbol: 'WETH',
        decimals: 18,
      },
      token1: {
        id: USDC_ADDRESS[ChainId.AVALANCHE],
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
    },  
    '0xd413F437F998dE70413d9D9840825156bb32941c': {
      id: 14,
      address: BTC_USDC[ChainId.AVALANCHE].toLowerCase(),
      token0: {
        id: WBTC_ADDRESS[ChainId.AVALANCHE],
        name: 'Wrapped Bitcoin',
        symbol: 'WBTC',
        decimals: 8,
      },
      token1: {
        id: USDC_ADDRESS[ChainId.AVALANCHE],
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
    },
  },
  [ChainId.FANTOM]: {
    '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07': {
      id: 0,
      address: SOUL_ADDRESS[ChainId.FANTOM].toLowerCase(),
      token0: {
        id: SOUL_ADDRESS[ChainId.FANTOM], // SOUL
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
    },
    '0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57': { // SOUL-FTM
      id: 1,
      address: SOUL_NATIVE[ChainId.FANTOM].toLowerCase(),
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      token1: {
        id: SOUL_ADDRESS[ChainId.FANTOM], // SOUL
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
    },
    // '0xC0A301f1E5E0Fe37a31657e8F60a41b14d01B0Ef': {  // SOUL-USDC
    //   id: 2,
    //   address: '0xc0a301f1e5e0fe37a31657e8f60a41b14d01b0ef',
    //   token0: {
    //     id: SOUL_ADDRESS[ChainId.FANTOM], // SOUL
    //     name: 'Soul Power',
    //     symbol: 'SOUL',
    //     decimals: 18,
    //   },
    //   token1: {
    //     id: MULTI_USDC_ADDRESS[ChainId.FANTOM], // mUSDC
    //     name: 'USDC (Multichain)',
    //     symbol: 'mUSDC',
    //     decimals: 6,
    //   },
    // },
    // '0x160653F02b6597E7Db00BA8cA826cf43D2f39556': { // FTM-USDC 
    //   id: 3,
    //   address: '0x160653f02b6597e7db00ba8ca826cf43d2f39556',
    //   token0: {
    //     id: MULTI_USDC_ADDRESS[ChainId.FANTOM], // USDC
    //     name: 'USDC (Multichain)',
    //     symbol: 'mUSDC',
    //     decimals: 6,
    //   },
    //   token1: {
    //     id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
    //     name: 'Wrapped Fantom',
    //     symbol: 'FTM',
    //     decimals: 18,
    //   },
    // },
    // '0xecB41D6B5885E75a149EDA173e92267aa271D895': {  // FTM-BTC
    //   id: 4,
    //   address: '0xecb41d6b5885e75a149eda173e92267aa271d895',
    //   token0: {
    //     id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
    //     name: 'Wrapped Fantom',
    //     symbol: 'FTM',
    //     decimals: 18,
    //   },
    //   token1: {
    //     id: '0x321162Cd933E2Be498Cd2267a90534A804051b11', // WBTC
    //     name: 'Wrapped Bitcoin (Multi)',
    //     symbol: 'mBTC',
    //     decimals: 8,
    //   },
    // },
    // '0xC615a5fd68265D9Ec6eF60805998fa5Bb71972Cb': { // FTM-mETH
    //   id: 5,
    //   address: '0xc615a5fd68265d9ec6ef60805998fa5bb71972cb', // FTM-mETH
    //   token0: {
    //     id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
    //     name: 'Wrapped Fantom',
    //     symbol: 'FTM',
    //     decimals: 18,
    //   },
    //   token1: {
    //     id: MULTI_WETH_ADDRESS[ChainId.FANTOM], // WETH
    //     name: 'Wrapped Ethereum',
    //     symbol: 'WETH',
    //     decimals: 18,
    //   },
    // },
    // '0x52966a12e3211c92909C28603ca3df8465c06c82': {  // BNB-FTM
    //   id: 6,
    //   address: '0x52966a12e3211c92909c28603ca3df8465c06c82',
    //   token0: {
    //     id: '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454', // BNB
    //     name: 'Binance',
    //     symbol: 'BNB',
    //     decimals: 18,
    //   },
    //   token1: {
    //     id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
    //     name: 'Wrapped Fantom',
    //     symbol: 'FTM',
    //     decimals: 18,
    //   },
    // },
    // '0x5159Ba92FDC80b3a4B19De279711b1822de06c86': {  // AVAX-FTM
    //   id: 7,
    //   address: '0x5159Ba92FDC80b3a4B19De279711b1822de06c86',
    //   token0: {
    //     id: MULTI_AVAX_ADDRESS[ChainId.FANTOM], // AVAX
    //     name: 'Avalanche',
    //     symbol: 'AVAX',
    //     decimals: 18,
    //   },
    //   token1: {
    //     id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
    //     name: 'Wrapped Fantom',
    //     symbol: 'FTM',
    //     decimals: 18,
    //   },
    // },
    //   '0xF3d6E8Ecece8647B456d57375Ce0B51B8F0cD40b': {  // FTM-DAI
    //   id: 8, // 600
    //   address: '0xf3d6e8ecece8647b456d57375ce0b51b8f0cd40b',
    //   token0: {
    //     id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
    //     name: 'Wrapped Fantom',
    //     symbol: 'FTM',
    //     decimals: 18,
    //   },
    //   token1: {
    //     id: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // DAI
    //     name: 'Dai Stablecoin',
    //     symbol: 'DAI',
    //     decimals: 18,
    //   },
    // },
    // '0x1FC954d3484bC21E0Ce53A6648a35BBfc03DC9D0': {  // BTC-ETH
    //   id: 9,
    //   address: '0x1fc954d3484bc21e0ce53a6648a35bbfc03dc9d0',
    //   token0: { // WBTC
    //     id: MULTI_WBTC_ADDRESS[ChainId.FANTOM], // WBTC
    //     name: 'Wrapped Bitcoin',
    //     symbol: 'WBTC',
    //     decimals: 8,
    //   },
    //   token1: { // WETH
    //     id: MULTI_WETH_ADDRESS[ChainId.FANTOM], // WETH
    //     name: 'Wrapped Ethereum',
    //     symbol: 'WETH',
    //     decimals: 18,
    //   },
    // },    
    // '0x857107e8F42023F7623C7ca413811DB1853F7f4b': {  // GRIMEVO-FTM
    //   id: 10,
    //   address: '0x857107e8f42023f7623c7ca413811db1853f7f4b',
    //   token0: { // GRIMEVO
    //     id: '0x0a77866C01429941BFC7854c0c0675dB1015218b', // GRIMEVO
    //     name: 'Grim EVO',
    //     symbol: 'GRIMEVO',
    //     decimals: 18,
    //   },
    //   token1: { // WFTM
    //     id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
    //     name: 'Wrapped Fantom',
    //     symbol: 'FTM',
    //     decimals: 18,
    //   },
    // },
    // '0x5b181BBc3Cc18C66B6f36f584866a1ff09865630': {  // ETH-USDC
    //   id: 11 ,
    //   address: '0x5b181bbc3cc18c66b6f36f584866a1ff09865630',
    //   token0: {
    //     id: MULTI_USDC_ADDRESS[ChainId.FANTOM], // USDC
    //     name: 'USDC Coin',
    //     symbol: 'USDC',
    //     decimals: 6,
    //   },
    //   token1: { // WETH
    //     id: MULTI_WETH_ADDRESS[ChainId.FANTOM], // WETH
    //     name: 'Wrapped Ethereum',
    //     symbol: 'WETH',
    //     decimals: 18,
    //   },
    // },
    // '0xE2d39F7f0c8517Ca2058Fa97eB3D8d4928F7C6D6': {  // BTC-USDC
    //   id: 12,
    //   address: '0xE2d39F7f0c8517Ca2058Fa97eB3D8d4928F7C6D6',
    //   token0: { // WBTC
    //     id: '0x321162Cd933E2Be498Cd2267a90534A804051b11', // WBTC
    //     name: 'Wrapped Bitcoin',
    //     symbol: 'WBTC',
    //     decimals: 8,
    //   },
    //   token1: { // USDC
    //     id: MULTI_USDC_ADDRESS[ChainId.FANTOM], // USDC
    //     name: 'USDC Coin',
    //     symbol: 'USDC',
    //     decimals: 6,
    //   },
    // },
    // '0xF4Bfdd73FE65D1B46b9968A24443A77ab89908dd': {  // DAI-FTM [LEND]
    //   id: 13,
    //   address: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    //   type: 'underworld',
    //   token0: {
    //     id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
    //     name: 'Wrapped Fantom',
    //     symbol: 'FTM',
    //     decimals: 18,
    //   },
    //   // token1: {
    //   //   id: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // DAI
    //   //   name: 'Dai Stablecoin',
    //   //   symbol: 'DAI',
    //   //   decimals: 18,
    //   // },
    // },
    // '0xFD9BE6a83c7e9cFF48f6D9a3036bb6b20598ED61': {  // FTM-DAI [LEND]
    //   id: 14,
    //   address: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
    //   type: 'underworld',
    //   token0: {
    //     id: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // DAI
    //     name: 'Dai Stablecoin',
    //     symbol: 'DAI',
    //     decimals: 18,
    //   },
    //   // token1: {
    //   //   id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
    //   //   name: 'Wrapped Fantom',
    //   //   symbol: 'FTM',
    //   //   decimals: 18,
    //   // },
    // },
    // '0xbDa9204e6D596feCf9bd48108723F9BDAa2019f6': {  // DAI-BNB [LEND]
    //   id: 15,
    //   address: '0xd67de0e0a0fd7b15dc8348bb9be742f3c5850454',
    //   type: 'underworld',
    //   token0: {
    //     id: '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454', // BNB
    //     name: 'Binance',
    //     symbol: 'BNB',
    //     decimals: 18,
    //   },
    //   // token1: {
    //   //   id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // DAI
    //   //   name: 'Wrapped Fantom',
    //   //   symbol: 'FTM',
    //   //   decimals: 18,
    //   // },
    // },
    // '0xa670C1E02c7AE8B3D575293bfA1F7eBa90F81C99': {  // FTM-WLUM
    //   id: 16,
    //   address: '0xa670c1e02c7ae8b3d575293bfa1f7eba90f81c99',
    //   token0: {
    //     id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
    //     name: 'Wrapped Fantom',
    //     symbol: 'FTM',
    //     decimals: 18,
    //   },
    //   token1: {
    //     id: '0xa69557e01B0a6b86E5b29BE66d730c0Bfff68208', // WLUM
    //     name: 'Wrapped Lumens',
    //     symbol: 'wLUM',
    //     decimals: 9,
    //   },
    // },
    // '0x9fA5de19495331E13b443F787B90CdD22B32263d': {  // DAI-ETH [LEND]
    //   id: 17, 
    //   address: '0x74b23882a30290451a17c44f4f05243b6b58c76d',
    //   type: 'underworld',
    //   token0: {
    //     id: MULTI_WETH_ADDRESS[ChainId.FANTOM], // WETH
    //     name: 'Wrapped ETH',
    //     symbol: 'WETH',
    //     decimals: 18,
    //   },
    //   // token1: {
    //   //   id: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // DAI
    //   //   name: 'Dai Stablecoin',
    //   //   symbol: 'DAI',
    //   //   decimals: 18,
    //   // },
    // },
    // '0xaf28730165634A56434ca7f0B302CC54F862046F': {  // BTC-DAI
    //   id: 18, 
    //   address: '0x321162Cd933E2Be498Cd2267a90534A804051b11',
    //   type: 'underworld',
    //   token0: { // WBTC
    //     id: '0x321162Cd933E2Be498Cd2267a90534A804051b11', // WBTC
    //     name: 'Wrapped Bitcoin',
    //     symbol: 'WBTC',
    //     decimals: 8,
    //   },
    //   // token1: {
    //   //   id: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // DAI
    //   //   name: 'Dai Stablecoin',
    //   //   symbol: 'DAI',
    //   //   decimals: 18,
    //   // },
    // },
    // '0x29a72C8d81815787B886E9fc9d763406C796DD73': {  // USDC-FTM
    //   id: 19, 
    //   address: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
    //   type: 'underworld',
    //   token0: {
    //     id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
    //     name: 'Wrapped Fantom',
    //     symbol: 'FTM',
    //     decimals: 18,
    //   },
    //   // token1: {
    //   //   id: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // USDC
    //   //   name: 'USD Coin',
    //   //   symbol: 'USDC',
    //   //   decimals: 6,
    //   // },
    // },
    // '0xc5Ae8847C868898f68EF0227B6c4865dFcCe0D65': {  // FTM-USDC
    //   id: 20, 
    //   address: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // USDC
    //   type: 'underworld',
    //   token0: {
    //     id: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // USDC
    //     name: 'USD Coin',
    //     symbol: 'USDC',
    //     decimals: 6,
    //   },
    //   // token1: {
    //   //   id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
    //   //   name: 'Wrapped Fantom',
    //   //   symbol: 'FTM',
    //   //   decimals: 18,
    //   // },
    // },
    // '0x0a55Eb040C5183c5784A03F34bCEb3963f52b5a0': {  // USDC-ETH √
    //   id: 21, 
    //   address: MULTI_WETH_ADDRESS[ChainId.FANTOM], // ETH
    //   type: 'underworld',
    //   token0: {
    //     id: MULTI_WETH_ADDRESS[ChainId.FANTOM], // ETH
    //     name: 'Wrapped Ethereum',
    //     symbol: 'ETH',
    //     decimals: 18,
    //   },
    //   // token1: {
    //   //   id: MULTI_USDC_ADDRESS[ChainId.FANTOM], // USDC
    //   //   name: 'USD Coin',
    //   //   symbol: 'USDC',
    //   //   decimals: 6,
    //   // },
    // },
    // '0x91787338E8fF91D0B36E54Fa5A50046d6C797D5B': {  // USDC-BTC √
    //   id: 22, 
    //   address: WBTC_ADDRESS[ChainId.FANTOM], // BTC
    //   type: 'underworld',
    //   token0: {
    //     id: WBTC_ADDRESS[ChainId.FANTOM], // BTC
    //     name: 'Wrapped Bitcoin',
    //     symbol: 'WBTC',
    //     decimals: 8,
    //   },
    //   // token1: {
    //   //   id: MULTI_USDC_ADDRESS[ChainId.FANTOM], // USDC
    //   //   name: 'USD Coin',
    //   //   symbol: 'USDC',
    //   //   decimals: 6,
    //   // },
    // },
    // '0x9e17f37d807B211306C7354605FAAa308c3683EB': {  // USDC-BNB √
    //   id: 23, 
    //   address: BNB_ADDRESS[ChainId.FANTOM], // BNB
    //   type: 'underworld',
    //   token0: {
    //     id: BNB_ADDRESS[ChainId.FANTOM], // BNB
    //     name: 'Binance',
    //     symbol: 'BNB',
    //     decimals: 18,
    //   },
    //   // token1: {
    //   //   id: MULTI_USDC_ADDRESS[ChainId.FANTOM], // USDC
    //   //   name: 'USD Coin',
    //   //   symbol: 'USDC',
    //   //   decimals: 6,
    //   // },
    // },
    // '0x5C900Ac3c95D13adE54D28A9800636AE21Cb5F39': {  // USDC-LINK √
    //   id: 24, 
    //   address: LINK_ADDRESS[ChainId.FANTOM], // LINK
    //   type: 'underworld',
    //   token0: {
    //     id: LINK_ADDRESS[ChainId.FANTOM], // LINK
    //     name: 'USD Coin',
    //     symbol: 'USDC',
    //     decimals: 18,
    //   },
    //   // token1: {
    //   //   id: MULTI_USDC_ADDRESS[ChainId.FANTOM], // USDC
    //   //   name: 'USD Coin',
    //   //   symbol: 'USDC',
    //   //   decimals: 6,
    //   // },
    // },
    '0x5cED9D6B44a1F7C927AF31A8Af26dEF60C776712': { // SOUL-USDC √
      id: 26,
      address: SOUL_USDC[ChainId.FANTOM].toLowerCase(),
      token0: {
        id: USDC_ADDRESS[ChainId.FANTOM],
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      token1: {
        id: SOUL_ADDRESS[ChainId.FANTOM], // SOUL
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
    },
    '0xd1A432df5ee2Df3F891F835854ffeA072C273C65': { // axlUSDC-NATIVE √
      id: 27,
      address: USDC_NATIVE[ChainId.FANTOM].toLowerCase(),
      token0: {
        id: USDC_ADDRESS[ChainId.FANTOM],
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      token1: {
        id: WNATIVE_ADDRESS[ChainId.FANTOM], // WFTM
        name: 'Wrapped Fantom',
        symbol: 'WFTM',
        decimals: 18,
      },
    },
    '0x9827713159B666855BdfB53CE0F16aA7b0E30847': { // axlWETH-NATIVE √
      id: 28,
      address: ETH_NATIVE[ChainId.FANTOM].toLowerCase(),
      token0: {
        id: WETH_ADDRESS[ChainId.FANTOM],
        name: 'Wrapped Ether',
        symbol: 'WETH',
        decimals: 18,
      },
      token1: {
        id: WNATIVE_ADDRESS[ChainId.FANTOM], // WFTM
        name: 'Wrapped Fantom',
        symbol: 'WFTM',
        decimals: 18,
      },
    },
    '0x44DF3a3b162826D7354b4e2495AEF097B6862069': { // axlBTC-NATIVE √
      id: 29,
      address: BTC_NATIVE[ChainId.FANTOM].toLowerCase(),
      token0: {
        id: WBTC_ADDRESS[ChainId.FANTOM], // WBTC
        name: 'Wrapped Bitcoin',
        symbol: 'WBTC',
        decimals: 8,
      },
      token1: {
        id: WNATIVE_ADDRESS[ChainId.FANTOM], // WFTM
        name: 'Wrapped Fantom',
        symbol: 'WFTM',
        decimals: 18,
      },
    },
    // '0xe5fCD208C453b72F476967C174d4530E21aAE14C': { // FMULTI-NATIVE √
    //   id: 31, // note: 30 is errored
    //   address: FMULTI_NATIVE[ChainId.FANTOM].toLowerCase(),
    //   token0: {
    //     id: FMULTI_ADDRESS[ChainId.FANTOM], // FMULTI
    //     name: 'Fuck Multi',
    //     symbol: 'FMULTI',
    //     decimals: 18,
    //   },
    //   token1: {
    //     id: WNATIVE_ADDRESS[ChainId.FANTOM], // WFTM
    //     name: 'Wrapped Fantom',
    //     symbol: 'WFTM',
    //     decimals: 18,
    //   },
    // },
    '0xBBdA07f2121274ecb1a08077F37A60F7E0D36629': { // USDC-USDC √
      id: 32,
      address: '0xbbda07f2121274ecb1a08077f37a60f7e0d36629',
      token0: {
        id: LZ_USDC_ADDRESS[ChainId.FANTOM], // LZUSDC
        name: 'USD Coin (LayerZero)',
        symbol: 'lzUSDC',
        decimals: 6,
      },
      token1: {
        id: USDC_ADDRESS[ChainId.FANTOM], // AXLUSDC
        name: 'USD Coin (Axelar)',
        symbol: 'axlUSDC',
        decimals: 6,
      },
    },
    '0xf4AadfC5bDccE978f0aD40FFcf908e0B653D2742': { // BTC-BTC √
      id: 33,
      address: '0xf4aadfc5bdcce978f0ad40ffcf908e0b653d2742',
      token0: {
        id: LZ_WBTC_ADDRESS[ChainId.FANTOM], // lzBTC
        name: 'Bitcoin (LayerZero)',
        symbol: 'lzBTC',
        decimals: 8,
      },
      token1: {
        id: AXL_WBTC_ADDRESS[ChainId.FANTOM], // axlBTC
        name: 'Bitcoin (Axelar)',
        symbol: 'axlBTC',
        decimals: 8,
      },
    },
    '0x80ccC7651dcce2DaE0717Ff2A0B1c40C8D03AEBA': { // ETH-ETH √
      id: 34,
      address: '0x80ccc7651dcce2dae0717ff2a0b1c40c8d03aeba',
      token0: {
        id: LZ_WETH_ADDRESS[ChainId.FANTOM], // lzETH
        name: 'Ethereum (LayerZero)',
        symbol: 'lzETH',
        decimals: 18,
      },
      token1: {
        id: AXL_WETH_ADDRESS[ChainId.FANTOM], // axlETH
        name: 'Ethereum (Axelar)',
        symbol: 'axlETH',
        decimals: 18,
      },
    },
    
  }, 
}