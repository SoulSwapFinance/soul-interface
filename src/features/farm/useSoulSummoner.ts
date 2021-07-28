import { useActiveWeb3React, useSoulContract } from '../../hooks'

import { BigNumber } from '@ethersproject/bignumber'
import { Chef } from './enum'
import { Zero } from '@ethersproject/constants'
import { useCallback } from 'react'
import { useChefContract } from './hooks'

export default function useSoulSummoner(chef: Chef) {
  const { account } = useActiveWeb3React()

  const soul = useSoulContract()

  const contract = useChefContract(chef)

  // Deposit
  const deposit = useCallback(
    async (pid: number, amount: BigNumber) => {
      try {
        let tx

        if (chef === Chef.MASTERCHEF_V1) {
          tx = await contract?.deposit(pid, amount)
        } else {
          tx = await contract?.deposit(pid, amount, account)
        }

        return tx
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, chef, contract]
  )

  // Withdraw
  const withdraw = useCallback(
    async (pid: number, amount: BigNumber) => {
      try {
        let tx

        if (chef === Chef.MASTERCHEF_V1) {
          tx = await contract?.withdraw(pid, amount)
        } else {
          tx = await contract?.withdraw(pid, amount, account)
        }

        return tx
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, chef, contract]
  )

  const harvest = useCallback(
    async (pid: number) => {
      try {
        let tx

        if (chef === Chef.MASTERCHEF_V1) {
          tx = await contract?.deposit(pid, Zero)
        } else if (chef === Chef.SOUL_SUMMONER) {
          const pendingSoul = await contract?.pendingSoul(pid, account)

          const balanceOf = await soul?.balanceOf(contract?.address)

          // If SoulSummoner doesn't have enough soul to harvest, batch in a harvest.
          if (pendingSoul.gt(balanceOf)) {
            tx = await contract?.batch(
              [
                contract?.interface?.encodeFunctionData('harvestFromMasterChef'),
                contract?.interface?.encodeFunctionData('harvest', [pid, account]),
              ],
              true
            )
          } else {
            tx = await contract?.harvest(pid, account)
          }
        } else if (chef === Chef.MINICHEF) {
          tx = await contract?.harvest(pid, account)
        }

        return tx
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, chef, contract, soul]
  )

  // Pool length
  const poolLength = useCallback(async () => {
    try {
      const tx = await contract?.poolLength()
      return tx
    } catch (e) {
      console.error(e)
      return e
    }
  }, [account, chef, contract])

  // Pool Info
  const poolInfo = useCallback(
    async (pid: number) => {
      try {
        const tx = await contract?.poolInfo(pid)
        const lpToken = tx?.[0].toString()
        const lastRewardTime = BigNumber.from(tx?.[1])
        const accSoulPerShare = BigNumber.from(tx?.[2])
        return [lpToken, lastRewardTime, accSoulPerShare]
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, chef, contract]
  )

  // User Info
  const userInfo = useCallback(
    async (pid: number, address: string) => {
      try {
        const tx = await contract?.userInfo(pid)
        const amount = BigNumber.from(tx?.[0])
        const rewardDebt = BigNumber.from(tx?.[1])
        return [amount, rewardDebt]
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, chef, contract]
  )

  // Amount of SOUL pending for redemption
  const pendingSoul = useCallback(
    async (pid: number, address: string) => {
      try {
        const tx = BigNumber.from(await contract?.pendingSoul(pid, address))
        return tx
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, chef, contract]
  )

  // How much SOUL is emitted per second
  const soulPerSecond = useCallback(async () => {
    try {
      const tx = BigNumber.from(await contract?.soulPerSecond())
      return tx
    } catch (e) {
      console.error(e)
      return e
    }
  }, [account, chef, contract])

  // Total Allocation Point (net amount of all chains combined)
  const totalAllocPoint = useCallback(async () => {
    try {
      const tx = BigNumber.from(await contract?.totalAllocPoint())
      return tx
    } catch (e) {
      console.error(e)
      return e
    }
  }, [account, chef, contract])

  return { deposit, withdraw, harvest, poolLength, poolInfo, userInfo, pendingSoul, soulPerSecond, totalAllocPoint }
}
