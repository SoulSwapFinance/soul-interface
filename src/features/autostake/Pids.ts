import { tokens } from 'features/bond/constants/tokens'
import { SOUL_ADDRESS } from 'sdk'

export const AllPids = [
  {
    // 1000
    pid: 0,
    summonerPid: 0,
    token1: 'SOUL',
    token2: 'SOUL',
    lpSymbol: 'SOUL',
    lpAddresses: {
      250: SOUL_ADDRESS[250],
    },
    token1Address: tokens.SOUL,
    token2Address: tokens.SOUL,
  },
]
