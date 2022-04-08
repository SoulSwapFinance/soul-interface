import { Wrap } from '../../components/ReusableStyles'
import Container from '../../components/Container'
import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
import Head from 'next/head'
import React from 'react'
import { Banner } from '../../components/Banner'

import StakeList from '../../features/stake/StakeList'

const Circles = () => {
  return (
    <Wrap padding="4rem 0 0 0" justifyContent="center">
      <DoubleGlowShadowV2 opacity="0.6">

      <Container id="stake-page">
        <Head>
          <title>Stake | Soul</title>
          <meta key="description" name="description" content="Stake SOUL" />
        </Head>
        <Banner />
        <StakeList />
      </Container>

      </DoubleGlowShadowV2>
    </Wrap>
  )
}

export default Circles