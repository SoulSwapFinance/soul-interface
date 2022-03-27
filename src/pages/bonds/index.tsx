import { Wrap } from '../../components/ReusableStyles'
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
      <Container id="farm-page">
        <BondsBanner/>
        <br/>
        <Head>
          <title>Bonds | All</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>
        <BondList />
      </Container>
    </Wrap>
  )
}

export default Bonds

Bonds.Guard = NetworkGuard(Feature.BONDS)