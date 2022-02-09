import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Token } from 'sdk'
import { Button } from 'components/Button'
import ListPanel from 'components/ListPanel'
import { HeadlessUiModal } from 'components/Modal'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import { useMineListItemDetailsModal } from 'features/mines/MineListItemDetails'
import { setMinesModalOpen } from 'features/mines/minesSlice'
import { useAppDispatch } from 'state/hooks'
import React, { FC } from 'react'

interface PoolRemoveLiquidityReviewContentProps {
  liquidityAmount?: CurrencyAmount<Token>
  parsedAmounts: (CurrencyAmount<Currency> | undefined)[]
  execute(): void
  txHash?: string
}

const PoolRemoveLiquidityReviewContent: FC<PoolRemoveLiquidityReviewContentProps> = ({
  liquidityAmount,
  parsedAmounts,
  execute,
  txHash,
}) => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { setContent } = useMineListItemDetailsModal()

  return !txHash ? (
    <div className="flex flex-col gap-4">
      <HeadlessUIModal.Header
        header={i18n._(t`Confirm Remove Liquidity`)}
        onBack={() => setContent(undefined)}
        onClose={() => dispatch(setMinesModalOpen(false))}
      />
      <Typography variant="sm">
      {i18n._(t`Output is estimated. If the price changes by more than your chosen slippage it'll revert.`)}
      </Typography>
      <HeadlessUIModal.BorderedContent className="flex flex-col gap-3 bg-dark-1000/40">
        <Typography weight={700} variant="sm" className="text-secondary">
          {i18n._(t`Remove:`)}
        </Typography>
        <ListPanel
          items={[
            <ListPanel.CurrencyAmountItem hideCurrencyLogo={true} hideUSDC={true} amount={liquidityAmount} key={0} />,
          ]}
        />
      </HeadlessUIModal.BorderedContent>
      <HeadlessUIModal.BorderedContent className="flex flex-col gap-3 bg-dark-1000/40">
        <Typography weight={700} variant="sm" className="text-secondary">
          {i18n._(t`Receive:`)}
        </Typography>
        <ListPanel
          items={parsedAmounts.map((parsedInputAmount, index) => (
            <ListPanel.CurrencyAmountItem amount={parsedInputAmount} key={index} />
          ))}
        />
      </HeadlessUIModal.BorderedContent>
      <Button id="btn-modal-confirm-withdrawal" color="purple" onClick={execute}>
        {i18n._(t`Confirm Withdrawal`)}
      </Button>
    </div>
  ) : (
    <HeadlessUiModal.SubmittedModalContent
      txHash={txHash}
      header={i18n._(t`Success!`)}
      subheader={i18n._(t`Success! Withdrawal Submitted`)}
      onDismiss={() => dispatch(setMinesModalOpen(false))}
    />
  )
}

export default PoolRemoveLiquidityReviewContent