import { tokens } from './constants/tokens'

// Base tokens (token1):
// - FTM
// - FUSD
// - SOUL

export const FarmPids = [
  { // 800
    pid: 1,
    token1: 'SOUL',
    token2: 'FTM',
    lpSymbol: 'SOUL-FTM',
    lpAddresses: {
      4002: '0x10c0AFd7C58916C4025d466E11850c7D79219277',
      250: '0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57',
    },
    token1Address: tokens.SOUL,
    token2Address: tokens.FTM,
  },
  { // 600
    pid: 2,
    token1: 'FTM',
    token2: 'USDC',
    lpSymbol: 'FTM-USDC',
    lpAddresses: {
      4002: '',
      250: '0x160653F02b6597E7Db00BA8cA826cf43D2f39556',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.USDC,
  },
  { // 400	
    pid: 3,
    token1: 'FUSD',
    token2: 'SOUL',
    lpSymbol: 'SOUL-FUSD',
    lpAddresses: {
      4002: '0xaf02fd55F297f2a591367F6E33Dc600Ff2Be472A',
      250: '0x9e7711eaeb652d0da577c1748844407f8db44a10',
    },
    token1Address: tokens.FUSD,
    token2Address: tokens.SOUL,
  },
  { // 600
    pid: 4,
    token1: 'FTM',
    token2: 'WETH',
    lpSymbol: 'FTM-ETH',
    lpAddresses: {
      4002: '',
      250: '0xC615a5fd68265D9Ec6eF60805998fa5Bb71972Cb',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.WETH,
  },
  { // 800
    pid: 5,
    token1: 'SOUL',
    token2: 'SEANCE',
    lpSymbol: 'SOUL-SEANCE',
    lpAddresses: {
      4002: '',
      250: '0x8f1E15cD3d5a0bb85B8189d5c6B61BB64398E19b',
    },
      token1Address: tokens.SOUL,
      token2Address: tokens.SEANCE,
  },
  { // 200
    pid: 6,
    token1: 'FUSD',
    token2: 'USDC',
    lpSymbol: 'FUSD-USDC',
    lpAddresses: {
      4002: '',
      250: '0xD5F5E2638d636A98eD4aAEBfd2045441316e0c08',
      },
      token1Address: tokens.FUSD,
      token2Address: tokens.USDC,
  },
  { // 400
    pid: 7,
    token1: 'USDC',
    token2: 'SEANCE',
    lpSymbol: 'USDC-SEANCE',
    lpAddresses: {
      4002: '',
      250: '0x98C678d3C7ebeD4a36B84666700d8b5b5Ddc1f79',
      },
      token1Address: tokens.USDC,
      token2Address: tokens.SEANCE,
  },
  { // 600
    pid: 8,
    token1: 'WETH',
    token2: 'WBTC',
    lpSymbol: 'ETH-BTC',
    lpAddresses: {
      4002: '',
      250: '0x1fc954d3484bc21e0ce53a6648a35bbfc03dc9d0',
      },
      token1Address: tokens.WETH,
      token2Address: tokens.WBTC,
  },
  { // 200
    pid: 9,
    token1: 'USDC',
    token2: 'fUSDT',
    lpSymbol: 'USDC-fUSDT',
    lpAddresses: {
      4002: '',
      250: '0x298c12d6d9d6746dd0ef0a89421288f52d5566ef',
      },
      token1Address: tokens.USDC,
      token2Address: tokens.fUSDT,
  },
  { // 600
    pid: 10,
    token1: 'SEANCE',
    token2: 'FTM',
    lpSymbol: 'SEANCE-FTM',
    lpAddresses: {
      4002: '',
      250: '0x8542bEAC34282aFe5Bb6951Eb6DCE0B3783b7faB',
      },
      token1Address: tokens.SEANCE,
      token2Address: tokens.FTM,
  },
  { // 100
    pid: 11,
    token1: 'FTM',
    token2: 'GRIM',
    lpSymbol: 'GRIM-FTM',
    lpAddresses: {
      4002: '',
      250: '0x124D8CA33E29D1090a844e4C896DD16A360B1c96',
      },
      token1Address: tokens.FTM,
      token2Address: tokens.GRIM,
  },
  { // 100
    pid: 12,
    token1: 'FTM',
    token2: 'REAPER',
    lpSymbol: 'REAPER-FTM',
    lpAddresses: {
      4002: '',
      250: '0x7D776489372c8AFC0A1941a1335C9e9f90e0116a',
      },
      token1Address: tokens.FTM,
      token2Address: tokens.REAPER,
  },
  { // 600
    pid: 13,
    token1: 'FTM',
    token2: 'BTC',
    lpSymbol: 'BTC-FTM',
    lpAddresses: {
      4002: '',
      250: '0xecB41D6B5885E75a149EDA173e92267aa271D895',
      },
      token1Address: tokens.FTM,
      token2Address: tokens.WBTC,
  },
  { // 600
    pid: 14,
    token1: 'FTM',
    token2: 'USDT',
    lpSymbol: 'FTM-USDT',
    lpAddresses: {
      4002: '',
      250: '0xdC24814AD654986928F8E4aec48D37fa30bBC5BB',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.fUSDT,
  },
  { // 600
    pid: 15,
    token1: 'ETH',
    token2: 'USDC',
    lpSymbol: 'ETH-USDC',
    lpAddresses: {
      4002: '',
      250: '0x5b181BBc3Cc18C66B6f36f584866a1ff09865630',
      },
      token1Address: tokens.WETH,
      token2Address: tokens.USDC,
  },
  // { // TEMPLATE
  //   pid: 13,
  //   token1: '',
  //   token2: '',
  //   lpSymbol: '',
  //   lpAddresses: {
  //     4002: '',
  //     250: '',
  //     },
  //     token1Address: tokens.SEANCE,
  //     token2Address: tokens.FTM,
  // },
]

export default FarmPids
