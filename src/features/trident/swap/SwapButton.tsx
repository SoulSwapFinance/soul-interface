import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Button } from 'components/Button'
import Dots from 'components/Dots'
import { useDerivedTridentSwapContext } from 'features/trident/swap/DerivedTradeContext'
import { selectTridentSwap, setTridentSwapState } from 'features/trident/swap/swapSlice'
import { useCoffinBoxContract, useTridentRouterContract } from 'hooks'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { TradeUnion } from 'types'
import React, { FC, useCallback } from 'react'

import TridentApproveGate from '../TridentApproveGate'

interface SwapButton {
  onClick(x: TradeUnion): void
}

const SwapButton: FC<SwapButton> = ({ onClick }) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const tridentSwapState = useAppSelector(selectTridentSwap)
  const { attemptingTxn } = tridentSwapState
  const router = useTridentRouterContract()
  const coffinBox = useCoffinBoxContract()
  const { parsedAmounts, error, trade } = useDerivedTridentSwapContext()

  const handleClick = useCallback(() => {
    if (trade) onClick(trade)
    dispatch(setTridentSwapState({ ...tridentSwapState, showReview: true }))
  }, [dispatch, onClick, trade, tridentSwapState])

  return (
    <TridentApproveGate
      inputAmounts={[parsedAmounts?.[0]]}
      tokenApproveOn={coffinBox?.address}
      masterContractAddress={router?.address}
    >
      {({ approved, loading }) => {
        const disabled = !!error || !approved || loading || attemptingTxn
        const buttonText = attemptingTxn ? (
          <Dots>{i18n._(t`Swapping`)}</Dots>
        ) : loading ? (
          ''
        ) : error ? (
          error
        ) : (
          i18n._(t`Swap`)
        )

        return (
          <div className="flex">
            <Button
              fullWidth
              id="swap-button"
              loading={loading}
              color="gradient"
              disabled={disabled}
              onClick={handleClick}
            >
              {buttonText}
            </Button>
          </div>
        )
      }}
    </TridentApproveGate>
  )
}

export default SwapButton