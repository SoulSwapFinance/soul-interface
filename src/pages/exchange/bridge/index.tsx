import React from 'react'
import SwapDropdown from 'features/swap/SwapDropdown'
import { NextSeo } from 'next-seo'
import DoubleGlowShadowV2 from "components/DoubleGlowShadowV2";
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'
import BridgeAssetSelect from 'features/bridge/BridgeAssetSelect'

const Bridge = ({ }) => {
    return (
    <DoubleGlowShadowV2>
      <NextSeo title={`Meta | SoulSwap`} />
      <div className={`grid p-1 mt-8 space-y-2 rounded-2xl bg-dark-1000`}>
        <SwapDropdown
          // inputCurrency={currencyA}
          // outputCurrency={currencyB}
        />
        <div className={`my-12`} />
        <BridgeAssetSelect />
      </div>
    </DoubleGlowShadowV2>
  )
}

export default Bridge
Bridge.Guard = NetworkGuard(Feature.BRIDGE)
