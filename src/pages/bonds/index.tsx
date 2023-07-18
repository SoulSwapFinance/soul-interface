import Head from 'next/head'
import React from 'react'
import BondList from 'features/bond/List'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'

const Bonds = () => {
  return (
    <div className={`mt-8`}>
        <Head>
          <title>Bonds | All</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>
        <BondList />
    </div>
  )
}

export default Bonds

Bonds.Guard = NetworkGuard(Feature.BONDS)