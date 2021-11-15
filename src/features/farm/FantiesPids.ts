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

export const FantiesPids = [
  
  // SEANCE POOLS
  {
    // 200
    pid: 30,
    token1: 'SEANCE',
    token2: 'SPIRIT',
    lpSymbol: 'SEANCE-SPIRIT',
    lpAddresses: {
      4002: '',
      250: '0xE3c700551c0D96202934969Ad219B8693a723d59',
    },
    token1Address: tokens.SEANCE,
    token2Address: tokens.SPIRIT,
  },

  {
    // 200
    pid: 31,
    token1: 'SEANCE',
    token2: 'BOO',
    lpSymbol: 'SEANCE-BOO',
    lpAddresses: {
      4002: '',
      250: '0x26a30b02A8DFb3f573E3F881D04258461Cae47Db',
    },
    token1Address: tokens.SEANCE,
    token2Address: tokens.BOO,
  },

  {
    // 200
    pid: 32,
    token1: 'SEANCE',
    token2: 'ZOO',
    lpSymbol: 'SEANCE-ZOO',
    lpAddresses: {
      4002: '',
      250: '0xa2cFc18F3A41E158DA173be0e4785F017Ff92a6e',
    },
    token1Address: tokens.SEANCE,
    token2Address: tokens.ZOO,
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

export default FantiesPids
