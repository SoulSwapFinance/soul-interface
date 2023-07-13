import HeadlessUiModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import React from 'react'
import { useActiveWeb3React } from 'services/web3'

interface TransactionFailedModalProps {
  isOpen: boolean
  onDismiss: () => void
}

export default function TransactionFailedModal({ isOpen, onDismiss }: TransactionFailedModalProps) {
  const { chainId } = useActiveWeb3React()

  return (
    <HeadlessUiModal.Controlled
      isOpen={isOpen}
      chainId={chainId}
      onDismiss={onDismiss} maxWidth="md">
      <div className="flex flex-col gap-4">
        <HeadlessUiModal.Header header={`Transaction Rejected`} onClose={onDismiss} />
        <HeadlessUiModal.BorderedContent className="flex flex-col gap-1 text-center">
          <Typography variant="lg" weight={700} className="text-pink-red" component="span">
            {`Oops!`}{' '}
          </Typography>
          <Typography variant="sm" weight={700} className="text-primary" component="span">
            {`Your transaction got rejected`}
          </Typography>
        </HeadlessUiModal.BorderedContent>
        <Typography variant="xs" className="text-secondary text-center" component="span">
          {`Please try again`}
        </Typography>
      </div>
    </HeadlessUiModal.Controlled>
  )
}
