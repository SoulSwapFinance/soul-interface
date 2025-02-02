import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Container from '../../components/Container'
import Head from 'next/head'
import Link from 'next/link'
import Typography from '../../components/Typography'
import React, { useMemo } from 'react'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums/Feature'

const SOUL = () => [
  {
    id: 0,
    name: 'CHOOSE YOUR DESTINY...',
    description: `SELECT PATH`,
    href: '/explore',
  },
  {
    id: 1,
    name: 'SUMMONER',
    description: `Deposit liquidity or lent assets. Earn SOUL.`,
    href: './farms',
  },
  {
    id: 2,
    name: 'BONDER',
    description: `Deposit liquidity. Mint SOUL.`,
    href: './bond',
  },
  {
    id: 3,
    name: 'ENCHANTER',
    description: 'Deposit SOUL. Auto-compound SOUL.',
    href: './soul/autostake'
  },
]

const Explore = () => {
  const soulFeature = useMemo(() => SOUL(), [])

  return (
    <Container id="features-page" className="py-4 space-y-5 md:py-8 lg:py-12" maxWidth="4xl">
      <Head>
        <title>Explore | Soul</title>
        <meta key="description" name="description" content="SoulSwap Tools..." />
      </Head>
      <div className="py-1 bg-dark-600" />
        <div className="py-1 bg-purple" />
      <Typography variant="h1" className="text-center text-dark-600" component="h1">
        SOULSWAP FINANCE
      </Typography>
      <div className="py-1 bg-dark-600" />
        <div className="py-1 bg-purple" />
      <ul className="space-y-4 divide-y-0">
        {soulFeature.map((soulFeature) => (
          <li key={soulFeature.id} className="relative border gap-4 border-purple hover:border-dark-600 w-full p-4 rounded bg-dark-900 hover:bg-dark-800">
          {soulFeature.id  == 0 &&
            <div className="flex justify-between space-y-4 space-x-4">
              <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-xl font-bold truncate text-primary">{soulFeature.name}</p>
                      <p className="text-sm truncate text-dark-600">{soulFeature.description}</p>
                  </div>
              </div>
            </div>
                }
          {soulFeature.id  > 0 &&
            <div className="flex justify-between space-y-4 space-x-4">
              <div className="flex-1 min-w-0">

                <Link href={soulFeature.href}>
                  <div className="flex items-center justify-between focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <div className="space-y-1">
                      <p className="text-xl font-bold truncate text-primary">{soulFeature.name}</p>
                      <p className="text-sm truncate text-secondary">{soulFeature.description}</p>
                    </div>
                    <ArrowRightIcon width={24} height={24} className="text-high-emphesis" />
                    {/* {
                        soulFeature.id  == 0 
                          ? <ArrowDownIcon width={24} height={24}  className="text-high-emphesis"/>
                          : <ArrowRightIcon width={24} height={24} className="text-high-emphesis" />
                    } */}
                  </div>
                </Link>
              </div>
            </div>
                }
          </li>
        ))}
      </ul>
    </Container>
  )
}

Explore.Guard = NetworkGuard(Feature.EXPLORE)
export default Explore
