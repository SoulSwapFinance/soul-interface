import React from 'react'
import { Wrap } from 'components/ReusableStyles'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import Container from 'components/Container'
import Head from 'next/head'
import FarmList from 'features/defarms/List'
import Image from 'next/image'
import { Feature } from 'enums'
import { ChainId } from 'sdk'
import NetworkGuard from 'guards/Network'
import NavLink from 'components/NavLink'
import { Button } from 'components/Button'
import TokenStats from 'components/TokenStats'
import DEFARM_BANNER from 'assets/branding/farm-banner.png'
import { getChainColor } from 'constants/chains'
import { useActiveWeb3React } from 'services/web3'
import { classNames } from 'functions'
import ExternalLink from 'components/ExternalLink'
import { SubmitButton } from 'features/bond/Styles'

const Defarms = () => {
  const { chainId } = useActiveWeb3React()

  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <DoubleGlowShadowV2 opacity="0.6">
        <Container id="farm-page">
          <Head>
            <title>DeFarms | Soul</title>
            <meta key="description" name="description" content="Farm" />
            <Image src="https://giphy.com/embed/kPCDnjRGh7POYS4Z5P" width={480} height={480} alt={'egg gif with tokens'} />
          </Head>      
          <div className={`grid p-1 mt-8 rounded rounded-2xl bg-dark-1000`} >
                      <div
            className={
              classNames(chainId == ChainId.FANTOM 
                  ? 'mb-4 rounded rounded-xl bg-purple' 
                  : 'hidden')
              }
          >
            <ExternalLink
              href="https://soulswapfinance.medium.com/introducing-defarms-d6f6c9ac3fa6"
              target="_blank"
              rel="noreferrer"
            >
              <SubmitButton
                primaryColor={"#7G1BD9"}
                size="xl"
              >
                <a 
                  className="block text-md font-bold md:text-xl text-white font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300"
                >
                  <span> Learn About DeFarms ↗</span>
                </a>
              </SubmitButton>
            </ExternalLink>
          </div>
          <div
              className={`w-full grid grid-cols-2 p-4 rounded rounded-2xl border border-2 border-purple`}
            >
              <div className={`w-full`}>
              <TokenStats />
              </div>
              <Image src={DEFARM_BANNER}
                height={180}
                width={1080}
                alt={'economy data page banner'}
              />
            </div>
          <div className={`flex justify-center m-1 p-1`}>
          <Button variant="bordered" color="purple" size="lg">
          <NavLink href={'/dashboard'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Soul Economy</span>
            </a>
          </NavLink>
        </Button>
      </div>
      <div className="flex ml-2 mr-2 mb-4 mt-2 gap-1 items-center justify-center">
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/farms'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Farms</span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/bonds'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Bonds</span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/autostake'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Vault</span>
            </a>
          </NavLink>
        </Button>
      </div> 
            <FarmList />
            <div className="grid grid-cols-2 mt-2">
              {/* <iframe src="https://giphy.com/embed/kPCDnjRGh7POYS4Z5P" width="100%" height="240" allowFullScreen></iframe>
            <iframe src="https://giphy.com/embed/nPquUiVkV4K9j26fB3" width="100%" height="240" allowFullScreen></iframe> */}
            </div>
    </div>
        </Container>
      </DoubleGlowShadowV2>
    </Wrap>
  )
}

export default Defarms

Defarms.Guard = NetworkGuard(Feature.DEFARM)
