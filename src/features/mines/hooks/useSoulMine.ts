import { ethers, BigNumber } from 'ethers'
import { useActiveWeb3React } from 'services/web3'

import {
  useHelperContract,
  usePriceHelperContract,
  usePairContract,
  useTokenContract,
  useSummonerContract,
} from 'hooks/useContract'

import { SUMMONER_ADDRESS } from 'sdk'

import { useFantomPrice, useSeancePrice, useSoulPrice, useWrappedEthPrice } from 'hooks/getPrices'

// const helperContract = useHelperContract()

function useSoulMine(pid, lpToken, token1Address, token2Address) {
  const { account, chainId } = useActiveWeb3React()
  
  // const farmHelperContract = useHelperContract()
  const helperContract = useHelperContract()
  const priceHelperContract = usePriceHelperContract()
  const summonerContract = useSummonerContract()
  const lpTokenContract = usePairContract(lpToken)
  const token1Contract = useTokenContract(token1Address[chainId])
  const token2Contract = useTokenContract(token2Address[chainId])

  const soulPrice = useSoulPrice()
  const ethPrice = useWrappedEthPrice()
  const ftmPrice = useFantomPrice()
  const seancePrice = useSeancePrice()

  // ----------------------------------------------
  //                  Bond Helper
  // ----------------------------------------------

  const totalPendingRewards = async () => {
    try {
      const result = await helperContract?.totalPending()
      return result
    } catch (e) {
      // console.log(e)
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
      // console.log(e)
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

  const fetchStakedValue = async (pid, address) => {
    try {
      const usdcValue = await priceHelperContract?.usdcValue([pid, address])
      // [1] get ttl supply of lp token = usdcPrice per LP
      // [2] multiply usdcPrice per LP [1] by stakedAmount
      const stakedValue = usdcValue 
      return stakedValue
    } catch (e) {
      // console.log(e)
      return e
    }
  }

  /**
   * Fetches the LP value of a user
   * 
   * [0] : summonerLpTokens
   * [1] : lpTokenSupply
   * [2] : pidAlloc
   * [3] : totalAlloc
   * [4] : soulPerYear
   * [5] : tvl (token balance)
   */
   const fetchUserLpValue = async (pid, token1Name, token2Name, lpAmount) => {
    try {
      const result = await helperContract?.fetchPidDetails(pid)

      // ------ TVL ------

      const userPercOfSupply = lpAmount / result?.[1] // i.e, 10 / 100 = 0.1
      const rawPidValue = (userPercOfSupply * result?.[5]) / 10 ** 18 // i.e. 0.1 * 100,000 = 10,000

      let lpValue = rawPidValue

      if (
        token1Name === 'USDC' ||
        token2Name === 'USDC' ||
        token1Name === 'USDT' ||
        token2Name === 'USDT' ||
        token1Name === 'gFUSDT' ||
        token2Name === 'gFUSDT'
      ) {
        if (token1Name !== 'DAI') {
          lpValue = (userPercOfSupply * result?.[5]) / 10 ** 6
        } else {}
      } else if (token1Name === 'FUSD' || token2Name === 'FUSD' || token1Name === 'DAI' || token2Name === 'DAI') {
      } else if (token1Name === 'FTM' || token2Name === 'FTM') {
        lpValue = rawPidValue * ftmPrice
      } else if (token1Name === 'SOUL' || token2Name === 'SOUL') {
        lpValue = rawPidValue * soulPrice
      } else if (token1Name === 'SEANCE' || token2Name === 'SEANCE') {
        lpValue = rawPidValue * seancePrice
      } else if (token1Name === 'WETH' || token2Name === 'WETH') {
        lpValue = rawPidValue * ethPrice
      }

      return lpValue
    } catch (e) {
      console.log(e)
      return e
    }
  }

  /**
   * Fetches the TVL + APR for each pool
   * 
   * [0] : summonerLpTokens
   * [1] : lpTokenSupply
   * [2] : pidAlloc
   * [3] : totalAlloc
   * [4] : soulPerYear
   * [5] : tvl (token balance)
   */
  const fetchMineStats = async (pid, token1Name, token2Name) => {
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
        token1Name === 'USDT' ||
        token2Name === 'USDT' ||
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

      return [fixedPidTvl, fixedApr]
    } catch (e) {
      // console.log(e)
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

      // console.log('SOUL', '- fixedPidTvl', fixedPidTvl)
      // console.log('SOUL', '- fixedApr', fixedApr)

      return [fixedPidTvl, fixedApr]
    } catch (e) {
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
  const mint = async (pid) => {
    try {
      let result = await summonerContract?.bond(pid)
      return result
    } catch (e) {
      alert(e.message)
      console.log(e)
      return e
    }
  }

  // -----------------------
  //  Read Functions
  // -----------------------

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
  // [0] lpToken,
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
  // [2] depositTime,
  // [3] lastDepositTime,
  const userInfo = async (pid, account) => {
    try {
      const result = await summonerContract?.userInfo(pid, account)
      // console.log('userInfoResult:', result)
      const amount = result?.[0].toString()
      const rewardDebt = result?.[1].toString()
      // console.log(amount, 'lp deposited')
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
      const soulAmount = await summonerContract?.pendingSoul(pid, user)
      // console.log('soulAmount', soulAmount, 'soulprice', soulPrice)
      return [soulAmount, soulPrice]
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
      const contractBal = await lpTokenContract?.balanceOf(SUMMONER_ADDRESS[chainId])
      const userBal = await lpTokenContract?.balanceOf(account)

      const alloc = userBal / contractBal
      const allocPerc = alloc * 100

      return [alloc, allocPerc]
    } catch (e) {
      // console.log(e)
      // alert(e.message)
      return e
    }
  }

  /**
   * The amount of tokens the user holds compared to the contract
   * Note : need to make func to calculate how many staked compared to pool
   */
  const fetchUserLpTokenAllocInBond = async (pid, account) => {
    try {
      // get how many lpTokens in contract
      const totalSupply = await lpTokenContract?.totalSupply()

      // get how many lpTokens held by Summoner
      const heldBySummoner = await lpTokenContract?.balanceOf(SUMMONER_ADDRESS[chainId])

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

  // price per LP
  const usdcPrice = async (pid, address) => {
    try {
      const price = await priceHelperContract?.usdcPrice(pid, address)
      return price
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
  //     const netLpTokens = await lpTokenContract?.balanceOf(SUMMONER_ADDRESS[chainId][chainId])

  //     // how many ftm tokens held in the lpTokenContract account
  //     const fusdOrFtmAmount = isFusd ? await wftmContract.balanceOf(lpToken) : await fusdContract.balanceOf(lpToken)

  //     return fusdOrFtmAmount
  //   } catch (e) {
  //     console.log(e)
  //     alert(e.message)
  //     return e
  //   }
  // }, [summonerContract])

  // ------- BONDS -------

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
      } else if (token1Name === 'FTM' || token2Name === 'FTM' || token1Name === 'WFTM' || token2Name === 'WFTM') {
        totalLpValue =
          (token1Name === 'FTM' || token1Name === 'WFTM') ? ethers.utils.formatUnits(token1Bal) : ethers.utils.formatUnits(token2Bal.mul(2))
      } else if (token1Name === 'SOUL' || token2Name === 'SOUL') {
        totalLpValue =
          token1Name === 'SOUL'
            ? ethers.utils.formatUnits(token1Bal)
            : ethers.utils.formatUnits(token2Bal.mul(soulPrice).mul(2))
      }

      // lp tokens held by summoner
      const totalLpTokens = await lpTokenContract?.totalSupply()
      const summonerLpTokens = await lpTokenContract?.balanceOf(SUMMONER_ADDRESS[chainId])
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
      // console.log(e)
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
      const yearlySoulBondAlloc = secPerYear.mul(formattedSps).mul(poolWeight)

      // value of lp tokens held by summoner
      const fetchedLiquidity = await fetchLiquidityValue(token1Name, token2Name)

      // farm apr
      const farmApr = yearlySoulBondAlloc.div(fetchedLiquidity[1])

      return [farmApr, fetchedLiquidity[0], fetchedLiquidity[1]]
    } catch (e) {
      // console.log(e)
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
      const rawSummonerBal = await lpTokenContract?.balanceOf(SUMMONER_ADDRESS[chainId])
      const summonerBalance = BigNumber.from(ethers.utils.formatUnits(rawSummonerBal))
      // console.log('summonerBalance', ethers.utils.formatUnits(summonerBalance))

      // summonerBal * soulPrice = TVL

      const totalLpValue = summonerBalance.mul(soulPrice)
      // console.log('totalLpValue', totalLpValue)

      return totalLpValue
    } catch (e) {
      console.log(e)
      // alert(e.message);
      return e
    }
  }

  /**
   * Soul Price
   */
  // const fetchSoulPrice = async () => {
  //   try {
  //     // summonerBal * soulPrice = TVL
  //     const soulPrice = useSoulPrice()
  //     // console.log('soulPrice', soulPrice)

  //     return soulPrice
  //   } catch (e) {
  //     console.log(e)
  //     // alert(e.message);
  //     return e
  //   }
  // }

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
      const yearlySoulBondAlloc = formattedSps.mul(secPerYear).mul(poolWeight)

      // value of lp tokens held by summoner
      const fetchedLiquidity = await fetchPid0LiquidityValue(lpToken)

      // farm apr
      const farmApr = yearlySoulBondAlloc.div(fetchedLiquidity)

      return [farmApr, fetchedLiquidity]
    } catch (e) {
      // console.log(e)
      // alert(e.message);
      return e
    }
  }

  return {
    // helper contract
    totalPendingRewards,
    fetchYearlyRewards,
    fetchStakedBals,
    fetchStakedValue,
    fetchMineStats,
    fetchStakeStats,
    
    fetchPid0LiquidityValue,
    fetchPid0AprAndLiquidity,
    
    // value fetcher
    fetchUserLpValue,

    deposit,
    mint,
    poolLength,
    poolInfo,
    userInfo,
    userDelta,
    pendingSoul,
    soulPerSecond,
    totalAllocPoint,
    usdcPrice,

    fetchUserLpTokenAlloc,
    fetchUserLpTokenAllocInBond,

    fetchLiquidityValue,
    fetchAprAndLiquidity,
  }
}

export default useSoulMine
