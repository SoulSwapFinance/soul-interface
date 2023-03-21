import { Wrap } from 'components/ReusableStyles'
import Container from 'components/Container'
import Head from 'next/head'
import React from 'react'
import Explore from 'features/underworld/analytics/views/Explore'
import { DoubleGlowShadowChain } from 'components/DoubleGlow'

const UnderworldAnalytics = () => {
  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <Container id="underworld-analytics-page">
        <DoubleGlowShadowChain>
        <br/>
        <Head>
          <title>Underworld Market Analytics</title>
          <meta key="description" name="description" content="Underworld Market Analytics" />
        </Head>
        <Explore />
        </DoubleGlowShadowChain>
      </Container>
    </Wrap>
  )
}

export default UnderworldAnalytics