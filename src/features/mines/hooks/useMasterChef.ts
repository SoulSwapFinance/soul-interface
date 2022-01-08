import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { useSoulContract } from 'hooks/useContract'
import { useActiveWeb3React } from 'services/web3'
import { useCallback } from 'react'

import { Chef } from '../enum'
import { useSummonerContract } from 'hooks'

export default function useMasterChef() {
  const { account } = useActiveWeb3React()

  const soul = useSoulContract()

  const contract = useSummonerContract()

  // Deposit
  const deposit = useCallback(
    async (pid: number, amount: BigNumber) => {
      try {
        let tx
          tx = await contract?.deposit(pid, amount)
        }
     catch (e) {
        console.error(e)
        return e
      }
    },
    [account, , contract]
  )

  // Withdraw
  const withdraw = useCallback(
    async (pid: number, amount: BigNumber) => {
      try {
        let tx
          tx = await contract?.withdraw(pid, amount)
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, contract]
)

  const harvest = useCallback(
    async (pid: number) => {
      try {
        let tx
          tx = await contract?.deposit(pid, Zero)
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, , contract, soul]
  )

  return { deposit, withdraw, harvest }
}
