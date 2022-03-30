import React from 'react'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import HeadlessUiModal from 'components/Modal/HeadlessUIModal'
import ModalHeader from 'components/Modal/Header'
import Seance from 'pages/applications/seance'

export default function StakeModal(): JSX.Element | null {
  const modalOpen = useModalOpen(ApplicationModal.SEANCE)
  const toggleSeanceModal = useToggleModal(ApplicationModal.SEANCE)

  return (
    <HeadlessUiModal.Controlled isOpen={modalOpen} onDismiss={toggleSeanceModal}
      maxWidth={'md'}
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex flex-col w-full">
            <ModalHeader header={''} onClose={toggleSeanceModal} />
            <Seance />
          </div>
        </div>
      </div>
    </HeadlessUiModal.Controlled>
  )
}


