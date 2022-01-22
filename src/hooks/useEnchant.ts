import { CurrencyAmount, Token, ENCHANT_ADDRESS } from '../sdk'
import { useCallback } from 'react'
import { useEnchantContract, useEnchantHelperContract, useSeanceContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from 'services/web3'

const useEnchant = () => {
  const { account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const enchantContract = useEnchantContract()
  const helperContract = useEnchantHelperContract()
  const seanceContract = useSeanceContract()

  // -----------------------
  //  READ FUNCTIONS
  // -----------------------

  /**
   *  @dev : fetches the user's info of the enchantment
   */
  const userBalance = useCallback(async () => {
    return await enchantContract?.balanceOf(account)
  }, [account, enchantContract])

  const enchantedSeance = useCallback(async () => {
    return await helperContract?.getEnchantedSeance()
  }, [helperContract])

  /**
   *  @dev : fetches the total shares within the enchantment
   */
  const totalShares = useCallback(async () => {
    return await enchantContract?.totalSupply()
  }, [enchantContract])

  /**
   *  @dev : calculates the user's percentage of the total pool
   */
  const userSharePercOfTotal = useCallback(async () => {
    const memberShare = await userBalance()
    const totalMemberShare = await totalShares()

    return memberShare / totalMemberShare * 100
  }, [totalShares, userBalance])

  /**
   *  @dev : fetches the seance pending for harvest
   */
  const calculateHarvestRewards = useCallback(async () => {
    const memberShare = await userBalance()
    const memberSharePercent = await userSharePercOfTotal()

    const seanceBalance = await seanceContract?.balanceOf(enchantContract)
    const totalMemberShares = await totalShares()

    const totalPayableSeance = memberShare * seanceBalance / totalMemberShares 
    const harvestRewards = totalPayableSeance - totalMemberShares

    return harvestRewards
  }, [enchantContract, seanceContract, totalShares, userBalance, userSharePercOfTotal])

  /**
   *  @dev : calculates the contract's pending SEANCE
   */
  const calculateTotalPayableSeance = useCallback(async () => {
    const memberShares = await userBalance()

    const seanceBalance = await seanceContract?.balanceOf(enchantContract)
    const totalMemberShares = await totalShares()

    const totalPayableSeance = memberShares * seanceBalance / totalMemberShares 
    
    return totalPayableSeance
  }, [enchantContract, seanceContract, totalShares, userBalance])

  /**
   *  @dev : calculates the user's % pending seance
   */
  const userPendingRewards = useCallback(async () => {
    const userShare = await userSharePercOfTotal()
    const contractPendingSeance = await calculateTotalPayableSeance()

    const pending = contractPendingSeance * userShare

    return pending
  }, [calculateTotalPayableSeance, userSharePercOfTotal])

  // -----------------------
  //  WRITE FUNCTIONS
  // -----------------------

  /**
   *  @dev : enchant SEANCE to the Enchantment.
   */
  const enchant = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await enchantContract?.enchant(amount?.quotient.toString())
          return addTransaction(tx, { summary: 'Stake SEANCE' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, enchantContract]
  )

  /**
   *  @dev : withdraw a portion of enchanted SEANCE.
   */
  const leave = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await enchantContract?.leave(amount?.quotient.toString())
          return addTransaction(tx, { summary: 'Unstake SEANCE' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, enchantContract]
  )

  /**
   *  @dev : withdraw all SEANCE from ENCHANT.
  */
  const exit = useCallback(async () => {
    try {
      const staked = await enchantContract.balanceOf(account)
      const tx = await enchantContract?.leave(staked)
      return addTransaction(tx, { summary: 'Exit ENCHANT' })
    } catch (e) {
      return e
    }
  }, [account, addTransaction, enchantContract])

  return {
    userBalance,
    enchantedSeance,
    totalShares,
    calculateHarvestRewards,
    userSharePercOfTotal,
    calculateTotalPayableSeance,
    userPendingRewards,
    enchant,
    leave,
    exit,
  }
}

export default useEnchant
