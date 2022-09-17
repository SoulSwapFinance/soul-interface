import { ChainId } from "@sushiswap/core-sdk";
import { UNIDX_ADDRESS } from "constants/addresses";
import { SEANCE_ADDRESS, SOUL_ADDRESS } from "sdk";
import { tokens } from "./tokens";

// Base tokens (token1):
// - SOUL

export const SummonerPid0 = [
  {
    pid: 0,
    token1: 'SOUL',
    token2: 'SOUL',
    lpSymbol: 'SOUL-SOUL',
    lpAddresses: {
      4002: '0xCF174A6793FA36A73e8fF18A71bd81C985ef5aB5',
      250: SOUL_ADDRESS[ChainId.FANTOM],
    },
    token1Address: tokens.SOUL,
    token2Address: tokens.SOUL,
  },
]

export const CirclePids = [
  {
    pid: 0,
    token1: 'SEANCE',
    token2: 'WFTM',
    lpSymbol: 'FANTOM',
    lpAddresses: {
      4002: '0xD54Cf31D5653F4a062f5DA4C83170A5867d04442',
      250: SEANCE_ADDRESS[ChainId.FANTOM],
    },
    token1Address: tokens.SEANCE,
    token2Address: tokens.FTM,
    startTime: 1636518600,
    endTime: 1636691400
  },
  {
    pid: 1,
    token1: 'SEANCE',
    token2: 'UNIDX',
    lpSymbol: 'UNIDEX',
    lpAddresses: {
      4002: '0xD54Cf31D5653F4a062f5DA4C83170A5867d04442',
      250: UNIDX_ADDRESS[ChainId.FANTOM],
    },
    token1Address: tokens.SEANCE,
    token2Address: tokens.UNIDX,
    startTime: 1636518600,
    endTime: 1636691400
  },
]
