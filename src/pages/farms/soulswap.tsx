import React from 'react'
import { Wrap } from '../../components/ReusableStyles'
import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
import Container from '../../components/Container'
import Head from 'next/head'
import SoulSwapList from '../../features/farm/SoulSwapList'

const SoulSwap = () => {
  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <DoubleGlowShadowV2 opacity="0.6">
      <Container id="farm-page">
        <Head>
          <title>Farm with SoulSwap Assets ($SOUL)</title>
          <meta key="description" name="description" content="Farm SOUL" />
        </Head>
        <SoulSwapList />
      </Container>
      </DoubleGlowShadowV2>
      <div className="flex items-center px-4">
        </div>
    </Wrap>
  )
}

export default SoulSwap