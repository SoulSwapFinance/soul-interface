import { useActiveWeb3React } from '../../hooks'

import { BigNumber } from '@ethersproject/bignumber'
import { useCallback } from 'react'
import { useSoulSummonerContract } from '../../hooks/useContract'

export default function useSoulSummoner() {
  const { account } = useActiveWeb3React()
  const summonerContract = useSoulSummonerContract()

  // Deposit
  const deposit = useCallback(
    async (pid: number, amount: BigNumber) => {
      try {
        console.log(amount)
        return await summonerContract?.deposit(pid, amount)
      } catch (e) {
        console.log(e)
        alert(e.message)
        return e
      }
    },
    [account, summonerContract]
  )

  // Withdraw
  const withdraw = useCallback(
    async (pid: number, amount: BigNumber) => {
      try {
        let tx = await summonerContract?.withdraw(pid, amount)
        return tx
      } catch (e) {
        alert(e.message)
        console.log(e)
        return e
      }
    },
    [account, summonerContract]
  )

  // Pool length
  const poolLength = useCallback(async () => {
    try {
      const tx = await summonerContract?.poolLength()
      return tx
    } catch (e) {
      console.log(e)
      return e
    }
  }, [account, summonerContract])

  // Pool Info
  const poolInfo = useCallback(
    async (pid: number) => {
      try {
        const tx = await summonerContract?.poolInfo(pid)
        const lpToken = tx?.[0].toString()
        const allocPoint = BigNumber.from(tx?.[1])
        const lastRewardTime = BigNumber.from(tx?.[2])
        const accSoulPerShare = BigNumber.from(tx?.[3])
        return [lpToken, allocPoint, lastRewardTime, accSoulPerShare]
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, summonerContract]
  )

  // User Info
  const userInfo = useCallback(
    async (pid: number) => {
      try {
        const tx = await summonerContract?.userInfo(pid, account)
        const amount = BigNumber.from(tx?.[0])
        const rewardDebt = BigNumber.from(tx?.[1])
        return [amount, rewardDebt]
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, summonerContract]
  )

  // Amount of SOUL pending for redemption
  const pendingSoul = useCallback(
    async (pid: number) => {
      try {
        const tx = BigNumber.from(await summonerContract?.pendingSoul(pid, account))
        return tx
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, summonerContract]
  )

  // How much SOUL is emitted per second
  const soulPerSecond = useCallback(async () => {
    try {
      const tx = BigNumber.from(await summonerContract?.soulPerSecond())
      return tx
    } catch (e) {
      console.log(e)
      return e
    }
  }, [account, summonerContract])

  // Total Allocation Point (net amount of all chains combined)
  const totalAllocPoint = useCallback(async () => {
    try {
      const tx = BigNumber.from(await summonerContract?.totalAllocPoint())
      return tx
    } catch (e) {
      console.log(e)
      return e
    }
  }, [account, summonerContract])

  return { deposit, withdraw, poolLength, poolInfo, userInfo, pendingSoul, soulPerSecond, totalAllocPoint }
}
