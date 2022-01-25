import { CurrencyAmount, Token } from 'sdk'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useCallback } from 'react'

import { useEnchantmentContract } from './useContract'

const useBar = () => {
  const addTransaction = useTransactionAdder()
  const barContract = useEnchantmentContract()

  const enter = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await barContract?.enter(amount?.quotient.toString())
          return addTransaction(tx, { summary: 'Enter Enchantment' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, barContract]
  )

  const leave = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await barContract?.leave(amount?.quotient.toString())
          return addTransaction(tx, { summary: 'Leave Enchantment' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, barContract]
  )

  return { enter, leave }
}

export default useBar