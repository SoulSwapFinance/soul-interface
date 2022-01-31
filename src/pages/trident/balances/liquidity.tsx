import React from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CoffinActionsModal } from 'features/trident/balances/ActionsModal'
// import { LiquidityPositionsBalances } from 'features/trident/balances/AssetBalances'
import BalancesSideBar from 'features/trident/balances/BalancesSideBar'
import { LiquidityPositionsBalancesSum } from 'features/trident/balances/BalancesSum'
import HeaderDropdown from 'features/trident/balances/HeaderDropdown'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'

const LiquidityPosition = () => {
  const { i18n } = useLingui()

  return (
    <>
      <TridentHeader pattern="bg-binary">
        <HeaderDropdown label={i18n._(t`Total Deposits`)} />
        <LiquidityPositionsBalancesSum />
      </TridentHeader>
      <TridentBody>
        <div className="flex flex-col justify-between gap-8">
          <BalancesSideBar />
          {/* <LiquidityPositionsBalances /> */}
          <CoffinActionsModal />
        </div>
      </TridentBody>
    </>
  )
}

LiquidityPosition.Layout = TridentLayout

export default LiquidityPosition