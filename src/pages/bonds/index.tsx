import { Wrap } from '../../components/ReusableStyles'
// import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
import BondsBanner from '../../components/BondsBanner'
import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'
import BondList from '../../features/bond/BondList'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'

const Bonds = () => {
  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      {/* <DoubleGlowShadowV2 opacity="0.6"> */}
      <Container id="farm-page">
        <BondsBanner/>
        <br/>
        <Head>
          <title>Mint | All</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>
        <BondList />
      </Container>
      {/* </DoubleGlowShadowV2> */}
    </Wrap>
  )
}

export default Bonds

Bonds.Guard = NetworkGuard(Feature.BONDS)