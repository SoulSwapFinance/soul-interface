import { CurrencyAmount, Token } from 'sdk'

import { useCallback } from 'react'
import { useEnchantContract } from './useContract'
import { useTransactionAdder } from 'state/transactions/hooks'

const useSeanceStakeManual = () => {
  const addTransaction = useTransactionAdder()
  const enchantContract = useEnchantContract()

  // enchant your SEANCE.
  const enter = useCallback(
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

  // leave the Enchantment.
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

  // harvest pending SEANCE.
  const harvest = useCallback(async () => {
    try {
      const tx = await enchantContract?.leave('0')
      return addTransaction(tx, { summary: 'Harvest SEANCE' })
    } catch (e) {
      return e
    }
  }, [addTransaction, enchantContract])

  return { enter, leave, harvest }
}

export default useSeanceStakeManual
