// import { Wrap } from '../../components/ReusableStyles'
// import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'
import AutoStake from 'pages/soul/autostake'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'

const Autostake = () => {
  return (
    <div className={`mt-4`}>
        <Head>
          <title>Autostake | Soul</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>        
        <AutoStake />
    </div>
  )
}

export default Autostake

Autostake.Guard = NetworkGuard(Feature.VAULT)