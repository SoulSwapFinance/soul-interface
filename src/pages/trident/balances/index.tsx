import ActionsModal from 'features/trident/balances/ActionsModal'
import { CoffinBalances, WalletBalances } from 'features/trident/balances/AssetBalances'
import HeaderDropdown from 'features/trident/balances/HeaderDropdown'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'
import React from 'react'

const Balances = () => {
  return (
    <>
      <TridentHeader pattern="bg-chevron">
        <HeaderDropdown />
      </TridentHeader>
      <TridentBody className="flex flex-col gap-10 lg:grid grid-cols-2 lg:gap-4">
        <WalletBalances />
        <CoffinBalances />
      </TridentBody>
      <ActionsModal />
    </>
  )
}

Balances.Layout = TridentLayout

export default Balances