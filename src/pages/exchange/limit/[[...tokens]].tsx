import React from 'react'
import { Feature } from 'enums'
import HeaderNew from 'features/trade/HeaderNew'
import NetworkGuard from 'guards/Network'
import { SwapLayout, SwapLayoutCard } from 'layouts/SwapLayout'
import useLimitOrderDerivedCurrencies from 'state/limit-order/hooks'
import { GelatoLimitOrderPanel, GelatoLimitOrdersHistoryPanel } from 'soulswap-limit-orders-react'

const LimitOrder = () => {
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()

  return (
      <SwapLayoutCard>
      <div id="limit-page" className="w-full h-full max-w-2xl space-y-3 rounded bg-dark-1200 z-1">
        <div className="px-2">
          <HeaderNew inputCurrency={inputCurrency} outputCurrency={outputCurrency} />
        </div>
        <div className="ml-0 mb-4 sm:ml-0">
        <GelatoLimitOrderPanel />
        <GelatoLimitOrdersHistoryPanel />
        </div>
      </div>
        </SwapLayoutCard>
  )
}

LimitOrder.Guard = NetworkGuard(Feature.LIMIT)
LimitOrder.Layout = SwapLayout('limit-order-page')

export default LimitOrder