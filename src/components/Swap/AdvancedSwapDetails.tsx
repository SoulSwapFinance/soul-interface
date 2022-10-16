import { Currency, TradeType } from 'sdk'
import { t } from '@lingui/macro'
import React, { useMemo, useState } from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'
import DropdownSVG from 'assets/icons/down.svg'
import Divider from 'components/Divider'
import InfoHelper from 'components/InfoHelper'
import { FeeConfig } from 'hooks/useSwapV2Callback'
import useTheme from 'hooks/useTheme'
import { Field } from 'state/swap/actions'
import { useUserSlippageToleranceV2 } from 'state/user/hooks'
import { TYPE } from 'theme'
// import { formattedNum } from 'utils'
import { Aggregator } from 'utils/swap/aggregator'
import { useCurrencyConvertedToNative } from 'utils/swap/dmm'
import { getFormattedFeeAmountUsd } from 'utils/fee'
import { computeSlippageAdjustedAmounts } from 'utils/prices'

import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'
import { formatNumber } from 'functions'

const IconWrapper = styled.div<{ show: boolean }>`
  color: ${({ theme }) => theme.text};
  transform: rotate(${({ show }) => (!show ? '0deg' : '-180deg')});
  transition: transform 300ms;
`
const ContentWrapper = styled(AutoColumn)<{ show: boolean }>`
  max-height: ${({ show }) => (show ? '500px' : 0)};
  margin-top: ${({ show }) => (show ? '12px' : 0)};
  transition: margin-top 300ms ease, height 300ms ease;
  overflow: hidden;
`

interface TradeSummaryProps {
  trade: Aggregator
  allowedSlippage: number
  feeConfig?: FeeConfig | undefined
}

function TradeSummary({ trade, feeConfig, allowedSlippage }: TradeSummaryProps) {
  const theme = useTheme()
  const [show, setShow] = useState(feeConfig ? true : false)

  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

  const nativeInput = useCurrencyConvertedToNative(trade.inputAmount.currency as Currency)
  const nativeOutput = useCurrencyConvertedToNative(trade.outputAmount.currency as Currency)

  const formattedFeeAmountUsd = useMemo(() => getFormattedFeeAmountUsd(trade, feeConfig), [trade, feeConfig])

  return (
    <>
      <AutoColumn>
        <RowBetween style={{ cursor: 'pointer' }} onClick={() => setShow(prev => !prev)} role="button">
          <Text fontSize={12} fontWeight={500} color={theme.text}>
           MORE INFORMATION
          </Text>
          <IconWrapper show={show}>
            <DropdownSVG></DropdownSVG>
          </IconWrapper>
        </RowBetween>
        <ContentWrapper show={show} gap="0.75rem">
          <Divider />
          <RowBetween>
            <RowFixed>
              <TYPE.Black fontSize={12} fontWeight={400} color={theme.subText}>
                {isExactIn ? t`Minimum Received` : t`Maximum Sold`}
              </TYPE.Black>
              <InfoHelper size={14} text={t`Minimum amount you will receive or your transaction will revert`} />
            </RowFixed>
            <RowFixed>
              <TYPE.Black color={theme.text} fontSize={12}>
                {isExactIn
                  ? !!slippageAdjustedAmounts[Field.OUTPUT]
                    ? `${formatNumber(slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(10) || '0')} ${
                        nativeOutput?.symbol
                      }`
                    : '-'
                  : !!slippageAdjustedAmounts[Field.INPUT]
                  ? `${formatNumber(slippageAdjustedAmounts[Field.INPUT]?.toSignificant(10) || '0')} ${
                      nativeInput?.symbol
                    }`
                  : '-'}
              </TYPE.Black>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <TYPE.Black fontSize={12} fontWeight={400} color={theme.subText}>
               Gas Fee
              </TYPE.Black>

              <InfoHelper size={14} text={t`Estimated network fee for your transaction`} />
            </RowFixed>
            <TYPE.Black color={theme.text} fontSize={12}>
              {trade.gasUsd ? formatNumber(trade.gasUsd?.toString(), true) : '--'}
            </TYPE.Black>
          </RowBetween>

          <RowBetween>
            <RowFixed>
              <TYPE.Black fontSize={12} fontWeight={400} color={theme.subText}>
               Price Impact
              </TYPE.Black>
              <InfoHelper size={14} text={t`Estimated change in price due to the size of your transaction`} />
            </RowFixed>
            <TYPE.Black fontSize={12} color={trade.priceImpact > 5 ? theme.red : theme.text}>
              {trade.priceImpact === -1
                ? '--'
                : trade.priceImpact > 0.01
                ? trade.priceImpact.toFixed(3) + '%'
                : '< 0.01%'}
            </TYPE.Black>
          </RowBetween>
          {feeConfig && (
            <RowBetween>
              <RowFixed>
                <TYPE.Black fontSize={12} fontWeight={400} color={theme.subText}>
                 Referral Fee
                </TYPE.Black>
                <InfoHelper size={14} text={t`Commission fee to be paid directly to your referrer`} />
              </RowFixed>
              <TYPE.Black color={theme.text} fontSize={12}>
                {formattedFeeAmountUsd}
              </TYPE.Black>
            </RowBetween>
          )}
          {/* <RowBetween>
              <RowFixed>
                <TYPE.Black fontSize={12} fontWeight={400} color={theme.subText}>
                 Route
                </TYPE.Black>
              </RowFixed>
              <ButtonEmpty padding="0" width="max-content" onClick={toggleRoute}>
                <Text fontSize={12} marginRight="4px">
                 View your trade route
                </Text>
                <Eye size={16} />
              </ButtonEmpty>
            </RowBetween> */}
        </ContentWrapper>
      </AutoColumn>
    </>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Aggregator
  feeConfig?: FeeConfig | undefined
}

export function AdvancedSwapDetails({ trade, feeConfig }: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageToleranceV2()

  return trade ? <TradeSummary trade={trade} feeConfig={feeConfig} allowedSlippage={allowedSlippage} /> : null
}
