import { CurrencyAmount, Token } from '../sdk'

import { useCallback } from 'react'
import { useSpellBoundContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

const useSpellBound = () => {
  const addTransaction = useTransactionAdder()
  const spellContract = useSpellBoundContract()

  const enter = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await spellContract?.enter(amount?.quotient.toString())
          return addTransaction(tx, { summary: 'Enter SpellBound' })
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
          return addTransaction(tx, { summary: 'Leave SpellBound' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, spellContract]
  )

  return { enter, leave }
}

export default useSpellBound
