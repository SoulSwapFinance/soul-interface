import { ChainId, DAI_ADDRESS, SOUL_ADDRESS, SOUL_USDC, USDC_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS, WNATIVE_ADDRESS, BTC_NATIVE, ETH_NATIVE, USDC_NATIVE, SOUL_NATIVE, BTC_USDC, USDC_USDC, LZ_USDC_ADDRESS } from 'sdk'

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
    // 400
    pid: 0,
    type: 'swap',
    token0Symbol: 'WFTM',
    token1Symbol: 'SOUL',
    lpSymbol: 'FTM-SOUL',
    lpAddress: SOUL_NATIVE[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: SOUL_ADDRESS[ChainId.FANTOM],
  },
  {
    // 200
    pid: 1,
    type: 'swap',
    token0Symbol: 'SOUL',
    token1Symbol: 'USDC',
    lpSymbol: 'SOUL-USDC',
    lpAddress: SOUL_USDC[ChainId.FANTOM],
    token0Address: SOUL_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 200
    pid: 2,
    type: 'swap',
    token0Symbol: 'WFTM',
    token1Symbol: 'USDC',
    lpSymbol: 'FTM-USDC',
    lpAddress: USDC_NATIVE[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 200
    pid: 3,
    type: 'swap',
    token0Symbol: 'WFTM',
    token1Symbol: 'BTC',
    lpSymbol: 'FTM-BTC',
    lpAddress: BTC_NATIVE[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: WBTC_ADDRESS[ChainId.FANTOM]
  },
  {
    // 200
    pid: 4,
    type: 'swap',
    token0Symbol: 'BTC',
    token1Symbol: 'USDC',
    lpSymbol: 'BTC-USDC',
    lpAddress: BTC_USDC[ChainId.FANTOM],
    token0Address: WBTC_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM]
  },
  {
    // 200
    pid: 5,
    type: 'swap',
    token0Symbol: 'WFTM',
    token1Symbol: 'ETH',
    lpSymbol: 'FTM-ETH',
    lpAddress: ETH_NATIVE[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: WETH_ADDRESS[ChainId.FANTOM],
  },
  {
    // 200
    pid: 6,
    type: 'swap',
    token0Symbol: 'ETH',
    token1Symbol: 'USDC',
    lpSymbol: 'ETH-USDC',
    lpAddress: ETH_NATIVE[ChainId.FANTOM],
    token0Address: WETH_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 200
    pid: 7,
    type: 'swap',
    token0Symbol: 'USDC',
    token1Symbol: 'USDC',
    lpSymbol: 'USDC-USDC',
    lpAddress: USDC_USDC[ChainId.FANTOM],
    token0Address: USDC_ADDRESS[ChainId.FANTOM],
    token1Address: LZ_USDC_ADDRESS[ChainId.FANTOM],
  },
    
]