import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'

import { CreateTrade } from '../../features/atomic-swap/CreateTrade'
import { TradeItemList } from '../../features/atomic-swap/TradeItemList'
import { Wrap, Illustration } from '../../features/atomic-swap/ReusableStyles'
import Page from '../../features/atomic-swap/Page'

const AtomicSwap = () => {
  return (
    <>
      {' '}
      {/* <DoubleGlowShadowV2 opacity="0.6"> */}
      <Head>
        <title>Trade | Soul</title>
        <meta
          key="description"
          name="description"
          content="Trade bundles of ERC20, 721 or 1155 privately or on the marketplace."
        />
      </Head>
      <Page>
        <Wrap display="flex" justifyContent="center">
          <Illustration src={'/images/atomic-swap/AtomicSwapBannerFinal.gif'} />
        </Wrap>
        <Wrap display="flex" justifyContent="center">
          <CreateTrade />
        </Wrap>
        <TradeItemList />
      </Page>
      {/* </DoubleGlowShadowV2> */}
    </>
  )
}

export default AtomicSwap
