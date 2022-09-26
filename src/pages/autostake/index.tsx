import { Wrap } from '../../components/ReusableStyles'
import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'
import AutoStake from 'pages/soul/autostake'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'

const Autostake = () => {
  return (
      <Container id="farm-page">
        <br/>
        <Head>
          <title>Autostake | Soul</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>        
        <AutoStake />
      </Container>
  )
}

export default Autostake

Autostake.Guard = NetworkGuard(Feature.VAULT)