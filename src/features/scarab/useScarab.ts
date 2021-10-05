import { useScarabContract, useTokenContract } from '../../hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { useCallback } from 'react'
import { useToken } from '../../hooks/Tokens'
// import { SOUL } from '../../constants'

export default function useScarab() {
  const contract = useScarabContract()
  const tokenContract = useTokenContract()

  const lockTokens = useCallback(
    async (
      withdrawer: string, 
      amount: BigNumber, 
      unlockTimestamp: string
      ) => {
      try {
        return await contract?.lockTokens(withdrawer, amount.toString(), unlockTimestamp, {
          value: '100000000000000000',
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

  const getScarabsByTokenAddress = useCallback(
    async (token: string) => {
      try {
        const scarabsIds = await contract?.getDepositsByTokenAddress(token)
        const result = []
        if (scarabsIds.length > 0) {
          for (const id of scarabsIds) {
            const scarabInfo = await contract?.lockedToken(id.toString())
            result.push({ id, ...scarabInfo })
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

  return { lockTokens, getScarabsByTokenAddress, withdrawTokens }
}
