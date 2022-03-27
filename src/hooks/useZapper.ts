import { Currency, CurrencyAmount } from '../sdk'

import { useActiveWeb3React } from 'services/web3'
import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useZapperContract } from '../hooks/useContract'

const useZapper = (currency?: Currency) => {
  const { chainId, account } = useActiveWeb3React()
  const zapperContract = useZapperContract(true)
  const addTransaction = useTransactionAdder()

  const zapIn = useCallback(
    async (fromTokenContractAddress, pairAddress, amount, swapTarget, minPoolTokens, swapData) => {
      const tx = await zapperContract?.ZapIn(
        fromTokenContractAddress,
        pairAddress,
        amount?.raw.toString(),
        minPoolTokens,
        swapTarget,
        // Call data for swap if necessary
        swapData,
        // Affiliate
        '0x0000000000000000000000000000000000000000',
        // Transfer residual (Can save gas if set to false but unsure about math right now)
        true,
        {
          // Value for transfer should be 0 unless it's an ETH transfer
          value: fromTokenContractAddress === '0x0000000000000000000000000000000000000000' ? amount?.raw.toString() : 0,
        }
      )
      return addTransaction(tx, {
        summary: `Zap ${amount?.toSignificant(6)} ${currency?.symbol}`,
      })
    },
    [zapperContract, addTransaction, currency?.symbol]
  )

  return { zapIn }
}

export default useZapper
