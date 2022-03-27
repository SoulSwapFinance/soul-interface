import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Percent, Token } from 'sdk'
import { Button } from 'components/Button'
import ListPanel from 'components/ListPanel'
import { HeadlessUiModal } from 'components/Modal'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import { useMineListItemDetailsModal } from 'features/mines/MineListItemDetails'
import { setMinesModalOpen } from 'features/mines/minesSlice'
import { useAppDispatch } from 'state/hooks'
import { Field } from 'state/mint/actions'
import React, { FC } from 'react'

interface PoolAddLiquidityReviewContentProps {
  noLiquidity?: boolean
  liquidityMinted?: CurrencyAmount<Token>
  poolShare?: Percent
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  execute(): void
  txHash?: string
}

const PoolAddLiquidityReviewContent: FC<PoolAddLiquidityReviewContentProps> = ({
  noLiquidity,
  liquidityMinted,
  poolShare,
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
        header={noLiquidity ? i18n._(t`Confirm create pool`) : i18n._(t`Confirm Add Liquidity`)}
        onBack={() => setContent(undefined)}
        onClose={() => dispatch(setMinesModalOpen(false))}
      />
      <Typography variant="sm">
        {i18n._(t`Output is estimated. If the price changes by more than your chosen slippage it'll revert.`)}
      </Typography>
      <HeadlessUIModal.BorderedContent className="flex flex-col gap-3 bg-dark-1000/40">
        <Typography weight={700} variant="sm" className="text-secondary">
          {i18n._(t`Depositing:`)}
        </Typography>
        <ListPanel
          items={Object.values(parsedAmounts).map((cur, index) => (
            <ListPanel.CurrencyAmountItem amount={cur} key={index} />
          ))}
        />
      </HeadlessUIModal.BorderedContent>
      <HeadlessUIModal.BorderedContent className="flex flex-col gap-3 bg-dark-1000/40">
        <Typography weight={700} variant="sm" className="text-secondary">
          {i18n._(t`Receive (minimum):`)}
        </Typography>
        <Typography weight={700} variant="lg" className="text-high-emphesis">
          {liquidityMinted?.toSignificant(6)} SLP
        </Typography>
      </HeadlessUIModal.BorderedContent>
      <div className="flex justify-between px-2 py-1">
        <Typography variant="sm" className="text-secondary">
          {i18n._(t`Share of Pool`)}
        </Typography>
        <Typography variant="sm" weight={700} className="text-right text-high-emphesis">
          {poolShare?.greaterThan(0) ? poolShare?.toSignificant(6) : '0.000'}%
        </Typography>
      </div>
      <div className="flex flex-grow" />
      <Button id={`btn-modal-confirm-deposit`} color="blue" onClick={execute}>
        {i18n._(t`Confirm Deposit`)}
      </Button>
    </div>
  ) : (
    <HeadlessUiModal.SubmittedModalContent
      txHash={txHash}
      header={i18n._(t`Success!`)}
      subheader={i18n._(t`Success! Deposit Submitted`)}
      onDismiss={() => dispatch(setMinesModalOpen(false))}
    />
  )
}

export default PoolAddLiquidityReviewContent
