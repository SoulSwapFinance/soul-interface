import { useCallback } from 'react'
import { ethers, BigNumber } from 'ethers'
// import { formatNumber } from '../../functions'

import { useActiveWeb3React } from 'services/web3'

import {
  useSoulSummonerContract,
  usePairContract,
  useTokenContract,
} from 'hooks/useContract'

import SUMMONER_HELPER_ADDRESS from 'constants'

import { useCircleStakingContract } from 'features/farm/hooks/useContract'
import { useHelperContract } from 'features/bond/hooks/useContract'
import { SoulSummonerAddress } from 'features/farm/constants'
import { AllPids } from 'features/farm/Pids'
import { useEnchantPrice, useFantomPrice, useSeancePrice, useSoulPrice, useWrappedEthPrice } from 'hooks/getPrices'

// const helperContract = useHelperContract()

function useSoulSummoner(pid, lpToken, token1Address, token2Address) {
  const { account, chainId } = useActiveWeb3React()

  const helperContract = useHelperContract()
  const summonerContract = useSoulSummonerContract()
  const circlesContract = useCircleStakingContract()
  const lpTokenContract = usePairContract(lpToken)
  const token1Contract = useTokenContract(token1Address[chainId])
  const token2Contract = useTokenContract(token2Address[chainId])
  const soulContract = useTokenContract(AllPids[0].token1Address[chainId])
  const fusdContract = useTokenContract(AllPids[0].token2Address[chainId])
  const soulPrice = useSoulPrice()
  const ethPrice = useWrappedEthPrice()
  const ftmPrice = useFantomPrice()
  const seancePrice = useSeancePrice()
  const enchantPrice = useEnchantPrice()
  
  // ----------------------------------------------
  //                  Farm Helper
  // ----------------------------------------------

  const totalPendingRewards = async () => {
    try {
      const result = await helperContract?.totalPending()
      return result
    } catch (e) {
      console.log(e)
      return e
    }
  }

  /**
   * [0] : pidAlloc
   * [1] : totalAlloc
   * [2] : soulPerYear
   */
  const fetchYearlyRewards = async () => {
    try {
      const result = await helperContract?.fetchYearlyRewards(pid)
      const poolWeight = result?.[0] / result?.[1]
      const poolYearlyRewards = poolWeight * result?.[2]
      return poolYearlyRewards
    } catch (e) {
      console.log(e)
      return e
    }
  }

  const fetchStakedBals = async () => {
    try {
      const result = await helperContract?.fetchStakedBals(pid)
      return result
    } catch (e) {
      console.log(e)
      return e
    }
  }

  /**
   * [0] : ftmUsdcTotalFtm
   * [1] : ftmUsdcTotalUsdc
   * [2] : soulFtmTotalSoul
   * [3] : soulFtmTotalFusd
   * [4] : ftmSeanceTotalFtm
   * [5] : ftmSeanceTotalSeance
   * [6] : ftmEnchantTotalFtm
   * [7] : ftmEnchantTotalEnchant
   * [8] : ftmEthTotalFtm
   * [9] : ftmEthTotalEth
   */
  const fetchTokenRateBals = async () => {
    try {

      // console.log(
      //   'usdcPerFtm:',
      //   ftmPrice,
      //   'soulPrice:',
      //   soulPrice,
      //   'seancePrice:',
      //   seancePrice,
      //   'enchantPrice:',
      //   enchantPrice,
      //   'ethPrice:',
      //   ethPrice
      // )

      return [ftmPrice, soulPrice, seancePrice, enchantPrice, ethPrice]
    } catch (e) {
      console.log(e)
      return e
    }
  }

  // /**
  //  * @returns Value of `lpAmount` 
  //  */
  // const fetchLpValue = async (pid, token1Name, token2Name, lpAmount) => {
  //   try {

  //     const result = await helperContract?.fetchPidDetails(pid)

  //     // console.log(token1Name, '/', token2Name, '- result', result)

  //     const lpAmount = await lpTokenContract.balanceOf(account)

  //     const rawPidValue = (lpAmount) / 10 ** 18 // i.e. 0.1 * 100,000 = 10,000

  //     let lpValue;

  //     if (
  //       token1Name === 'USDC' ||
  //       token2Name === 'USDC' ||
  //       token1Name === 'fUSDT' ||
  //       token2Name === 'fUSDT' ||
  //       token1Name === 'gFUSDT' ||
  //       token2Name === 'gFUSDT'
  //     ) {
  //       if (token1Name !== 'DAI') {
  //         lpValue = rawPidValue / 10 ** 6
  //       } else {}
  //     } else if (token1Name === 'FUSD' || token2Name === 'FUSD' || token1Name === 'DAI' || token2Name === 'DAI') {
  //     } else if (token1Name === 'FTM' || token2Name === 'FTM') {
  //       lpValue = rawPidValue * ftmPrice
  //     } else if (token1Name === 'SOUL' || token2Name === 'SOUL') {
  //       lpValue = rawPidValue * soulPrice
  //     } else if (token1Name === 'SEANCE' || token2Name === 'SEANCE') {
  //       lpValue = rawPidValue * seancePrice
  //     } else if (token1Name === 'ENCHANT' || token2Name === 'ENCHANT') {
  //       lpValue = rawPidValue * enchantPrice
  //     } else if (token1Name === 'WETH' || token2Name === 'WETH') {
  //       lpValue = rawPidValue * ethPrice
  //     }
  //   } catch (e) {
  //     console.log(e)
  //     return e
  //   }
  // }

  /**
   * [0] : summonerLpTokens
   * [1] : lpTokenSupply
   * [2] : pidAlloc
   * [3] : totalAlloc
   * [4] : soulPerYear
   * [5] : tvl (token balance)
   */
  const fetchFarmStats = async (pid, token1Name, token2Name) => {
    try {

      const result = await helperContract?.fetchPidDetails(pid)

      // console.log(token1Name, '/', token2Name, '- result', result)

      // ------ TVL ------

      const summonerPidPercOfSupply = result?.[0] / result?.[1] // i.e. 1/10 = 0.1
      const rawPidValue = (summonerPidPercOfSupply * result?.[5]) / 10 ** 18 // i.e. 0.1 * 100,000 = 10,000

      let pidTvl = rawPidValue

      if (
        token1Name === 'USDC' ||
        token2Name === 'USDC' ||
        token1Name === 'fUSDT' ||
        token2Name === 'fUSDT' ||
        token1Name === 'gFUSDT' ||
        token2Name === 'gFUSDT'
      ) {
        if (token1Name !== 'DAI') {
          pidTvl = (summonerPidPercOfSupply * result?.[5]) / 10 ** 6
        } else {}
      } else if (token1Name === 'FUSD' || token2Name === 'FUSD' || token1Name === 'DAI' || token2Name === 'DAI') {
      } else if (token1Name === 'FTM' || token2Name === 'FTM') {
        pidTvl = rawPidValue * ftmPrice
      } else if (token1Name === 'SOUL' || token2Name === 'SOUL') {
        pidTvl = rawPidValue * soulPrice
      } else if (token1Name === 'SEANCE' || token2Name === 'SEANCE') {
        pidTvl = rawPidValue * seancePrice
      } else if (token1Name === 'ENCHANT' || token2Name === 'ENCHANT') {
        pidTvl = rawPidValue * enchantPrice
      } else if (token1Name === 'WETH' || token2Name === 'WETH') {
        pidTvl = rawPidValue * ethPrice
      }

      // ------ APR ------

      // weight * soulPerYear
      const poolWeight = result?.[2] / result?.[3]
      const yearlySoulRewardAlloc = poolWeight * result?.[4]
      const apr = (((yearlySoulRewardAlloc * soulPrice) / pidTvl) * 100) / 10 ** 18

      const fixedPidTvl = Number(pidTvl).toFixed(0)
      const fixedApr = Number(apr).toFixed(0)

      // console.log(token1Name, '/', token2Name, '- summonerPidPercOfSupply', summonerPidPercOfSupply)
      // console.log(token1Name, '/', token2Name, '- tokenBal', Number(result?.[5]) / 10 ** 18)
      // console.log(token1Name, '/', token2Name, '- rawPidValue', rawPidValue)

      // console.log(token1Name, '/', token2Name, '- pidTvl', pidTvl)
      // console.log(token1Name, '/', token2Name, '- fixedPidTvl', fixedPidTvl)
      // console.log(token1Name, '/', token2Name, '- fixedApr', fixedApr)

      return [fixedPidTvl, fixedApr]
    } catch (e) {
      console.log(e)
      return e
    }
  }

  const fetchStakeStats = async () => {
    try {
      // summonerBal, totalSupply
      const result = await helperContract?.fetchPercOfSupply(0)

      // ------ TVL ------

      const pidTvl = (result?.[0] * soulPrice) / 10 ** 18

      // ------ APR ------

      const details = await helperContract?.fetchYearlyRewards(pid)

      // weight * soulPerYear
      const poolWeight = details?.[0] / details?.[1]
      const yearlySoulRewardAlloc = poolWeight * details?.[2]
      const apr = (((yearlySoulRewardAlloc * soulPrice) / pidTvl) * 100) / 10 ** 18

      const fixedPidTvl = Number(pidTvl).toFixed(0)
      const fixedApr = Number(apr).toFixed(0)

      console.log('SOUL', '- fixedPidTvl', fixedPidTvl)
      console.log('SOUL', '- fixedApr', fixedApr)

      return [fixedPidTvl, fixedApr]
    } catch (e) {
      console.log(e)
      return e
    }
  }

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
      // alert(e.message)
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
      // alert(e.message)
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

  // pool info:
  // [0] lpTokenUsed,
  // [1] allocPoint,
  // [2] lastRewardTime,
  // [3] accSoulPerShare
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

  // user info:
  // [0] amount,
  // [1] rewardDebt,
  // [2] rewardDebtAtTime
  // [3] lastWithdrawTime,
  // [4] firstDepositTime,
  // [5] timeDelta,
  // [6] lastDepositTime
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
      const timeDelta = await userDelta(pid, account)
      const result = await summonerContract?.getFeeRate(pid, timeDelta)
      return result
    } catch (e) {
      console.log(e)
      return e
    }
  }

  // -----------------------
  //  User LP Allocation
  // -----------------------

  /**
   * The amount of tokens the user holds compared to the contract
   * Note : need to make func to calculate how many staked compared to pool
   */
  const fetchUserLpTokenAlloc = async (account) => {
    try {
      const contractBal = await lpTokenContract?.balanceOf(SoulSummonerAddress)
      const userBal = await lpTokenContract?.balanceOf(account)

      const alloc = userBal / contractBal
      const allocPerc = alloc * 100

      return [alloc, allocPerc]
    } catch (e) {
      console.log(e)
      // alert(e.message)
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
      const heldBySummoner = await lpTokenContract?.balanceOf(SoulSummonerAddress)

      // get how many lpTokens held by user
      const heldByUser = await lpTokenContract?.balanceOf(account)

      // summoner % of total supply
      const summonerPercOfSupply = (heldBySummoner / totalSupply) * 100

      // user unstaked only %s
      const userUnstakedPercOfSupply = (heldByUser / totalSupply) * 100
      const userUnstakedPercOfSummoner = (heldByUser / heldBySummoner) * 100

      // user staked only %s
      const userStakedBal = (await userInfo(pid, account))?.[0]
      const userStakedPercOfSupply = (userStakedBal / summonerPercOfSupply) * 100
      const userStakedPercOfSummoner = (userStakedBal / heldBySummoner) * 100

      // user staked + unstaked %s
      const netUserLpTokens = userStakedBal + heldByUser
      const netUserPercOfSupply = (netUserLpTokens / totalSupply) * 100
      const netUserPercOfSummoner = (netUserLpTokens / heldBySummoner) * 100

      // console.log('userStakedBal', userStakedBal.toString())
      // console.log('heldBySummoner', heldBySummoner.toString())
      // console.log('userStakedPercOfSummoner', userStakedPercOfSummoner.toString())

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
      // alert(e.message)
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
  
  /**
   * Value of SOUL in FUSD
   */
  const fusdPerSoul = async () => {
    try {
      const totalSoul = await soulContract.balanceOf(AllPids[0].lpAddresses[chainId])
      const totalFusd = await fusdContract.balanceOf(AllPids[3].lpAddresses[chainId])

      const fusdPerSoul = totalFusd / totalSoul

      return fusdPerSoul
    } catch (e) {
      console.log(e)
      // alert(e.message)
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

      // check token1 && token2 name for base pair + fetch total value
      if (token1Name === 'FUSD' || token2Name === 'FUSD') {
        totalLpValue = token1Name === 'FUSD' ? ethers.utils.formatUnits(token1Bal) : ethers.utils.formatUnits(token2Bal)
      } else if (token1Name === 'FTM' || token2Name === 'FTM') {
        totalLpValue =
          token1Name === 'FTM' ? ethers.utils.formatUnits(token1Bal) : ethers.utils.formatUnits(token2Bal.mul(2))
      } else if (token1Name === 'SOUL' || token2Name === 'SOUL') {
        totalLpValue =
          token1Name === 'SOUL'
            ? ethers.utils.formatUnits(token1Bal)
            : ethers.utils.formatUnits(token2Bal.mul(soulPrice).mul(2))
      }

      // lp tokens held by summoner
      const totalLpTokens = await lpTokenContract?.totalSupply()
      const summonerLpTokens = await lpTokenContract?.balanceOf(SoulSummonerAddress)
      const supplyHeldBySummoner = summonerLpTokens / totalLpTokens

      // value of lp tokens held by summoner
      const summonerTotalLpValue = supplyHeldBySummoner * (totalLpValue * 2)

      // console.log('totalLpTokens', totalLpTokens.toString())
      // console.log('summonerLpTokens', summonerLpTokens.toString())
      // console.log('supplyHeldBySummoner', supplyHeldBySummoner.toString())

      // console.log('totalLpValue', totalLpValue.toString())
      // console.log('summonerTotalLpValue', summonerTotalLpValue.toString())

      return [totalLpValue, summonerTotalLpValue]
    } catch (e) {
      console.log(e)
      // alert(e.message)
      return e
    }
  }

  /**
   * Fetches the APR percentage for the `pid`
   */
  const fetchAprAndLiquidity = async (pid, token1Name, token2Name, token1Address, token2Address, lpToken) => {
    try {
      // pool weight
      const alloc = await poolInfo(pid)
      const totalAlloc = await totalAllocPoint()
      const poolWeight = alloc?.[1] / totalAlloc

      // soul per sec (sps)
      const soulPerSec = await soulPerSecond()
      const formattedSps = ethers.utils.formatUnits(soulPerSec)

      // amount of soul allocated && allocated to this pool per year
      const secPerYear = BigNumber.from(31_536_000)
      const yearlySoul = secPerYear.mul(formattedSps)
      const yearlySoulFarmAlloc = secPerYear.mul(formattedSps).mul(poolWeight)

      // value of lp tokens held by summoner
      const fetchedLiquidity = await fetchLiquidityValue(token1Name, token2Name)

      // farm apr
      const farmApr = yearlySoulFarmAlloc.div(fetchedLiquidity[1])

      return [farmApr, fetchedLiquidity[0], fetchedLiquidity[1]]
    } catch (e) {
      console.log(e)
      // alert(e.message)
      return e
    }
  }

  // ------- STAKING -------

  /**
   * Value of liqudity of lpToken
   */
  const fetchPid0LiquidityValue = async (lpToken) => {
    try {
      // SOUL held by summoner
      const rawSummonerBal = await lpTokenContract?.balanceOf(SoulSummonerAddress)
      const summonerBalance = BigNumber.from(ethers.utils.formatUnits(rawSummonerBal))
      console.log('summonerBalance', ethers.utils.formatUnits(summonerBalance))

      // summonerBal * soulPrice = TVL

      // console.log('soulPrice', soulPrice)

      const totalLpValue = summonerBalance.mul(soulPrice)
      console.log('totalLpValue', totalLpValue)

      return totalLpValue
    } catch (e) {
      console.log(e)
      // alert(e.message);
      return e
    }
  }

  /**
   * Fetches the APR percentage for the `pid`
   */
  const fetchPid0AprAndLiquidity = async (lpToken) => {
    try {
      // pool weight
      const alloc = await poolInfo(0)
      const totalAlloc = await totalAllocPoint()
      const poolWeight = alloc?.[1].div(totalAlloc)

      // soul per sec (sps)
      const soulPerSec = await soulPerSecond()
      const formattedSps = BigNumber.from(ethers.utils.formatUnits(soulPerSec))
      const secPerYear = BigNumber.from(ethers.utils.formatUnits(31_536_000))

      // amount of soul allocated to this pool per year
      const yearlySoulFarmAlloc = formattedSps.mul(secPerYear).mul(poolWeight)

      // value of lp tokens held by summoner
      const fetchedLiquidity = await fetchPid0LiquidityValue(lpToken)

      // farm apr
      const farmApr = yearlySoulFarmAlloc.div(fetchedLiquidity)

      return [farmApr, fetchedLiquidity]
    } catch (e) {
      console.log(e)
      // alert(e.message);
      return e
    }
  }

  // Circle Staking

  /**
   * [0] : reward token
   * [1] : rewards per second
   * [2] : token precision
   * [3] : seance staked
   * [4] : last reward time
   * [5] : accRewardPerShare
   * [6] : end time
   * [7] : start time
   * [8] : user limit end time
   * [9] : dao address
   */
  const circlePoolInfo = async (pid) => {
    try {
      const result = await circlesContract?.poolInfo(pid)
      return result
    } catch (e) {
      console.error(e)
      return e
    }
  }

  // [0] : amount
  // [1] : rewardDebt
  const circleUserInfo = async (pid) => {
    try {
      const result = await circlesContract?.userInfo(pid, account)
      return result
    } catch (e) {
      console.error(e)
      return e
    }
  }

  const circlePendingRewards = async (pid) => {
    try {
      const result = await circlesContract?.pendingReward(pid, account)
      return result
    } catch (e) {
      console.error(e)
      return e
    }
  }

  const circleDeposit = async (pid, amount) => {
    try {
      const result = await circlesContract?.deposit(pid, amount)
      return result
    } catch (e) {
      console.error(e)
      return e
    }
  }

  const circleWithdraw = async (pid, amount) => {
    try {
      let result = await circlesContract?.withdraw(pid, amount)
      return result
    } catch (e) {
      console.error(e)
      return e
    }
  }

  return {
    // helper contract
    totalPendingRewards,
    fetchYearlyRewards,
    fetchStakedBals,
    fetchTokenRateBals,
    fetchFarmStats,
    fetchStakeStats,

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

    // circle staking
    circlePoolInfo,
    circleUserInfo,
    circleDeposit,
    circleWithdraw,
    circlePendingRewards,
  }
}

export default useSoulSummoner
