import { Wrap } from '../../components/ReusableStyles'
import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'
import AutostakeList from '../../features/autostake/List'
import NavLink from 'components/NavLink'
import { Button } from 'components/Button'
// import NetworkGuard from 'guards/Network'
// import { Feature } from 'enums'

const Autostake = () => {
  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <Container id="farm-page">
        <br/>
        <Head>
          <title>Autostake | Soul</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>
        <div className="flex ml-2 mr-2 mb-4 gap-1 items-center justify-center">
        <Button variant="bordered" color="purple" size="lg">
          <NavLink href={'/seance'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Stake </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="bordered" color="purple" size="lg">
          <NavLink href={'/summoner'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Farm </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="bordered" color="purple" size="lg">
          <NavLink href={'/soul/dashboard'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Data </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="bordered" color="purple" size="lg">
          <NavLink href={'/bonds'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Bond </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="bordered" color="purple" size="lg">
          <NavLink href={'/underworld'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Lend </span>
            </a>
          </NavLink>
        </Button>
      </div>
        <AutostakeList />
      </Container>
    </Wrap>
  )
}

export default Autostake

// Autostake.Guard = NetworkGuard(Feature.BONDS)