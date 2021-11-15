import { tokens } from './constants/tokens'

// base tokens (token1): SEANCE

const token1 = 'SEANCE'
const token1Address = tokens.SEANCE

export const MatePids = [

  { // 200
    pid: 30,
    token1,
    token2: 'SPIRIT',
    lpSymbol: 'SEANCE-SPIRIT',
    lpAddresses: {
      4002: '',
      250: '0xE3c700551c0D96202934969Ad219B8693a723d59',
    },
    token1Address,
    token2Address: tokens.SPIRIT,
  },

  { // 200
    pid: 31,
    token1,
    token2: 'BOO',
    lpSymbol: 'SEANCE-BOO',
    lpAddresses: {
      4002: '',
      250: '0x26a30b02A8DFb3f573E3F881D04258461Cae47Db',
    },
    token1Address,
    token2Address: tokens.BOO,
  },

  { // 200
    pid: 32,
    token1,
    token2: 'ZOO',
    lpSymbol: 'SEANCE-ZOO',
    lpAddresses: {
      4002: '',
      250: '0xa2cFc18F3A41E158DA173be0e4785F017Ff92a6e',
    },
    token1Address,
    token2Address: tokens.ZOO,
  }

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
  
  export default MatePids
  