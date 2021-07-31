import { useActiveWeb3React } from '../../hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { useCallback } from 'react'
import { useSoulSummonerContract } from '../../hooks/useContract'
import { useTransactionAdder } from '../../state/transactions/hooks'

export default function useSoulSummoner() {
  const { account } = useActiveWeb3React()
  const summonerContract = useSoulSummonerContract()
  const addTransaction = useTransactionAdder()

  // -----------------------
  //  Read Functions
  // -----------------------

  // fetches the user's info of the soul summoner
  const info = useCallback(async () => {
    return await summonerContract?.userInfo(account)
  }, [account, summonerContract])

  // calculates the user's pending rewards
  const userPendingRewards = useCallback(async (pid: number, amount: BigNumber) => {
    await calculateTotalPendingSoulRewards()
    return userPendingRewards
  }, [])

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
    [summonerContract]
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
    [summonerContract]
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
  }, [summonerContract])

  // pool info
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
    [summonerContract]
  )

  // user info
  const userInfo = useCallback(
    async (pid: number) => {
      try {
        const tx = await summonerContract?.userInfo(pid, account)
        const amount = tx?.[0]
        const rewardDebt = tx?.[1]
        return [amount, rewardDebt]
      } catch (e) {
        console.log(e)
        return e
      }
    },
    [account, summonerContract]
  )

  // amount of soul pending for redemption
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

  // soul is emitted per second
  const soulPerSecond = useCallback(async () => {
    try {
      const tx = BigNumber.from(await summonerContract?.soulPerSecond())
      return tx
    } catch (e) {
      console.log(e)
      return e
    }
  }, [summonerContract])

  // total allocation point (net amount of all pools combined)
  const totalAllocPoint = useCallback(async () => {
    try {
      const tx = BigNumber.from(await summonerContract?.totalAllocPoint())
      return tx
    } catch (e) {
      console.log(e)
      return e
    }
  }, [summonerContract])

  return { deposit, withdraw, poolLength, poolInfo, userInfo, pendingSoul, soulPerSecond, totalAllocPoint }
}
function userSharePercOfTotal() {
  throw new Error('Function not implemented.')
}

function calculateTotalPendingSoulRewards() {
  throw new Error('Function not implemented.')
}
