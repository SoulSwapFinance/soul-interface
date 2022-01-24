import { AlertTriangle, ArrowDown } from 'react-feather'
import { Currency, Percent, TradeType, Trade } from '../../sdk'
import React, { useState } from 'react'
import { formatNumberScale, isAddress, shortenAddress } from '../../functions'

import { CurrencyLogo } from '../../components/CurrencyLogo'
import TradePrice from './TradePrice'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import { warningSeverity } from '../../functions'
import AdvancedSwapDetails from './AdvancedSwapDetails'

// import Card from '../../components/Card'
// import { Field } from '../../state/swap/actions'
// import { RowBetween } from '../../components/Row'
// import Typography from '../../components/Typography'
// import { useActiveWeb3React } from 'services/web3'

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
  // minerBribe,
}: {
  trade: Trade<Currency, Currency, TradeType>
  allowedSlippage: Percent
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
  // minerBribe?: string
}) {
  const { i18n } = useLingui()

  const [showInverted, setShowInverted] = useState<boolean>(false)

  const fiatValueInput = useUSDCValue(trade.inputAmount)
  const fiatValueOutput = useUSDCValue(trade.outputAmount)

  const priceImpactSeverity = warningSeverity(trade?.priceImpact)

  return (
    <div className="grid md:gap-4">
      <div className="grid md:gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <CurrencyLogo currency={trade?.inputAmount?.currency} size={48} />
            <div className="overflow-ellipsis w-[190px] overflow-hidden font-bold text-2xl text-high-emphesis">
              {formatNumberScale(trade?.inputAmount?.toSignificant(6), false, 4)}
            </div>
          </div>
          <div className="md:ml-3 text-2xl font-medium text-high-emphesis">{trade?.inputAmount?.currency?.symbol}</div>
        </div>
        <div className="ml-3 mb-2 mt-2 mr-3 min-w-[24px]">
          <ArrowDown size={24} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CurrencyLogo currency={trade?.outputAmount?.currency} size={48} />
            <div
              className={`overflow-ellipsis md:w-[220px] overflow-hidden font-bold text-2xl ${
                priceImpactSeverity > 2 ? 'text-red' : 'text-high-emphesis'
              }`}
            >
              {formatNumberScale(trade?.outputAmount?.toSignificant(6), false, 4)}
            </div>
          </div>
          <div className="ml-3 text-2xl font-medium text-high-emphesis">{trade?.outputAmount?.currency?.symbol}</div>
        </div>
      </div>

      <TradePrice
        price={trade?.executionPrice}
        showInverted={showInverted}
        setShowInverted={setShowInverted}
        className="px-0 mb-3 mt-3"
        // trade={trade}
      />

      <AdvancedSwapDetails 
        trade={trade} 
        allowedSlippage={allowedSlippage} 
        // minerBribe={minerBribe} 
      />

      {showAcceptChanges ? (
        <div className="flex mt-3 items-center justify-between p-0 md:p-2 px-0 md:px-3 border border-dark-600 rounded">
          <div className="flex items-center justify-start text-sm font-bold uppercase text-high-emphesis">
            <div className="ml-2 mb-2 mt-2 m:mr-0 mr-3 min-w-[24px]">
              <AlertTriangle size={24} />
            </div>
            <span>{i18n._(t`Price Updated`)}</span>
          </div>
          <span className="mr-2 text-sm cursor-pointer text-purple" onClick={onAcceptChanges}>
            {i18n._(t`Accept`)}
          </span>
        </div>
      ) : null}
      <div className="mb-2 mt-2 justify-start text-sm text-secondary">
        {trade?.tradeType === TradeType.EXACT_INPUT ? (
          <>
            {i18n._(t`Output is estimated. You'll receive at least`)}{' '}
            <b>
              {trade?.minimumAmountOut(allowedSlippage).toSignificant(6)} {trade?.outputAmount?.currency?.symbol}
            </b>{' '}
            {i18n._(t`or the transaction will revert.`)}
          </>
        ) : (
          <>
            {i18n._(t`Input is estimated. You will sell at most`)}{' '}
            <b>
              {trade?.maximumAmountIn(allowedSlippage).toSignificant(6)} {trade?.inputAmount?.currency?.symbol}
            </b>{' '}
            {i18n._(t`or the transaction will revert.`)}
          </>
        )}
      </div>

      {recipient !== null ? (
        <div className="flex-start">
          <>
            {i18n._(t`Output will be sent to`)}{' '}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </>
        </div>
      ) : null}
    </div>
  )
}
