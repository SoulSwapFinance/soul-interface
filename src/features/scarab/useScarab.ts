
import { useScarabContract } from '../../hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { useCallback } from 'react'
import { useToken } from '../../hooks/Tokens'

export default function useScarab() {
  const contract = useScarabContract()

  const lockSouls = useCallback(
    async (recipient: string, amount: BigNumber, unlockTimestamp: string) => {
      try {
        return await contract?.lockSouls(recipient, amount.toString(), unlockTimestamp, {
          // value: '100000000000000000',
        })
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  const withdrawTokens = useCallback(
    async (id: string) => {
      try {
        return await contract?.withdrawTokens(id)
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  const getDepositsByRecipient = useCallback(
    async (recipient: string) => {
      try {
        const scarabs = await contract?.getDepositsByRecipient(recipient)
        const result = []
        if (scarabs.length > 0) {
          for (const id of scarabs) {
            const scarabs = await contract?.depositsByRecipient(recipient, id.toString())
            result.push({ id, ...scarabs })
          }
        }
        return result
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  return { lockSouls, getDepositsByRecipient, withdrawTokens }
}