import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent } from 'sdk'
import FormattedPriceImpact from 'components/FormattedPriceImpact'
import { HeadlessUiModal } from 'components/Modal'
import QuestionHelper from 'components/QuestionHelper'
import Typography from 'components/Typography'
import { isAddress, shortenAddress } from 'functions'
import { computeRealizedLPFeePercent } from 'functions/prices'
import { TradeUnion } from 'types'
import React, { FC, useMemo } from 'react'

export interface AdvancedSwapDetailsProps {
  trade?: TradeUnion
  allowedSlippage: Percent
  recipient?: string
}

const AdvancedSwapDetails: FC<AdvancedSwapDetailsProps> = ({ trade, recipient, allowedSlippage }) => {
  const { i18n } = useLingui()

  const { priceImpact } = useMemo(() => {
    if (!trade) return { priceImpact: undefined }

    const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
    const priceImpact = trade.priceImpact.subtract(realizedLpFeePercent)
    return { priceImpact }
  }, [trade])

  return (
    <HeadlessUiModal.BorderedContent className="flex flex-col px-4 gap-1 bg-dark-1000/40 border !border-dark-800 rounded-2xl">
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center">
          <Typography variant="sm">{i18n._(t`Price Impact`)}</Typography>
          <QuestionHelper
            text={i18n._(t`The difference between the market price and estimated price due to trade size.`)}
          />
        </div>
        <FormattedPriceImpact priceImpact={priceImpact} />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center">
          <Typography variant="sm">{i18n._(t`Slippage Tolerance`)}</Typography>
        </div>
        <Typography variant="sm">{allowedSlippage.toFixed(2)}%</Typography>
      </div>

      {recipient && (
        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <Typography variant="sm">{i18n._(t`Recipient`)}</Typography>
          </div>
          <Typography variant="sm">
            {recipient && isAddress(recipient) ? shortenAddress(recipient) : recipient}
          </Typography>
        </div>
      )}
    </HeadlessUiModal.BorderedContent>
  )
}

export default AdvancedSwapDetails
