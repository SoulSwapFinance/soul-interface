import { Wrap } from '../../components/ReusableStyles'
import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
// import FarmBanner from '../../components/FarmBanner'
import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'
import FarmList from '../../features/farm/List'
import NavLink from 'components/NavLink'
import { Button } from 'components/Button'

const Summoner = () => {
  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <DoubleGlowShadowV2 opacity="0.6">
      {/* <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/swap?inputCurrency=&outputCurrency=0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span><b>Click to Withdraw Inactive Farms</b> </span>
            </a>
          </NavLink>
        </Button> */}
      <Container id="farm-page">
        {/* <FarmBanner/> */}
        <br/>
        <Head>
          <title>Farm | All</title>
          <meta key="description" name="description" content="Farm SOUL" />
        </Head>
        <FarmList />
      </Container>
      </DoubleGlowShadowV2>
    </Wrap>
  )
}

export default Summoner