import { useCallback } from 'react'
import { ethers, BigNumber } from 'ethers'
// import { formatNumber } from '../../functions'

import { useActiveWeb3React } from 'services/web3'

import {
  useHelperContract,
  useCircleStakingContract,
} from 'hooks/useContract'
import { useEnchantPrice, useFantomPrice, useSeancePrice, useSoulPrice, useWrappedEthPrice } from 'hooks/getPrices'

function useSoulCircle() {
  const { account, chainId } = useActiveWeb3React()

  const helperContract = useHelperContract()
  const circlesContract = useCircleStakingContract()
  const soulPrice = useSoulPrice()
  const ethPrice = useWrappedEthPrice()
  const ftmPrice = useFantomPrice()
  const seancePrice = useSeancePrice()
  const enchantPrice = useEnchantPrice()
  
  // ----------------------------------------------
  //                  Farm Helper
  // ----------------------------------------------

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
