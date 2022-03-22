import { Wrap } from '../../components/ReusableStyles'
import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'
import LuxList from 'features/luxor/LuxList'

const Lux = () => {
  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <Container id="farm-page">
        <br/>
        <Head>
          <title>Lux | Soul</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>
        <LuxList />
      </Container>
    </Wrap>
  )
}

export default Lux

// Lux.Guard = NetworkGuard(Feature.BONDS)