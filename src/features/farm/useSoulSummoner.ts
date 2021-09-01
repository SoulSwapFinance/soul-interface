import { useActiveWeb3React } from '../../hooks'
import { BigNumber } from 'ethers'
import { useCallback } from 'react'
import {
  useSoulSummonerContract,
  usePairContract,
  useTokenContract,
  useSoulContract,
  useMulticallContract,
} from '../../hooks/useContract'
import { SOUL_ADDRESS } from '@soulswap/sdk'

export default function useSoulSummoner(tokenAddress?) {
  const { account } = useActiveWeb3React()
  const summonerContract = useSoulSummonerContract()

  const lpTokenContract = usePairContract(tokenAddress)

  const wftmContract = useTokenContract('0xf1277d1ed8ad466beddf92ef448a132661956621')
  const fusdContract = useTokenContract('0x306557358e20aea124b16a548597897858d13cb2')
  const soulContract = useSoulContract()

  // const multicallContract = useMulticallContract()

  const fetchTvlWithWftm = useCallback(async () => {
    try {
      // return total amount of lp tokens locked in summoner contract
      const netLpTokens = await lpTokenContract?.balanceOf('0xA65DbEA56E1E202bf03dB5f49ba565fb00Bf9288')

      // how many ftm tokens held in the lpTokenContract address
      const netLpValue = await wftmContract.balanceOf(tokenAddress).times(BigNumber.from(2))

      console.log(netLpValue)
      return netLpValue
    } catch (e) {
      console.log(e)
      alert(e.message)
      return e
    }
  }, [summonerContract])

  const fetchTvlWithFusd = useCallback(async () => {
    try {
      // return total amount of lp tokens locked in summoner contract
      const netLpTokens = await lpTokenContract?.balanceOf('0xA65DbEA56E1E202bf03dB5f49ba565fb00Bf9288')

      // how many ftm tokens held in the lpTokenContract address
      const netLpValue = await fusdContract.balanceOf(tokenAddress).times(BigNumber.from(2))

      console.log(netLpValue)
      return netLpValue
    } catch (e) {
      console.log(e)
      alert(e.message)
      return e
    }
  }, [summonerContract])
  
  const fetchTvlWithSoul = useCallback(async () => {
    try {
      // return total amount of lp tokens locked in summoner contract
      const netLpTokens = await lpTokenContract?.balanceOf('0xA65DbEA56E1E202bf03dB5f49ba565fb00Bf9288')

      // how many ftm tokens held in the lpTokenContract address
      const netLpValue = await soulContract.balanceOf(tokenAddress).times(BigNumber.from(2))

      console.log(netLpValue)
      return netLpValue
    } catch (e) {
      console.log(e)
      alert(e.message)
      return e
    }
  }, [summonerContract])

  const fetchSummonerLpTokens = useCallback(async () => {
    try {
      // return total amount of lp tokens locked in summoner contract
      const result = await lpTokenContract?.balanceOf('0xA65DbEA56E1E202bf03dB5f49ba565fb00Bf9288')
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
        const lpTokenContract = result?.[0].toString()
        const allocPoint = BigNumber.from(result?.[1])
        const lastRewardTime = BigNumber.from(result?.[2])
        const accSoulPerShare = BigNumber.from(result?.[3])
        return [lpTokenContract, allocPoint, lastRewardTime, accSoulPerShare]
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
    fetchTvlWithWftm,
    fetchTvlWithFusd,
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
