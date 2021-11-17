import { tokens } from './constants/tokens'

// Base tokens (token1):
// - FTM
// - USDT
// - SOUL

export const WithdrawPids = [
  {
    // 400
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
]

export const AllPids = [

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

  {
    // 1200
    pid: 24,
    token1: 'FTM',
    token2: 'ENCHANT',
    lpSymbol: 'ENCHANT-FTM',
    lpAddresses: {
      4002: '',
      250: '0xb4d6ff768f409e4d102bad80f9a8ac105453ccdd',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.ENCHANT,
  },

  {
    // 600
    pid: 22,
    token1: 'USDC',
    token2: 'SOUL',
    lpSymbol: 'SOUL-USDC',
    lpAddresses: {
      4002: '',
      250: '0xC0A301f1E5E0Fe37a31657e8F60a41b14d01B0Ef',
    },
    token1Address: tokens.USDC,
    token2Address: tokens.SOUL,
  },

  {
    // 600
    pid: 28,
    token1: 'fUSDT',
    token2: 'SOUL',
    lpSymbol: 'SOUL-FUSDT',
    lpAddresses: {
      4002: '',
      250: '0xE27Cc06a7F34892BC17a5474303b91b2C9F3F21A',
    },
    token1Address: tokens.fUSDT,
    token2Address: tokens.SOUL,
  },

  {
    // 600
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

  {
    // 600
    pid: 25,
    token1: 'SOUL',
    token2: 'ENCHANT',
    lpSymbol: 'ENCHANT-SOUL',
    lpAddresses: {
      4002: '',
      250: '0x9acc8f23680b6d7e295166277e2fb9c88a26cce6',
    },
    token1Address: tokens.SOUL,
    token2Address: tokens.ENCHANT,
  },

  {
    // 600
    pid: 26,
    token1: 'SEANCE',
    token2: 'ENCHANT',
    lpSymbol: 'ENCHANT-SEANCE',
    lpAddresses: {
      4002: '',
      250: '0x5695176d085f8f7320507495066ffec940da244c',
    },
    token1Address: tokens.SEANCE,
    token2Address: tokens.ENCHANT,
  },

  {
    // 400
    pid: 29,
    token1: 'USDC',
    token2: 'ENCHANT',
    lpSymbol: 'ENCHANT-USDC',
    lpAddresses: {
      4002: '',
      250: '0x6c6f32008262666CA4acEd0a824c4945AB96e5F3',
    },
    token1Address: tokens.USDC,
    token2Address: tokens.ENCHANT,
  },
  {
    // 400
    pid: 27,
    token1: 'SEANCE',
    token2: 'UNIDX',
    lpSymbol: 'SEANCE-UNIDX',
    lpAddresses: {
      4002: '',
      250: '0x578c7B9A45D9e55246d3036D48db262b9B3CA48e',
    },
    token1Address: tokens.SEANCE,
    token2Address: tokens.UNIDX,
  },
  {
    // 600
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
  {
    // 400
    pid: 7,
    token1: 'USDC',
    token2: 'SEANCE',
    lpSymbol: 'SEANCE-USDC',
    lpAddresses: {
      4002: '',
      250: '0x98C678d3C7ebeD4a36B84666700d8b5b5Ddc1f79',
    },
    token1Address: tokens.USDC,
    token2Address: tokens.SEANCE,
  },
  {
    // 100
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
  {
    // 100
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
  {
    // 600
    pid: 23,
    token1: 'FTM',
    token2: 'DAI',
    lpSymbol: 'DAI-FTM',
    lpAddresses: {
      4002: '',
      250: '0xF3d6E8Ecece8647B456d57375Ce0B51B8F0cD40b',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.DAI,
  },
  {
    // 600
    pid: 2,
    token1: 'FTM',
    token2: 'USDC',
    lpSymbol: 'USDC-FTM',
    lpAddresses: {
      4002: '',
      250: '0x160653F02b6597E7Db00BA8cA826cf43D2f39556',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.USDC,
  },
  {
    // 400
    pid: 19,
    token1: 'FTM',
    token2: 'MIM',
    lpSymbol: 'MIM-FTM',
    lpAddresses: {
      4002: '',
      250: '0x34990FC1e6e3169DCf23624049be29782AFc81bd',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.MIM,
  },
  {
    // 400
    pid: 17,
    token1: 'BNB',
    token2: 'DAI',
    lpSymbol: 'BNB-DAI',
    lpAddresses: {
      4002: '',
      250: '0xC1EdFbA9811B696bDFd07d31eD5FF702e031364E',
    },
    token1Address: tokens.BNB,
    token2Address: tokens.DAI,
  },
  {
    // 600
    pid: 18,
    token1: 'BNB',
    token2: 'FTM',
    lpSymbol: 'BNB-FTM',
    lpAddresses: {
      4002: '',
      250: '0x52966a12e3211c92909C28603ca3df8465c06c82',
    },
    token1Address: tokens.BNB,
    token2Address: tokens.FTM,
  },
  {
    // 600
    pid: 4,
    token1: 'FTM',
    token2: 'WETH',
    lpSymbol: 'ETH-FTM',
    lpAddresses: {
      4002: '',
      250: '0xC615a5fd68265D9Ec6eF60805998fa5Bb71972Cb',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.WETH,
  },
  {
    // 600
    pid: 8,
    token1: 'WETH',
    token2: 'WBTC',
    lpSymbol: 'BTC-ETH',
    lpAddresses: {
      4002: '',
      250: '0x1fc954d3484bc21e0ce53a6648a35bbfc03dc9d0',
    },
    token1Address: tokens.WETH,
    token2Address: tokens.WBTC,
  },
  {
    // 600
    pid: 20,
    token1: 'USDC',
    token2: 'BTC',
    lpSymbol: 'BTC-USDC',
    lpAddresses: {
      4002: '',
      250: '0xE2d39F7f0c8517Ca2058Fa97eB3D8d4928F7C6D6',
    },
    token1Address: tokens.USDC,
    token2Address: tokens.WBTC,
  },
  {
    // 600
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
  {
    // 600
    pid: 14,
    token1: 'FTM',
    token2: 'fUSDT',
    lpSymbol: 'FTM-fUSDT',
    lpAddresses: {
      4002: '',
      250: '0xdC24814AD654986928F8E4aec48D37fa30bBC5BB',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.fUSDT,
  },
  {
    // 400
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
  {
    // 200
    pid: 21,
    token1: 'USDC',
    token2: 'DAI',
    lpSymbol: 'DAI-USDC',
    lpAddresses: {
      4002: '',
      250: '0x406de3a93f6b4179e3b21a3d81226b43e1918fd9',
    },
    token1Address: tokens.USDC,
    token2Address: tokens.DAI,
  },
  {
    // 200
    pid: 16,
    token1: 'DAI',
    token2: 'gFUSDT',
    lpSymbol: 'DAI-gFUSDT',
    lpAddresses: {
      4002: '',
      250: '0xe637D90A993EDBD75AC09E9fcB16313D193B9451',
    },
    token1Address: tokens.DAI,
    token2Address: tokens.gFUSDT,
  },
  {
    // 200
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
  {
    // 200
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



    // NEW //



  {
    // 200
    pid: 33,
    token1: 'SEANCE',
    token2: 'TOMB',
    lpSymbol: 'SEANCE-TOMB',
    lpAddresses: {
      4002: '',
      250: '0x75aE2E7B4f3a4b5F9048AD6966f6e975e510aD03',
    },
    token1Address: tokens.SEANCE,
    token2Address: tokens.TOMB,
  },
  {
    // 200
    pid: 34,
    token1: 'SEANCE',
    token2: 'ICE',
    lpSymbol: 'SEANCE-ICE',
    lpAddresses: {
      4002: '',
      250: '0xc0fEd4A6EDef23da7fF766D24F17Ecf454C16D25',
    },
    token1Address: tokens.SEANCE,
    token2Address: tokens.ICE,
  },
  {
    // 200
    pid: 35,
    token1: 'SEANCE',
    token2: 'SPELL',
    lpSymbol: 'SEANCE-SPELL',
    lpAddresses: {
      4002: '',
      250: '0x63A1b4E3f210db7f1d4Ae7d29Bc0BC7F611e713a',
    },
    token1Address: tokens.SEANCE,
    token2Address: tokens.SPELL,
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

export const MatePids = [
  
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

    {
      // 200
      pid: 33,
      token1: 'SEANCE',
      token2: 'TOMB',
      lpSymbol: 'SEANCE-TOMB',
      lpAddresses: {
        4002: '',
        250: '0x75aE2E7B4f3a4b5F9048AD6966f6e975e510aD03',
      },
      token1Address: tokens.SEANCE,
      token2Address: tokens.TOMB,
    },
    {
      // 200
      pid: 34,
      token1: 'SEANCE',
      token2: 'ICE',
      lpSymbol: 'SEANCE-ICE',
      lpAddresses: {
        4002: '',
        250: '0xc0fEd4A6EDef23da7fF766D24F17Ecf454C16D25',
      },
      token1Address: tokens.SEANCE,
      token2Address: tokens.ICE,
    },
    {
      // 200
      pid: 35,
      token1: 'SEANCE',
      token2: 'SPELL',
      lpSymbol: 'SEANCE-SPELL',
      lpAddresses: {
        4002: '',
        250: '0x63A1b4E3f210db7f1d4Ae7d29Bc0BC7F611e713a',
      },
      token1Address: tokens.SEANCE,
      token2Address: tokens.SPELL,
    },
  ]


export const FantiesPids = [

  {
    // 600
    pid: 10,
    token1: 'SEANCE',
    token2: 'FTM',
    lpSymbol: 'SEANCE',
    lpAddresses: {
      4002: '',
      250: '0x8542bEAC34282aFe5Bb6951Eb6DCE0B3783b7faB',
    },
    token1Address: tokens.SEANCE,
    token2Address: tokens.FTM,
  },

  {
    // 1200
    pid: 24,
    token1: 'FTM',
    token2: 'ENCHANT',
    lpSymbol: 'ENCHANT',
    lpAddresses: {
      4002: '',
      250: '0xb4d6ff768f409e4d102bad80f9a8ac105453ccdd',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.ENCHANT,
  },

  {
    // 600
    pid: 13,
    token1: 'FTM',
    token2: 'BTC',
    lpSymbol: 'BITCOIN',
    lpAddresses: {
      4002: '',
      250: '0xecB41D6B5885E75a149EDA173e92267aa271D895',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.WBTC,
  },

  {
    // 600
    pid: 4,
    token1: 'FTM',
    token2: 'WETH',
    lpSymbol: 'WETH',
    lpAddresses: {
      4002: '',
      250: '0xC615a5fd68265D9Ec6eF60805998fa5Bb71972Cb',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.WETH,
  },

  {
    // 600
    pid: 18,
    token1: 'BNB',
    token2: 'FTM',
    lpSymbol: 'BINANCE',
    lpAddresses: {
      4002: '',
      250: '0x52966a12e3211c92909C28603ca3df8465c06c82',
    },
    token1Address: tokens.BNB,
    token2Address: tokens.FTM,
  },

  {
    // 100
    pid: 11,
    token1: 'FTM',
    token2: 'GRIM',
    lpSymbol: 'GRIM',
    lpAddresses: {
      4002: '',
      250: '0x124D8CA33E29D1090a844e4C896DD16A360B1c96',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.GRIM,
  },

  {
    // 100
    pid: 12,
    token1: 'FTM',
    token2: 'REAPER',
    lpSymbol: 'REAPER',
    lpAddresses: {
      4002: '',
      250: '0x7D776489372c8AFC0A1941a1335C9e9f90e0116a',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.REAPER,
  },

  {
    // 600
    pid: 14,
    token1: 'FTM',
    token2: 'fUSDT',
    lpSymbol: 'fUSDT',
    lpAddresses: {
      4002: '',
      250: '0xdC24814AD654986928F8E4aec48D37fa30bBC5BB',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.fUSDT,
  },

  {
    // 600
    pid: 23,
    token1: 'FTM',
    token2: 'DAI',
    lpSymbol: 'DAI',
    lpAddresses: {
      4002: '',
      250: '0xF3d6E8Ecece8647B456d57375Ce0B51B8F0cD40b',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.DAI,
  },

  {
    // 600
    pid: 2,
    token1: 'FTM',
    token2: 'USDC',
    lpSymbol: 'USDC',
    lpAddresses: {
      4002: '',
      250: '0x160653F02b6597E7Db00BA8cA826cf43D2f39556',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.USDC,
  },

  {
    // 400
    pid: 19,
    token1: 'FTM',
    token2: 'MIM',
    lpSymbol: 'MIM',
    lpAddresses: {
      4002: '',
      250: '0x34990FC1e6e3169DCf23624049be29782AFc81bd',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.MIM,
  },

]

export const SeancePids = [

  {
    // 600
    pid: 5,
    token1: 'SOUL',
    token2: 'SEANCE',
    lpSymbol: 'SOUL',
    lpAddresses: {
      4002: '',
      250: '0x8f1E15cD3d5a0bb85B8189d5c6B61BB64398E19b',
    },
    token1Address: tokens.SOUL,
    token2Address: tokens.SEANCE,
  },

  {
    // 600
    pid: 26,
    token1: 'SEANCE',
    token2: 'ENCHANT',
    lpSymbol: 'ENCHANT',
    lpAddresses: {
      4002: '',
      250: '0x5695176d085f8f7320507495066ffec940da244c',
    },
    token1Address: tokens.SEANCE,
    token2Address: tokens.ENCHANT,
  },

  {
    // 600
    pid: 10,
    token1: 'SEANCE',
    token2: 'FTM',
    lpSymbol: 'FANTOM',
    lpAddresses: {
      4002: '',
      250: '0x8542bEAC34282aFe5Bb6951Eb6DCE0B3783b7faB',
    },
    token1Address: tokens.SEANCE,
    token2Address: tokens.FTM,
  },

  {
    // 400
    pid: 27,
    token1: 'SEANCE',
    token2: 'UNIDX',
    lpSymbol: 'UNIDEX',
    lpAddresses: {
      4002: '',
      250: '0x578c7B9A45D9e55246d3036D48db262b9B3CA48e',
    },
    token1Address: tokens.SEANCE,
    token2Address: tokens.UNIDX,
  },

  {
    // 200
    pid: 30,
    token1: 'SEANCE',
    token2: 'SPIRIT',
    lpSymbol: 'SPIRIT',
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
    lpSymbol: 'BOO',
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
    lpSymbol: 'ZOO',
    lpAddresses: {
      4002: '',
      250: '0xa2cFc18F3A41E158DA173be0e4785F017Ff92a6e',
    },
    token1Address: tokens.SEANCE,
    token2Address: tokens.ZOO,
  },
  {
    // 200
    pid: 33,
    token1: 'SEANCE',
    token2: 'TOMB',
    lpSymbol: 'TOMB',
    lpAddresses: {
      4002: '',
      250: '0x75aE2E7B4f3a4b5F9048AD6966f6e975e510aD03',
    },
    token1Address: tokens.SEANCE,
    token2Address: tokens.TOMB,
  },
  {
    // 200
    pid: 34,
    token1: 'SEANCE',
    token2: 'ICE',
    lpSymbol: 'ICE',
    lpAddresses: {
      4002: '',
      250: '0xc0fEd4A6EDef23da7fF766D24F17Ecf454C16D25',
    },
    token1Address: tokens.SEANCE,
    token2Address: tokens.ICE,
  },
  {
    // 200
    pid: 35,
    token1: 'SEANCE',
    token2: 'SPELL',
    lpSymbol: 'SPELL',
    lpAddresses: {
      4002: '',
      250: '0x63A1b4E3f210db7f1d4Ae7d29Bc0BC7F611e713a',
    },
    token1Address: tokens.SEANCE,
    token2Address: tokens.SPELL,
  },
  {
    // 400
    pid: 7,
    token1: 'USDC',
    token2: 'SEANCE',
    lpSymbol: 'USDC',
    lpAddresses: {
      4002: '',
      250: '0x98C678d3C7ebeD4a36B84666700d8b5b5Ddc1f79',
    },
    token1Address: tokens.USDC,
    token2Address: tokens.SEANCE,
  },

]


export const SoulPids = [

  {
    // 600
    pid: 5,
    token1: 'SOUL',
    token2: 'SEANCE',
    lpSymbol: 'SEANCE',
    lpAddresses: {
      4002: '',
      250: '0x8f1E15cD3d5a0bb85B8189d5c6B61BB64398E19b',
    },
    token1Address: tokens.SOUL,
    token2Address: tokens.SEANCE,
  },

  {
    // 1600
    pid: 1,
    token1: 'SOUL',
    token2: 'FTM',
    lpSymbol: 'FANTOM',
    lpAddresses: {
      4002: '0x10c0AFd7C58916C4025d466E11850c7D79219277',
      250: '0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57',
    },
    token1Address: tokens.SOUL,
    token2Address: tokens.FTM,
  },
  {
    // 600
    pid: 22,
    token1: 'USDC',
    token2: 'SOUL',
    lpSymbol: 'USDC',
    lpAddresses: {
      4002: '',
      250: '0xC0A301f1E5E0Fe37a31657e8F60a41b14d01B0Ef',
    },
    token1Address: tokens.USDC,
    token2Address: tokens.SOUL,
  },

  {
    // 600
    pid: 28,
    token1: 'fUSDT',
    token2: 'SOUL',
    lpSymbol: 'fUSDT',
    lpAddresses: {
      4002: '',
      250: '0xE27Cc06a7F34892BC17a5474303b91b2C9F3F21A',
    },
    token1Address: tokens.fUSDT,
    token2Address: tokens.SOUL,
  },

  {
    // 600
    pid: 5,
    token1: 'SOUL',
    token2: 'SEANCE',
    lpSymbol: 'SEANCE',
    lpAddresses: {
      4002: '',
      250: '0x8f1E15cD3d5a0bb85B8189d5c6B61BB64398E19b',
    },
    token1Address: tokens.SOUL,
    token2Address: tokens.SEANCE,
  },

  {
    // 600
    pid: 25,
    token1: 'SOUL',
    token2: 'ENCHANT',
    lpSymbol: 'ENCHANT',
    lpAddresses: {
      4002: '',
      250: '0x9acc8f23680b6d7e295166277e2fb9c88a26cce6',
    },
    token1Address: tokens.SOUL,
    token2Address: tokens.ENCHANT,
  },
]


export const StablePids = [
  {
    // 200
    pid: 16,
    token1: 'DAI',
    token2: 'gFUSDT',
    lpSymbol: 'DAI-gFUSDT',
    lpAddresses: {
      4002: '',
      250: '0xe637D90A993EDBD75AC09E9fcB16313D193B9451',
    },
    token1Address: tokens.DAI,
    token2Address: tokens.gFUSDT,
  },
  {
    // 200
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
  {
    // 200
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

  {
    // 200
    pid: 21,
    token1: 'USDC',
    token2: 'DAI',
    lpSymbol: 'DAI-USDC',
    lpAddresses: {
      4002: '',
      250: '0x406de3a93f6b4179e3b21a3d81226b43e1918fd9',
    },
    token1Address: tokens.USDC,
    token2Address: tokens.DAI,
  },
  
]