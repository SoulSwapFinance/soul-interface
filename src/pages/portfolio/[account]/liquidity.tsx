import { LiquidityPositionsBalancesSum } from 'features/portfolio/BalancesSum'
import HeaderDropdown from 'features/portfolio/HeaderDropdown'
import { useAccountInUrl } from 'features/portfolio/useAccountInUrl'
import TridentLayout, { TridentHeader } from 'layouts/Trident'
import React from 'react'

const LiquidityPosition = () => {
  const account = useAccountInUrl('/portfolio')
  if (!account) return (
    <div>
      <div>
        <div>
          {`Please connect to Fantom`}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <TridentHeader pattern="bg-binary">
        <HeaderDropdown account={account} />
        <LiquidityPositionsBalancesSum />
      </TridentHeader>
    </>
  )
}

LiquidityPosition.Layout = TridentLayout

export default LiquidityPosition