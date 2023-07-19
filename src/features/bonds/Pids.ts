import { FTM_USDC_PAIR } from 'constants/index'
import { AVAX_ADDRESS, BNB_ADDRESS, ChainId, DAI_ADDRESS, DAI_BNB_MARKET, DAI_ETH_MARKET, DAI_NATIVE_MARKET, MULTI_USDC_ADDRESS, NATIVE_DAI_MARKET, SEANCE_ADDRESS, SOUL_ADDRESS, SOUL_USDC, SOUL_MUSDC, USDC_ADDRESS, USDC_DAI_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS, WNATIVE_ADDRESS, FRAX_ADDRESS } from 'sdk'

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
    lpAddress: SOUL_USDC[ChainId.FANTOM],
    token0Address: SOUL_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 2,
    type: 'swap',
    token0Symbol: 'WFTM',
    token1Symbol: 'USDC',
    lpSymbol: 'FTM-USDC',
    lpAddress: FTM_USDC_PAIR[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  // {
  //   // 600
  //   pid: 3,
  //   type: 'swap',
  //   token0Symbol: 'WFTM',
  //   token1Symbol: 'FRAX',
  //   lpSymbol: 'FTM-FRAX',
  //   lpAddress: FTM_FRAX_PAIR[ChainId.FANTOM],
  //   token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
  //   token1Address: FRAX_ADDRESS[ChainId.FANTOM],
  // },
]