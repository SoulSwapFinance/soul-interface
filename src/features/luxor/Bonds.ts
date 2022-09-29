import { ChainId, DAI_ADDRESS, LUX_ADDRESS, LUX_DAI, LUX_NATIVE, LUX_SOR, SOR_ADDRESS, SOR_FTM, WNATIVE_ADDRESS } from "sdk"

export const AllBonds = [
  // 5 DAYS
  {
    pid: 0,
    bondAddress: '0xCf994423b39A6991e82443a8011Bf6749e19434b',
    assetName: 'DAI',
    assetAddress: DAI_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
    term: '5D',
  },
  {
    pid: 1,
    status: 'closed', // manual override
    bondAddress: '0x13729e99A7b77469f7FD204495a7b49e25e8444a',
    assetName: 'WFTM',
    assetAddress: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    term: '5D',
  },
  {
    pid: 2,
    bondAddress: '0xaC64DC47A1fe52458D3418AC7C568Edc3306130a',
    assetName: 'LUX-DAI',
    assetAddress: LUX_DAI[ChainId.FANTOM],
    token1Address: LUX_ADDRESS[ChainId.FANTOM],
    token2Address: DAI_ADDRESS[ChainId.FANTOM],
    term: '5D',
  },
  {
    pid: 3,
    bondAddress: '0xaBAD60240f1a39fce0d828eecf54d790FFF92cec',
    assetName: 'LUX-FTM',
    assetAddress: LUX_NATIVE[ChainId.FANTOM],
    token1Address: LUX_ADDRESS[ChainId.FANTOM],
    token2Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    term: '5D',
  },

  // 1 WEEK
  {
    pid: 4,
    bondAddress: '0x80C61168e1F02e1835b541e9Ca6Bb3416a36Af6F',
    assetName: 'DAI',
    assetAddress: DAI_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
    term: '1W',
  },
  {
    pid: 5,
    status: 'closed', // manual override
    bondAddress: '0x376969e00621Ebf685fC3D1F216C00d19B162923',
    assetName: 'WFTM',
    assetAddress: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    term: '1W',
  },
  {
    pid: 6,
    bondAddress: '0x5612d83dfED9B387c925Ac4D19ED3aeDd71004A8',
    assetName: 'LUX-DAI',
    assetAddress: LUX_DAI[ChainId.FANTOM],
    token1Address: LUX_ADDRESS[ChainId.FANTOM],
    token2Address: DAI_ADDRESS[ChainId.FANTOM],
    term: '1W',
  },
  {
    pid: 7,
    bondAddress: '0x8dF4f6e20C64DA8DAFC8c43E434f2cFda9C3FCAE',
    assetName: 'LUX-FTM',
    assetAddress: LUX_NATIVE[ChainId.FANTOM],
    token1Address: LUX_ADDRESS[ChainId.FANTOM],
    token2Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    term: '1W',
  },

  // 2 WEEKS
  {
    pid: 8,
    bondAddress: '0x73eE5Fcd1336246C74f6448B1d528aeacF5404f2',
    assetName: 'DAI',
    assetAddress: DAI_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
    term: '2W',
  },
  {
    pid: 9,
    status: 'closed',
    bondAddress: '0xc421072646C51FF8983714F28e4253ad8B44bb1E',
    assetName: 'WFTM',
    assetAddress: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    term: '2W',
  },
  {
    pid: 10,
    bondAddress: '0xaFADcDca5Aa1F187B357499f2e3BA94D3Cc32ad1',
    assetName: 'LUX-DAI',
    assetAddress: LUX_DAI[ChainId.FANTOM],
    token1Address: LUX_ADDRESS[ChainId.FANTOM],
    token2Address: DAI_ADDRESS[ChainId.FANTOM],
    term: '2W',
  },
  {
    pid: 11,
    bondAddress: '0x0A98e728f0537f40e8dC261D633fe4a00E1aFA72',
    assetName: 'LUX-FTM',
    assetAddress: LUX_NATIVE[ChainId.FANTOM],
    token1Address: LUX_ADDRESS[ChainId.FANTOM],
    token2Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    term: '2W',
  },

  // 4 WEEKS
  {
    pid: 12,
    bondAddress: '0x1a7bA76b2A421E0E730809C40bE4a685dE29307c',
    assetName: 'DAI',
    assetAddress: DAI_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
    term: '4W',
  },
  {
    pid: 13,
    status: 'closed',
    bondAddress: '0x89EA4331183730F289DEAfc926cF0541364F169D',
    assetName: 'WFTM',
    assetAddress: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    term: '4W',
  },
  {
    pid: 14,
    bondAddress: '0xAE08cf625d4232935D2F1b331517aC0089163DB2',
    assetName: 'LUX-DAI',
    assetAddress: LUX_DAI[ChainId.FANTOM],
    token1Address: LUX_ADDRESS[ChainId.FANTOM],
    token2Address: DAI_ADDRESS[ChainId.FANTOM],
    term: '4W',
  },
  {
    pid: 15,
    bondAddress: '0xAbeEd495A87fccc2988F0CdaCf314F23AF52B685',
    assetName: 'LUX-FTM',
    assetAddress: LUX_NATIVE[ChainId.FANTOM],
    token1Address: LUX_ADDRESS[ChainId.FANTOM],
    token2Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    term: '4W',
  },

  // 10 DAY | INACTIVE BONDS
  {
    pid: 16,
    bondAddress: '0xDAF7fE4Db56d8D2080bc8FDd4Ca9F60B2931993B',
    assetName: 'LUX-SOR',
    assetAddress: LUX_SOR[ChainId.FANTOM],
    token1Address: LUX_ADDRESS[ChainId.FANTOM],
    token2Address: SOR_ADDRESS[ChainId.FANTOM],
    term: '10D',
  },
  {
    pid: 18,
    status: 'closed', // manual override
    bondAddress: '0x5b76bE108A44169928cFddFCdE549ab6Af194429',
    assetName: 'SOR',
    assetAddress: SOR_ADDRESS[ChainId.FANTOM],
    token1Address: SOR_ADDRESS[ChainId.FANTOM],
    term: '10D',
  },
  {
    pid: 19,
    status: 'closed', // manual override
    bondAddress: '0x48F524CDDDC0E2CaC75E2988bDde773b2F9A0AA9',
    assetName: 'WFTM',
    assetAddress: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    term: '10D',
  },
  {
    pid: 20,
    status: 'closed',
    bondAddress: '0xf9a0fA495e0CfaFE40CAb1bDC307f6Fc24889d51',
    assetName: 'LUX-SOR',
    assetAddress: LUX_SOR[ChainId.FANTOM],
    token1Address: LUX_ADDRESS[ChainId.FANTOM],
    token2Address: SOR_ADDRESS[ChainId.FANTOM],
    term: '10D',
  },
  {
    pid: 21,
    status: 'closed',
    bondAddress: '0xad586E71A6947c6624f3C58b24F7d8d9E2F04a4b',
    assetName: 'SOR-FTM',
    assetAddress: SOR_FTM[ChainId.FANTOM],
    token1Address: SOR_ADDRESS[ChainId.FANTOM],
    token2Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    term: '10D',
    },
      // LUX-SOR BONDS //
  {
    pid: 22,
    bondAddress: '0xF584E92F891e2BCF78Eb7B49D929eae48c2d8B6A',
    status: 'closed',
    assetName: 'LUX-SOR',
    assetAddress: LUX_SOR[ChainId.FANTOM],
    token1Address: LUX_ADDRESS[ChainId.FANTOM],
    token2Address: SOR_ADDRESS[ChainId.FANTOM],
    term: '5D',
  },

  /// LIVE BONDS ///

  // SOR & DAI BONDS //

  {
    pid: 23,
    bondAddress: '0x4Ac427a4DFF61023c2e84d8316180CF109c5e45C',
    assetName: 'SOR',
    assetAddress: SOR_ADDRESS[ChainId.FANTOM],
    token1Address: SOR_ADDRESS[ChainId.FANTOM],
    term: '5D',
  },
  {
    pid: 24,
    bondAddress: '0x26155f6F5e5372dc063042A37C1391e04E71509e',
    assetName: 'DAI',
    assetAddress: DAI_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
    term: '5D',
  },

  // FTM BONDS //
  {
    pid: 25,
    bondAddress: '0x2b4ecB35Aa2a5C163675E1b66577E127C38eb911',
    assetName: 'WFTM',
    assetAddress: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    term: '5D',
  },
  
  // SOR-FTM BONDS //
  {
    pid: 26,
    bondAddress: '0x4b66619b1469b2198A52cA23b181813199a731E5',
    assetName: 'SOR-FTM',
    assetAddress: SOR_FTM[ChainId.FANTOM],
    token1Address: SOR_ADDRESS[ChainId.FANTOM],
    token2Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    term: '5D',
  },

  // LUX-FTM BONDS //
  {
    pid: 27,
    bondAddress: '0x6d9b32219455f42E24159E089aFc8D744819cd23',
    assetName: 'LUX-FTM',
    assetAddress: LUX_NATIVE[ChainId.FANTOM],
    token1Address: LUX_ADDRESS[ChainId.FANTOM],
    token2Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    term: '5D',
  },

]
