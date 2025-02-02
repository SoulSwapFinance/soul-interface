import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { FC } from 'react'

import { NotificationData } from './index'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'
import { getExplorerLink } from 'functions/explorer'

interface ToastCompleted extends Omit<NotificationData, 'promise'> {
  onDismiss(): void
}

export const ToastCompleted: FC<ToastCompleted> = ({ href, chainId, txHash, onDismiss, summary }) => {
  return (
    <>
      <ToastContent
        icon={<CheckCircleIcon width={18} height={18} className="text-green" />}
        title="Transaction Completed"
        summary={summary.completed}
      />
      <ToastButtons href={href ? href : getExplorerLink(chainId, txHash, 'transaction')} onDismiss={onDismiss} />
    </>
  )
}
