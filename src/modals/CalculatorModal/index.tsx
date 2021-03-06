import React from 'react'
import { useModalOpen, useToggleCalculatorModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import HeadlessUiModal from 'components/Modal/HeadlessUIModal'
import ModalHeader from 'components/Modal/Header'
import Calculator from 'pages/applications/calculator'

export default function CalculatorModal(): JSX.Element | null {
  const calculatorModalOpen = useModalOpen(ApplicationModal.CALCULATOR)
  const toggleCalculatorModal = useToggleCalculatorModal()

  return (
    <HeadlessUiModal.Controlled isOpen={calculatorModalOpen} onDismiss={toggleCalculatorModal}
      maxWidth={'md'}
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex flex-col w-full">
            <ModalHeader header={''} onClose={toggleCalculatorModal} />
            <Calculator/>
          </div>
        </div>
      </div>
    </HeadlessUiModal.Controlled>
  )
}


