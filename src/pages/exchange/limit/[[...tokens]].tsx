import React, { useState } from 'react'
import { Feature } from 'enums'
import SwapHeader from 'features/swap/SwapHeader'
import NetworkGuard from 'guards/Network'
import { SwapLayout, SwapLayoutCard } from 'layouts/SwapLayout'
import useLimitOrderDerivedCurrencies from 'state/limit-order/hooks'
import { GelatoLimitOrderPanel, GelatoLimitOrdersHistoryPanel } from 'soulswap-limit-orders-react'
import Toggle from 'components/Toggle'
// import Chart from 'components/Chart'
import Image from 'next/image'

const LimitOrder = () => {
  const { inputCurrency, outputCurrency } = useLimitOrderDerivedCurrencies()
  const [expertMode, openExpertMode] = useState(false)

  return (
      <SwapLayoutCard>
      <div id="limit-page" className="w-full h-full max-w-2xl space-y-3 rounded bg-dark-1200 z-1">
        <div className="px-2">
          <SwapHeader inputCurrency={inputCurrency} outputCurrency={outputCurrency} />
        </div>
        <div className="ml-0 mb-4 sm:ml-0">
        <GelatoLimitOrderPanel />
        </div>
      </div>
      <div className="flex flex-row gap-3 text-white justify-end">
         Orders 
              <Toggle
                id="toggle-button"
                isActive={expertMode}
                toggle={
                  expertMode
                    ? () => {
                        openExpertMode(false)
                      }
                    : () => {
                        openExpertMode(true)
                      }
                }
              />
            </div>
         {  !expertMode && 
                   <div className="grid grid-cols-1">
                   {/* <Image src='https://app.soulswap.finance/neon-bg.jpeg' height="400px" width="400px" /> */}
                   {/* <Image src='https://app.soulswap.finance/neon-bg.jpeg' height="400px" width="400px" /> */}
                   {/* <Image src='https://app.soulswap.finance/neon-triangle-lights.jpeg' height="600px" width="600px" /> */}
                   <Image src='https://app.soulswap.finance/title-soul-halfs.png' height="400px" width="600px" alt="logo"/>
                 </div>
          }
          { expertMode &&
            <div className={`xl:max-w-7xl mt-0 w-full lg:grid-cols-1 order-last space-y-0 lg:space-x-4 lg:space-y-0 bg-dark-900`}>
              <div className={`w-full flex flex-col order-last sm:mb-0 lg:mt-0 p-0 rounded rounded-lg bg-light-glass`}>
                {/* <Chart inputCurrency={inputCurrency} outputCurrency={outputCurrency} /> */}
                <GelatoLimitOrdersHistoryPanel />
              </div>
            </div>
          }
        </SwapLayoutCard>
  )
}

LimitOrder.Guard = NetworkGuard(Feature.LIMIT)
LimitOrder.Layout = SwapLayout('limit-order-page')

export default LimitOrder