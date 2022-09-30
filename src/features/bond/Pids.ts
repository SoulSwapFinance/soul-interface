import { AVAX_ADDRESS, BNB_ADDRESS, ChainId, DAI_ADDRESS, SEANCE_ADDRESS, SOUL_ADDRESS, USDC_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS, WNATIVE_ADDRESS } from 'sdk'

export const AvalanchePools = [
  {
    pid: 0,
    // summonerPid: 1,
    token0Symbol: 'SOUL',
    token1Symbol: 'AVAX',
    // lpSymbol: 'SOUL-AVAX',
    lpAddress: '0x6Da1AD717C7577AAB46C19aB6d3d9C31aff32A00',
    token0Address: SOUL_ADDRESS[ChainId.AVALANCHE],
    token1Address: AVAX_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 1,
    // summonerPid: 2,
    token0Symbol: 'SOUL',
    token1Symbol: 'USDC',
    // lpSymbol: 'SOUL-USDC',
    lpAddress: '0x922fcADa825Dc669798206A35D2D2B455f9A64E7',
    token0Address: SOUL_ADDRESS[ChainId.AVALANCHE],
    token1Address: USDC_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 2,
    // summonerPid: 3,
    token0Symbol: 'AVAX',
    token1Symbol: 'USDC',
    // lpSymbol: 'AVAX-USDC',
    lpAddress: '0x864384a54ea644852603778c0C200eF2D6F2Ac2f',
    token0Address: AVAX_ADDRESS[ChainId.AVALANCHE],
    token1Address: USDC_ADDRESS[ChainId.AVALANCHE],
  }, 
  {
    pid: 3,
    // summonerPid: 4,
    token0Symbol: 'AVAX',
    token1Symbol: 'ETH',
    lpSymbol: 'AVAX-ETH',
    lpAddress: '0x5796Bf89f6C7C47811E4E59Ecd7aCACC8A5B9dEF',
    token0Address: AVAX_ADDRESS[ChainId.AVALANCHE],
    token1Address: WETH_ADDRESS[ChainId.AVALANCHE]
  }, 
  {
    pid: 4,
    // summonerPid: 5,
    token0Symbol: 'AVAX',
    token1Symbol: 'BTC',
    lpSymbol: 'AVAX-BTC',
    lpAddress: '0x8C162C3Bdd7354b5Cb1A0b18eDBB5725CFE762A3',
    token0Address: AVAX_ADDRESS[ChainId.AVALANCHE],
    token1Address: WBTC_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 5,
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
    // summonerPid: 1,
    token0Symbol: 'SOUL',
    token1Symbol: 'FTM',
    lpSymbol: 'SOUL-FTM',
    lpAddress: '0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57',
    token0Address: SOUL_ADDRESS[ChainId.FANTOM],
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 1,
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
    // summonerPid: 10,
    token0Symbol: 'SEANCE',
    token1Symbol: 'FTM',
    lpSymbol: 'SEANCE-FTM',
    lpAddress: '0x8542bEAC34282aFe5Bb6951Eb6DCE0B3783b7faB',
    token0Address: SEANCE_ADDRESS[ChainId.FANTOM],
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 3,
    // summonerPid: 2,
    token0Symbol: 'FTM',
    token1Symbol: 'USDC',
    lpSymbol: 'FTM-USDC',
    lpAddress: '0x160653F02b6597E7Db00BA8cA826cf43D2f39556',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },

  {
    // 600
    pid: 4,
    // summonerPid: 23,
    token0Symbol: 'FTM',
    token1Symbol: 'DAI',
    lpSymbol: 'FTM-DAI',
    lpAddress: '0xF3d6E8Ecece8647B456d57375Ce0B51B8F0cD40b',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
  },
  {
      // 600
      pid: 5,
      // summonerPid: 18,
      token0Symbol: 'FTM',
      token1Symbol: 'BNB',
      lpSymbol: 'FTM-BNB',
      lpAddress: '0x52966a12e3211c92909C28603ca3df8465c06c82',
      token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
      token1Address: BNB_ADDRESS[ChainId.FANTOM],
    },
    {
      // 600
      pid: 6,
      // summonerPid: 4,
      token0Symbol: 'FTM',
      token1Symbol: 'WETH',
      lpSymbol: 'FTM-ETH',
      lpAddress: '0xC615a5fd68265D9Ec6eF60805998fa5Bb71972Cb',
      token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
      token1Address: WETH_ADDRESS[ChainId.FANTOM],
    },
    
    {
      // 600
      pid: 7,
      // summonerPid: 13,
      token0Symbol: 'FTM',
      token1Symbol: 'BTC',
      lpSymbol: 'FTM-BTC',
      lpAddress: '0xecB41D6B5885E75a149EDA173e92267aa271D895',
      token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
      token1Address: WBTC_ADDRESS[ChainId.FANTOM]
    },

    /* {
    // 600
    pid: 8,
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
    // summonerPid: 21,
    token0Symbol: 'USDC',
    token1Symbol: 'DAI',
    lpSymbol: 'USDC-DAI',
    lpAddress: '0x406de3a93f6b4179e3b21a3d81226b43e1918fd9',
    token0Address:  USDC_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
  },
]
