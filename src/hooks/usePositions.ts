import { useMemo } from 'react'
import { Contract } from '@ethersproject/contracts'
import { useActiveWeb3React } from "services/web3"
import { useSingleCallResult, useSingleContractMultipleData } from "state/multicall/hooks"
import zip from 'lodash/zip'
import { Zero } from '@ethersproject/constants'
import { useSummonerContract } from 'hooks'

export function useSoulPositions(contract?: Contract | null) {
    const { account } = useActiveWeb3React()
  
    const numberOfPools = useSingleCallResult(contract ? contract : null, 'poolLength')?.result
  
    const args = useMemo(() => {
      if (!account || !numberOfPools) {
        return
      }
      // return [...Array(numberOfPools).keys()].map((pid) => [String(pid), String(account)])
      return [...Array(Number(numberOfPools)).keys()].map((pid) => [String(pid), String(account)])
    }, [numberOfPools, account])
  
    const pendingSoul = useSingleContractMultipleData(args ? contract : null, 'pendingSoul', args)
    const userInfo = useSingleContractMultipleData(args ? contract : null, 'userInfo', args)
  
    return useMemo(() => {
      if (!pendingSoul || !userInfo) {
        return []
      }
      return zip(pendingSoul, userInfo)
        .map((data, i) => ({
          id: args[i][0],
          pendingSoul: data[0].result?.[0] || Zero,
          amount: data[1].result?.[0] || Zero,
        }))
        .filter(({ pendingSoul, amount }) => {
          return (pendingSoul && !pendingSoul.isZero()) || (amount && !amount.isZero())
        })
    }, [args, pendingSoul, userInfo])
  }
  
export function usePositions() {
    return useSoulPositions(useSummonerContract())
  }