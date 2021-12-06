import { Wrap } from '../../components/ReusableStyles'
import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'

import SeanceList from '../../features/farm/SeanceList'
// import NavLink from '../../components/NavLink'

const SeanceCircle = () => {
  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <DoubleGlowShadowV2 opacity="0.6">
      <Container id="farm-page">
        <Head>
          <title>Farm | SeanceCircle</title>
          <meta key="description" name="description" content="Farm SOUL" />
        </Head>
        <SeanceList />
      </Container>
      </DoubleGlowShadowV2>

    </Wrap>
  )
}

export default SeanceCircle