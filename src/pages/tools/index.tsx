import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Container from '../../components/Container'
import Head from 'next/head'
import Link from 'next/link'
import Typography from '../../components/Typography'
import { useMemo } from 'react'

const TOOLS = () => [
  {
    id: 1,
    name: 'SUMMON SOUL',
    description: 'Deposit your SOUL-LP to earn $SOUL rewards',
    href: './farms',
  },
  {
    id: 2,
    name: 'LEND & EARN',
    description: 'Lend assets, then farm to earn $SOUL rewards.',
    href: './lend'
  },
  {
    id: 3,
    name: 'ENCHANTED BUYBACKS',
    description: 'Deposit $SEANCE and earn protocol fee-shares.',
    href: './enchant'
  },
  {
    id: 4,
    name: 'BRIDGE ASSETS',
    description: 'Bridge from Binance, Ethereum, Huobi, and more.',
    href: './cross'
  },
]

export default function Tools() {
  const tools = useMemo(() => TOOLS(), [])

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