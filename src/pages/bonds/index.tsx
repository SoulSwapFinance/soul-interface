import { Wrap } from 'components/ReusableStyles'
// import { BondsBanner } from 'components/Banner'
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
import Image from 'next/image'
import BONDS_BANNER from 'assets/branding/bonds-banner.png'

const Bonds = () => {
  const { chainId } = useActiveWeb3React()
  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <Container id="farm-page">
        {/* <BondsBanner /> */}
        {/* <br/> */}
        <SubmitButton
          height="2rem"
          // variant="outlined" 
          primaryColor={"#6F1BD9"}
          // color={"purple"} 
          // color={getChainColorCode(chainId)} 
          size="lg"
        // className={chainId == ChainId.AVALANCHE ? 'mb-4' : 'hidden'}
        >
          <ExternalLink
            href="https://soulswapfinance.medium.com/owning-our-liquidity-via-our-innovative-soul-bonds-podl-592c2849ceed" target="_blank" rel="noreferrer"
          >
            <a className="block text-md font-bold md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span> Learn More: Innovative Soul Bonds </span>
            </a>
          </ExternalLink>
        </SubmitButton>
        <div className={`w-full grid grid-cols-2 p-4 border border-2 rounded rounded-2xl border-purple`}>
          <div className={`flex justify-center bg-dark-800 mr-2 ml-2 rounded rounded-2xl w-5/6`}>
            <Image src={`/favicon.ico`}
              objectFit={`contain`}
              height={72}
              width={72}
              />
          </div>
            <Image src={BONDS_BANNER}
              height={180}
              width={1080}
            />
          </div>
        <Head>
          <title>Bonds | All</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>
        <div className="flex ml-2 mr-2 mb-4 mt-2 gap-1 items-center justify-center">
          <NavLink href={'/summoner'}>
            <Button variant="filled" color="purple" size="lg">
              <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                <span> Farm </span>
              </a>
            </Button>
          </NavLink>
          <NavLink href={'/soul/dashboard'}>
            <Button variant="filled" color="purple" size="lg" className={[ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? '' : 'hidden'}>
              <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                <span> Data </span>
              </a>
            </Button>
          </NavLink>
          <NavLink href={'/lend'}>
            <Button variant="filled" color="purple" size="lg">
              <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                <span> Lend </span>
              </a>
            </Button>
          </NavLink>
          <NavLink href={'/autostake'}>
            <Button variant="filled" color="purple" size="lg" className={[ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? '' : 'hidden'}>
              <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                <span> Vault </span>
              </a>
            </Button>
          </NavLink>
        </div>
        <BondList />
      </Container>
    </Wrap>
  )
}

export default Bonds

Bonds.Guard = NetworkGuard(Feature.BONDS)