import { tokens } from 'features/bond/constants/tokens'

const DAI = '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E'
const LUX = '0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b'
const FTM = '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83'

export const AllBonds = [
  {
    pid: 0,
    token1: 'DAI',
    // token2: 'LUX',
    lpSymbol: 'SOUL',
    lpAddress: '0xe2fb177009ff39f52c0134e8007fa0e4baacbd07',
    token1Address: DAI,
    token2Address: LUX,
  },
  {
    pid: 1,
    token1: 'DAI',
    token2: 'LUX',
    lpSymbol: 'SOUL',
    lpAddress: '0xe2fb177009ff39f52c0134e8007fa0e4baacbd07',
    token1Address: DAI,
    token2Address: LUX,
  },
]
