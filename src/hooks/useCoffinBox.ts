import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import { JSBI, WNATIVE_ADDRESS } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useCallback } from 'react'

import { useCoffinBoxContract } from './useContract'

function useCoffinBox() {
  const { account, chainId } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()
  const coffinBoxContract = useCoffinBoxContract()

  const deposit = useCallback(
    async (tokenAddress: string, value: BigNumber) => {
      if (value && chainId) {
        try {
          const tokenAddressChecksum = getAddress(tokenAddress)
          if (tokenAddressChecksum === WNATIVE_ADDRESS[chainId]) {
            const tx = await coffinBoxContract?.deposit(AddressZero, account, account, value, 0, {
              value,
            })
            return addTransaction(tx, { summary: 'Deposit to Coffinbox' })
          } else {
            const tx = await coffinBoxContract?.deposit(tokenAddressChecksum, account, account, value, 0)
            return addTransaction(tx, { summary: 'Deposit to Coffinbox' })
          }
        } catch (e) {
          console.error('coffinbox deposit error:', e)
          return e
        }
      }
    },
    [account, addTransaction, coffinBoxContract, chainId]
  )

  const withdraw = useCallback(
    async (tokenAddress: string, value: BigNumber, share?: JSBI) => {
      if (value && chainId) {
        try {
          const tokenAddressChecksum = getAddress(tokenAddress)
          const tx = await coffinBoxContract?.withdraw(
            tokenAddressChecksum === WNATIVE_ADDRESS[chainId]
              ? '0x0000000000000000000000000000000000000000'
              : tokenAddressChecksum,
            account,
            account,
            value,
            share ? share.toString() : 0
          )
          return addTransaction(tx, { summary: 'Withdraw from Coffinbox' })
        } catch (e) {
          console.error('coffinbox withdraw error:', e)
          return e
        }
      }
    },
    [account, addTransaction, coffinBoxContract, chainId]
  )

  const harvest = useCallback(async (tokenAddress: string, rebalance: boolean = false) => {
    if (chainId) {
      try {
        const tx = await coffinBoxContract?.harvest(tokenAddress, rebalance, 0)
        return addTransaction(tx, { summary: rebalance ? 'Harvest & Rebalance' : 'Harvest' })
      } catch (e) {
        console.error('coffinbox harvest error:', e)
        return e
      }
    }
  }, [])

  return { deposit, withdraw, harvest }
}

export default useCoffinBox