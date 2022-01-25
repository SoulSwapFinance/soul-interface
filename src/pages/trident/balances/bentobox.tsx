import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ActionsAsideBento } from 'features/trident/balances/ActionsAside'
import { BentoActionsModal } from 'features/trident/balances/ActionsModal'
import { BentoBalances } from 'features/trident/balances/AssetBalances'
import BalancesSideBar from 'features/trident/balances/BalancesSideBar'
import { BentoBalancesSum } from 'features/trident/balances/BalancesSum'
import HeaderDropdown from 'features/trident/balances/HeaderDropdown'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'
import React from 'react'

const BentoBox = () => {
  const { i18n } = useLingui()

  return (
    <>
      <TridentHeader pattern="bg-chevron">
        <HeaderDropdown label={i18n._(t`My CoffinBox`)} />
        <BentoBalancesSum />
      </TridentHeader>
      <TridentBody>
        <div className="flex flex-row justify-between gap-10">
          <div className="flex flex-col gap-8 w-full">
            <BalancesSideBar />
            <div className="flex flex-col gap-4">
              <BentoBalances />
            </div>
            <BentoActionsModal />
          </div>
          <div className="flex flex-col hidden mt-[-188px] lg:block lg:min-w-[304px]">
            <ActionsAsideBento />
          </div>
        </div>
      </TridentBody>
    </>
  )
}

BentoBox.Layout = TridentLayout

export default BentoBox