import { useCallback } from 'react'
import { ethers, BigNumber } from 'ethers'
// import { formatNumber } from '../../functions'

import {
  usePriceHelperContract,
  useBondHelperContract,
  useSoulBondContract,
  usePairContract,
} from 'features/bond/hooks/useContract'

import { SoulBondAddress, BOND_HELPER_ADDRESS as BondHelperAddress } from 'features/bond/constants'

import { useActiveWeb3React } from 'services/web3'
import { useFantomPrice, useSeancePrice, useSoulPrice, useWrappedEthPrice } from 'hooks/getPrices'
import { useAutoStakeContract } from 'hooks/useContract'

// const helperContract = useHelperContract()

function useAutoStake(pid, stakeToken) {
  const { account } = useActiveWeb3React()
  
  const helperContract = useBondHelperContract()
  const priceHelperContract = usePriceHelperContract()
  const bondContract = useSoulBondContract()
  const stakeContract = useAutoStakeContract()
  const lpTokenContract = usePairContract(stakeToken)

  const soulPrice = useSoulPrice()
  const seancePrice = useSeancePrice()
  const ftmPrice = useFantomPrice()
  const ethPrice = useWrappedEthPrice()

  function soulFromShares(shares: BigNumber, sharePrice: BigNumber) {
    const DECIMALS = BigNumber.from(10).pow(18)
    return shares.mul(sharePrice).div(DECIMALS)
  }
  
  function sharesFromSoul(amount: BigNumber, sharePrice: BigNumber) {
    const DECIMALS = BigNumber.from(10).pow(18)
    return amount.mul(DECIMALS).div(sharePrice)
  }
  // ----------------------------------------------
  //                  Bond Helper
  // ----------------------------------------------

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

  const fetchStakedValue = async (pid, address) => {
    try {
      const usdcValue = await priceHelperContract?.usdcValue([pid, address])
      // [1] get ttl supply of lp token = usdcPrice per LP
      // [2] multiply usdcPrice per LP [1] by stakedAmount
      const stakedValue = usdcValue 
      return stakedValue
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
  const fetchStakeStats = async (pid, token1Name, token2Name) => {
    try {
      const result = await helperContract?.fetchPidDetails(pid)

      // console.log(token1Name, '/', token2Name, '- result', result)

      // ------ TVL ------

      const summonerPidPercOfSupply = result?.[0] / result?.[1] // i.e. 1/10 = 0.1
      const rawPidValue = (summonerPidPercOfSupply * result?.[5]) / 10 ** 18 // i.e. 0.1 * 100,000 = 10,000

      const pidTvl = rawPidValue * soulPrice
     
      // ------ APR ------

      // weight * soulPerYear
      const poolWeight = result?.[2] / result?.[3]
      const yearlySoulRewardAlloc = poolWeight * result?.[4]
      const apr = (((yearlySoulRewardAlloc * soulPrice) / pidTvl) * 100) / 10 ** 18

      const fixedPidTvl = Number(pidTvl).toFixed(0)
      const fixedApr = Number(apr).toFixed(0)
      
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
const deposit =
  async (amount: BigNumber) => {
    try {
      let tx

      tx = await stakeContract?.deposit(account, amount, {
        /*gasLimit: 500000*/
      })

      return tx
    } catch (e) {
      console.error(e)
      return e
    }
  }

// Withdraw
const withdraw =
  async (amount: BigNumber, sharePrice: BigNumber) => {
    try {
      let tx
      let shares = sharesFromSoul(amount, sharePrice)

      tx = await stakeContract?.withdraw(shares, {
        /*gasLimit: 500000*/
      })

      return tx
    } catch (e) {
      console.error(e)
      return e
    }
}


  // -----------------------
  //  Read Functions
  // ---------------------- -

  // pool info:
  // [0] callFee,
  // [1] allocPoint,
  // [2] withdrawFee,
  // [3] soulBalance,
  const poolInfo = async () => {
    try {
      const callFee = await stakeContract?.callFee()
      const allocPoint = await BigNumber.from(bondContract?.poolInfo?.[1])
      const withdrawFee = await stakeContract?.withdrawFee()
      const soulBalance = await stakeContract?.soulBalanceOf()
      return [callFee, allocPoint, withdrawFee, soulBalance]
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
      const result = await bondContract?.userInfo(pid, account)
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

  // amount of soul pending for redemption
  const pendingSoul = async () => {
    try {
      const soulAmount = await stakeContract?.calculateTotalPendingSoulRewards()
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
  const fetchUserLpTokenAllocInBond = async (pid, account) => {
    try {
      // get how many lpTokens in contract
      const totalSupply = await lpTokenContract?.totalSupply()

      // get how many lpTokens held by Summoner
      const heldBySummoner = await lpTokenContract?.balanceOf(SoulBondAddress)

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
      const sps = await bondContract?.soulPerSecond()
      return sps
    } catch (e) {
      console.log(e)
      return e
    }
  }

  // total allocation point (net amount of all pools combined)
  const totalAllocPoint = async () => {
    try {
      const totalAlloc = await bondContract?.totalAllocPoint()
      return totalAlloc
    } catch (e) {
      console.log(e)
      return e
    }
  }

  // ------- BONDS -------



  // ------- STAKING -------

  /**
   * Value of liqudity of lpToken
   */
  const fetchPid0LiquidityValue = async (lpToken) => {
    try {
      // SOUL held by summoner
      const rawSummonerBal = await lpTokenContract?.balanceOf(SoulBondAddress)
      const summonerBalance = BigNumber.from(ethers.utils.formatUnits(rawSummonerBal))
      // console.log('summonerBalance', ethers.utils.formatUnits(summonerBalance))

      // summonerBal * soulPrice = TVL
      // console.log('soulPrice', soulPrice)

      const totalLpValue = summonerBalance.mul(soulPrice)
      // console.log('totalLpValue', totalLpValue)

      return totalLpValue
    } catch (e) {
      // console.log(e)
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
  //     const soulPrice = await fusdPerSoul()
  //     console.log('soulPrice', soulPrice)

  //     return soulPrice
  //   } catch (e) {
  //     // console.log(e)
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
      const alloc = await poolInfo()
      const totalAlloc = await totalAllocPoint()
      const poolWeight = alloc?.[1].div(totalAlloc)

      // soul per sec (sps)
      const soulPerSec = await soulPerSecond()
      const formattedSps = BigNumber.from(ethers.utils.formatUnits(soulPerSec))
      const secPerYear = BigNumber.from(ethers.utils.formatUnits(31_536_000))

      // amount of soul allocated to this pool per year
      const yearlySoulBondAlloc = formattedSps.mul(secPerYear).mul(poolWeight)

      // value of soul held by summoner
      const fetchedLiquidity = await fetchPid0LiquidityValue(lpToken)

      // farm apr
      const farmApr = yearlySoulBondAlloc.div(fetchedLiquidity)

      return [farmApr, fetchedLiquidity]
    } catch (e) {
      console.log(e)
      // alert(e.message);
      return e
    }
  }

  return {
    fetchUserLpTokenAllocInBond,
    fetchStakeStats,
    deposit,
    withdraw,
    pendingSoul,
    userInfo,
    
    // // // 
    fetchStakedValue,
    
    fetchPid0LiquidityValue,
    fetchPid0AprAndLiquidity,
    
    // value fetcher
    poolInfo,
    totalAllocPoint
  }
}

export default useAutoStake
