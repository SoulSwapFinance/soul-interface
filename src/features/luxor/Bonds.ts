import { tokens } from 'features/bond/constants/tokens'

const DAI = '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E'
const LUX = '0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b'
const SOR = '0xEFFd4874AcA3Acd19a24dF3281b5cdAdD823801A'
const FTM = '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83'
const LUX_DAI = '0x46729c2AeeabE7774a0E710867df80a6E19Ef851'
const LUX_FTM = '0x951BBB838e49F7081072895947735b0892cCcbCD'
const LUX_SOR = '0x622E69B6785311800B0d55D72fF27D91F5518212'

export const AllBonds = [
  // 5 DAYS
  {
    pid: 0,
    bondAddress: '0xCf994423b39A6991e82443a8011Bf6749e19434b',
    assetName: 'DAI',
    assetAddress: DAI,
    token1Address: DAI,
    term: '5D',
  },
  {
    pid: 1,
    status: 'closed', // manual override
    bondAddress: '0x13729e99A7b77469f7FD204495a7b49e25e8444a',
    assetName: 'WFTM',
    assetAddress: FTM,
    token1Address: FTM,
    term: '5D',
  },
  {
    pid: 2,
    bondAddress: '0xaC64DC47A1fe52458D3418AC7C568Edc3306130a',
    assetName: 'LUX-DAI',
    assetAddress: LUX_DAI,
    token1Address: LUX,
    token2Address: DAI,
    term: '5D',
  },
  {
    pid: 3,
    bondAddress: '0xaBAD60240f1a39fce0d828eecf54d790FFF92cec',
    assetName: 'LUX-FTM',
    assetAddress: LUX_FTM,
    token1Address: LUX,
    token2Address: FTM,
    term: '5D',
  },

  // 1 WEEK
  {
    pid: 4,
    bondAddress: '0x80C61168e1F02e1835b541e9Ca6Bb3416a36Af6F',
    assetName: 'DAI',
    assetAddress: DAI,
    token1Address: DAI,
    term: '1W',
  },
  {
    pid: 5,
    status: 'closed', // manual override
    bondAddress: '0x376969e00621Ebf685fC3D1F216C00d19B162923',
    assetName: 'WFTM',
    assetAddress: FTM,
    token1Address: FTM,
    term: '1W',
  },
  {
    pid: 6,
    bondAddress: 
    '0x5612d83dfED9B387c925Ac4D19ED3aeDd71004A8',
    assetName: 'LUX-DAI',
    assetAddress: LUX_DAI,
    token1Address: LUX,
    token2Address: DAI,
    term: '1W',
  },
  {
    pid: 7,
    bondAddress: '0x8dF4f6e20C64DA8DAFC8c43E434f2cFda9C3FCAE',
    assetName: 'LUX-FTM',
    assetAddress: LUX_FTM,
    token1Address: LUX,
    token2Address: FTM,
    term: '1W',
  },

  // 2 WEEKS
  {
    pid: 8,
    bondAddress: '0x73eE5Fcd1336246C74f6448B1d528aeacF5404f2',
    assetName: 'DAI',
    assetAddress: DAI,
    token1Address: DAI,
    term: '2W',
  },
  {
    pid: 9,
    status: 'closed',
    bondAddress: '0xc421072646C51FF8983714F28e4253ad8B44bb1E',
    assetName: 'WFTM',
    assetAddress: FTM,
    token1Address: FTM,
    term: '2W',
  },
  {
    pid: 10,
    bondAddress: '0xaFADcDca5Aa1F187B357499f2e3BA94D3Cc32ad1',
    assetName: 'LUX-DAI',
    assetAddress: LUX_DAI,
    token1Address: LUX,
    token2Address: DAI,
    term: '2W',
  },
  {
    pid: 11,
    bondAddress: '0x0A98e728f0537f40e8dC261D633fe4a00E1aFA72',
    assetName: 'LUX-FTM',
    assetAddress: LUX_FTM,
    token1Address: LUX,
    token2Address: FTM,
    term: '2W',
  },

  // 4 WEEKS
  {
    pid: 12,
    bondAddress: '0x1a7bA76b2A421E0E730809C40bE4a685dE29307c',
    assetName: 'DAI',
    assetAddress: DAI,
    token1Address: DAI,
    term: '4W',
  },
  {
    pid: 13,
    status: 'closed',
    bondAddress: '0x89EA4331183730F289DEAfc926cF0541364F169D',
    assetName: 'WFTM',
    assetAddress: FTM,
    token1Address: FTM,
    term: '4W',
  },
  {
    pid: 14,
    bondAddress: '0xAE08cf625d4232935D2F1b331517aC0089163DB2',
    assetName: 'LUX-DAI',
    assetAddress: LUX_DAI,
    token1Address: LUX,
    token2Address: DAI,
    term: '4W',
  },
  {
    pid: 15,
    bondAddress: '0xAbeEd495A87fccc2988F0CdaCf314F23AF52B685',
    assetName: 'LUX-FTM',
    assetAddress: LUX_FTM,
    token1Address: LUX,
    token2Address: FTM,
    term: '4W',
  },
  {
    pid: 16,
    bondAddress: '0xF584E92F891e2BCF78Eb7B49D929eae48c2d8B6A',
    assetName: 'LUX-SOR',
    assetAddress: LUX_SOR,
    token1Address: LUX,
    token2Address: SOR,
    term: '5D',
  },
  {
    pid: 17,
    bondAddress: '0x4Ac427a4DFF61023c2e84d8316180CF109c5e45C',
    assetName: 'SOR',
    assetAddress: SOR,
    token1Address: SOR,
    term: '5D',
  },
  // {
  //   pid: 18,
  //   bondAddress: '0x04b65a392F7f2577C7aa78b4cab3BA6F6FD71336',
  //   assetName: 'WFTM',
  //   assetAddress: FTM,
  //   token1Address: FTM,
  //   term: '5D',
  // },
]
