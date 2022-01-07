import { Wrap } from '../../components/ReusableStyles'
import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
import FarmBanner from '../../components/FarmBanner'
import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'
import FarmList from '../../features/farm/FarmList'

const Farms = () => {
  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <DoubleGlowShadowV2 opacity="0.6">
      <Container id="farm-page">
        <FarmBanner/>
        <br/>
        <Head>
          <title>Farm | All</title>
          <meta key="description" name="description" content="Farm SOUL" />
        </Head>
        <FarmList />
      </Container>
      </DoubleGlowShadowV2>
    </Wrap>
  )
}

export default Farms