import { CurrencyAmount, Token } from '../../../sdk'
// import { Fraction } from '../entities'
import { useActiveWeb3React } from 'services/web3'
import { useCallback } from 'react'
import { useSoulVaultContract } from './useContract'
import { useTransactionAdder } from '../../../state/transactions/hooks'

const useSoulVault = () => {
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const soulVaultContract = useSoulVaultContract()

  // -----------------------
  //  Read Functions
  // -----------------------

  /**
   *  @dev : fetches the user's info of the vault
   */
  const userInfo = useCallback(async () => {
    return await soulVaultContract?.userInfo(account)
  }, [account, soulVaultContract])

  /**
   *  @dev : fetches the total shares within the vault
   */
  const totalShares = useCallback(async () => {
    return await soulVaultContract?.totalShares()
  }, [soulVaultContract])

  /**
   *  @dev : calculates the user's percentage of the total pool
   */
  const userSharePercOfTotal = useCallback(async () => {
    const userShares = await userInfo()
    const contractTotalShares = await totalShares()

    return (userShares / contractTotalShares) * 100
  }, [totalShares, userInfo])

  /**
   *  @dev : fetches the soul pending for harvest
   */
  const calculateHarvestSoulRewards = useCallback(async () => {
    const rewards = await soulVaultContract?.calculateHarvestSoulRewards()
    return rewards
  }, [soulVaultContract])

  /**
   *  @dev : calculates the contract's pending SOUL
   */
  const calculateTotalPendingSoulRewards = useCallback(async () => {
    return await soulVaultContract?.calculateTotalPendingSoulRewards()
  }, [soulVaultContract])

  /**
   *  @dev : calculates the user's % pending rewards
   */
  const userPendingRewards = useCallback(async () => {
    const userShare = await userSharePercOfTotal()
    const contractPendingSoul = await calculateTotalPendingSoulRewards()

    const pending = contractPendingSoul * userShare

    return pending
  }, [calculateTotalPendingSoulRewards, userSharePercOfTotal])

  // -----------------------
  //  Write Functions
  // -----------------------

  /**
   *  @dev : deposit SOUL to SoulVault
   */
  const deposit = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await soulVaultContract?.deposit(amount?.quotient.toString())
          return addTransaction(tx, { summary: 'Stake SOUL' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, soulVaultContract]
  )

  /**
   *  @dev : withdraw a portion of SOUL from SoulVault
   */
  const withdraw = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await soulVaultContract?.withdraw(amount?.quotient.toString())
          return addTransaction(tx, { summary: 'Unstake SOUL' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, soulVaultContract]
  )

  /**
   *  @dev : withdraw current staked SOUL balance from SoulVault
   */
  const withdrawAll = useCallback(async () => {
    try {
      const tx = await soulVaultContract?.withdrawAll()
      return addTransaction(tx, { summary: 'Unstake all SOUL' })
    } catch (e) {
      return e
    }
  }, [addTransaction, soulVaultContract])

  /**
   *  @dev : bounty reward for third-party caller
   */
  const harvest = useCallback(async () => {
    try {
      const tx = await soulVaultContract?.harvest()
      return addTransaction(tx, { summary: 'Harvest SOUL' })
    } catch (e) {
      return e
    }
  }, [addTransaction, soulVaultContract])

  return {
    userInfo,
    totalShares,
    userSharePercOfTotal,
    calculateHarvestSoulRewards,
    calculateTotalPendingSoulRewards,
    userPendingRewards,
    deposit,
    withdraw,
    withdrawAll,
    harvest,
  }
}

export default useSoulVault
