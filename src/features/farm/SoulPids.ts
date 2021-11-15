import { tokens } from './constants/tokens'

// Base tokens (token1):
// - FTM
// - USDT
// - SOUL

// export const WithdrawPids = [
//   {
//     // 400
//     pid: 3,
//     token1: 'FUSD',
//     token2: 'SOUL',
//     lpSymbol: 'SOUL-FUSD',
//     lpAddresses: {
//       4002: '0xaf02fd55F297f2a591367F6E33Dc600Ff2Be472A',
//       250: '0x9e7711eaeb652d0da577c1748844407f8db44a10',
//     },
//     token1Address: tokens.FUSD,
//     token2Address: tokens.SOUL,
//   },
// ]

export const SoulPids = [
  
  {
    // 1600
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

export default SoulPids
