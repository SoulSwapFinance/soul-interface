import { Currency, CurrencyAmount, Token } from '../sdk'

import { useCallback } from 'react'
import { useSoulSummonerContract } from '../hooks/useContract' // Not using `useEnchantmentContract` to enter staking
import { useTransactionAdder } from '../state/transactions/hooks'

const useSoulStakeManual = () => {
  const addTransaction = useTransactionAdder()
  const summonerContract = useSoulSummonerContract()

  // Enter staking in SoulSummoner
  const enter = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await summonerContract?.enterStaking(amount?.quotient.toString())
          return addTransaction(tx, { summary: 'Stake SOUL' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, summonerContract]
  )

  // Leave staking in SoulSummoner
  const leave = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await summonerContract?.leaveStaking(amount?.quotient.toString())
          return addTransaction(tx, { summary: 'Unstake SOUL' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, summonerContract]
  )

  // Harvest pending SOUL
  const harvest = useCallback(async () => {
    try {
      const tx = await summonerContract?.leaveStaking('0')
      return addTransaction(tx, { summary: 'Harvest SOUL' })
    } catch (e) {
      return e
    }
  }, [addTransaction, summonerContract])

  return { enter, leave, harvest }
}

export default useSoulStakeManual
