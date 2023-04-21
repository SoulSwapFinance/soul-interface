import { ChainId, SOUL_ADDRESS, USDC_ADDRESS, LUX_ADDRESS, WLUM_ADDRESS, WNATIVE_ADDRESS, SOUL_NATIVE, DAI_ADDRESS, BNB_ADDRESS, SOR_ADDRESS, WETH_ADDRESS, WBTC_ADDRESS, CRV_ADDRESS, GRIMEVO_ADDRESS, FUSD_ADDRESS, USDT_ADDRESS, SOUL_USDC, USDC_NATIVE, BTC_NATIVE, ETH_NATIVE, DAI_USDC, AVAX_ADDRESS, BNB_NATIVE, DAI_NATIVE, BTC_ETH, AVAX_NATIVE, ETH_USDC, BTC_USDC, LINK_ADDRESS, LINK_NATIVE } from 'sdk'

/*/ rules /*/
// `token0Symbol` && `token1Symbol`: always use "w" prefix
// `lpSymbol`: never use "w" prefix
// `lpSymbol`: always frontload native

// take note of exemptions (usually in lending) //

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
    {
    // LENDING
    pid: 8,
    type: 'lend',
    decimals: 18,
    token0Symbol: 'AVAX', // EXEMPT //
    token1Symbol: 'USDC',
    lpSymbol: 'USDC-AVAX', // EXEMPT //
    lpAddress: '0xa34fe600E6349d67fcd6989A9c4007b5ee5A494B',
    token0Address: WNATIVE_ADDRESS[ChainId.AVALANCHE],
    token1Address: USDC_ADDRESS[ChainId.AVALANCHE],
  },
  {
    // LENDING
    pid: 9,
    type: 'lend',
    decimals: 6,
    token0Symbol: 'USDC', // EXEMPT //
    token1Symbol: 'AVAX',
    lpSymbol: 'AVAX-USDC', // EXEMPT //
    lpAddress: '0x7ef603f01Ffa9D21c9ee8159AF4adFbE78DC925B',
    token0Address: USDC_ADDRESS[ChainId.AVALANCHE],
    token1Address: WNATIVE_ADDRESS[ChainId.AVALANCHE],
  },
  {
    // LENDING
    pid: 10,
    type: 'lend',
    decimals: 18,
    token0Symbol: 'ETH', // EXEMPT //
    token1Symbol: 'USDC',
    lpSymbol: 'USDC-ETH', // EXEMPT //
    lpAddress: '0xD981D3e065bA8E89Ac56DB994D86F22dA409cf20',
    token0Address: WETH_ADDRESS[ChainId.AVALANCHE],
    token1Address: USDC_ADDRESS[ChainId.AVALANCHE],
  },
  {
    // LENDING
    pid: 11,
    type: 'lend',
    decimals: 8,
    token0Symbol: 'BTC', // EXEMPT //
    token1Symbol: 'USDC',
    lpSymbol: 'USDC-BTC', // EXEMPT //
    lpAddress: '0x142c9eE960bB6AD872f22712C4b129783999c35E',
    token0Address: WBTC_ADDRESS[ChainId.AVALANCHE],
    token1Address: USDC_ADDRESS[ChainId.AVALANCHE],
  },
]

export const InactiveFantomPools = [
  { // 600
    pid: 8,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WFTM',
    token1Symbol: 'DAI',
    lpSymbol: 'FTM-DAI',
    lpAddress: DAI_NATIVE[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
  },
  // LENDING MARKET //
  // {
  //   pid: 24,
  //   type: 'lend',
  //   decimals: 18,
  //   token0Symbol: 'LINK', // EXEMPT //
  //   token1Symbol: 'USDC',
  //   lpSymbol: 'USDC-LINK', // EXEMPT //
  //   lpAddress: '0x5C900Ac3c95D13adE54D28A9800636AE21Cb5F39',
  //   token0Address: LINK_ADDRESS[ChainId.FANTOM],
  //   token1Address: USDC_ADDRESS[ChainId.FANTOM],
  // },
  { // 600
    pid: 6,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WFTM',
    token1Symbol: 'BNB',
    lpSymbol: 'FTM-BNB',
    lpAddress: BNB_NATIVE[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: BNB_ADDRESS[ChainId.FANTOM],
  },
  { // 150
    pid: 25,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WFTM',
    token1Symbol: 'LINK',
    lpSymbol: 'FTM-LINK',
    lpAddress: LINK_NATIVE[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: LINK_ADDRESS[ChainId.FANTOM],
  },
  // { // LENDING √
  //   pid: 13,
  //   type: 'lend',
  //   decimals: 18,
  //   token0Symbol: 'FTM', // EXEMPT //
  //   token1Symbol: 'DAI',
  //   lpSymbol: 'DAI-FTM', // EXEMPT //
  //   lpAddress: '0xF4Bfdd73FE65D1B46b9968A24443A77ab89908dd',
  //   token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
  //   token1Address: DAI_ADDRESS[ChainId.FANTOM],
  // },
  // { // LENDING √
  //   pid: 14,
  //   type: 'lend',
  //   decimals: 18,
  //   token0Symbol: 'DAI',
  //   token1Symbol: 'FTM', // EXEMPT //
  //   lpSymbol: 'FTM-DAI',
  //   lpAddress: '0xFD9BE6a83c7e9cFF48f6D9a3036bb6b20598ED61',
  //   token0Address: DAI_ADDRESS[ChainId.FANTOM],
  //   token1Address: WNATIVE_ADDRESS[ChainId.FANTOM], // EXEMPT //
  // },
  // { // LENDING √
  //   pid: 17,
  //   type: 'lend',
  //   decimals: 18,
  //   token0Symbol: 'ETH',
  //   token1Symbol: 'DAI',
  //   lpSymbol: 'DAI-ETH',
  //   lpAddress: '0x9fA5de19495331E13b443F787B90CdD22B32263d',
  //   token0Address: WETH_ADDRESS[ChainId.FANTOM],
  //   token1Address: DAI_ADDRESS[ChainId.FANTOM],
  // },
  /* { // LENDING
    pid: 18,
    type: 'lend',
    decimals: 8,
    token0Symbol: 'BTC',
    token1Symbol: 'DAI',
    lpSymbol: 'DAI-BTC',
    lpAddress: '0xaf28730165634A56434ca7f0B302CC54F862046F',
    token0Address: WBTC_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
  }, */
  // { // LENDING √
  //   pid: 15,
  //   type: 'lend',
  //   decimals: 18,
  //   token0Symbol: 'BNB',
  //   token1Symbol: 'DAI',
  //   lpSymbol: 'DAI-BNB',
  //   lpAddress: '0xbDa9204e6D596feCf9bd48108723F9BDAa2019f6',
  //   token0Address: BNB_ADDRESS[ChainId.FANTOM],
  //   token1Address: DAI_ADDRESS[ChainId.FANTOM],
  // },
  /* { // 0
      pid: 16,
      type: 'swap',
      decimals: 18,
      token0Symbol: 'WFTM',
      token1Symbol: 'WLUM',
      lpSymbol: 'FTM-WLUM',
      lpAddress: '0xa670C1E02c7AE8B3D575293bfA1F7eBa90F81C99',
      token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
      token1Address: WLUM_ADDRESS[ChainId.FANTOM],
    }, */
]

export const FantomPools = [
  { // 1,200
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
    pid: 2,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'SOUL',
    token1Symbol: 'USDC',
    lpSymbol: 'SOUL-USDC',
    lpAddress: SOUL_USDC[ChainId.FANTOM],
    token0Address: SOUL_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  { // 600
    pid: 3,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WFTM',
    token1Symbol: 'USDC',
    lpSymbol: 'FTM-USDC',
    lpAddress: USDC_NATIVE[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  { // 600
    pid: 4,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WFTM',
    token1Symbol: 'BTC',
    lpSymbol: 'FTM-BTC',
    lpAddress: BTC_NATIVE[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: WBTC_ADDRESS[ChainId.FANTOM],
  },
  { // 600
    pid: 5,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WFTM',
    token1Symbol: 'ETH',
    lpSymbol: 'FTM-ETH',
    lpAddress: ETH_NATIVE[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: WETH_ADDRESS[ChainId.FANTOM],
  },
  { // 600
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
  { // 300
    pid: 9,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WETH',
    token1Symbol: 'BTC',
    lpSymbol: 'ETH-BTC',
    lpAddress: BTC_ETH[ChainId.FANTOM],
    token0Address: WETH_ADDRESS[ChainId.FANTOM],
    token1Address: WBTC_ADDRESS[ChainId.FANTOM],
  },
  /* { // 20
    pid: 10,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WFTM',
    token1Symbol: 'EVO',
    lpSymbol: 'FTM-EVO',
    lpAddress: '0x857107e8F42023F7623C7ca413811DB1853F7f4b',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: GRIMEVO_ADDRESS[ChainId.FANTOM],
  }, */
  { // 200
    pid: 11,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WETH',
    token1Symbol: 'USDC',
    lpSymbol: 'ETH-USDC',
    lpAddress: ETH_USDC[ChainId.FANTOM],
    token0Address: WETH_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  { // 200
    pid: 12,
    type: 'swap',
    decimals: 18,
    token0Symbol: 'BTC',
    token1Symbol: 'USDC',
    lpSymbol: 'BTC-USDC',
    lpAddress: BTC_USDC[ChainId.FANTOM],
    token0Address: WBTC_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  // LENDING MARKET //
  { // 220
    pid: 19,
    type: 'lend',
    decimals: 18,
    token0Symbol: 'FTM', // EXEMPT //
    token1Symbol: 'USDC',
    lpSymbol: 'USDC-FTM', // EXEMPT //
    lpAddress: '0x29a72C8d81815787B886E9fc9d763406C796DD73',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  // LENDING MARKET //
  { // 220
    pid: 20,
    type: 'lend',
    decimals: 6,
    token0Symbol: 'USDC', // EXEMPT //
    token1Symbol: 'FTM',
    lpSymbol: 'FTM-USDC', // EXEMPT //
    lpAddress: '0xc5Ae8847C868898f68EF0227B6c4865dFcCe0D65',
    token0Address: USDC_ADDRESS[ChainId.FANTOM],
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
  },
  // LENDING MARKET //
  { // 220
    pid: 21,
    type: 'lend',
    decimals: 18,
    token0Symbol: 'ETH', // EXEMPT //
    token1Symbol: 'USDC',
    lpSymbol: 'USDC-ETH', // EXEMPT //
    lpAddress: '0x0a55Eb040C5183c5784A03F34bCEb3963f52b5a0',
    token0Address: WETH_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
   // LENDING MARKET //
   { // 220
    pid: 22,
    type: 'lend',
    decimals: 8,
    token0Symbol: 'BTC', // EXEMPT //
    token1Symbol: 'USDC',
    lpSymbol: 'USDC-BTC', // EXEMPT //
    lpAddress: '0x91787338E8fF91D0B36E54Fa5A50046d6C797D5B',
    token0Address: WBTC_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
   // LENDING MARKET //
  {
    pid: 23,
    type: 'lend',
    decimals: 18,
    token0Symbol: 'BNB', // EXEMPT //
    token1Symbol: 'USDC',
    lpSymbol: 'USDC-BNB', // EXEMPT //
    lpAddress: '0x9e17f37d807B211306C7354605FAAa308c3683EB',
    token0Address: BNB_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
]