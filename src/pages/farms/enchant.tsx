import { Wrap } from '../../components/ReusableStyles'
import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'

import EnchantList from '../../features/farm/EnchantList'
import NavLink from '../../components/NavLink'

const Enchant = () => {
  return (
    <Wrap padding='2rem 0 0 0' justifyContent="center">
      <DoubleGlowShadowV2 opacity="0.6">
      {/* <h1> Farm FANTOM Pairs for SOUL Rewards</h1>
      <br /> */}
      <Container id="farm-page">
        <Head>
          <title>Farm | Enchant</title>
          <meta key="description" name="description" content="Farm SOUL" />
        </Head>
        <EnchantList />
      </Container>
      {/* <NavLink href="/farms">
            <a className="flex items-center space-x-2 font-medium text-center cursor-pointer text-base hover:text-high-emphesis">
              <span>View All Categories</span>
            </a>
          </NavLink> */}
      </DoubleGlowShadowV2>

    </Wrap>
  )
}

export default Enchant