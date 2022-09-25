import { ChainId, SEANCE_ADDRESS, SOUL_ADDRESS, USDC_ADDRESS, LUX_ADDRESS, WLUM_ADDRESS, WNATIVE_ADDRESS, AVAX_ADDRESS, SOUL_NATIVE_ADDRESS, DAI_ADDRESS, BNB_ADDRESS, SOR_ADDRESS, WETH_ADDRESS, WBTC_ADDRESS, CRV_ADDRESS, GRIMEVO_ADDRESS } from 'sdk'

export const InactivePools = [
  {
    // 0
    pid: 16,
    token1: 'DAI',
    token2: 'gFUSDT',
    lpSymbol: 'DAI-gFUSDT',
    lpAddress: '0xe637D90A993EDBD75AC09E9fcB16313D193B9451',
    token1Address: DAI_ADDRESS[ChainId.FANTOM], 
    token2Address: '0x940F41F0ec9ba1A34CF001cc03347ac092F5F6B5', // gFUSDT,
  },
  {
    // 0
    pid: 6,
    token1: 'USDC',
    token2: 'FUSD',
    lpSymbol: 'USDC-FUSD',
    lpAddress: '0xD5F5E2638d636A98eD4aAEBfd2045441316e0c08',
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
    token2Address: '0xAd84341756Bf337f5a0164515b1f6F993D194E1f', // FUSD
  },
  {
    // 0
    pid: 9,
    token1: 'USDC',
    token2: 'USDT',
    lpSymbol: 'USDC-USDT',
    lpAddress: '0x298c12d6d9d6746dd0ef0a89421288f52d5566ef',
    token2Address: '0x049d68029688eAbF473097a2fC38ef61633A3C7A' // USDT,
  },
]

export const AvalanchePools = [
  {
    pid: 1,
    token1: 'SOUL',
    token2: 'AVAX',
    lpSymbol: 'SOUL-AVAX',
    lpAddress: SOUL_NATIVE_ADDRESS[ChainId.AVALANCHE],
    token1Address: SOUL_ADDRESS[ChainId.AVALANCHE],
    token2Address: AVAX_ADDRESS[ChainId.AVALANCHE],
  },
]

export const FantomPools = [
  {
    // 7500
    pid: 1,
    token1: 'SOUL',
    token2: 'FTM',
    lpSymbol: 'SOUL-FTM',
    lpAddress: '0x6Da1AD717C7577AAB46C19aB6d3d9C31aff32A00',
    token1Address: SOUL_ADDRESS[ChainId.FANTOM],
    token2Address: WNATIVE_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 22,
    token1: 'SOUL',
    token2: 'USDC',
    lpSymbol: 'SOUL-USDC',
    lpAddress: '0xC0A301f1E5E0Fe37a31657e8F60a41b14d01B0Ef',
    token1Address: SOUL_ADDRESS[ChainId.FANTOM],
    token2Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 5,
    token1: 'SOUL',
    token2: 'SEANCE',
    lpSymbol: 'SOUL-SEANCE',
    lpAddress: '0x8f1E15cD3d5a0bb85B8189d5c6B61BB64398E19b',
    token1Address: SOUL_ADDRESS[ChainId.FANTOM],
    token2Address: SEANCE_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 10,
    token1: 'SEANCE',
    token2: 'FTM',
    lpSymbol: 'SEANCE-FTM',
    lpAddress: '0x8542bEAC34282aFe5Bb6951Eb6DCE0B3783b7faB',
    token1Address: SEANCE_ADDRESS[ChainId.FANTOM],
    token2Address: WNATIVE_ADDRESS[ChainId.FANTOM],
  },
  {
    // 400
    pid: 7,
    token1: 'SEANCE',
    token2: 'USDC',
    lpSymbol: 'SEANCE-USDC',
    lpAddress: '0x98C678d3C7ebeD4a36B84666700d8b5b5Ddc1f79',
    token1Address: SEANCE_ADDRESS[ChainId.FANTOM],
    token2Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 750
    pid: 54,
    token1: 'FTM',
    token2: 'SOR',
    lpSymbol: 'FTM-SOR',
    lpAddress: '0xdfB2218b48627794711E6cFd72e26c541E456F6F',
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token2Address: SOR_ADDRESS[ChainId.FANTOM],
  },
  {
    // 1500
    pid: 47,
    token1: 'FTM',
    token2: 'wLUM',
    lpSymbol: 'FTM-wLUM',
    lpAddress: '0xa670C1E02c7AE8B3D575293bfA1F7eBa90F81C99',
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token2Address: WLUM_ADDRESS[ChainId.FANTOM],
  },
  {
    // 1000
    pid: 44,
    token1: 'FTM',
    token2: 'LUX',
    lpSymbol: 'FTM-LUX',
    lpAddress: '0x951BBB838e49F7081072895947735b0892cCcbCD',
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token2Address: LUX_ADDRESS[ChainId.FANTOM],
  },
  {
    // 300
    pid: 38,
    token1: 'FTM',
    token2: 'FUSD',
    lpSymbol: 'FTM-FUSD',
    lpAddress: '0x1AE16105a7d4bE7DFD9737FD13D9A50AEFed1437',
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token2Address: '0xAd84341756Bf337f5a0164515b1f6F993D194E1f', // FUSD
  },
  {
    // 600
    pid: 23,
    token1: 'FTM',
    token2: 'DAI',
    lpSymbol: 'FTM-DAI',
    lpAddress: '0xF3d6E8Ecece8647B456d57375Ce0B51B8F0cD40b',
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token2Address: DAI_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 2,
    token1: 'FTM',
    token2: 'USDC',
    lpSymbol: 'FTM-USDC',
    lpAddress: '0x160653F02b6597E7Db00BA8cA826cf43D2f39556',
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token2Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 55,
    token1: 'FTM',
    token2: 'AVAX',
    lpSymbol: 'FTM-AVAX',
    lpAddress: '0x5159Ba92FDC80b3a4B19De279711b1822de06c86',
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token2Address: AVAX_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 18,
    token1: 'FTM',
    token2: 'BNB',
    lpSymbol: 'FTM-BNB',
    lpAddress: '0x52966a12e3211c92909C28603ca3df8465c06c82',
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token2Address: BNB_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 4,
    token1: 'FTM',
    token2: 'WETH',
    lpSymbol: 'FTM-ETH',
    lpAddress: '0xC615a5fd68265D9Ec6eF60805998fa5Bb71972Cb',
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token2Address: WETH_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 13,
    token1: 'FTM',
    token2: 'BTC',
    lpSymbol: 'FTM-BTC',
    lpAddress: '0xecB41D6B5885E75a149EDA173e92267aa271D895',
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token2Address: WBTC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 300
    pid: 41,
    token1: 'FTM',
    token2: 'CRV',
    lpSymbol: 'FTM-CRV',
    lpAddress: '0x1C9A342A615E8CAB4d21A2ACA7E40a48b2F8747F',
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token2Address: CRV_ADDRESS[ChainId.FANTOM],
  },
  {
    // 400
    pid: 15,
    token1: 'WETH',
    token2: 'USDC',
    lpSymbol: 'ETH-USDC',
    lpAddress: '0x5b181BBc3Cc18C66B6f36f584866a1ff09865630',
    token1Address: WETH_ADDRESS[ChainId.FANTOM],
    token2Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 8,
    token1: 'WETH',
    token2: 'BTC',
    lpSymbol: 'ETH-BTC',
    lpAddress: '0x1fc954d3484bc21e0ce53a6648a35bbfc03dc9d0',
    token1Address: WETH_ADDRESS[ChainId.FANTOM],
    token2Address: WBTC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 600
    pid: 20,
    token1: 'BTC',
    token2: 'USDC',
    lpSymbol: 'BTC-USDC',
    lpAddress: '0xE2d39F7f0c8517Ca2058Fa97eB3D8d4928F7C6D6',
    token1Address: WBTC_ADDRESS[ChainId.FANTOM],
    token2Address: USDC_ADDRESS[ChainId.FANTOM],
  },
  {
    // 200
    pid: 50,
    token1: 'FTM',
    token2: 'EVO',
    lpSymbol: 'FTM-EVO',
    lpAddress: '0x857107e8F42023F7623C7ca413811DB1853F7f4b',
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token2Address: GRIMEVO_ADDRESS[ChainId.FANTOM],
  },
]

export const LendingPools = [
  {
    // LENDING
    pid: 48,
    token1: 'FTM',
    token2: 'DAI',
    lpSymbol: 'DAI-FTM',
    lpAddress: '0xF4Bfdd73FE65D1B46b9968A24443A77ab89908dd',
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token2Address: DAI_ADDRESS[ChainId.FANTOM],
  },
  {
    // LENDING
    pid: 49,
    token1: 'DAI',
    token2: 'FTM',
    lpSymbol: 'FTM-DAI',
    lpAddress: '0xFD9BE6a83c7e9cFF48f6D9a3036bb6b20598ED61',
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
    token2Address: WNATIVE_ADDRESS[ChainId.FANTOM],
  },
  {
    // LENDING
    pid: 51,
    token1: 'WETH',
    token2: 'DAI',
    lpSymbol: 'DAI-ETH',
    lpAddress: '0x9fA5de19495331E13b443F787B90CdD22B32263d',
    token1Address: WETH_ADDRESS[ChainId.FANTOM],
    token2Address: DAI_ADDRESS[ChainId.FANTOM],
  },
  {
    // LENDING
    pid: 53,
    token1: 'BNB',
    token2: 'DAI',
    lpSymbol: 'DAI-BNB',
    lpAddress: '0xbDa9204e6D596feCf9bd48108723F9BDAa2019f6',
    token1Address: BNB_ADDRESS[ChainId.FANTOM],
    token2Address: DAI_ADDRESS[ChainId.FANTOM],
  },
  {
    // LENDING
    pid: 56,
    token1: 'BTC',
    token2: 'DAI',
    lpSymbol: 'DAI-BTC',
    lpAddress: '0xaf28730165634A56434ca7f0B302CC54F862046F',
    token1Address: WBTC_ADDRESS[ChainId.FANTOM],
    token2Address: DAI_ADDRESS[ChainId.FANTOM],
  },
]