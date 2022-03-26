import { Wrap } from '../../components/ReusableStyles'
import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'
import LuxList from 'features/luxor/LuxList'
import Alert from 'components/Alert'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'

const Luxor = () => {
  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <Container id="luxor-page">
        <br/>
        <Head>
          <title>Luxor Money | Soul</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>
    <div className="flex mb-4 gap-1 items-center justify-center">
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/dashboard'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Dashboard </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/sor'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Stablecoin </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/stake'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Stake Luxor </span>
            </a>
          </NavLink>
        </Button>
      </div>
        <LuxList />
      </Container>
    </Wrap>
  )
}

export default Luxor

// Lux.Guard = NetworkGuard(Feature.BONDS)