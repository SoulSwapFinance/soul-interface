import React from 'react'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import HeadlessUiModal from 'components/Modal/HeadlessUIModal'
import ModalHeader from 'components/Modal/Header'
import Stake from 'pages/applications/stake'

export default function StakeModal(): JSX.Element | null {
  const modalOpen = useModalOpen(ApplicationModal.STAKE)
  const toggleStakeModal = useToggleModal(ApplicationModal.STAKE)

  return (
    <HeadlessUiModal.Controlled isOpen={modalOpen} onDismiss={toggleStakeModal}
      maxWidth={'md'}
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex flex-col w-full">
            <ModalHeader header={''} onClose={toggleStakeModal} />
            <Stake />
          </div>
        </div>
      </div>
    </HeadlessUiModal.Controlled>
  )
}


