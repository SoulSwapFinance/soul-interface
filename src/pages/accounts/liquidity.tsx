import React from 'react'
import { NextSeo } from 'next-seo'
import { LiquidityPositionsBalancesSum } from 'features/portfolio/BalancesSum'
import HeaderDropdown from 'features/portfolio/HeaderDropdown'

// import dynamic from 'next/dynamic'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'
import { useAccountInUrl } from 'features/portfolio/useAccountInUrl'
// import { classNames } from 'functions'
import { useActiveWeb3React } from 'services/web3'

const LiquidityPosition = () => {
    // const { account, chainId } = useActiveWeb3React()
  const account = useAccountInUrl('/portfolio')

  if (!account) return null // || !chainId)

  return (
    <>
      <NextSeo title={`${`Account`} ${account}`} />
      <TridentHeader pattern="bg-chevron">
        <HeaderDropdown account={account} />
        <LiquidityPositionsBalancesSum />
      </TridentHeader>
    </>
  )
}

LiquidityPosition.Layout = TridentLayout

export default LiquidityPosition

// Export the non-dynamic version for static rendering
// export { LiquidityPosition as LiquidityPositionComponent }

// // Export the dynamic version as default
// export default dynamic(() => Promise.resolve(LiquidityPosition), {
//   ssr: false,
// })