import React, { FC } from 'react'

import { NotificationData } from './index'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'
import { HalfCircleIcon } from 'components/Icons/HalfCircleIcon'
import { getExplorerLink } from 'functions/explorer'

interface ToastInfo extends Omit<NotificationData, 'promise'> {
  onDismiss(): void
}

export const ToastInfo: FC<ToastInfo> = ({ href, chainId, txHash, onDismiss, summary }) => {
  return (
    <>
      <ToastContent
        icon={<HalfCircleIcon width={18} height={18} className="text-blue" />}
        title="Transaction Info"
        summary={summary?.info}
      />
      <ToastButtons href={href ? href : getExplorerLink(chainId, txHash, 'transaction')} onDismiss={onDismiss} />
    </>
  )
}
