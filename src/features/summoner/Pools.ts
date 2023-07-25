import { ChainId, SOUL_ADDRESS, USDC_ADDRESS, WNATIVE_ADDRESS, SOUL_NATIVE, DAI_ADDRESS, BNB_ADDRESS, SOR_ADDRESS, WETH_ADDRESS, WBTC_ADDRESS, FUSD_ADDRESS, USDT_ADDRESS, SOUL_USDC, SOUL_MUSDC, USDC_NATIVE, MUSDC_NATIVE, BTC_NATIVE, ETH_NATIVE, DAI_USDC, AVAX_ADDRESS, BNB_NATIVE, DAI_NATIVE, MULTI_BTC_ETH, AVAX_NATIVE, ETH_USDC, BTC_USDC, BTC_MUSDC, LINK_ADDRESS, LINK_NATIVE, FMULTI_ADDRESS,
MULTI_USDC_ADDRESS, 
MULTI_WETH_ADDRESS,
MULTI_WBTC_ADDRESS,
MBTC_NATIVE,
METH_NATIVE} from 'sdk'

/*/ rules /*/
// `token0Symbol` && `token1Symbol`: always use "w" prefix
// `lpSymbol`: never use "w" prefix
// `lpSymbol`: always frontload native

export const InactiveAvalanchePools = []

export const AvalanchePools = [
  {
    pid: 1,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WAVAX',
    token1Symbol: 'SOUL',
    lpSymbol: 'AVAX-SOUL',
    lpAddress: SOUL_NATIVE[ChainId.AVALANCHE],
    token0Address: WNATIVE_ADDRESS[ChainId.AVALANCHE],
    token1Address: SOUL_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 2,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'SOUL',
    token1Symbol: 'USDC',
    lpSymbol: 'SOUL-USDC',
    lpAddress: SOUL_USDC[ChainId.AVALANCHE],
    token0Address: SOUL_ADDRESS[ChainId.AVALANCHE],
    token1Address: USDC_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 3,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WAVAX',
    token1Symbol: 'USDC',
    lpSymbol: 'AVAX-USDC',
    lpAddress: USDC_NATIVE[ChainId.AVALANCHE],
    token0Address: WNATIVE_ADDRESS[ChainId.AVALANCHE],
    token1Address: USDC_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 4,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WAVAX',
    token1Symbol: 'BTC',
    lpSymbol: 'AVAX-BTC',
    lpAddress: BTC_NATIVE[ChainId.AVALANCHE],
    token0Address: WNATIVE_ADDRESS[ChainId.AVALANCHE],
    token1Address: WBTC_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 5,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WAVAX',
    token1Symbol: 'ETH',
    lpSymbol: 'AVAX-ETH',
    lpAddress: ETH_NATIVE[ChainId.AVALANCHE],
    token0Address: WNATIVE_ADDRESS[ChainId.AVALANCHE],
    token1Address: WETH_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 6,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WAVAX',
    token1Symbol: 'BNB',
    lpSymbol: 'AVAX-BNB',
    lpAddress: BNB_NATIVE[ChainId.AVALANCHE],
    token0Address: WNATIVE_ADDRESS[ChainId.AVALANCHE],
    token1Address: BNB_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 7,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'DAI',
    token1Symbol: 'USDC',
    lpSymbol: 'DAI-USDC',
    lpAddress: DAI_USDC[ChainId.AVALANCHE],
    token0Address: DAI_ADDRESS[ChainId.AVALANCHE],
    token1Address: USDC_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 12,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WAVAX',
    token1Symbol: 'DAI',
    lpSymbol: 'AVAX-DAI',
    lpAddress: DAI_NATIVE[ChainId.AVALANCHE],
    token0Address: WNATIVE_ADDRESS[ChainId.AVALANCHE],
    token1Address: DAI_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 13,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'ETH',
    token1Symbol: 'USDC',
    lpSymbol: 'ETH-USDC',
    lpAddress: ETH_USDC[ChainId.AVALANCHE],
    token0Address: WETH_ADDRESS[ChainId.AVALANCHE],
    token1Address: USDC_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 14,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'BTC',
    token1Symbol: 'USDC',
    lpSymbol: 'BTC-USDC',
    lpAddress: BTC_USDC[ChainId.AVALANCHE],
    token0Address: WBTC_ADDRESS[ChainId.AVALANCHE],
    token1Address: USDC_ADDRESS[ChainId.AVALANCHE],
  },
]

export const InactiveFantomPools = [
  { // 0
    pid: 2,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'SOUL',
    token1Symbol: 'USDC',
    lpSymbol: 'SOUL-USDC',
    lpAddress: SOUL_MUSDC[ChainId.FANTOM],
    token0Address: SOUL_ADDRESS[ChainId.FANTOM],
    token1Address: MULTI_USDC_ADDRESS[ChainId.FANTOM],
  },
  { // 0
    pid: 3,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WFTM',
    token1Symbol: 'USDC',
    lpSymbol: 'FTM-USDC',
    lpAddress: MUSDC_NATIVE[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: MULTI_USDC_ADDRESS[ChainId.FANTOM],
  },
  { // 0
    pid: 9,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WETH',
    token1Symbol: 'BTC',
    lpSymbol: 'ETH-BTC',
    lpAddress: MULTI_BTC_ETH[ChainId.FANTOM],
    token0Address: MULTI_WETH_ADDRESS[ChainId.FANTOM],
    token1Address: MULTI_WBTC_ADDRESS[ChainId.FANTOM],
  },
  { // 0
    pid: 7,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WFTM',
    token1Symbol: 'AVAX',
    lpSymbol: 'FTM-AVAX',
    lpAddress: AVAX_NATIVE[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: AVAX_ADDRESS[ChainId.FANTOM],
  },
  { // 0
    pid: 4,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WFTM',
    token1Symbol: 'BTC',
    lpSymbol: 'FTM-BTC',
    lpAddress: MBTC_NATIVE[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: MULTI_WBTC_ADDRESS[ChainId.FANTOM],
  },
  { // 0
    pid: 5,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WFTM',
    token1Symbol: 'ETH',
    lpSymbol: 'FTM-ETH',
    lpAddress: METH_NATIVE[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: MULTI_WETH_ADDRESS[ChainId.FANTOM],
  },
]

export const FantomPools = [
  { // 1,400
    pid: 1,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WFTM',
    token1Symbol: 'SOUL',
    lpSymbol: 'FTM-SOUL',
    lpAddress: SOUL_NATIVE[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: SOUL_ADDRESS[ChainId.FANTOM],
  },
   { // 800
      pid: 26,
      type: 'swap',
      decimals: 18,
      token0Symbol: 'SOUL',
      token1Symbol: 'USDC',
      lpSymbol: 'SOUL-USDC',
      lpAddress: SOUL_USDC[ChainId.FANTOM],
      token0Address: SOUL_ADDRESS[ChainId.FANTOM],
      token1Address: USDC_ADDRESS[ChainId.FANTOM],
   }, 
  { // 400
    pid: 27,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WFTM',
    token1Symbol: 'USDC',
    lpSymbol: 'FTM-USDC',
    lpAddress: USDC_NATIVE[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  { // 200
    pid: 28,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WFTM',
    token1Symbol: 'ETH',
    lpSymbol: 'FTM-ETH',
    lpAddress: ETH_NATIVE[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: WETH_ADDRESS[ChainId.FANTOM],
  },
 { // 200
    pid: 29,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WFTM',
    token1Symbol: 'BTC',
    lpSymbol: 'FTM-BTC',
    lpAddress: BTC_NATIVE[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: WBTC_ADDRESS[ChainId.FANTOM],
  },
  { // 20
    pid: 30,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WFTM',
    token1Symbol: 'FMULTI',
    lpSymbol: 'FTM-FMULTI',
    lpAddress: "0xe5fCD208C453b72F476967C174d4530E21aAE14C",
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: FMULTI_ADDRESS[ChainId.FANTOM],
  },
]