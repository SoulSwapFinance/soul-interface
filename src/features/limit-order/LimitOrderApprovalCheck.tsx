import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Button } from 'components/Button'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import { Feature } from 'enums'
import useLimitOrders from 'features/limit-order/hooks/useLimitOrders'
import { featureEnabled } from 'functions'
import useCoffinMasterApproveCallback, { CoffinApprovalState } from 'hooks/useCoffinMasterApproveCallback'
import { useActiveWeb3React } from 'services/web3'
import cookie from 'cookie-cutter'
import React, { FC, useState } from 'react'
import { STOP_LIMIT_ORDER_ADDRESS } from 'constants/addresses'

const LimitOrderApprovalCheck: FC = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const { pending } = useLimitOrders()
  const { approve, approvalState } = useCoffinMasterApproveCallback(chainId && STOP_LIMIT_ORDER_ADDRESS[chainId], {})
  const [dismissed, setDismissed] = useState<boolean>()

  const isOpen =
    pending.totalOrders > 0 &&
    approvalState === CoffinApprovalState.NOT_APPROVED &&
    !cookie.get('disableLimitOrderGuard') &&
    typeof dismissed !== 'undefined' &&
    !dismissed

  if (chainId && !featureEnabled(Feature.LIMIT_ORDERS, chainId)) return <></>

  return (
    <HeadlessUIModal.Controlled isOpen={isOpen} onDismiss={() => setDismissed(true)} maxWidth="sm">
      <div className="flex flex-col gap-4">
        <HeadlessUIModal.Header header={i18n._(t`Approve Master Contract`)} onClose={() => setDismissed(true)} />
        <HeadlessUIModal.BorderedContent className="bg-dark-1000/40">
          <Typography variant="sm">
            {i18n._(t`It seems like you have open orders while the limit order master contract is not approved. Please make
          sure you approved the limit order master contract or the order will not execute`)}
          </Typography>
        </HeadlessUIModal.BorderedContent>
        <div className="flex justify-end gap-6">
          <Button color="blue" size="sm" variant="empty" onClick={() => cookie.set('disableLimitOrderGuard', true)}>
            {i18n._(t`Do not show again`)}
          </Button>
          <Button loading={approvalState === CoffinApprovalState.PENDING} color="blue" size="sm" onClick={approve}>
            {i18n._(t`Approve`)}
          </Button>
        </div>
      </div>
    </HeadlessUIModal.Controlled>
  )
}

export default LimitOrderApprovalCheck