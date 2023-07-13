import { Button } from 'components/Button'
import Dots from 'components/Dots'
import { useDerivedTridentSwapContext } from 'features/trident/swap/DerivedTradeContext'
import { selectTridentSwap, setTridentSwapState } from 'features/trident/swap/swapSlice'
import { useCoffinBoxContract, useTridentRouterContract } from 'hooks'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { TradeUnion } from 'types'
import React, { FC, useCallback } from 'react'

import TridentApproveGate from '../TridentApproveGate'
import { getChainColor } from 'constants/chains'
import { useActiveWeb3React } from 'services/web3'

interface SwapButton {
  onClick(x: TradeUnion): void
}

const SwapButton: FC<SwapButton> = ({ onClick }) => {
  const { chainId } = useActiveWeb3React()
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
          <Dots>{`Swapping`}</Dots>
        ) : loading ? (
          ''
        ) : error ? (
          error
        ) : (
          `Swap`
        )

        return (
          <div className="flex">
            <Button
              className="w-full"
              id="swap-button"
              loading={loading}
              color={getChainColor(chainId)}
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