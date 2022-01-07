import { Wrap } from 'components/ReusableStyles'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import Container from 'components/Container'
import Head from 'next/head'
import React from 'react'

import SoulList from 'features/farm/SoulList'
// import NavLink from 'components/NavLink'

const SoulPower = () => {
  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <DoubleGlowShadowV2 opacity="0.6">
      <Container id="farm-page">
        <Head>
          <title>Farm with SoulPower ($SOUL)</title>
          <meta key="description" name="description" content="Farm SOUL" />
        </Head>
        <SoulList />
      </Container>
      </DoubleGlowShadowV2>
      <div className="flex items-center px-4">
        </div>
    </Wrap>
  )
}

export default SoulPower