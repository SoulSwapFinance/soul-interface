import { Wrap } from '../../components/ReusableStyles'
import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'
import List from 'features/underworld/List'
import DoubleGlowShadowBlue from 'components/DoubleGlowShadowBlue'

const Summoner = () => {
  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <Container id="farm-page">
        <DoubleGlowShadowBlue>
        <br/>
        <Head>
          <title>Underworld Markets</title>
          <meta key="description" name="description" content="Underworld Markets" />
        </Head>
        <List />
        </DoubleGlowShadowBlue>
      </Container>
    </Wrap>
  )
}

export default Summoner