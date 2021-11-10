import { useCallback } from 'react'
import { ethers, BigNumber } from 'ethers'
// import { formatNumber } from '../../functions'

import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

import {
  useHelperContract,
  useSoulSummonerContract,
  useCircleStakingContract,
  usePairContract,
  useTokenContract,
} from '../farm/hooks/useContract'

function useSoulCircle() {
  const { account, chainId } = useActiveWeb3React()

  const helperContract = useHelperContract()
  const circlesContract = useCircleStakingContract()

  // ----------------------------------------------
  //                  Farm Helper
  // ----------------------------------------------

  /**
   * [0] : ftmUsdcTotalFtm
   * [1] : ftmUsdcTotalUsdc
   * [2] : soulFtmTotalSoul
   * [3] : soulFtmTotalFusd
   * [4] : ethFtmTotalFtm
   * [5] : ethFtmTotalEth
   * [6] : ftmEnchantTotalFtm
   * [7] : ftmEnchantTotalEnchant
   */
  const fetchTokenRateBals = async () => {
    try {
      const result = await helperContract?.fetchTokenRateBals()

      const ftmPrice = result?.[1] / (result?.[0] / 10 ** 12)
      const soulPrice = result?.[3] / result?.[2]
      const ethPrice = (result?.[4] / result?.[5]) * ftmPrice
      const enchantPrice = result?.[6] / result?.[7]

      console.log(
        'usdcPerFtm:',
        ftmPrice,
        'fusdPerSoul:',
        soulPrice,
        'ethPrice:',
        ethPrice,
        'enchantPrice:',
        enchantPrice
      )

      return [ftmPrice, soulPrice, ethPrice, enchantPrice]
    } catch (e) {
      console.log(e)
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
    fetchTokenRateBals,

    // circle staking
    circlePoolInfo,
    circleUserInfo,
    circleDeposit,
    circleWithdraw,
    circlePendingRewards,
  }
}

export default useSoulCircle
