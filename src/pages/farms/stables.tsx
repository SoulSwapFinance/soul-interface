import { Wrap } from 'components/ReusableStyles'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import Container from 'components/Container'
import Head from 'next/head'
import React from 'react'

import StablesList from 'features/farm/StablesList'
// import NavLink from 'components/NavLink'

const Stables = () => {
  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <DoubleGlowShadowV2 opacity="0.6">
      <Container id="farm-page">
        <Head>
          <title>Farm with Stables ($SOUL)</title>
          <meta key="description" name="description" content="Farm SOUL" />
        </Head>
        <StablesList />
      </Container>
      </DoubleGlowShadowV2>
    </Wrap>
  )
}

export default Stables