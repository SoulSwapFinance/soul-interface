import { useMemo } from 'react'
import { useSingleCallResult } from "state/multicall/hooks"
import { useSoulSummonerContract } from './useContract'

export function useSoulSummonerInfo(contract) {
    const soulPerSecond = useSingleCallResult(contract ? contract : null, 'soulPerSecond')?.result
    const totalAllocPoint = useSingleCallResult(contract ? contract : null, 'totalAllocPoint')?.result
  
    return useMemo(() => ({ soulPerSecond, totalAllocPoint }), [soulPerSecond, totalAllocPoint])
  }
  
  export function useSummonerInfo() {
    return useSoulSummonerInfo(useSoulSummonerContract())
  }
  