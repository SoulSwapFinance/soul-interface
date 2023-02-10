import { Wrap } from '../../../components/ReusableStyles'
import Container from '../../../components/Container'
import Head from 'next/head'
import React from 'react'
import { FtmList } from 'features/luxor/List'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'
// import { useLuxorPrice } from 'hooks/getPrices'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums/Feature'
import { LuxorBanner, DonateBanner } from 'components/Banner'

const Luxor = () => {
  // const luxorPrice = useLuxorPrice()

  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <LuxorBanner />
      <Container id="luxor-page">
        <Head>
          <title>Luxor | Soul</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>
        <div className="flex ml-0 mr-0 mb-1 mt-4 gap-1 items-center justify-center">
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/dashboard'}>
            <a className="block text-md md:text-xl text-black font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Data </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/stake'}>
            <a className="block text-md md:text-xl text-black font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Stake </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/wrap'}>
            <a className="block text-md md:text-xl text-black font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Wrap </span>
            </a>
          </NavLink>
        </Button>
      </div>
        <FtmList />
      </Container>
    </Wrap>
  )
}

Luxor.Guard = NetworkGuard(Feature.LUXOR)

export default Luxor

