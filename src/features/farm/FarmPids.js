import { tokens } from './tokens'

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
      // 4002: '0x10c0AFd7C58916C4025d466E11850c7D79219277',
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
      // 4002: '',
      250: '0x160653F02b6597E7Db00BA8cA826cf43D2f39556',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.USDC,
  },
  { // 800	
    pid: 3,
    token1: 'SOUL',
    token2: 'FUSD',
    lpSymbol: 'SOUL-FUSD',
    lpAddresses: {
      // 4002: '0xaf02fd55F297f2a591367F6E33Dc600Ff2Be472A',
      250: '0x9e7711eaeb652d0da577c1748844407f8db44a10',
    },
    token1Address: tokens.SOUL,
    token2Address: tokens.FUSD,
  },
  { // 600
    pid: 4,
    token1: 'FTM',
    token2: 'WETH',
    lpSymbol: 'FTM-WETH',
    lpAddresses: {
      // 4002: '',
      250: '0xC615a5fd68265D9Ec6eF60805998fa5Bb71972Cb',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.WETH,
  },

  // {
  //   pid: 5,
  //   token1: "FTM",
  //   token2: "BTC",
  //   lpSymbol: "FTM-BTC",
  //   lpAddresses: {
  //     4002: "0x69532253792c8ce581D1BE2150aF67994fF324e7",
  //   },
  //   token1Address: tokens.FTM,
  //   token2Address: tokens.BTC,
  // },
]

export default FarmPids
