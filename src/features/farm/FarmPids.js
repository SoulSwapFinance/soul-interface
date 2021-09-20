import { tokens } from './tokens'

// Base tokens (token1):
// - WFTM
// - FUSD
// - SOUL

export const FarmPids = [
  {
    pid: 1,
    token1: 'SOUL',
    token2: 'FUSD',
    lpSymbol: 'SOUL-FUSD',
    lpAddresses: {
      4002: '0xaf02fd55F297f2a591367F6E33Dc600Ff2Be472A',
    },
    token1Address: tokens.SOUL,
    token2Address: tokens.FUSD,
  },
  {
    pid: 2,
    token1: 'SOUL',
    token2: 'WFTM',
    lpSymbol: 'SOUL-FTM',
    lpAddresses: {
      4002: '0x10c0AFd7C58916C4025d466E11850c7D79219277',
    },
    token1Address: tokens.SOUL,
    token2Address: tokens.WFTM,
  },
  {
    pid: 3,
    token1: 'FTM',
    token2: 'FETH',
    lpSymbol: 'FTM-FETH',
    lpAddresses: {
      4002: '0x5215981e81f0636A5f806fd20A0E0E180d9aaa68',
    },
    token1Address: tokens.WFTM,
    token2Address: tokens.FETH,
  },
  {
    pid: 5,
    token1: "WFTM",
    token2: "FUSD",
    lpSymbol: "FTM-FUSD",
    lpAddresses: {
      4002: "0x3E65778f959fdA459f1759321fefaddb69bdFb12",
    },
    token1Address: tokens.WFTM,
    token2Address: tokens.FUSD,
  },
  // {
  //   pid: 5,
  //   token1: "FTM",
  //   token2: "FBTC",
  //   lpSymbol: "FTM-FBTC",
  //   lpAddresses: {
  //     4002: "0x69532253792c8ce581D1BE2150aF67994fF324e7",
  //   },
  //   token1Address: tokens.WFTM,
  //   token2Address: tokens.FBTC,
  // },
]

export default FarmPids
