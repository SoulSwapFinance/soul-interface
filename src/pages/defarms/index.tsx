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
// import TokenStats from 'components/TokenStats'
import DEFARM_BANNER from 'assets/branding/farm-banner.png'
// import { getChainColor } from 'constants/chains'
import { useActiveWeb3React } from 'services/web3'
import { classNames } from 'functions'
import ExternalLink from 'components/ExternalLink'
import { SubmitButton } from 'features/bond/Styles'

const Defarms = () => {
  const { chainId } = useActiveWeb3React()

  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <DoubleGlowShadowV2 opacity="0.6">
        <Container id="defarm-page">
      <Head>
        <title>DeFarms | SoulSwap</title>
          <meta name="description" content="Providing protocols with the opportunity to incentivize their communities to provide liquidity." />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://soulswap.finance/images/soulswap-cover.png" />
          <meta name="twitter:site" content="@SoulSwapFinance" />
          <meta id="og:image" property="og:image" content="https://soulswap.finance/images/soulswap-cover.png" />
          <meta id="og:image:type" property="og:image:type" content="image/png" />
          <meta id="og:image:type" property="og:image:type" content="630" />
          <meta id="og:image:width" property="og:image:width" content="1200" />
          <meta id="og:description" property="og:description" content="Providing protocols with the opportunity to incentivize their communities to provide liquidity." />
      </Head>
          <div className={`grid p-1 mt-8 rounded-2xl bg-dark-1000`} >
          <div
            className={
              classNames(chainId == ChainId.FANTOM 
                  ? 'grid grid-cols-1 mb-4 gap-2 rounded-xl' 
                  : 'hidden')
              }
          >
            {/* <div className={'grid grid-cols-2'}> */}

            <div className={'grid grid-cols-1 gap-2 border-2 border-dark-800 bg-purple rounded-lg'}>
            <ExternalLink
              href="https://soulswapfinance.medium.com/introducing-defarms-d6f6c9ac3fa6"
              target="_blank"
              rel="noreferrer"
            >
              <SubmitButton
                primaryColor={"#7G1BD9"}
                size="xl"
              >
                <div 
                  className="block text-md font-bold md:text-xl text-white p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300"
                >
                  <span> Learn About DeFarms ↗</span>
                </div>
              </SubmitButton>
            </ExternalLink>
            </div>
            {/* </div> */}
          </div>
          <div
              className={`flex ml-4 mr-4 sm:mr-8 sm:ml-8 border-4 p-4 border-dark-800 rounded-2xl`}
            >
              <Image src={DEFARM_BANNER}
                height={180}
                width={720}
                alt={'defarm banner'}
              />
          </div>
          <div className={`flex justify-center m-1 p-1`}>
          <Button variant="bordered" color="purple" size="lg">
          <NavLink href={'/dashboard'}>
            <div className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Soul Economy</span>
            </div>
          </NavLink>
        </Button>
      </div>
      <div className="flex ml-2 mr-2 mb-4 mt-2 gap-1 items-center justify-center">
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/farms'}>
            <div className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Farm</span>
            </div>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/bonds'}>
            <div className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Bond</span>
            </div>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/autostake'}>
            <div className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Vault</span>
            </div>
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
