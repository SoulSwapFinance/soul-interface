import { AVAX_ADDRESS, BNB_ADDRESS, ChainId, DAI_ADDRESS, SEANCE_ADDRESS, SOUL_ADDRESS, SOUL_USDC, USDC_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS, WNATIVE_ADDRESS } from 'sdk'

export const AvalanchePools = [
  {
    pid: 0,
    type: 'swap',
    // summonerPid: 1,
    token0Symbol: 'WAVAX',
    token1Symbol: 'SOUL',
    lpSymbol: 'AVAX-SOUL',
    lpAddress: '0x6Da1AD717C7577AAB46C19aB6d3d9C31aff32A00',
    token0Address: WNATIVE_ADDRESS[ChainId.AVALANCHE],
    token1Address: SOUL_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 1,
    type: 'swap',
    // summonerPid: 2,
    token0Symbol: 'SOUL',
    token1Symbol: 'USDC',
    lpSymbol: 'SOUL-USDC',
    lpAddress: SOUL_USDC[ChainId.AVALANCHE],
    token0Address: SOUL_ADDRESS[ChainId.AVALANCHE],
    token1Address: USDC_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 2,
    type: 'swap',
    // summonerPid: 3,
    token0Symbol: 'WAVAX',
    token1Symbol: 'USDC',
    lpSymbol: 'AVAX-USDC',
    lpAddress: '0x864384a54ea644852603778c0C200eF2D6F2Ac2f',
    token0Address: WNATIVE_ADDRESS[ChainId.AVALANCHE],
    token1Address: USDC_ADDRESS[ChainId.AVALANCHE],
  }, 
  {
    pid: 3,
    type: 'swap',
    // summonerPid: 4,
    token0Symbol: 'WAVAX',
    token1Symbol: 'ETH',
    lpSymbol: 'AVAX-ETH',
    lpAddress: '0x5796Bf89f6C7C47811E4E59Ecd7aCACC8A5B9dEF',
    token0Address: WNATIVE_ADDRESS[ChainId.AVALANCHE],
    token1Address: WETH_ADDRESS[ChainId.AVALANCHE]
  }, 
  {
    pid: 4,
    type: 'swap',
    // summonerPid: 5,
    token0Symbol: 'WAVAX',
    token1Symbol: 'BTC',
    lpSymbol: 'AVAX-BTC',
    lpAddress: '0x8C162C3Bdd7354b5Cb1A0b18eDBB5725CFE762A3',
    token0Address: WNATIVE_ADDRESS[ChainId.AVALANCHE],
    token1Address: WBTC_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 5,
    type: 'swap',
    // summonerPid: 6,
    token0Symbol: 'USDC',
    token1Symbol: 'DAI',
    lpSymbol: 'USDC-DAI',
    lpAddress: '0xE9807645aDA66F2f3d4f2d2A79223701F3cC0903',
    token0Address:  USDC_ADDRESS[ChainId.AVALANCHE],
    token1Address: DAI_ADDRESS[ChainId.AVALANCHE],
  },
]

export const FantomPools = [
  {
    // 1000
    pid: 0,
    type: 'swap',
    // summonerPid: 1,
    token0Symbol: 'WFTM',
    token1Symbol: 'SOUL',
    lpSymbol: 'FTM-SOUL',
    lpAddress: '0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: SOUL_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 1,
    type: 'swap',
    // summonerPid: 22,
    token0Symbol: 'SOUL',
    token1Symbol: 'USDC',
    lpSymbol: 'SOUL-USDC',
    lpAddress: '0xC0A301f1E5E0Fe37a31657e8F60a41b14d01B0Ef',
    token0Address: SOUL_ADDRESS[ChainId.FANTOM],
    token1Address:  USDC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 2,
    type: 'swap',
    // summonerPid: 10,
    token0Symbol: 'WFTM',
    token1Symbol: 'SEANCE',
    lpSymbol: 'FTM-SEANCE',
    lpAddress: '0x8542bEAC34282aFe5Bb6951Eb6DCE0B3783b7faB',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: SEANCE_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 3,
    type: 'swap',
    // summonerPid: 2,
    token0Symbol: 'WFTM',
    token1Symbol: 'USDC',
    lpSymbol: 'FTM-USDC',
    lpAddress: '0x160653F02b6597E7Db00BA8cA826cf43D2f39556',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },

  {
    // 600
    pid: 4,
    type: 'swap',
    // summonerPid: 23,
    token0Symbol: 'WFTM',
    token1Symbol: 'DAI',
    lpSymbol: 'FTM-DAI',
    lpAddress: '0xF3d6E8Ecece8647B456d57375Ce0B51B8F0cD40b',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
  },
  {
      // 600
      pid: 5,
      type: 'swap',
      // summonerPid: 18,
      token0Symbol: 'WFTM',
      token1Symbol: 'BNB',
      lpSymbol: 'FTM-BNB',
      lpAddress: '0x52966a12e3211c92909C28603ca3df8465c06c82',
      token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
      token1Address: BNB_ADDRESS[ChainId.FANTOM],
    },
    {
      // 600
      pid: 6,
      type: 'swap',
      // summonerPid: 4,
      token0Symbol: 'WFTM',
      token1Symbol: 'ETH',
      lpSymbol: 'FTM-ETH',
      lpAddress: '0xC615a5fd68265D9Ec6eF60805998fa5Bb71972Cb',
      token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
      token1Address: WETH_ADDRESS[ChainId.FANTOM],
    },
    
    {
      // 600
      pid: 7,
      type: 'swap',
      // summonerPid: 13,
      token0Symbol: 'WFTM',
      token1Symbol: 'BTC',
      lpSymbol: 'FTM-BTC',
      lpAddress: '0xecB41D6B5885E75a149EDA173e92267aa271D895',
      token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
      token1Address: WBTC_ADDRESS[ChainId.FANTOM]
    },

    /* {
    // 600
    pid: 8,
    type: 'swap',
    token0Symbol: 'WETH',
    token1: 'BTC',
    lpSymbol: 'ETH-BTC',
    lpAddress: '0x1fc954d3484bc21e0ce53a6648a35bbfc03dc9d0',
    token0Address: WETH_ADDRESS[ChainId.FANTOM],
    token1Address: WBTC_ADDRESS[ChainId.FANTOM]
  }, */
 
  {
    // 600
    pid: 9,
    type: 'swap',
    // summonerPid: 21,
    token0Symbol: 'USDC',
    token1Symbol: 'DAI',
    lpSymbol: 'USDC-DAI',
    lpAddress: '0x406de3a93f6b4179e3b21a3d81226b43e1918fd9',
    token0Address:  USDC_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
  },
  { // LENDING
    pid: 10,
    type: 'lend',
    decimals: 18,
    token0Symbol: 'FTM', // EXEMPT //
    token1Symbol: 'DAI',
    lpSymbol: 'DAI-FTM', // EXEMPT //
    lpAddress: '0xF4Bfdd73FE65D1B46b9968A24443A77ab89908dd',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
  },
  { // LENDING
    pid: 11,
    type: 'lend',
    decimals: 18,
    token0Symbol: 'DAI',
    token1Symbol: 'FTM', // EXEMPT //
    lpSymbol: 'FTM-DAI',
    lpAddress: '0xFD9BE6a83c7e9cFF48f6D9a3036bb6b20598ED61',
    token0Address: DAI_ADDRESS[ChainId.FANTOM],
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM], // EXEMPT //
  },
  { // LENDING
    pid: 12,
    type: 'lend',
    decimals: 18,
    token0Symbol: 'ETH',
    token1Symbol: 'DAI',
    lpSymbol: 'DAI-ETH',
    lpAddress: '0x9fA5de19495331E13b443F787B90CdD22B32263d',
    token0Address: WETH_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
  },
  { // LENDING
    pid: 13,
    type: 'lend',
    decimals: 18,
    token0Symbol: 'BNB',
    token1Symbol: 'DAI',
    lpSymbol: 'DAI-BNB',
    lpAddress: '0xbDa9204e6D596feCf9bd48108723F9BDAa2019f6',
    token0Address: BNB_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
  },
]

// export const FantomLendingPools = [
  
// ]