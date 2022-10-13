import { Wrap } from 'components/ReusableStyles'
import { BondsBanner } from 'components/Banner'
import Container from 'components/Container'
import Head from 'next/head'
import React from 'react'
import BondList from 'features/bond/List'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'
import NavLink from 'components/NavLink'
import { Button } from 'components/Button'
import { ChainId } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
import ExternalLink from 'components/ExternalLink'
import { SubmitButton } from 'features/bond/Styles'

const Bonds = () => {
  const { chainId } = useActiveWeb3React()
  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <Container id="farm-page">
        {/* <BondsBanner /> */}
        {/* <br/> */} 
        <SubmitButton
        height= "2rem"
        // variant="outlined" 
        primaryColor={"#6F1BD9"} 
        // color={"purple"} 
        // color={getChainColorCode(chainId)} 
        size="lg"
        // className={chainId == ChainId.AVALANCHE ? 'mb-4' : 'hidden'}
        >
        <ExternalLink 
        href = "https://soulswapfinance.medium.com/owning-our-liquidity-via-our-innovative-soul-bonds-podl-592c2849ceed" target = "_blank" rel="noreferrer"
        >
        <a className="block text-md font-bold md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
          <span> Learn More: Innovative Soul Bonds </span>
        </a>
        </ExternalLink>
      </SubmitButton>
        <Head>
          <title>Bonds | All</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>
        <div className="flex ml-2 mr-2 mb-4 gap-1 items-center justify-center">
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/summoner'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Farm </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg" className={[ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? '' : 'hidden'}>
          <NavLink href={'/soul/dashboard'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Data </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/underworld'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Lend </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg" className={[ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? '' : 'hidden'}>
          <NavLink href={'/autostake'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Vault </span>
            </a>
          </NavLink>
        </Button>
        </div>
        <BondList />
      </Container>
    </Wrap>
  )
}

export default Bonds

Bonds.Guard = NetworkGuard(Feature.BONDS)