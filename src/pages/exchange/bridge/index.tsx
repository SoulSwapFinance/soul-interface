import React from 'react'
// import SwapDropdown from 'features/swap/SwapDropdown'
import { NextSeo } from 'next-seo'
import DoubleGlowShadowV2 from "components/DoubleGlowShadowV2";
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'
import BridgeAssetSelect from 'features/bridge/BridgeAssetSelect'
import Head from 'next/head';
import { useActiveWeb3React } from 'services/web3';

const Bridge = ({ }) => {
  const { chainId } = useActiveWeb3React()

  if (!chainId) {
    return <div>
      <div>
        <div>
          {`Please connect to Fantom`}
        </div>
      </div>
    </div>
  }

  return (
    <DoubleGlowShadowV2>
      <Head>
        <title>Bridge | SoulSwap</title>
          {/* <meta name="description" content="SoulSwap is an AMM exchange, part of Soul Protocol, which offers a full suite of DeFi tools." /> */}
          <meta name="description" content="Bridge to and from Fantom, Avalanche, and Ethereum for USDC, WETH, and WBTC via the Squid Router bridge." />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://soulswap.finance/images/soulswap-cover.png" />
          <meta name="twitter:site" content="@SoulSwapFinance" />
          <meta id="og:image" property="og:image" content="https://soulswap.finance/images/soulswap-cover.png" />
          <meta id="og:image:type" property="og:image:type" content="image/png" />
          <meta id="og:image:type" property="og:image:type" content="630" />
          <meta id="og:image:width" property="og:image:width" content="1200" />
          <meta id="og:description" property="og:description" content="Bridge to and from Fantom, Avalanche, and Ethereum for USDC, WETH, and WBTC via the Squid Router bridge." />
      </Head>
      <div className={`grid p-1 mt-8 space-y-2 rounded-2xl bg-dark-1000`}>
        {/* <SwapDropdown
          // inputCurrency={currencyA}
          // outputCurrency={currencyB}
        /> */}
        <div className={`my-12`} />
        <BridgeAssetSelect />
      </div>
    </DoubleGlowShadowV2>
  )
}

Bridge.Guard = NetworkGuard(Feature.BRIDGE)
export default Bridge
