import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ActionsAsideWallet } from 'features/trident/balances/ActionsAside'
import { WalletActionsModal } from 'features/trident/balances/ActionsModal'
import { WalletBalances } from 'features/trident/balances/AssetBalances'
import BalancesSideBar from 'features/trident/balances/BalancesSideBar'
import { WalletBalancesSum } from 'features/trident/balances/BalancesSum'
import HeaderDropdown from 'features/trident/balances/HeaderDropdown'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'
import React from 'react'

const Wallet = () => {
  const { i18n } = useLingui()

  return (
    <>
      <TridentHeader pattern="bg-chevron">
        <HeaderDropdown label={i18n._(t`Wallet Assets`)} />
        <WalletBalancesSum />
      </TridentHeader>
      <TridentBody>
        <div className="flex flex-row justify-between gap-10">
          <div className="flex flex-col gap-8 w-full">
            <BalancesSideBar />
            <div className="flex flex-col gap-4">
              <WalletBalances />
            </div>
            <WalletActionsModal />
          </div>
          <div className="flex flex-col hidden mt-[-188px] lg:block lg:min-w-[304px]">
            <ActionsAsideWallet />
          </div>
        </div>
      </TridentBody>
    </>
  )
}

Wallet.Layout = TridentLayout

export default Wallet