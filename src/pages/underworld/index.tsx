import { Wrap } from '../../components/ReusableStyles'
import Container from '../../components/Container'
import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
import Head from 'next/head'
import React from 'react'

import LendList from '../../features/underworld/LendList'

const Underworld = () => {
  return (
    <Wrap padding="4rem 0 0 0" justifyContent="center">
      <DoubleGlowShadowV2 opacity="0.6">

      <Container id="Underworld-page">
        <Head>
          <title>Underworld | Soul</title>
          <meta key="description" name="description" content="Underworld SOUL" />
        </Head>

        <LendList />
      </Container>

      </DoubleGlowShadowV2>
    </Wrap>
  )
}

export default Underworld