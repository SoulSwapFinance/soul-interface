import React from 'react'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import HeadlessUiModal from 'components/Modal/HeadlessUIModal'
import ModalHeader from 'components/Modal/Header'
import Wrap from 'pages/applications/wrap'
import { useActiveWeb3React } from 'services/web3'

export default function WrapModal(): JSX.Element | null {
  const modalOpen = useModalOpen(ApplicationModal.WRAP)
  const toggleWrapModal = useToggleModal(ApplicationModal.WRAP)
  const { chainId } = useActiveWeb3React()
  return (
    <HeadlessUiModal.Controlled 
    isOpen={modalOpen}
    chainId={chainId}
    onDismiss={toggleWrapModal}
      maxWidth={'3xl'}
    >
      <div className="justify-center">
          <div className="flex flex-col w-full">
            <ModalHeader header={''} onClose={toggleWrapModal} />
            <Wrap />
          </div>
      </div>
    </HeadlessUiModal.Controlled>
  )
}


