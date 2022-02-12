import { HeadlessUiModal } from 'components/Modal'
import ActionView from 'features/portfolio/ActionsModal/ActionView'
import DepositView from 'features/portfolio/ActionsModal/DepositView'
import WithdrawView from 'features/portfolio/ActionsModal/WithdrawView'
import {
  selectTridentBalances,
  setBalancesActiveModal,
  setBalancesModalOpen,
  setBalancesState,
} from 'features/portfolio/portfolioSlice'
import { ActiveModal } from 'features/trident/types'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import React, { FC, useCallback } from 'react'

const ActionsModal: FC = () => {
  const dispatch = useAppDispatch()
  const { activeModal, modalOpen } = useAppSelector(selectTridentBalances)

  const handleDismiss = useCallback(() => {
    setBalancesState({
      activeModal: undefined,
      currency: undefined,
    })
  }, [])

  return (
    <HeadlessUiModal.Controlled
      isOpen={modalOpen}
      onDismiss={() => dispatch(setBalancesModalOpen(false))}
      afterLeave={handleDismiss}
      maxWidth="md"
    >
      {activeModal === ActiveModal.DEPOSIT ? (
        <DepositView
          onBack={() => dispatch(setBalancesActiveModal(ActiveModal.MENU))}
          onClose={() => dispatch(setBalancesActiveModal(undefined))}
        />
      ) : activeModal === ActiveModal.WITHDRAW ? (
        <WithdrawView
          onBack={() => dispatch(setBalancesActiveModal(ActiveModal.MENU))}
          onClose={() => dispatch(setBalancesActiveModal(undefined))}
        />
      ) : (
        <ActionView onClose={() => dispatch(setBalancesActiveModal(undefined))} />
      )}
    </HeadlessUiModal.Controlled>
  )
}

export default ActionsModal
