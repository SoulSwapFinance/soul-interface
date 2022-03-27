import { ArrowRightIcon } from '@heroicons/react/outline'
import Container from '../../components/Container'
import Head from 'next/head'
import { I18n } from '@lingui/core'
import Link from 'next/link'
import Typography from '../../components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useMemo } from 'react'

const EXPLORE = (i18n: I18n) => [
  {
    id: 1,
    name: 'SUMMON SOUL',
    description: i18n._(t`Deposit liquidity or lent asset. Earn SOUL rewards.`),
    href: './farms',
  },
  {
    id: 2,
    name: 'STAKE SOUL',
    description: 'Stake SOUL for SEANCE. Use SEANCE to earn more.',
    href: './seance'
  },
  {
    id: 3,
    name: 'AUTO-STAKE SOUL',
    description: 'Deposit SOUL. Auto-magically compound rewards.',
    href: './autostake'
  },
  {
    id: 4,
    name: 'LUXOR BONDS',
    description: 'Access Luxor Money bonds. Natively on SoulSwap.',
    href: './luxor/bonds'
  },
  {
    id: 5,
    name: 'SOR STABLECOIN',
    description: 'Honor God(dess) Shai. Stake DAI for SOR and more.',
    href: './luxor/sor'
  },
  {
    id: 6,
    name: 'LEND & BORROW',
    description: 'Lend, Leverage, and Farm. Enter the Underworld.',
    href: './borrow'
  },
  {
    id: 7,
    name: 'SHARE YOUR SOUL',
    description: 'Send your SOUL. Only claimable via Seance Circles.',
    href: './scarab/create'
  },
  {
    id: 8,
    name: 'BRIDGE ASSETS',
    description: 'Bridge from BSC, ETH, AVAX, MATIC, HECO, and more.',
    href: 'https://bridge.soulswap.finance'
  },
]

export default function Tools() {
  const { i18n } = useLingui()
  const features = useMemo(() => EXPLORE(i18n), [i18n])

  return (
    <Container id="features-page" className="py-4 space-y-5 md:py-8 lg:py-12" maxWidth="xl">
      <Head>
        <title>Explore | Soul</title>
        <meta key="description" name="description" content="SoulSwap Tools..." />
      </Head>
      <Typography variant="h1" className="text-center" component="h1">
        OUR ECOSYSTEM
      </Typography>
      <ul className="space-y-4 divide-y-0">
        {features.map((feature) => (
          <li key={feature.id} className="relative border gap-4 border-dark-800 hover:border-dark-600 w-full p-5 rounded bg-dark-900 hover:bg-dark-800">
            <div className="flex justify-between space-y-4 space-x-4">
              <div className="flex-1 min-w-0">
                <Link href={feature.href}>
                  <a className="flex items-center justify-between focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <div className="space-y-1">
                      <p className="text-xl font-bold truncate text-primary">{feature.name}</p>
                      <p className="text-sm truncate text-secondary">{feature.description}</p>
                    </div>
                    <ArrowRightIcon width={24} height={24} className="text-high-emphesis" />
                  </a>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  )
}