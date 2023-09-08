import Head from 'next/head'
import React from 'react'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'
import Swap from 'pages/exchange/swap/[[...tokens]]'

const MobileExchange = () => {
  return (
    <div className={`mt-8`}>
        <Head>
          <title>Swap | All</title>
          <meta key="description" name="description" content="Swap SOUL" />
        </Head>
        <Swap />
    </div>
  )
}

export default MobileExchange

MobileExchange.Guard = NetworkGuard(Feature.AMM)