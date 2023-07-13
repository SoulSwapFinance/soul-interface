import { HeadlessUiModal } from 'components/Modal'
import React, { FC } from 'react'

interface DepositSubmittedModalContent {
  txHash: string
  onDismiss(): void
}

const DepositSubmittedModalContent: FC<DepositSubmittedModalContent> = ({ txHash, onDismiss }) => {

  return (
    <HeadlessUiModal.SubmittedModalContent
      txHash={txHash}
      header={`Success!`}
      subheader={`Success! Deposit Submitted`}
      onDismiss={onDismiss}
    />
  )
}

export default DepositSubmittedModalContent