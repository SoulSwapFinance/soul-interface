import { SwitchVerticalIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent } from 'sdk'
import limitOrderPairList from 'constants/token-lists/limitOrderPairList.json'
import RecipientField from 'components/RecipientField'
import Typography from 'components/Typography'
import { ZERO_PERCENT } from '../../../constants'
import { Feature } from 'enums'
import LimitOrderApprovalCheck from 'features/limit-order/LimitOrderApprovalCheck'
import LimitOrderButton from 'features/limit-order/LimitOrderButton'
import LimitOrderReviewModal from 'features/limit-order/LimitOrderReviewModal'
import LimitPriceInputPanel from 'features/limit-order/LimitPriceInputPanel'
import OrderExpirationDropdown from 'features/limit-order/components/OrderExpirationDropdown'
import SwapHeader from 'features/swap/SwapHeader'
import SwapAssetPanel from 'features/trident/swap/SwapAssetPanel'
import NetworkGuard from 'guards/Network'
import { SwapLayout, SwapLayoutCard } from 'layouts/SwapLayout'
import { useActiveWeb3React } from 'services/web3'
import { useAppDispatch } from 'state/hooks'
import { Field, setFromCoffinBalance, setRecipient } from 'state/limit-order/actions'
import useLimitOrderDerivedCurrencies, {
  useLimitOrderActionHandlers,
  useLimitOrderDerivedLimitPrice,
  useLimitOrderDerivedParsedAmounts,
  useLimitOrderDerivedTrade,
  useLimitOrderState,
} from 'state/limit-order/hooks'
import { useExpertModeManager } from 'state/user/hooks'
import React, { useMemo } from 'react'
import NavLink from 'components/NavLink'
import Badge from 'components/Badge'
import useLimitOrders from 'features/limit-order/hooks/useLimitOrders'


const LimitOrder = () => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const [isExpertMode] = useExpertModeManager()
  const { typedField, typedValue, fromCoffinBalance, recipient } = useLimitOrderState()
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()
  const { pending } = useLimitOrders()
  const trade = useLimitOrderDerivedTrade()
  const rate = useLimitOrderDerivedLimitPrice()
  const parsedAmounts = useLimitOrderDerivedParsedAmounts({ rate, trade })
  const { onSwitchTokens, onCurrencySelection, onUserInput } = useLimitOrderActionHandlers()

  const pairs = useMemo(
    () => (limitOrderPairList.pairs[chainId || 1] || []).map(([token0, token1]) => [token0.address, token1.address]),
    [chainId]
  )

  const inputPanelHelperText = useMemo(() => {
    if (rate && trade) {
      const { numerator, denominator } = rate.subtract(trade.executionPrice).divide(trade.executionPrice)
      return new Percent(numerator, denominator)
    }
  }, [rate, trade])

  const inputTokenList = useMemo(() => {
    if (pairs.length === 0) return []
    return pairs.reduce((acc, [token0, token1]) => {
      acc.push(token0)
      acc.push(token1)
      return acc
    }, [])
  }, [pairs])

  const outputTokenList = useMemo(() => {
    if (pairs.length === 0) return []
    if (inputCurrency) {

      return pairs.reduce((acc, [token0, token1]) => {
        if (inputCurrency.wrapped.address === token0) acc.push(token1)
        if (inputCurrency.wrapped.address === token1) acc.push(token0)
        return acc
      }, [])
    }
    return pairs.reduce((acc, [token0, token1]) => {
      acc.push(token0)
      acc.push(token1)
      return acc
    }, [])
  }, [inputCurrency, pairs])

  return (
    <>
      <SwapLayoutCard>
        <LimitOrderApprovalCheck />
        <div className="px-2">
          <SwapHeader inputCurrency={inputCurrency} outputCurrency={outputCurrency} />
        </div>
        <div className="flex flex-col gap-3">
          <SwapAssetPanel
            error={false}
            header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`You pay`)} />}
            walletToggle={(props) => (
              <SwapAssetPanel.Switch
                id={`switch-classic-withdraw-from-0}`}
                {...props}
                label={i18n._(t`Pay from`)}
                onChange={() => dispatch(setFromCoffinBalance(!fromCoffinBalance))}
              />
            )}
            selected={true}
            spendFromWallet={!fromCoffinBalance}
            currency={inputCurrency}
            value={(typedField === Field.INPUT ? typedValue : parsedAmounts?.inputAmount?.toSignificant(6)) || ''}
            onChange={(value) => onUserInput(Field.INPUT, value || '')}
            onSelect={(inputCurrency) => onCurrencySelection(Field.INPUT, inputCurrency)}
            currencies={inputTokenList}
          />
          <div className="flex gap-3">
            <div className="flex flex-1">
              <LimitPriceInputPanel trade={trade} limitPrice={!!rate ? rate : trade?.executionPrice} />
            </div>
            <SwitchVerticalIcon
              width={18}
              className="mt-6 cursor-pointer text-secondary hover:text-white"
              onClick={onSwitchTokens}
            />
            <div className="flex flex-1">
              <OrderExpirationDropdown />
            </div>
          </div>
          <SwapAssetPanel
            error={false}
            header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`You receive`)} />}
            selected={true}
            currency={outputCurrency}
            value={(typedField === Field.OUTPUT ? typedValue : parsedAmounts?.outputAmount?.toSignificant(6)) || ''}
            onChange={(value) => onUserInput(Field.OUTPUT, value || '')}
            onSelect={(outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency)}
            currencies={outputTokenList}
            priceImpact={inputPanelHelperText}
            priceImpactCss={inputPanelHelperText?.greaterThan(ZERO_PERCENT) ? 'text-green' : 'text-red'}
          />
        </div>

        {isExpertMode && <RecipientField recipient={recipient} action={setRecipient} />}
        <LimitOrderButton trade={trade} parsedAmounts={parsedAmounts} />
        <LimitOrderReviewModal
          parsedAmounts={parsedAmounts}
          trade={trade}
          limitPrice={!!rate ? rate : trade?.executionPrice}
        />
      </SwapLayoutCard>
      <Typography variant="xs" className="px-10 mt-5 italic text-center text-low-emphesis">
        {i18n._(t`Limit orders use funds from CoffinBox, to create a limit order depositing into CoffinBox is required.`)}
      </Typography>
      <div className="flex items-center px-4">
          <NavLink href="/limit-order/open">
            <a className="flex items-center space-x-2 font-medium text-center cursor-pointer text-base hover:text-high-emphesis">
              {pending.totalOrders == 1 ?
              <span>{i18n._(t`View ${pending.totalOrders} Open Order`)}</span>
              : <span>{i18n._(t`View ${pending.totalOrders} Open Orders`)}</span>
              }
            </a>
          </NavLink>
        </div>
    </>
  )
}

LimitOrder.Guard = NetworkGuard(Feature.LIMIT_ORDERS)
LimitOrder.Layout = SwapLayout('limit-order-page')

export default LimitOrder