import { XIcon } from '@heroicons/react/solid'
import { CurrencyLogo } from 'components/CurrencyLogo'
import BottomSlideIn from 'components/Dialog/BottomSlideIn'
import Typography from 'components/Typography'
import { selectTridentBalances, setBalancesActiveModal } from 'features/trident/balances/balancesSlice'
import CoffinActions from 'features/trident/balances/CoffinActions'
import DepositToCoffinBoxModal from 'features/trident/balances/DepositToCoffinBoxModal'
import { useBalancesSelectedCurrency } from 'features/trident/balances/useBalancesDerivedState'
import WalletActions from 'features/trident/balances/WalletActions'
import WithdrawToWalletModal from 'features/trident/balances/WithdrawToWalletModal'
import { ActiveModal } from 'features/trident/types'
import useDesktopMediaQuery from 'hooks/useDesktopMediaQuery'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import React, { FC } from 'react'

const _ActionsModal: FC = ({ children }) => {
  const isDesktop = useDesktopMediaQuery()
  const dispatch = useAppDispatch()
  const currency = useBalancesSelectedCurrency()
  const { activeModal } = useAppSelector(selectTridentBalances)

  if (isDesktop) return <></>

  return (
    <BottomSlideIn open={activeModal === ActiveModal.MENU} onClose={() => dispatch(setBalancesActiveModal(undefined))}>
      <div className="flex justify-between bg-dark-800 p-5">
        <div className="flex gap-4 items-center">
          <CurrencyLogo currency={currency} size={42} className="!rounded-full" />
          <Typography variant="h3" className="text-high-emphesis" weight={700}>
            {currency?.symbol}
          </Typography>
        </div>
        <div
          className="w-8 h-8 flex justify-end items-start cursor-pointer"
          onClick={() => dispatch(setBalancesActiveModal(undefined))}
        >
          <XIcon width={20} />
        </div>
      </div>
      {children}
    </BottomSlideIn>
  )
}

export const CoffinActionsModal: FC = () => {
  const isDesktop = useDesktopMediaQuery()
  const dispatch = useAppDispatch()
  const { activeModal } = useAppSelector(selectTridentBalances)

  return (
    <>
      <_ActionsModal>
        <CoffinActions />
      </_ActionsModal>
      <WithdrawToWalletModal
        open={activeModal === ActiveModal.WITHDRAW}
        onClose={() =>
          isDesktop ? dispatch(setBalancesActiveModal(ActiveModal.MENU)) : dispatch(setBalancesActiveModal(undefined))
        }
      />
    </>
  )
}

export const WalletActionsModal: FC = () => {
  const isDesktop = useDesktopMediaQuery()
  const dispatch = useAppDispatch()
  const { activeModal } = useAppSelector(selectTridentBalances)

  return (
    <>
      <_ActionsModal>
        <WalletActions />
      </_ActionsModal>
      <DepositToCoffinBoxModal
        open={activeModal === ActiveModal.DEPOSIT}
        onClose={() =>
          isDesktop ? dispatch(setBalancesActiveModal(ActiveModal.MENU)) : dispatch(setBalancesActiveModal(undefined))
        }
      />
    </>
  )
}