import { tokens } from 'features/bond/constants/tokens'

const DAI = '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E'
const LUX = '0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b'
const FTM = '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83'
const LUX_DAI = '0x46729c2AeeabE7774a0E710867df80a6E19Ef851'
const LUX_FTM = '0x951BBB838e49F7081072895947735b0892cCcbCD'

export const AllBonds = [
  // 5 DAYS
  {
    pid: 0,
    id: 0,
    bondAddress: '0xCf994423b39A6991e82443a8011Bf6749e19434b',
    assetName: 'DAI',
    assetAddress: DAI,
    token1Address: DAI,
    term: '5D',
  },
  {
    pid: 4,
    id: 3,
    bondAddress: '0x13729e99A7b77469f7FD204495a7b49e25e8444a',
    assetName: 'WFTM',
    assetAddress: FTM,
    token1Address: FTM,
    term: '5D',
  },
  {
    pid: 8,
    id: 6,
    bondAddress: '0xaC64DC47A1fe52458D3418AC7C568Edc3306130a',
    assetName: 'LUX-DAI',
    assetAddress: LUX_DAI,
    token1Address: LUX,
    token2Address: DAI,
    term: '5D',
  },
  {
    pid: 12,
    id: 8,
    bondAddress: '0xaBAD60240f1a39fce0d828eecf54d790FFF92cec',
    assetName: 'LUX-FTM',
    assetAddress: LUX_FTM,
    token1Address: LUX,
    token2Address: FTM,
    term: '5D',
  },

  // 1 WEEK
  {
    pid: 1,
    id: 1,
    bondAddress: '0x80C61168e1F02e1835b541e9Ca6Bb3416a36Af6F',
    assetName: 'DAI',
    assetAddress: DAI,
    token1Address: DAI,
    term: '1W',
  },
  {
    pid: 5,
    id: 4,
    bondAddress: '0x376969e00621Ebf685fC3D1F216C00d19B162923',
    assetName: 'WFTM',
    assetAddress: FTM,
    token1Address: FTM,
    term: '1W',
  },
  {
    pid: 9,
    id: 7,
    bondAddress: 
    '0x5612d83dfED9B387c925Ac4D19ED3aeDd71004A8',
    assetName: 'LUX-DAI',
    assetAddress: LUX_DAI,
    token1Address: LUX,
    token2Address: DAI,
    term: '1W',
  },
  {
    pid: 13,
    id: 9,
    bondAddress: '0x8dF4f6e20C64DA8DAFC8c43E434f2cFda9C3FCAE',
    assetName: 'LUX-FTM',
    assetAddress: LUX_FTM,
    token1Address: LUX,
    token2Address: FTM,
    term: '1W',
  },

  // 2 WEEKS
  {
    pid: 2,
    id: 2,
    bondAddress: '0x73eE5Fcd1336246C74f6448B1d528aeacF5404f2',
    assetName: 'DAI',
    assetAddress: DAI,
    token1Address: DAI,
    term: '2W',
  },
  {
    pid: 6,
    id: 5,
    bondAddress: '0xc421072646C51FF8983714F28e4253ad8B44bb1E',
    assetName: 'WFTM',
    assetAddress: FTM,
    token1Address: FTM,
    term: '2W',
  },
  {
    pid: 10,
    id: 15,
    bondAddress: '0xaFADcDca5Aa1F187B357499f2e3BA94D3Cc32ad1',
    assetName: 'LUX-DAI',
    assetAddress: LUX_DAI,
    token1Address: LUX,
    token2Address: DAI,
    term: '2W',
  },
  {
    pid: 14,
    id: 10,
    bondAddress: '0x0A98e728f0537f40e8dC261D633fe4a00E1aFA72',
    assetName: 'LUX-FTM',
    assetAddress: LUX_FTM,
    token1Address: LUX,
    token2Address: FTM,
    term: '2W',
  },

  // 4 WEEKS (DISCONTINUED)
  // {
  //   pid: 3,
  //   id: 11,
  //   bondAddress: '0x1a7bA76b2A421E0E730809C40bE4a685dE29307c',
  //   assetName: 'DAI',
  //   assetAddress: DAI,
  //   token1Address: DAI,
  //   term: '4W',
  // },
  // {
  //   pid: 7,
  //   id: 12,
  //   bondAddress: '0x89EA4331183730F289DEAfc926cF0541364F169D',
  //   assetName: 'WFTM',
  //   assetAddress: FTM,
  //   token1Address: FTM,
  //   term: '4W',
  // },
  // {
  //   pid: 11,
  //   id: 14,
  //   bondAddress: '0xAE08cf625d4232935D2F1b331517aC0089163DB2',
  //   assetName: 'LUX-DAI',
  //   assetAddress: LUX_DAI,
  //   token1Address: LUX,
  //   token2Address: DAI,
  //   term: '4W',
  // },
  // {
  //   pid: 15,
  //   id: 13,
  //   bondAddress: '0xAbeEd495A87fccc2988F0CdaCf314F23AF52B685',
  //   assetName: 'LUX-FTM',
  //   assetAddress: LUX_FTM,
  //   token1Address: LUX,
  //   token2Address: FTM,
  //   term: '4W',
  // },
]
