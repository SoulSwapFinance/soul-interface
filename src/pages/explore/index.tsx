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
    description: i18n._(t`Deposit your SOUL-LP to earn $SOUL rewards.`),
    href: './farms',
  },
  {
    id: 2,
    name: 'STAKE SOUL',
    description: 'Borrow $SEANCE with $SOUL and earn rewards.',
    href: './seance'
  },
  {
    id: 3,
    name: 'SEANCE CIRCLES',
    description: 'Deposit $SEANCE to earn $WFTM and $UNIDX.',
    href: './circles'
  },
  {
    id: 4,
    name: 'LEND & BORROW',
    description: 'Lend assets and farm or borrow for more.',
    href: './borrow'
  },
  {
    id: 5,
    name: 'SHARE YOUR SOUL',
    description: 'Send $SOUL for a small sacrifice of $SEANCE.',
    href: './scarab/create'
  },
  {
    id: 6,
    name: 'BRIDGE ASSETS',
    description: 'Bridge from Binance, Ethereum, Huobi, and more.',
    href: 'https://bridge.soul.sh'
  },
]

export default function Tools() {
  const { i18n } = useLingui()
  const features = useMemo(() => EXPLORE(i18n), [i18n])

  return (
    <Container id="features-page" className="py-4 space-y-4 md:py-8 lg:py-12" maxWidth="xl">
      <Head>
        <title>Explore | Soul</title>
        <meta key="description" name="description" content="SoulSwap Tools..." />
      </Head>
      <Typography variant="h1" component="h1">
        OUR ECOSYSTEM
      </Typography>
      <ul className="space-y-4 divide-y-0">
        {features.map((feature) => (
          <li key={feature.id} className="relative w-full p-4 rounded bg-dark-900 hover:bg-dark-800">
            <div className="flex justify-between space-x-4">
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