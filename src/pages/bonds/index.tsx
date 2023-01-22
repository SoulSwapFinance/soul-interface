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
import MINT_BANNER from 'assets/branding/mint-banner.png'

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
            <a className="block text-md font-bold md:text-xl text-white font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
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
            <Image src={MINT_BANNER}
              height={180}
              width={1080}
            />
          </div>
        <Head>
          <title>Bonds | All</title>
          <meta key="description" name="description" content="Mint SOUL" />
        </Head>
        <div className={`flex justify-center m-1 p-1`}>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/dashboard'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>SoulSwap Data </span>
            </a>
          </NavLink>
        </Button>
      </div>
        <div className="flex ml-2 mr-2 mb-4 mt-2 gap-1 items-center justify-center">
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/autostake'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Stake</span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/summoner'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Summon</span>
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