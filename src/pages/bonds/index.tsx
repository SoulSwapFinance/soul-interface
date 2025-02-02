import Head from 'next/head'
import React from 'react'
import BondList from 'features/bond/List'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'

const Bonds = () => {
  return (
    <div className={`mt-8`}>
        <Head>
          <title>Bonds | SoulSwap</title>
          <meta name="description" content="SoulSwap bonds enable our community to acquire SOUL by transferring liquidity that goes towards protocol-owned liquidity, which enhances the exchange experience for traders." />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://soulswap.finance/images/soulswap-cover.png" />
          <meta name="twitter:site" content="@SoulSwapFinance" />
          <meta id="og:image" property="og:image" content="https://soulswap.finance/images/soulswap-cover.png" />
          <meta id="og:image:type" property="og:image:type" content="image/png" />
          <meta id="og:image:type" property="og:image:type" content="630" />
          <meta id="og:image:width" property="og:image:width" content="1200" />
          <meta id="og:description" property="og:description" content="SoulSwap bonds enable our community to acquire SOUL by transferring liquidity that goes towards protocol-owned liquidity, which enhances the exchange experience for traders." />
        </Head>
        <BondList />
    </div>
  )
}

Bonds.Guard = NetworkGuard(Feature.BONDS)
export default Bonds
