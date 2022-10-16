import { Currency, TradeType } from 'sdk'
import { t } from '@lingui/macro'
import { rgba } from 'polished'
import React, { useMemo, useState } from 'react'
import { AlertTriangle, Repeat } from 'react-feather'
import { Text } from 'rebass'

import InfoHelper from 'components/InfoHelper'
import { useActiveWeb3React } from 'services/web3'
import { FeeConfig } from 'hooks/useSwapV2Callback'
import useTheme from 'hooks/useTheme'
import { Aggregator } from 'utils/swap/aggregator'
import { useCurrencyConvertedToNative } from 'utils/swap/dmm'
import { getFormattedFeeAmountUsd } from 'utils/fee'

import { Field } from '../../state/swap/actions'
import { TYPE } from '../../theme'
import { computeSlippageAdjustedAmounts, formatExecutionPrice } from '../../utils/prices'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'
import { formatNumber } from 'functions'

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
  feeConfig,
}: {
  trade: Aggregator
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
  feeConfig: FeeConfig | undefined
}) {
  const { chainId } = useActiveWeb3React()
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const theme = useTheme()
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade],
  )

  const nativeInput = useCurrencyConvertedToNative(trade.inputAmount.currency as Currency)

  const nativeOutput = useCurrencyConvertedToNative(trade.outputAmount.currency as Currency)

  const formattedFeeAmountUsd = useMemo(() => getFormattedFeeAmountUsd(trade, feeConfig), [trade, feeConfig])
  const { priceImpact } = trade
  const highPriceImpact = priceImpact > 5
  const veryHighPriceImpact = priceImpact > 15

  return (
    <>
      <AutoColumn gap="0.5rem" style={{ padding: '1rem', border: `1px solid ${theme.border}`, borderRadius: '8px' }}>
        <RowBetween align="center">
          <Text fontWeight={400} fontSize={14} color={theme.subText}>
            Current Price
          </Text>
          <Text
            fontWeight={500}
            fontSize={14}
            color={theme.text}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px',
            }}
          >
            {formatExecutionPrice(trade, showInverted, chainId)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <Repeat size={14} color={theme.text} />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.Black fontSize={14} fontWeight={400} color={theme.subText}>
              {trade.tradeType === TradeType.EXACT_INPUT ? t`Minimum Received` : t`Maximum Sold`}
            </TYPE.Black>
            <InfoHelper size={14} text={t`Minimum amount you will receive or your transaction will revert`} />
          </RowFixed>
          <RowFixed>
            <TYPE.Black fontSize={14}>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </TYPE.Black>
            <TYPE.Black fontSize={14} marginLeft={'4px'}>
              {trade.tradeType === TradeType.EXACT_INPUT ? nativeOutput?.symbol : nativeInput?.symbol}
            </TYPE.Black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.Black fontSize={14} fontWeight={400} color={theme.subText}>
              Gas Fee
            </TYPE.Black>
            <InfoHelper size={14} text={t`Estimated network fee for your transaction`} />
          </RowFixed>

          <TYPE.Black color={theme.text} fontSize={14}>
            {trade.gasUsd ? formatNumber(trade.gasUsd?.toString(), true) : '--'}
          </TYPE.Black>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.Black fontSize={14} fontWeight={400} color={theme.subText}>
              Price Impact
            </TYPE.Black>
            <InfoHelper size={14} text={t`Estimated change in price due to the size of your transaction`} />
          </RowFixed>
          <TYPE.Black
            fontSize={14}
            color={veryHighPriceImpact ? theme.red : highPriceImpact ? theme.warning : theme.text}
          >
            {priceImpact > 0.01 ? parseFloat(priceImpact.toFixed(3)) : '< 0.01'}%
          </TYPE.Black>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.Black fontSize={14} fontWeight={400} color={theme.subText}>
              Slippage
            </TYPE.Black>
          </RowFixed>
          <TYPE.Black fontSize={14}>{allowedSlippage / 100}%</TYPE.Black>
        </RowBetween>

        {feeConfig && (
          <RowBetween>
            <RowFixed>
              <TYPE.Black fontSize={14} fontWeight={400} color={theme.subText}>
                Referral Fee
              </TYPE.Black>
              <InfoHelper size={14} text={t`Commission fee to be paid directly to your referrer`} />
            </RowFixed>
            <TYPE.Black color={theme.text} fontSize={14}>
              {formattedFeeAmountUsd}
            </TYPE.Black>
          </RowBetween>
        )}
      </AutoColumn>
      {highPriceImpact && (
        <AutoRow
          style={{
            marginTop: '16px',
            padding: '15px 20px',
            borderRadius: '16px',
            backgroundColor: rgba(veryHighPriceImpact ? theme.red : theme.warning, 0.35),
            color: theme.text,
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: '18px',
          }}
        >
          <AlertTriangle
            color={veryHighPriceImpact ? theme.red : theme.warning}
            size={16}
            style={{ marginRight: '10px' }}
          />
          {veryHighPriceImpact ? 'Price impact is Very High!' : 'Price impact is High!'}
        </AutoRow>
      )}
      <AutoRow>
        <ButtonError
          onClick={onConfirm}
          disabled={disabledConfirm}
          style={{
            marginTop: '24px',
            ...((highPriceImpact || veryHighPriceImpact) && {
              border: 'none',
              background: veryHighPriceImpact ? theme.red : theme.warning,
              color: theme.text,
            }),
          }}
          id="confirm-swap-or-send"
        >
          <Text fontSize={16} fontWeight={500}>
            {t`Confirm Swap`}
          </Text>
        </ButtonError>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
