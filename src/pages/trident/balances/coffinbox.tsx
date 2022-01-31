import React from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ActionsAsideCoffin } from 'features/trident/balances/ActionsAside'
import { CoffinActionsModal } from 'features/trident/balances/ActionsModal'
import { CoffinBalances } from 'features/trident/balances/AssetBalances'
import BalancesSideBar from 'features/trident/balances/BalancesSideBar'
import { CoffinBalancesSum } from 'features/trident/balances/BalancesSum'
import HeaderDropdown from 'features/trident/balances/HeaderDropdown'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'

const CoffinBox = () => {
  const { i18n } = useLingui()

  return (
    <>
      <TridentHeader pattern="bg-chevron">
        <HeaderDropdown label={i18n._(t`My CoffinBox`)} />
        <CoffinBalancesSum />
      </TridentHeader>
      <TridentBody>
        <div className="flex flex-row justify-between gap-10">
          <div className="flex flex-col gap-8 w-full">
            <BalancesSideBar />
            <div className="flex flex-col gap-4">
              <CoffinBalances />
            </div>
            <CoffinActionsModal />
          </div>
          <div className="flex flex-col hidden mt-[-188px] lg:block lg:min-w-[304px]">
            <ActionsAsideCoffin />
          </div>
        </div>
      </TridentBody>
    </>
  )
}

CoffinBox.Layout = TridentLayout

export default CoffinBox