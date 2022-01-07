import { useActiveWeb3React, useSoulSummonerContract } from '../../hooks'

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

  // Harvest [LP-Only]
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
  
  // Stake
  const stake = useCallback(
    async (amount: BigNumber) => {
      try {
        return await contract?.enterStaking(amount);
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
    )

    // Unstake
    const unstake = useCallback(
      async (amount: BigNumber) => {
        try {
          return await contract?.leaveStaking(amount);
        } catch (e) {
          console.error(e)
          return e
        }
      },
      [contract]
    )

  // Claim Staking Rewards
  const claimStake = useCallback(
    async (amount: Number) => {
      try {
        return await contract?.leaveStaking(Zero);
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  return { deposit, withdraw, harvest, stake, unstake, claimStake }
}
