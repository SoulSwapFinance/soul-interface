import { ArrowRightIcon } from '@heroicons/react/outline'
import Container from '../../components/Container'
import Head from 'next/head'
import { I18n } from '@lingui/core'
import Link from 'next/link'
import Typography from '../../components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useMemo } from 'react'

const TOOLS = (i18n: I18n) => [
  // {
  //   id: 1,
  //   name: 'MEOWSHI',
  //   description: i18n._(t`Redenominate ENCHANT into MEOWSHI`),
  //   href: '/tools/meowshi',
  // },
  // {
  //   id: 2,
  //   name: 'INARI',
  //   description: 'Deposit SOUL in various strategies & platforms in one click!',
  //   href: '/inari',
  // },
  {
    id: 1,
    name: 'SUMMON SOUL POWER',
    description: i18n._(t`Earn SOUL rewards by depositing your SoulSwap LP.`),
    href: '/farm',
  },
  {
    id: 2,
    name: 'BORROW SEANCE AND EARN SOUL',
    description: 'Deposit SOUL collatoral to BORROW SEANCE, while earning more SOUL.',
    href: './seance'
  },
  {
    id: 3,
    name: 'STAKE SEANCE FOR REWARDS',
    description: 'Deposit SEANCE to EARN Fantom (WFTM) and UniDex (UNIDX).',
    href: './circles'
  },
  {
    id: 4,
    name: 'EARN FEE SHARE WITH ENCHANT',
    description: 'Deposit SEANCE to EARN fee-shares, deposited to ENCHANT.',
    href: './enchant'
  },
  {
    id: 5,
    name: 'SHARE YOUR SOUL WITH FRIENDS',
    description: 'Use a SCARAB to send SOUL to a friend, for a small sacrifice...',
    href: './scarab'
  },
  {
    id: 6,
    name: 'BRIDGE YOUR ASSETS',
    description: 'Bridge assets from blockchains such as: Binance, Ethereum, and more!',
    href: './bridge'
  },
]

export default function Tools() {
  const { i18n } = useLingui()
  const tools = useMemo(() => TOOLS(i18n), [i18n])

  return (
    <Container id="tools-page" className="py-4 space-y-4 md:py-8 lg:py-12" maxWidth="xl">
      <Head>
        <title>Tools | Soul</title>
        <meta key="description" name="description" content="SoulSwap Tools..." />
      </Head>
      <Typography variant="h1" component="h1">
        OUR ECOSYSTEM
      </Typography>
      <ul className="space-y-4 divide-y-0">
        {tools.map((tool) => (
          <li key={tool.id} className="relative w-full p-4 rounded bg-dark-900 hover:bg-dark-800">
            <div className="flex justify-between space-x-4">
              <div className="flex-1 min-w-0">
                <Link href={tool.href}>
                  <a className="flex items-center justify-between focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <div className="space-y-1">
                      <p className="text-xl font-bold truncate text-primary">{tool.name}</p>
                      <p className="text-sm truncate text-secondary">{tool.description}</p>
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