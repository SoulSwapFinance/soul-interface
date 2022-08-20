import React from 'react'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import HeadlessUiModal from 'components/Modal/HeadlessUIModal'
import ModalHeader from 'components/Modal/Header'
import Stake from 'pages/applications/stake'
import { useActiveWeb3React } from 'services/web3'

export default function StakeModal(): JSX.Element | null {
  const modalOpen = useModalOpen(ApplicationModal.STAKE)
  const toggleStakeModal = useToggleModal(ApplicationModal.STAKE)
  const { chainId } = useActiveWeb3React()
  return (
    <HeadlessUiModal.Controlled isOpen={modalOpen} onDismiss={toggleStakeModal}
      chainId={chainId}
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


