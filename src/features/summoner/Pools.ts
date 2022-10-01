import { ChainId, SEANCE_ADDRESS, SOUL_ADDRESS, USDC_ADDRESS, LUX_ADDRESS, WLUM_ADDRESS, WNATIVE_ADDRESS, SOUL_NATIVE, DAI_ADDRESS, BNB_ADDRESS, SOR_ADDRESS, WETH_ADDRESS, WBTC_ADDRESS, CRV_ADDRESS, GRIMEVO_ADDRESS, FUSD_ADDRESS, USDT_ADDRESS, SOUL_USDC, USDC_NATIVE, BTC_NATIVE, ETH_NATIVE, DAI_USDC, AVAX_ADDRESS, BNB_NATIVE } from 'sdk'

/*/ rules /*/
// `token0Symbol` && `token1Symbol`: always use "w" prefix
// `lpSymbol`: never use "w" prefix
// `lpSymbol`: always frontload native

// take note of exemptions (usually in lending) //

export const InactiveAvalanchePools = [
  // { 
  //   pid: undefined,
  //   token0Symbol: undefined,
  //   token1Symbol: undefined,
  //   lpSymbol: undefined,
  //   lpAddress: '',
  //   token0Address: '', 
  //   token1Address: '', 
  // }
]

export const InactiveFantomPools = [
  {
    // 0
    pid: 16,
    token0Symbol: 'DAI',
    token1Symbol: 'gFUSDT',
    lpSymbol: 'DAI-gFUSDT',
    lpAddress: '0xe637D90A993EDBD75AC09E9fcB16313D193B9451',
    token0Address: DAI_ADDRESS[ChainId.FANTOM], 
    token1Address: '0x940F41F0ec9ba1A34CF001cc03347ac092F5F6B5', // gFUSDT,
  },
  {
    // 0
    pid: 6,
    token0Symbol: 'USDC',
    token1Symbol: 'FUSD',
    lpSymbol: 'USDC-FUSD',
    lpAddress: '0xD5F5E2638d636A98eD4aAEBfd2045441316e0c08',
    token0Address: USDC_ADDRESS[ChainId.FANTOM],
    token1Address: FUSD_ADDRESS[ChainId.FANTOM],
  },
  {
    // 0
    pid: 9,
    token0Symbol: 'USDC',
    token1Symbol: 'USDT',
    lpSymbol: 'USDC-USDT',
    lpAddress: '0x298c12d6d9d6746dd0ef0a89421288f52d5566ef',
    token0Address: USDC_ADDRESS[ChainId.FANTOM],
    token1Address: USDT_ADDRESS[ChainId.FANTOM],
  },
]

export const AvalanchePools = [
  {
    pid: 1,
    token0Symbol: 'WAVAX',
    token1Symbol: 'SOUL',
    lpSymbol: 'AVAX-SOUL',
    lpAddress: SOUL_NATIVE[ChainId.AVALANCHE],
    token0Address: WNATIVE_ADDRESS[ChainId.AVALANCHE],
    token1Address: SOUL_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 2,
    token0Symbol: 'SOUL',
    token1Symbol: 'USDC',
    lpSymbol: 'SOUL-USDC',
    lpAddress: SOUL_USDC[ChainId.AVALANCHE],
    token0Address: SOUL_ADDRESS[ChainId.AVALANCHE],
    token1Address: USDC_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 3,
    token0Symbol: 'WAVAX',
    token1Symbol: 'USDC',
    lpSymbol: 'AVAX-USDC',
    lpAddress: USDC_NATIVE[ChainId.AVALANCHE],
    token0Address: WNATIVE_ADDRESS[ChainId.AVALANCHE],
    token1Address: USDC_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 4,
    token0Symbol: 'WAVAX',
    token1Symbol: 'BTC',
    lpSymbol: 'AVAX-BTC',
    lpAddress: BTC_NATIVE[ChainId.AVALANCHE],
    token0Address: WNATIVE_ADDRESS[ChainId.AVALANCHE],
    token1Address: WBTC_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 5,
    token0Symbol: 'WAVAX',
    token1Symbol: 'ETH',
    lpSymbol: 'AVAX-ETH',
    lpAddress: ETH_NATIVE[ChainId.AVALANCHE],
    token0Address: WNATIVE_ADDRESS[ChainId.AVALANCHE],
    token1Address: WETH_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 7,
    token0Symbol: 'WAVAX',
    token1Symbol: 'BNB',
    lpSymbol: 'AVAX-BNB',
    lpAddress: BNB_NATIVE[ChainId.AVALANCHE],
    token0Address: WNATIVE_ADDRESS[ChainId.AVALANCHE],
    token1Address: BNB_ADDRESS[ChainId.AVALANCHE],
  },
  {
    pid: 6,
    token0Symbol: 'DAI',
    token1Symbol: 'USDC',
    lpSymbol: 'DAI-USDC',
    lpAddress: DAI_USDC[ChainId.AVALANCHE],
    token0Address: DAI_ADDRESS[ChainId.AVALANCHE],
    token1Address: USDC_ADDRESS[ChainId.AVALANCHE],
  },
]

export const FantomPools = [
  {
    // 7500
    pid: 1,
    token0Symbol: 'WFTM',
    token1Symbol: 'SOUL',
    lpSymbol: 'FTM-SOUL',
    lpAddress: '0x6Da1AD717C7577AAB46C19aB6d3d9C31aff32A00',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: SOUL_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 22,
    token0Symbol: 'SOUL',
    token1Symbol: 'USDC',
    lpSymbol: 'SOUL-USDC',
    lpAddress: '0xC0A301f1E5E0Fe37a31657e8F60a41b14d01B0Ef',
    token0Address: SOUL_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 5,
    token0Symbol: 'SOUL',
    token1Symbol: 'SEANCE',
    lpSymbol: 'SOUL-SEANCE',
    lpAddress: '0x8f1E15cD3d5a0bb85B8189d5c6B61BB64398E19b',
    token0Address: SOUL_ADDRESS[ChainId.FANTOM],
    token1Address: SEANCE_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 10,
    token0Symbol: 'WFTM',
    token1Symbol: 'SEANCE',
    lpSymbol: 'FTM-SEANCE',
    lpAddress: '0x8542bEAC34282aFe5Bb6951Eb6DCE0B3783b7faB',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: SEANCE_ADDRESS[ChainId.FANTOM],
  },
  {
    // 400
    pid: 7,
    token0Symbol: 'SEANCE',
    token1Symbol: 'USDC',
    lpSymbol: 'SEANCE-USDC',
    lpAddress: '0x98C678d3C7ebeD4a36B84666700d8b5b5Ddc1f79',
    token0Address: SEANCE_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 750
    pid: 54,
    token0Symbol: 'WFTM',
    token1Symbol: 'SOR',
    lpSymbol: 'FTM-SOR',
    lpAddress: '0xdfB2218b48627794711E6cFd72e26c541E456F6F',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: SOR_ADDRESS[ChainId.FANTOM],
  },
  {
    // 1500
    pid: 47,
    token0Symbol: 'WFTM',
    token1Symbol: 'WLUM',
    lpSymbol: 'FTM-WLUM',
    lpAddress: '0xa670C1E02c7AE8B3D575293bfA1F7eBa90F81C99',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: WLUM_ADDRESS[ChainId.FANTOM],
  },
  {
    // 1000
    pid: 44,
    token0Symbol: 'WFTM',
    token1Symbol: 'LUX',
    lpSymbol: 'FTM-LUX',
    lpAddress: '0x951BBB838e49F7081072895947735b0892cCcbCD',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: LUX_ADDRESS[ChainId.FANTOM],
  },
  {
    // 300
    pid: 38,
    token0Symbol: 'WFTM',
    token1Symbol: 'FUSD',
    lpSymbol: 'FTM-FUSD',
    lpAddress: '0x1AE16105a7d4bE7DFD9737FD13D9A50AEFed1437',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: FUSD_ADDRESS[ChainId.FANTOM], // FUSD
  },
  {
    // 600
    pid: 23,
    token0Symbol: 'WFTM',
    token1Symbol: 'DAI',
    lpSymbol: 'FTM-DAI',
    lpAddress: '0xF3d6E8Ecece8647B456d57375Ce0B51B8F0cD40b',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 2,
    token0Symbol: 'WFTM',
    token1Symbol: 'USDC',
    lpSymbol: 'FTM-USDC',
    lpAddress: '0x160653F02b6597E7Db00BA8cA826cf43D2f39556',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 55,
    token0Symbol: 'WFTM',
    token1Symbol: 'AVAX',
    lpSymbol: 'FTM-WAVAX',
    lpAddress: '0x5159Ba92FDC80b3a4B19De279711b1822de06c86',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: AVAX_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 18,
    token0Symbol: 'WFTM',
    token1Symbol: 'BNB',
    lpSymbol: 'FTM-BNB',
    lpAddress: '0x52966a12e3211c92909C28603ca3df8465c06c82',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: BNB_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 4,
    token0Symbol: 'WFTM',
    token1Symbol: 'ETH',
    lpSymbol: 'FTM-ETH',
    lpAddress: '0xC615a5fd68265D9Ec6eF60805998fa5Bb71972Cb',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: WETH_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 13,
    token0Symbol: 'WFTM',
    token1Symbol: 'BTC',
    lpSymbol: 'FTM-BTC',
    lpAddress: '0xecB41D6B5885E75a149EDA173e92267aa271D895',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: WBTC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 300
    pid: 41,
    token0Symbol: 'WFTM',
    token1Symbol: 'CRV',
    lpSymbol: 'FTM-CRV',
    lpAddress: '0x1C9A342A615E8CAB4d21A2ACA7E40a48b2F8747F',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: CRV_ADDRESS[ChainId.FANTOM],
  },
  {
    // 400
    pid: 15,
    token0Symbol: 'WETH',
    token1Symbol: 'USDC',
    lpSymbol: 'ETH-USDC',
    lpAddress: '0x5b181BBc3Cc18C66B6f36f584866a1ff09865630',
    token0Address: WETH_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 8,
    token0Symbol: 'WETH',
    token1Symbol: 'BTC',
    lpSymbol: 'ETH-BTC',
    lpAddress: '0x1fc954d3484bc21e0ce53a6648a35bbfc03dc9d0',
    token0Address: WETH_ADDRESS[ChainId.FANTOM],
    token1Address: WBTC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 20,
    token0Symbol: 'BTC',
    token1Symbol: 'USDC',
    lpSymbol: 'BTC-USDC',
    lpAddress: '0xE2d39F7f0c8517Ca2058Fa97eB3D8d4928F7C6D6',
    token0Address: WBTC_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 200
    pid: 50,
    token0Symbol: 'WFTM',
    token1Symbol: 'EVO',
    lpSymbol: 'FTM-EVO',
    lpAddress: '0x857107e8F42023F7623C7ca413811DB1853F7f4b',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: GRIMEVO_ADDRESS[ChainId.FANTOM],
  },
]


export const AvalancheLendingPools = [
  // { 
  //   pid: undefined,
  //   token0Symbol: undefined,
  //   token1Symbol: undefined,
  //   lpSymbol: undefined,
  //   lpAddress: '',
  //   token0Address: '', 
  //   token1Address: '', 
  // }
]

export const FantomLendingPools = [
  {
    // LENDING
    pid: 48,
    token0Symbol: 'FTM', // EXEMPT //
    token1Symbol: 'DAI',
    lpSymbol: 'DAI-FTM', // EXEMPT //
    lpAddress: '0xF4Bfdd73FE65D1B46b9968A24443A77ab89908dd',
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
  },
  {
    // LENDING
    pid: 49,
    token0Symbol: 'DAI',
    token1Symbol: 'FTM', // EXEMPT //
    lpSymbol: 'FTM-DAI',
    lpAddress: '0xFD9BE6a83c7e9cFF48f6D9a3036bb6b20598ED61',
    token0Address: DAI_ADDRESS[ChainId.FANTOM],
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM], // EXEMPT //
  },
  {
    // LENDING
    pid: 51,
    token0Symbol: 'WETH',
    token1Symbol: 'DAI',
    lpSymbol: 'DAI-ETH',
    lpAddress: '0x9fA5de19495331E13b443F787B90CdD22B32263d',
    token0Address: WETH_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
  },
  {
    // LENDING
    pid: 53,
    token0Symbol: 'BNB',
    token1Symbol: 'DAI',
    lpSymbol: 'DAI-BNB',
    lpAddress: '0xbDa9204e6D596feCf9bd48108723F9BDAa2019f6',
    token0Address: BNB_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
  },
  {
    // LENDING
    pid: 56,
    token0Symbol: 'BTC',
    token1Symbol: 'DAI',
    lpSymbol: 'DAI-BTC',
    lpAddress: '0xaf28730165634A56434ca7f0B302CC54F862046F',
    token0Address: WBTC_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
  },
]