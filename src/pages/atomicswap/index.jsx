import { Wrap } from '../../components/ReusableStyles'
import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'

// import FarmList from '../../features/farm/FarmList'

const AtomicSwap = () => {
  return (
    <Wrap padding="2rem 0 0 0" justifyContent="center">
      <DoubleGlowShadowV2 opacity="0.6">
        <Container id="atomic-swap">
          <Head>
            <title>Trade | Soul</title>
            <meta
              key="description"
              name="description"
              content="Trade bundles of ERC20, 721 or 1155 privately or on the marketplace."
            />
          </Head>
          {/* <FarmList /> */}
        </Container>
      </DoubleGlowShadowV2>
    </Wrap>
  )
}

export default AtomicSwap
