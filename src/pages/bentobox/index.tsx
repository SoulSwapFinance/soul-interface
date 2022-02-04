import Card from '../../components/Card'
import Container from '../../components/Container'
import Head from 'next/head'
import Image from '../../components/Image'
import Link from 'next/link'
import React from 'react'
import Web3Status from '../../components/Web3Status'
import { SoulLaunchpad } from '../../features/launchpad/SoulLaunchpad'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from 'services/web3'
import { useLingui } from '@lingui/react'

export default function BenotBox() {
  const soulSwapHero = 'https://media.giphy.com/media/8yQady2pFVfGJSnde7/giphy.gif'
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  return (
    <Container
      id="soulswap-page"
      className="relative z-0 flex flex-col justify-center py-4 text-center md:py-8 lg:py-12"
      maxWidth="full"
    >
      <Head>
        <title>SoulSwap Vault | Soul</title>
        <meta
          key="description"
          name="description"
          // content="SoulSwap has a token vault that generates yield for liquidity providers. SoulSwap creates a source of liquidity that any user can access with minimal approvals, minimal gas usage, and maximal capital efficiency."
        />
      </Head>
      <div className="absolute top-0 left-0 right-0 z-0 w-full h-full" style={{ maxHeight: 500 }}>
        {/* <Image
          src={soulSwapHero}
          alt="SoulSwap Hero"
          layout="fill"
          // objectFit="cover"
          objectPosition="top"
          className="opacity-50"
          priority
        /> */}
        <SoulLaunchpad/>
      </div>

      <div className="flex justify-center">
        {/* <Image
          src="/title-logo.png"
          alt="SoulSwap Logo"
          objectFit="scale-down"
          layout="responsive"
          height={150}
          width={240}
          priority
        /> */}
      </div>

      <Container className="z-50 mx-auto" maxWidth="5xl">
        <div className="text-3xl font-bold md:text-5xl text-high-emphesis">{i18n._(t`SoulSwap Apps`)}</div>
        <div className="p-4 mt-0 mb-8 text-base font-medium md:text-lg lg:text-xltext-high-emphesis md:mt-4">
          {/* {i18n._(t`SoulSwap has constructed an innovative way to use dapps gas-efficiently and gain extra yield.`)} */}
        </div>
        <div className="grid grid-cols-4 gap-4 sm:gap-12 grid-flow-auto">
          <Card className="flex items-center justify-center w-full col-span-2 space-y-1 rounded cursor-pointer md:col-span-1 bg-dark-800 hover:bg-dark-900 shadow-pink-glow hover:shadow-pink-glow-hovered">
            <Image
              src={soulSwapHero}
              // src="/underworld-neon.png"
              alt="Underworld Logo"
              objectFit="scale-down"
              layout="responsive"
              height={150}
              width={100}
            />
            {account ? (
              <Link href="/borrow">
                <a className="w-full px-4 py-2 text-center bg-transparent border border-transparent rounded text-high-emphesis border-gradient-r-blue-pink-dark-900">
                  {i18n._(t`Enter`)}
                </a>
              </Link>
            ) : (
              <Web3Status />
            )}
          </Card>
          <Card className="flex items-center justify-center col-span-2 transition-colors cursor-pointer md:col-span-1 bg-dark-800 hover:bg-dark-900 shadow-blue-glow hover:shadow-blue-glow-hovered">
            <Image
              src="/coming-soon.png"
              alt="Coming Soon"
              objectFit="scale-down"
              layout="responsive"
              height={150}
              width={100}
            />
          </Card>
          <Card className="flex items-center justify-center col-span-2 transition-colors cursor-pointer md:col-span-1 bg-dark-800 hover:bg-dark-900 shadow-pink-glow hover:shadow-pink-glow-hovered">
            <Image
              src="/coming-soon.png"
              alt="Coming Soon"
              objectFit="scale-down"
              layout="responsive"
              height={150}
              width={100}
            />
          </Card>
          <Card className="flex items-center justify-center col-span-2 transition-colors cursor-pointer md:col-span-1 bg-dark-800 hover:bg-dark-900 shadow-blue-glow hover:shadow-blue-glow-hovered">
            <Image
              src="/coming-soon.png"
              alt="Coming Soon"
              objectFit="scale-down"
              layout="responsive"
              height={150}
              width={100}
            />
          </Card>
        </div>
      </Container>
    </Container>
  )
}
