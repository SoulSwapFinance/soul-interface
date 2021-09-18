import { Wrap } from '../../components/ReusableStyles'

import { ChainId } from '@soulswap/sdk'
import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'

import FarmList from '../../features/farm/FarmsList'

const Farm = () => {
  return (
    <Wrap width="50%" justifyContent="center">
      <Container id="farm-page">
        <Head>
          <title>Farm | Soul</title>
          <meta key="description" name="description" content="Farm SOUL" />
        </Head>

        <FarmList />
      </Container>
    </Wrap>
  )
}

export default Farm
