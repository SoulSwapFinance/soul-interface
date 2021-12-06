import { Wrap } from '../../components/ReusableStyles'
import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'

import FantiesList from '../../features/farm/FantiesList'
// import NavLink from '../../components/NavLink'

const Fanties = () => {
  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <DoubleGlowShadowV2 opacity="0.6">
      <Container id="farm-page">
        <Head>
          <title>Farm | Fanties</title>
          <meta key="description" name="description" content="Farm SOUL" />
        </Head>
        <FantiesList />
      </Container>
      </DoubleGlowShadowV2>

    </Wrap>
  )
}

export default Fanties