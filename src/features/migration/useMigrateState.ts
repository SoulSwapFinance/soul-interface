import { parseUnits } from '@ethersproject/units'
import { ChainId } from '@sushiswap/core-sdk'
import { useActiveWeb3React } from 'services/web3'
import { useIsTransactionPending, useTransactionAdder } from 'state/transactions/hooks'
import { useCallback, useEffect, useState } from 'react'

import useLPTokensState, { LPTokensState } from './useLPTokensState'
import useSushiRoll from './useSoulSwap'

export type MigrateMode = 'permit' | 'approve'

export interface MigrateState extends LPTokensState {
  amount: string
  setAmount: (amount: string) => void
  mode?: MigrateMode
  setMode: (_mode?: MigrateMode) => void
  onMigrate: () => Promise<void>
  pendingMigrationHash: string | null
  isMigrationPending: boolean
}

const useMigrateState: () => MigrateState = () => {
  const { library, account, chainId } = useActiveWeb3React()
  const state = useLPTokensState()
  const { migrate, migrateWithPermit } = useSushiRoll(state?.selectedLPToken?.version)
  const [mode, setMode] = useState<MigrateMode>()
  const [amount, setAmount] = useState('')
  const addTransaction = useTransactionAdder()
  const [pendingMigrationHash, setPendingMigrationHash] = useState<string | null>(null)
  const isMigrationPending = useIsTransactionPending(pendingMigrationHash ?? undefined)

  useEffect(() => {
    state.setSelectedLPToken(undefined)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const onMigrate = useCallback(async () => {
    if (mode && state.selectedLPToken && account && library) {
      const units = parseUnits(amount || '0', state.selectedLPToken.decimals)
      const func = mode === 'approve' ? migrate : migrateWithPermit
      const tx = await func(state.selectedLPToken, units)

      let exchange

      if (chainId === ChainId.ETHEREUM) {
        exchange = 'Uniswap'
      } else if (chainId === ChainId.BSC) {
        exchange = 'PancakeSwap'
      } else if (chainId === ChainId.FANTOM) {
        exchange = 'SpookySwap'
      }

      addTransaction(tx, {
        summary: `Migrate ${exchange} ${state.selectedLPToken.symbol} liquidity to SushiSwap`,
      })
      setPendingMigrationHash(tx.hash)

      await tx.wait()
      state.setSelectedLPToken(undefined)
      await state.updateLPTokens()
    }
  }, [mode, state, account, library, amount, migrate, migrateWithPermit, chainId, addTransaction])

  return {
    ...state,
    amount,
    setAmount,
    mode,
    setMode,
    onMigrate,
    pendingMigrationHash,
    isMigrationPending,
  }
}
export default useMigrateState