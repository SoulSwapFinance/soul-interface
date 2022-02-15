// import { LiquidityPositionsBalances } from 'features/portfolio/AssetBalances/liquidityPositions'
import { LiquidityPositionsBalancesSum } from 'features/portfolio/BalancesSum'
import HeaderDropdown from 'features/portfolio/HeaderDropdown'
import { useAccountInUrl } from 'features/portfolio/useAccountInUrl'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'
import React from 'react'

const LiquidityPosition = () => {
  const account = useAccountInUrl('/portfolio')
  if (!account) return

  return (
    <>
      <TridentHeader pattern="bg-binary">
        <HeaderDropdown account={account} />
        <LiquidityPositionsBalancesSum />
      </TridentHeader>
      <TridentBody>
        <div className="flex flex-col justify-between gap-8">
          {/* <LiquidityPositionsBalances /> */}
        </div>
      </TridentBody>
    </>
  )
}

LiquidityPosition.Layout = TridentLayout

export default LiquidityPosition