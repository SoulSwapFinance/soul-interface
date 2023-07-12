
import { CurrencyAmount } from 'sdk'
import { Button } from 'components/Button'
import ListPanel from 'components/ListPanel'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import { selectTridentAdd, setAddShowReview, setAddTxHash } from 'features/trident/add/addSlice'
import { useAddDetails } from 'features/trident/add/useAddDetails'
import { useAddLiquidityDerivedCurrencyAmounts } from 'features/trident/add/useAddLiquidityDerivedState'
import { useAddLiquidityExecute } from 'features/trident/add/useAddLiquidityExecute'
import { usePoolContext } from 'features/trident/PoolContext'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { FC, useCallback } from 'react'

import DepositSubmittedModalContent from './DepositSubmittedModalContent'
import { useActiveWeb3React } from 'services/web3'

const TransactionReviewStandardModal: FC = () => {
  const dispatch = useAppDispatch()
  const { currencies } = usePoolContext()
  const { attemptingTxn, showReview, txHash, spendFromWallet, coffinPermit } = useAppSelector(selectTridentAdd)
  const { liquidityMinted, poolShareAfter, poolShareBefore } = useAddDetails()
  const execute = useAddLiquidityExecute()
  const _parsedAmounts = useAddLiquidityDerivedCurrencyAmounts()
  const { chainId } = useActiveWeb3React()
  const _execute = useCallback(async () => {
    const tx = await execute({ parsedAmounts: _parsedAmounts, liquidityMinted, spendFromWallet, coffinPermit })
    if (tx?.hash) {
      dispatch(setAddTxHash(tx.hash))
    }
  }, [execute, _parsedAmounts, liquidityMinted, spendFromWallet, coffinPermit, dispatch])

  // Trick for performance since useUSDCValue is blocking
  const parsedAmounts = [
    _parsedAmounts[0] || (currencies?.[0] ? CurrencyAmount.fromRawAmount(currencies[0], '0') : undefined),
    _parsedAmounts[1] || (currencies?.[1] ? CurrencyAmount.fromRawAmount(currencies[1], '0') : undefined),
  ]

  // Need to use controlled modal here as open variable comes from the liquidityPageState.
  // In other words, this modal needs to be able to get spawned from anywhere within this context
  return (
    <HeadlessUIModal.Controlled
      isOpen={showReview}
      chainId={chainId}
      onDismiss={() => dispatch(setAddShowReview(false))}
      afterLeave={() => dispatch(setAddTxHash(undefined))}
      maxWidth="md"
      unmount={false}
    >
      {!txHash ? (
        <div className="flex flex-col gap-4">
          <HeadlessUIModal.Header
            header={`Confirm add liquidity`}
            onClose={() => dispatch(setAddShowReview(false))}
          />
          <Typography variant="sm">
            {`Output is estimated. If the price changes by more than 0.5% your transaction will revert.`}
          </Typography>
          <HeadlessUIModal.BorderedContent className="flex flex-col gap-3 bg-dark-1000/40">
            <Typography weight={700} variant="sm" className="text-secondary">
              {`You are depositing:`}
            </Typography>
            <ListPanel
              items={parsedAmounts.map((cur, index) => (
                <ListPanel.CurrencyAmountItem amount={cur} key={index} />
              ))}
            />
          </HeadlessUIModal.BorderedContent>
          <HeadlessUIModal.BorderedContent className="flex flex-col gap-3 bg-dark-1000/40">
            <Typography weight={700} variant="sm" className="text-secondary">
              {`You'll receive (at least):`}
            </Typography>
            <Typography weight={700} variant="lg" className="text-high-emphesis">
              {liquidityMinted?.toSignificant(6)} SLP
            </Typography>
          </HeadlessUIModal.BorderedContent>
          <div className="flex justify-between px-2 py-1">
            <Typography variant="sm" className="text-secondary">
              {`Share of Pool`}
            </Typography>
            <Typography variant="sm" weight={700} className="text-right text-high-emphesis">
              {poolShareBefore?.greaterThan(0) ? poolShareBefore?.toSignificant(6) : '0.000'}% →{' '}
              {poolShareAfter?.toSignificant(6) || '0.000'}%
            </Typography>
          </div>
          <Button id={`btn-modal-confirm-deposit`} disabled={attemptingTxn} color="blue" onClick={_execute}>
            {`Confirm Deposit`}
          </Button>
        </div>
      ) : (
        <DepositSubmittedModalContent txHash={txHash} onDismiss={() => dispatch(setAddTxHash(undefined))} />
      )}
    </HeadlessUIModal.Controlled>
  )
}

export default TransactionReviewStandardModal