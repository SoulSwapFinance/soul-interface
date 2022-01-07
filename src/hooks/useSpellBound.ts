import { CurrencyAmount, Token } from 'sdk'

import { useCallback } from 'react'
import { useEnchantmentContract } from './useContract'
import { useTransactionAdder } from 'state/transactions/hooks'

const useEnchantment = () => {
  const addTransaction = useTransactionAdder()
  const spellContract = useEnchantmentContract()

  const enter = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await spellContract?.enter(amount?.quotient.toString())
          return addTransaction(tx, { summary: 'Enter Enchantment' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, spellContract]
  )

  const leave = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await spellContract?.leave(amount?.quotient.toString())
          return addTransaction(tx, { summary: 'Leave Enchantment' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, spellContract]
  )

  return { enter, leave }
}

export default useEnchantment
