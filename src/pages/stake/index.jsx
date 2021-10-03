import { Wrap } from '../../components/ReusableStyles'
import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'

import { StakeList } from '../../features/stake/StakePairRow'

const Farm = () => {
  return (
    <Wrap padding="4rem 0 0 0" justifyContent="center">
      <Container id="farm-page">
        <Head>
          <title>Stake | Soul</title>
          <meta key="description" name="description" content="Stake SOUL" />
        </Head>

        <StakeList />
      </Container>
    </Wrap>
  )
}

export default Farm
