import React, { useState } from 'react'
import { Feature } from 'enums'
import SwapHeader from 'features/swap/SwapHeader'
import NetworkGuard from 'guards/Network'
import { SwapLayout, SwapLayoutCard } from 'layouts/SwapLayout'
import useLimitOrderDerivedCurrencies from 'state/limit-order/hooks'
import { GelatoLimitOrderPanel, GelatoLimitOrdersHistoryPanel } from 'soulswap-limit-orders-react'
import { Toggle } from 'components/Toggle'
// import Chart from 'components/Chart'
import Image from 'next/image'
import { classNames } from 'functions'
import { ChainId } from 'sdk'
import { useActiveWeb3React } from 'services/web3'

const LimitOrder = () => {
  const { chainId } = useActiveWeb3React()
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()
  const [showOrders, setShowOrders] = useState(false)
  return (
    <SwapLayoutCard>
      <div id="limit-page" className="w-full h-full max-w-2xl space-y-3 rounded bg-dark-1200 z-1">
        <div className="px-2">
          <SwapHeader inputCurrency={inputCurrency} outputCurrency={outputCurrency} />
        </div>
        <div className="ml-0 mb-4 sm:ml-0">
          <GelatoLimitOrderPanel showCommonBases={false} />
        </div>
      </div>
      <div className={classNames([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `flex flex-cols-2 gap-3 text-white justify-end` : `hidden`)}>
        <Toggle
          id="toggle-button"
          optionA="Orders"
          optionB="Orders"
          isActive={showOrders}
          toggle={
            showOrders
              ? () => {
                setShowOrders(false)
              }
              : () => {
                setShowOrders(true)
              }
          }
        />
      </div>
      {!showOrders &&
        <div className="grid grid-cols-1">
          {/* <Image src='https://app.soulswap.finance/neon-bg.jpeg' height="400px" width="400px" /> */}
          {/* <Image src='https://app.soulswap.finance/neon-bg.jpeg' height="400px" width="400px" /> */}
          {/* <Image src='https://app.soulswap.finance/neon-triangle-lights.jpeg' height="600px" width="600px" /> */}
          <Image src='https://app.soulswap.finance/title-soul-halfs.png' height="400px" width="600px" alt="logo" />
        </div>
      }
      {showOrders &&
        <div className="ml-0 mb-4 sm:ml-0">
          <GelatoLimitOrdersHistoryPanel />
        </div>
      }
    </SwapLayoutCard>
  )
}

LimitOrder.Guard = NetworkGuard(Feature.LIMIT)
LimitOrder.Layout = SwapLayout('limit-order-page')

export default LimitOrder