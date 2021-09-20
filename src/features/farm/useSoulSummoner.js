import { useCallback } from 'react'
import { ethers, BigNumber } from 'ethers'

import { ChainId } from '@soulswap/sdk'
// import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

import { useSoulSummonerContract, usePairContract, useTokenContract } from '../../hooks/useContract'

import { SOUL_SUMMONER_ADDRESS } from '@soulswap/sdk'

import FarmPids from './FarmPids'

function useSoulSummoner(lpToken, token1Address, token2Address) {
  const summonerContract = useSoulSummonerContract()
  const lpTokenContract = usePairContract(lpToken)
  const token1Contract = useTokenContract(token1Address)
  const token2Contract = useTokenContract(token2Address)
  const soulContract = useTokenContract(FarmPids[0].token1Address[4002])
  const fusdContract = useTokenContract(FarmPids[0].token2Address[4002])

  // -----------------------
  //  Staking Funcs
  // -----------------------

  // enterStaking
  const enterStaking = async (amount) => {
    try {
      const result = await summonerContract?.enterStaking(amount)
      return result
    } catch (e) {
      console.log(e)
      alert(e.message)
      return e
    }
  }

  // leaveStaking
  const leaveStaking = async (amount) => {
    try {
      let result = await summonerContract?.leaveStaking(amount)
      return result
    } catch (e) {
      alert(e.message)
      console.log(e)
      return e
    }
  }

  // -----------------------
  //  Interaction Functions
  // -----------------------

  // Deposit
  const deposit = async (pid, amount) => {
    try {
      const result = await summonerContract?.deposit(pid, amount)
      return result
    } catch (e) {
      console.log(e)
      alert(e.message)
      return e
    }
  }

  // Withdraw
  const withdraw = async (pid, amount) => {
    try {
      let result = await summonerContract?.withdraw(pid, amount)
      return result
    } catch (e) {
      alert(e.message)
      console.log(e)
      return e
    }
  }

  // -----------------------
  //  Read Functions
  // ---------------------- -

  // Pool length
  const poolLength = async () => {
    try {
      const result = await summonerContract?.poolLength()
      return result
    } catch (e) {
      console.log(e)
      return e
    }
  }

  // pool info
  const poolInfo = async (pid) => {
    try {
      const result = await summonerContract?.poolInfo(pid)
      const lpTokenUsed = result?.[0].toString()
      const allocPoint = BigNumber.from(result?.[1])
      const lastRewardTime = BigNumber.from(result?.[2])
      const accSoulPerShare = BigNumber.from(result?.[3])
      return [lpTokenUsed, allocPoint, lastRewardTime, accSoulPerShare]
    } catch (e) {
      console.log(e)
      return e
    }
  }

  // user info
  const userInfo = async (pid, account) => {
    try {
      const result = await summonerContract?.userInfo(pid, account)
      const amount = result?.[0].toString()
      const rewardDebt = result?.[1].toString()
      return [amount, rewardDebt]
    } catch (e) {
      console.log(e)
      return e
    }
  }

  // userDelta
  const userDelta = async (pid, account) => {
    try {
      const result = await summonerContract?.userDelta(pid, account)
      return result
    } catch (e) {
      console.log(e)
      return e
    }
  }

  // amount of soul pending for redemption
  const pendingSoul = async (pid, user) => {
    try {
      const result = await summonerContract?.pendingSoul(pid, user)
      return result
    } catch (e) {
      console.log(e)
      return e
    }
  }

  // -----------------------
  //  Fee Fetchers
  // -----------------------

  const dailyDecay = async () => {
    try {
      const result = await summonerContract?.dailyDecay()
      return result
    } catch (e) {
      console.log(e)
      return e
    }
  }

  const getWithdrawable = async (pid, amount, account) => {
    try {
      const timeDelta = await userDelta(pid, account)
      const result = await summonerContract?.getWithdrawable(pid, timeDelta, amount)
      return result
    } catch (e) {
      console.log(e)
      return e
    }
  }

  const getFeePercent = async (pid) => {
    try {
      const result = await summonerContract?.getFeePercent(pid)
      return result
    } catch (e) {
      console.log(e)
      return e
    }
  }

  // -----------------------
  //  User Lp Allocation
  // -----------------------

  /**
   * The amount of tokens the user holds compared to the contract
   * Note : need to make func to calculate how many staked compared to pool
   */
  const fetchUserLpTokenAlloc = async (account) => {
    try {
      const contractBal = await lpTokenContract?.balanceOf(SOUL_SUMMONER_ADDRESS[4002])

      const userBal = await lpTokenContract?.balanceOf(account)

      const alloc = userBal / contractBal
      const allocPerc = alloc * 100

      return [alloc, allocPerc]
    } catch (e) {
      console.log(e)
      alert(e.message)
      return e
    }
  }

  /**
   * The amount of tokens the user holds compared to the contract
   * Note : need to make func to calculate how many staked compared to pool
   */
  const fetchUserLpTokenAllocInFarm = async (pid, account) => {
    try {
      // get how many lpTokens in contract
      const totalSupply = await lpTokenContract?.totalSupply()
      // get how many lpTokens held by Summoner
      const heldBySummoner = await lpTokenContract?.balanceOf(SOUL_SUMMONER_ADDRESS[4002])
      // get how many lpTokens held by user
      const heldByUser = await lpTokenContract?.balanceOf(account)

      // summoner % of total supply
      const summonerPercOfSupply = (heldBySummoner / totalSupply) * 100

      // user unstaked only %s
      const userUnstakedPercOfSupply = (heldByUser / totalSupply) * 100
      const userUnstakedPercOfSummoner = (heldByUser / heldBySummoner) * 100

      // user staked only %s
      const userStakedBal = (await userInfo(pid, account))?.[0]
      console.log('userStakedBal', userStakedBal)
      const userStakedPercOfSupply = (userStakedBal / summonerPercOfSupply) * 100
      const userStakedPercOfSummoner = (userStakedBal / heldBySummoner) * 100
      // console.log('userStakedBal', userStakedBal.toString())
      // console.log('heldBySummoner', heldBySummoner.toString())
      // console.log('userStakedPercOfSummoner', userStakedPercOfSummoner.toString())

      // user staked + unstaked %s
      const netUserLpTokens = userStakedBal + heldByUser
      const netUserPercOfSupply = (netUserLpTokens / totalSupply) * 100
      const netUserPercOfSummoner = (netUserLpTokens / heldBySummoner) * 100

      return [
        summonerPercOfSupply,
        userUnstakedPercOfSupply,
        userUnstakedPercOfSummoner,
        userStakedPercOfSupply,
        userStakedPercOfSummoner,
        netUserPercOfSupply,
        netUserPercOfSummoner,
      ]
    } catch (e) {
      console.log(e)
      alert(e.message)
      return e
    }
  }

  // -----------------------
  //  Liquidity + APR
  // -----------------------

  // soul is emitted per second
  const soulPerSecond = async () => {
    try {
      const sps = await summonerContract?.soulPerSecond()
      return sps
    } catch (e) {
      console.log(e)
      return e
    }
  }

  // total allocation point (net amount of all pools combined)
  const totalAllocPoint = async () => {
    try {
      const totalAlloc = await summonerContract?.totalAllocPoint()
      return totalAlloc
    } catch (e) {
      console.log(e)
      return e
    }
  }

  // const fetchFusdValue = useCallback(async (lpToken) => {
  //   try {
  //     // return total amount of lp tokens locked in summoner contract
  //     const netLpTokens = await lpTokenContract?.balanceOf(SOUL_SUMMONER_ADDRESS[chainId])

  //     // how many ftm tokens held in the lpTokenContract account
  //     const fusdOrFtmAmount = isFusd ? await wftmContract.balanceOf(lpToken) : await fusdContract.balanceOf(lpToken)

  //     return fusdOrFtmAmount
  //   } catch (e) {
  //     console.log(e)
  //     alert(e.message)
  //     return e
  //   }
  // }, [summonerContract])

  /**
   * Value of SOUL in FUSD
   */
  const fusdPerSoul = async () => {
    try {
      const totalSoul = await soulContract.balanceOf(FarmPids[0].lpAddresses[4002])
      const totalFusd = await fusdContract.balanceOf(FarmPids[0].lpAddresses[4002])

      const fusdPerSoul = totalFusd / totalSoul

      return fusdPerSoul
    } catch (e) {
      console.log(e)
      alert(e.message)
      return e
    }
  }

  // ------- FARMS -------

  /**
   * Value of liqudiity of lpToken
   */
  const fetchLiquidityValue = async (token1Name, token2Name) => {
    try {
      const token1Bal = await token1Contract.balanceOf(lpToken)
      const token2Bal = await token2Contract.balanceOf(lpToken)

      let totalLpValue

      // check token1 && token2 name for base pair + fetch toatl value
      if (token1Name === 'FUSD' || token2Name === 'FUSD') {
        totalLpValue =
          (token1Name === 'FUSD'
            ? ethers.utils.formatUnits(token1Bal.toString())
            : ethers.utils.formatUnits(token2Bal.toString())) * 2
      } else if (token1Name === 'WFTM' || token2Name === 'WFTM') {
        totalLpValue =
          (token1Name === 'WFTM'
            ? ethers.utils.formatUnits(token1Bal.toString())
            : ethers.utils.formatUnits(token2Bal.toString())) * 2
      } else if (token1Name === 'SOUL' || token2Name === 'SOUL') {
        const soulPerFusd = await fusdPerSoul()
        totalLpValue =
          (token1Name === 'SOUL'
            ? ethers.utils.formatUnits(token1Bal.toString())
            : ethers.utils.formatUnits(token2Bal.toString())) *
          soulPerFusd *
          2
      }

      // lp tokens held by summoner
      const totalLpTokens = await lpTokenContract?.totalSupply()
      const summonerLpTokens = await lpTokenContract?.balanceOf(SOUL_SUMMONER_ADDRESS[4002])
      const supplyHeldBySummoner = (summonerLpTokens / totalLpTokens) * 100

      // value of lp tokens held by summoner
      const summonerTotalLpValue = supplyHeldBySummoner * totalLpValue

      // console.log('totalLpTokens', totalLpTokens.toString())
      // console.log('summonerLpTokens', summonerLpTokens.toString())
      // console.log('supplyHeldBySummoner', supplyHeldBySummoner.toString())

      // console.log('totalLpValue', totalLpValue.toString())
      // console.log('summonerTotalLpValue', summonerTotalLpValue.toString())

      return [totalLpValue, summonerTotalLpValue]
    } catch (e) {
      console.log(e)
      alert(e.message)
      return e
    }
  }

  /**
   * Fetches the APR percentage for the `pid`
   */
  const fetchAprAndLiquidity = async (pid, token1Name, token2Name, token1Address, token2Address, lpToken) => {
    try {
      const SECONDS_PER_YEAR = 31557600

      // pool weight
      const alloc = await poolInfo(pid)
      const totalAlloc = await totalAllocPoint(pid)
      const poolWeight = alloc?.[1] / totalAlloc
      
      // soul per sec (sps)
      const soulPerSec = await soulPerSecond()
      const formattedSps = ethers.utils.formatUnits(soulPerSec.toString())

      // amount of soul allocated to this pool per year
      const yearlySoulFarmAlloc = SECONDS_PER_YEAR * formattedSps * poolWeight

      // value of lp tokens held by summoner
      const fetchedLiquidity = await fetchLiquidityValue(token1Name, token2Name, token1Address, token2Address, lpToken)

      // farm apr
      const farmApr = yearlySoulFarmAlloc / fetchedLiquidity[1] * 100

      return [farmApr, fetchedLiquidity[0], fetchedLiquidity[1]]
    } catch (e) {
      console.log(e)
      alert(e.message)
      return e
    }
  }

  // ------- STAKING -------

  /**
   * Value of liqudiity of lpToken
   */
   const fetchPid0LiquidityValue = async (lpToken) => {
    try {
      // SOUL held by summoner
      const summonerBal = await lpTokenContract?.balanceOf(SOUL_SUMMONER_ADDRESS[4002]);
      console.log('summonerBal', ethers.utils.formatUnits(summonerBal.toString()))

      // summonerBal * soulPerFusd = TVL
      const soulPerFusd = await fusdPerSoul();
      console.log('soulPerFusd', soulPerFusd)
      
      const totalLpValue = ethers.utils.formatUnits(summonerBal.toString()) * soulPerFusd;
      console.log('totalLpValue', totalLpValue)

      
      return totalLpValue;
    } catch (e) {
      console.log(e);
      alert(e.message);
      return e;
    }
  };

  /**
   * Fetches the APR percentage for the `pid`
   */
  const fetchPid0AprAndLiquidity = async (lpToken) => {
    try {
      // pool weight
      const alloc = await poolInfo(0);
      const totalAlloc = await totalAllocPoint(0);
      const poolWeight = alloc?.[1] / totalAlloc;

      // soul per sec (sps)
      const soulPerSec = await soulPerSecond();
      const formattedSps = ethers.utils.formatUnits(soulPerSec.toString());

      // amount of soul allocated to this pool per year
      const yearlySoulFarmAlloc = formattedSps * 31557600 * poolWeight;

      // value of lp tokens held by summoner
      const fetchedLiquidity = await fetchPid0LiquidityValue(lpToken);

      // farm apr
      const farmApr = yearlySoulFarmAlloc / fetchedLiquidity * 100;

      return [farmApr, fetchedLiquidity];
    } catch (e) {
      console.log(e);
      alert(e.message);
      return e;
    }
  };


  return {
    enterStaking,
    leaveStaking,
    fetchPid0LiquidityValue,
    fetchPid0AprAndLiquidity,

    deposit,
    withdraw,
    poolLength,
    poolInfo,
    userInfo,
    userDelta,
    pendingSoul,
    soulPerSecond,
    totalAllocPoint,

    dailyDecay,
    getWithdrawable,
    getFeePercent,

    fetchUserLpTokenAlloc,
    fetchUserLpTokenAllocInFarm,

    fetchLiquidityValue,
    fetchAprAndLiquidity,
  }
}

export default useSoulSummoner
