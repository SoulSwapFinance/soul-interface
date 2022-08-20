import React from 'react'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import HeadlessUiModal from 'components/Modal/HeadlessUIModal'
import ModalHeader from 'components/Modal/Header'
import Sor from 'pages/applications/sor'
import { useActiveWeb3React } from 'services/web3'

export default function SorModal(): JSX.Element | null {
  const modalOpen = useModalOpen(ApplicationModal.SOR)
  const toggleSorModal = useToggleModal(ApplicationModal.SOR)
  const { chainId } = useActiveWeb3React() 
  
  return (
    <HeadlessUiModal.Controlled isOpen={modalOpen} onDismiss={toggleSorModal}
    chainId={chainId}
    maxWidth={'md'}
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex flex-col w-full">
            <ModalHeader header={''} onClose={toggleSorModal} />
            <Sor />
          </div>
        </div>
      </div>
    </HeadlessUiModal.Controlled>
  )
}


