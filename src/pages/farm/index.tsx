// import { Wrap } from '../../components/ReusableStyles'
// import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'
import Summoner from 'pages/summoner'

const Swap = () => {
  return (
    <div className={`mt-4`}>
        <Head>
          <title>Swap | Soul</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>        
        <Summoner />
    </div>
  )
}

export default Swap