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

  return { deposit, withdraw, harvest }
}
