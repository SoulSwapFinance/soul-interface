import React from 'react'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import HeadlessUiModal from 'components/Modal/HeadlessUIModal'
import ModalHeader from 'components/Modal/Header'
import LuxorBonds from 'pages/applications/bonds'

export default function LuxorBondsModal(): JSX.Element | null {
  const modalOpen = useModalOpen(ApplicationModal.LUXOR_BONDS)
  const toggleLuxorModal = useToggleModal(ApplicationModal.LUXOR_BONDS)

  return (
    <HeadlessUiModal.Controlled isOpen={modalOpen} onDismiss={toggleLuxorModal}
      maxWidth={'3xl'}
    >
      <div className="justify-center">
          <div className="flex flex-col w-full">
            <ModalHeader header={''} onClose={toggleLuxorModal} />
            <LuxorBonds />
          </div>
      </div>
    </HeadlessUiModal.Controlled>
  )
}


