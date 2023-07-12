import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import loadingCircle from 'animation/loading-circle.json'
import { ModalActionProps } from 'components/Modal/Action'
import { HeadlessUiModal } from 'components/Modal/index'
import Typography from 'components/Typography'
import { getExplorerLink, shortenString } from 'functions'
import { useActiveWeb3React } from 'services/web3'
import { useAppSelector } from 'state/hooks'
import { selectTxStatus } from 'state/transactions/selectors'
import Lottie from 'lottie-react'
import React, { FC, ReactElement } from 'react'

import { ModalHeaderProps } from './Header'

export interface SubmittedModalContentProps extends ModalHeaderProps {
  children?: React.ReactChild
  animationData?: Object
  txHash?: string
  onDismiss(): void
  onBack?(): void
  actions?: ReactElement<ModalActionProps> | ReactElement<ModalActionProps>[]
}

const SubmittedModalContent: FC<SubmittedModalContentProps> = ({
  header,
  children,
  subheader,
  animationData,
  txHash = '',
  onDismiss,
  onBack,
  actions,
}) => {
  const { chainId } = useActiveWeb3React()
  const txStatus = useAppSelector(selectTxStatus(txHash))

  return (
    <HeadlessUiModal.Body>
      {animationData && (
        <div className="w-[102px] h-[102px] rounded-full flex justify-center p-6">
          <Lottie animationData={animationData} autoplay loop={false} />
        </div>
      )}
      <HeadlessUiModal.Header onClose={onDismiss} onBack={onBack} header={header} subheader={subheader} />
      <HeadlessUiModal.Content>
        <div className="flex flex-col divide-y divide-dark-700">
          <div className="flex justify-between gap-2 py-2">
            <Typography variant="sm" className="text-secondary">
              {`Transaction Hash`}
            </Typography>
            {txHash && (
              <Typography variant="sm" weight={700} className="text-blue">
                <a target="_blank" rel="noreferrer" href={getExplorerLink(chainId, txHash, 'transaction')}>
                  {shortenString('0x376c05d690faac163bb042b8755ea3c604776b3743f70c5ee4eda503f284ff1c', 12)}
                </a>
              </Typography>
            )}
          </div>

          <div className="flex justify-between gap-2 py-2">
            <Typography variant="sm" className="text-secondary">
              {`Status`}
            </Typography>
            <Typography id={`div-tx-status`} variant="sm" weight={700} className="flex items-center gap-2 italic">
              {txStatus === 'PENDING'
                ? `Processing`
                : txStatus === 'SUCCESS'
                ? `Success`
                : txStatus === 'CANCELLED'
                ? `Cancelled`
                : txStatus === 'FAILED'
                ? `Failed`
                : ''}
              {txStatus === 'PENDING' ? (
                <div className="w-4 h-4">
                  <Lottie animationData={loadingCircle} autoplay loop />
                </div>
              ) : txStatus === 'SUCCESS' ? (
                <CheckCircleIcon className="w-4 h-4 text-green" />
              ) : txStatus === 'CANCELLED' || txStatus === 'FAILED' ? (
                <XCircleIcon className="w-4 h-4 text-high-emphesis" />
              ) : (
                ''
              )}
            </Typography>
          </div>
        </div>
        {children}
      </HeadlessUiModal.Content>
      <HeadlessUiModal.Actions>
        <HeadlessUiModal.Action main={!actions} onClick={onDismiss}>
          {`Close`}
        </HeadlessUiModal.Action>
        {actions}
      </HeadlessUiModal.Actions>
    </HeadlessUiModal.Body>
  )
}

export default SubmittedModalContent