import { useSoulSummonerContract, useSoulVaultContract } from '../../hooks'

import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { useCallback } from 'react'

export default function useSummoner() {

  const contract = useSoulSummonerContract()

  // Deposit
  const deposit = useCallback(
    async (pid: number, amount: BigNumber) => {
      try {
        debugger;
        return await contract?.deposit(pid, amount.toString());
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  // Withdraw
  const withdraw = useCallback(
    async (pid: number, amount: BigNumber) => {
      try {
        return await contract?.withdraw(pid, amount);
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  // Harvest
  const harvest = useCallback(
    async (pid: number) => {
      try {
        return await contract?.deposit(pid, Zero);
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  return { deposit, withdraw, harvest }
}
