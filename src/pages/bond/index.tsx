import { Wrap } from 'components/ReusableStyles'
import Container from 'components/Container'
import Head from 'next/head'
import React from 'react'
// import BondsList from 'features/bonds/List'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'

const Bond = () => {
  return (
    <div className={`mt-8`}>
        <Head>
          <title>Bond | All</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>
        {/* <BondsList /> */}
    </div>
  )
}

export default Bond

Bond.Guard = NetworkGuard(Feature.BOND)