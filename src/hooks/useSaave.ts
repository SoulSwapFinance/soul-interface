import { useCallback, useEffect, useState } from 'react'
import { useSaaveContract, useSoulContract } from '../hooks/useContract'

import { BalanceProps } from './useTokenBalance'
import { Fraction } from '../entities'
import { ethers } from 'ethers'
import useActiveWeb3React from '../hooks/useActiveWeb3React'
import { useTransactionAdder } from '../state/transactions/hooks'

const { BigNumber } = ethers

const useMaker = () => {
  const { account } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()
  const sushiContract = useSoulContract(true) // withSigner
  const saaveContract = useSaaveContract(true) // withSigner

  // Allowance
  const [allowance, setAllowance] = useState('0')
  const fetchAllowance = useCallback(async () => {
    if (account) {
      try {
        const allowance = await sushiContract?.allowance(account, saaveContract?.address)
        const formatted = Fraction.from(BigNumber.from(allowance), BigNumber.from(10).pow(18)).toString()
        setAllowance(formatted)
      } catch (error) {
        setAllowance('0')
        throw error
      }
    }
  }, [account, saaveContract?.address, sushiContract])
  useEffect(() => {
    if (account && saaveContract && sushiContract) {
      fetchAllowance()
    }
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, fetchAllowance, saaveContract, sushiContract])

  // Approve
  const approve = useCallback(async () => {
    try {
      const tx = await sushiContract?.approve(saaveContract?.address, ethers.constants.MaxUint256.toString())
      return addTransaction(tx, { summary: 'Approve' })
    } catch (e) {
      return e
    }
  }, [addTransaction, saaveContract?.address, sushiContract])

  // Saave Soul - SPELL - aSPELL
  const saave = useCallback(
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await saaveContract?.saave(amount?.value)
          return addTransaction(tx, { summary: 'SOUL → SPELL → aSPELL' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, saaveContract]
  )

  return { allowance, approve, saave }
}

export default useMaker
