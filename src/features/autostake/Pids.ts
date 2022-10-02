import { ChainId, SOUL_ADDRESS } from 'sdk'

export const AvalanchePools = [
  {
    // 1000
    pid: 0,
    summonerPid: 0,
    token1: 'SOUL',
    token2: 'SOUL',
    lpSymbol: 'SOUL',
    lpAddress: SOUL_ADDRESS[ChainId.AVALANCHE],
    token1Address: SOUL_ADDRESS[ChainId.AVALANCHE],
    token2Address: SOUL_ADDRESS[ChainId.AVALANCHE]
  },
]


export const FantomPools = [
  {
    // 1000
    pid: 0,
    summonerPid: 0,
    token1: 'SOUL',
    token2: 'SOUL',
    lpSymbol: 'SOUL',
    lpAddress:  SOUL_ADDRESS[ChainId.FANTOM],
    token1Address: SOUL_ADDRESS[ChainId.FANTOM],
    token2Address: SOUL_ADDRESS[ChainId.FANTOM]
  },
]
