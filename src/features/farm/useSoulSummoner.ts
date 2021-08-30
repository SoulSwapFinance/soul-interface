import { useActiveWeb3React } from '../../hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { useCallback } from 'react'
import { useSoulSummonerContract, useTokenContract } from '../../hooks/useContract'

export default function useSoulSummoner(tokenAddress) {
  const { account } = useActiveWeb3React()
  const summonerContract = useSoulSummonerContract()
  const erc20Contract = useTokenContract(tokenAddress)

  const fetchSummonerLpTokens = useCallback(async () => {
    try {
      // return total amount of lp tokens locked in summoner contract
      const result = await erc20Contract?.balanceOf('0xA65DbEA56E1E202bf03dB5f49ba565fb00Bf9288')
      console.log(result)
      return result
    } catch (e) {
      console.log(e)
      alert(e.message)
      return e
    }
  }, [summonerContract])

  // Deposit
  const deposit = useCallback(
    async (pid: number, amount: BigNumber) => {
      try {
        const result = await summonerContract?.deposit(pid, amount)
        return result
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
        let result = await summonerContract?.withdraw(pid, amount)
        return result
      } catch (e) {
        alert(e.message)
        console.log(e)
        return e
      }
    },
    [summonerContract]
  )

  // -----------------------
  //  Read Functions
  // -----------------------

  // Pool length
  const poolLength = useCallback(async () => {
    try {
      const result = await summonerContract?.poolLength()
      return result
    } catch (e) {
      console.log(e)
      return e
    }
  }, [summonerContract])

  // pool info
  const poolInfo = useCallback(
    async (pid: number) => {
      try {
        const result = await summonerContract?.poolInfo(pid)
        const lpToken = result?.[0].toString()
        const allocPoint = BigNumber.from(result?.[1])
        const lastRewardTime = BigNumber.from(result?.[2])
        const accSoulPerShare = BigNumber.from(result?.[3])
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
        const result = await summonerContract?.userInfo(pid, account)
        const amount = result?.[0].toString()
        const rewardDebt = result?.[1].toString()
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
        const result = await summonerContract?.pendingSoul(pid, account)
        return result
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
      const result = BigNumber.from(await summonerContract?.soulPerSecond())
      return result
    } catch (e) {
      console.log(e)
      return e
    }
  }, [summonerContract])

  // total allocation point (net amount of all pools combined)
  const totalAllocPoint = useCallback(async () => {
    try {
      const result = BigNumber.from(await summonerContract?.totalAllocPoint())
      return result
    } catch (e) {
      console.log(e)
      return e
    }
  }, [summonerContract])

  return {
    fetchSummonerLpTokens,
    deposit,
    withdraw,
    poolLength,
    poolInfo,
    userInfo,
    pendingSoul,
    soulPerSecond,
    totalAllocPoint,
  }
}
