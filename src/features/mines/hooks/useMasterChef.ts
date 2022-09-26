import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { useSoulContract } from 'hooks/useContract'
import { useActiveWeb3React } from 'services/web3'
import { useCallback } from 'react'

import { Chef } from '../enum'
import { useSummonerContract } from 'hooks'
import { ChainId } from 'sdk'

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
 
  const harvestAll = useCallback(
    async (chainId, pids) => {
      try {
        let tx
          tx = chainId == ChainId.FANTOM ? null : await contract?.harvestAll([pids])
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, , contract, soul]
  )

  // -----------------------
  //  Staking Funcs
  // -----------------------

  // enterStaking
  const enterStaking = async (amount) => {
    try {
      const result = await contract?.enterStaking(amount)
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
      let result = await contract?.leaveStaking(amount)
      return result
    } catch (e) {
      // alert(e.message)
      console.log(e)
      return e
    }
  }

  // Claim Staking Rewards
  const claimStake = useCallback(
    async (amount: Number) => {
      try {
        return await contract?.leaveStaking(Zero);
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  return { claimStake, deposit, withdraw, harvest, harvestAll, enterStaking, leaveStaking }

} 