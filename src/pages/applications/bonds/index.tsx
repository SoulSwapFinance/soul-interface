import React from 'react'
import { Wrap } from '../../../components/ReusableStyles'
import Container from '../../../components/Container'
import Head from 'next/head'
import { Button } from 'components/Button'
import { useLuxorPrice } from 'hooks/getPrices'

const Luxor = () => {
  const luxorPrice = useLuxorPrice()

  return (
    <Wrap padding='1 0 0 0' justifyContent="center">
      <Container id="luxor-page">
        <br/>
        <Head>
          <title>Luxor Money | Soul</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>
        <Button className="mb-2" variant="filled" color="yellow" size="lg">
            <div className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span>Market Price: ${Number(luxorPrice).toFixed(2)}</span>
            </div>
        </Button>
      </Container>
    </Wrap>
  )
}

export default Luxor

// Lux.Guard = NetworkGuard(Feature.BONDS)