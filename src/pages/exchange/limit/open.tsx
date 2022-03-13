// import { t } from '@lingui/macro'
// import { useLingui } from '@lingui/react'
// import Typography from 'components/Typography'
import { Feature } from 'enums'
// import DiscoverHeader from 'features/limit/DiscoverHeader'
// import LimitOrderApprovalCheck from 'features/limit/LimitOrderApprovalCheck'
// import OpenOrders from 'features/limit/components/OpenOrders'
// import OrdersTableToggle from 'features/limit/components/OrderTableToggle'
// import useLimitOrders from 'features/limit/hooks/useLimitOrders'
import NetworkGuard from 'guards/Network'
// import { TridentBody } from 'layouts/Trident'
import { useActiveWeb3React } from 'services/web3'
import { useCoffinMasterContractAllowed } from 'state/coffinbox/hooks'
import React from 'react'
import { STOP_LIMIT_ORDER_ADDRESS } from 'sdk'
import { GelatoLimitOrdersHistoryPanel } from 'soulswap-limit-orders-react'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import NavLink from 'components/NavLink'

function OpenOrdersPage() {
  // const { chainId, account } = useActiveWeb3React()
  // const { i18n } = useLingui()
  // const { pending } = useLimitOrders()
  // const masterContract = chainId && STOP_LIMIT_ORDER_ADDRESS[chainId]
  // const allowed = useCoffinMasterContractAllowed(masterContract, account ?? undefined)

  return (

    <div className="flex items-center justify-center sm:min-w-[500px]">
      <DoubleGlowShadowV2>
        <GelatoLimitOrdersHistoryPanel />
        <div className="flex items-right px-4">
          <NavLink href="/exchange/limit">
            <a className="flex text-blue items-center space-x-2 font-medium text-center cursor-pointer text-base hover:text-high-emphesis">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M2.117 12l7.527 6.235-.644.765-9-7.521 9-7.479.645.764-7.529 6.236h21.884v1h-21.883z" />
              </svg>
              <span>Back to Swap</span>
            </a>
          </NavLink>
        </div>
      </DoubleGlowShadowV2>
    </div>

  )
}

OpenOrdersPage.Guard = NetworkGuard(Feature.LIMIT)

export default OpenOrdersPage