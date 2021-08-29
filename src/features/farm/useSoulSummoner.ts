import { useActiveWeb3React } from '../../hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { useCallback } from 'react'
import { useSoulSummonerContract, useTokenContract } from '../../hooks/useContract'

export default function useSoulSummoner() {
  const { account } = useActiveWeb3React()
  const summonerContract = useSoulSummonerContract()

  const fetchSummonerLpTokens = useCallback(
    async (tokenAddress: string) => {
      try {
        // fetch lpToken contract
        const erc20Contract = await useTokenContract(tokenAddress)
        // return total amount of lp tokens locked in summoner contract
        return await erc20Contract?.balanceOf(summonerContract)
      } catch (e) {
        console.log(e)
        alert(e.message)
        return e
      }
    },
    [summonerContract]
  )

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

  // -----------------------
  //  Read Functions
  // -----------------------

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
        const amount = tx?.[0].toString()
        const rewardDebt = tx?.[1].toString()
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
        const tx = await summonerContract?.pendingSoul(pid, account)
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

  return { fetchSummonerLpTokens, deposit, withdraw, poolLength, poolInfo, userInfo, pendingSoul, soulPerSecond, totalAllocPoint }
}
