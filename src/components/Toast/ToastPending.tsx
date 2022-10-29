import { Chain } from 'soulswap-chain'
import React, { FC } from 'react'

// import { Loader, NotificationData } from '../../Loader'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'
import { NotificationData } from './Toast'
import Loader from 'components/Loader'

interface ToastPending extends Omit<NotificationData, 'promise'> {
  onDismiss(): void
}

export const ToastPending: FC<ToastPending> = ({ href, chainId, txHash, onDismiss, summary }) => {
  return (
    <>
      <ToastContent
        icon={<Loader width={18} height={18} className="text-blue" />}
        title="Transaction Pending"
        summary={summary.pending}
      />
      <ToastButtons href={href ? href : Chain.from(chainId).getTxUrl(txHash)} onDismiss={onDismiss} />
    </>
  )
}
