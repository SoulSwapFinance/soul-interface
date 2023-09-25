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
import { useActiveWeb3React } from 'services/web3'

const Luxor = () => {
  const { chainId } = useActiveWeb3React()

  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
        <Container id="luxor-page">
        <Head>
          <title>Luxor | Soul</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>
        <div className="flex ml-0 mr-0 mb-1 mt-4 gap-1 items-center justify-center">
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/redeem'}>
            <div className="block text-md md:text-xl text-black font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            {'Redeem'}
            </div>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/stake'}>
            <div className="block text-md md:text-xl text-black font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            {'Unstake'}
            </div>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/wrap'}>
            <div className="block text-md md:text-xl text-black font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            {'Unwrap'}
            </div>
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

