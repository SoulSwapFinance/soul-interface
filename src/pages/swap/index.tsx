// import { Wrap } from '../../components/ReusableStyles'
// import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'
import Exchange from 'pages/exchange/swap/[[...tokens]]'

const Swap = () => {
  return (
    <div className={`mt-4`}>
        <Head>
          <title>Swap | Soul</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>        
        <Exchange />
    </div>
  )
}

export default Swap