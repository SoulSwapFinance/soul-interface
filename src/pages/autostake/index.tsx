import { Wrap } from '../../components/ReusableStyles'
import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'
import AutostakeList from '../../features/autostake/List'
import NavLink from 'components/NavLink'
import { Button } from 'components/Button'
import AutoStake from 'pages/soul/autostake'
// import NetworkGuard from 'guards/Network'
// import { Feature } from 'enums'

const Autostake = () => {
  return (
    // <Wrap padding='1rem 0 0 0' justifyContent="center">
      <Container id="farm-page">
        <br/>
        <Head>
          <title>Autostake | Soul</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>        
        <AutoStake />
      </Container>
    // </Wrap>
  )
}

export default Autostake

// Autostake.Guard = NetworkGuard(Feature.BONDS)