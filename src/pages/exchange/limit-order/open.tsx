import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'components/Typography'
import { Feature } from 'enums'
import DiscoverHeader from 'features/limit-order/DiscoverHeader'
import LimitOrderApprovalCheck from 'features/limit-order/LimitOrderApprovalCheck'
import OpenOrders from 'features/limit-order/components/OpenOrders'
import OrdersTableToggle from 'features/limit-order/components/OrderTableToggle'
import useLimitOrders from 'features/limit-order/hooks/useLimitOrders'
import NetworkGuard from 'guards/Network'
import { TridentBody } from 'layouts/Trident'
import { useActiveWeb3React } from 'services/web3'
import { useCoffinMasterContractAllowed } from 'state/coffinbox/hooks'
import React from 'react'
import { STOP_LIMIT_ORDER_ADDRESS } from 'sdk'

function OpenOrdersPage() {
  const { chainId, account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { pending } = useLimitOrders()
  const masterContract = chainId && STOP_LIMIT_ORDER_ADDRESS[chainId]
  const allowed = useCoffinMasterContractAllowed(masterContract, account ?? undefined)

  return (
    <>
      <LimitOrderApprovalCheck />
      <DiscoverHeader />
      <TridentBody>
        {pending.totalOrders > 0 && typeof allowed !== 'undefined' && !allowed && (
          <div className="border border-yellow/40 rounded p-4">
            <Typography variant="sm" className="text-yellow">
              {i18n._(t`It seems like you have open orders while the limit order master contract is not yet approved. Please make
          sure you have approved the limit order master contract or the order will not execute`)}
            </Typography>
          </div>
        )}
        <OrdersTableToggle />
        <OpenOrders />
      </TridentBody>
    </>
  )
}

OpenOrdersPage.Guard = NetworkGuard(Feature.LIMIT_ORDERS)

export default OpenOrdersPage