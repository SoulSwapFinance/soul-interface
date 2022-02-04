import { BigNumber } from '@ethersproject/bignumber'
import { WNATIVE } from '../sdk'
import { ethers } from 'ethers'
import { useActiveWeb3React } from 'services/web3'
import { useCoffinBoxContract } from './useContract'
import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'

function useCoffinBox() {
  const { account, chainId } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()
  const coffinBoxContract = useCoffinBoxContract()

  const deposit = useCallback(
    async (tokenAddress: string, value: BigNumber) => {
      if (value && chainId) {
        try {
          const tokenAddressChecksum = ethers.utils.getAddress(tokenAddress)
          if (tokenAddressChecksum === WNATIVE[chainId].address) {
            const tx = await coffinBoxContract?.deposit(ethers.constants.AddressZero, account, account, value, 0, {
              value,
            })
            return addTransaction(tx, { summary: 'Deposit to CoffinBox' })
          } else {
            const tx = await coffinBoxContract?.deposit(tokenAddressChecksum, account, account, value, 0)
            return addTransaction(tx, { summary: 'Deposit to CoffinBox' })
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
    // todo: this should be updated with BigNumber as opposed to string
    async (tokenAddress: string, value: BigNumber) => {
      if (value && chainId) {
        try {
          const tokenAddressChecksum = ethers.utils.getAddress(tokenAddress)
          const tx = await coffinBoxContract?.withdraw(
            tokenAddressChecksum === WNATIVE[chainId].address
              ? '0x0000000000000000000000000000000000000000'
              : tokenAddressChecksum,
            account,
            account,
            value,
            0
          )
          return addTransaction(tx, { summary: 'Withdraw from CoffinBox' })
        } catch (e) {
          console.error('coffinbox withdraw error:', e)
          return e
        }
      }
    },
    [account, addTransaction, coffinBoxContract, chainId]
  )

  return { deposit, withdraw }
}

export default useCoffinBox
