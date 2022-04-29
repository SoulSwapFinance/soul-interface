import { Wrap } from '../../../components/ReusableStyles'
import Container from '../../../components/Container'
import Head from 'next/head'
import React from 'react'
import { LuxList } from 'features/luxor/LuxList'
// import Alert from 'components/Alert'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'
import { useLuxorPrice } from 'hooks/getPrices'
import { LuxorBanner } from 'components/Banner'

const Luxor = () => {
  const luxorPrice = useLuxorPrice()

  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <LuxorBanner />
      <Container id="luxor-page">
        <Head>
          <title>Luxor Money | Soul</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>
        <div className="mt-1 mb-1">
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/swap?inputCurrency=&outputCurrency=0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span>Market Price: ${Number(luxorPrice).toFixed(2)}</span>
            </a>
          </NavLink>
        </Button>
        </div>
        <div className="flex ml-0 mr-0 mb-1 gap-1 items-center justify-center">
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/dashboard'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Data </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/stake'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Stake </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/wrap'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Wrap </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/sor'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Stable </span>
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