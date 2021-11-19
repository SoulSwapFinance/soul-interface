import { ArrowRightIcon } from '@heroicons/react/outline'
import Container from '../../components/Container'
import Head from 'next/head'
import { I18n } from '@lingui/core'
import Link from 'next/link'
import Typography from '../../components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useMemo } from 'react'

const FARMS = (i18n: I18n) => [
  {
    id: 1,
    name: 'SOUL PAIRS',
    href: '/farms/soulpower',
  },
  {
    id: 2,
    name: 'SEANCE PAIRS',
    href: './farms/seancecircle'
  },
  {
    id: 3,
    name: 'ENCHANT PAIRS',
    href: './farms/enchant'
  },
  {
    id: 4,
    name: 'FANTOM PAIRS',
    href: './farms/fanties'
  },
  {
    id: 5,
    name: 'STABLE PAIRS',
    href: './farms/stables'
  },
  {
    id: 6,
    name: 'ALL FARMS',
    href: '/farms/all',
  },
  // {
  //   id: 8,
  //   name: 'EARN SOUL',
  //   href: '/seance'
  // },
  // {
  //   id: 9,
  //   name: 'EARN SEANCE',
  //   href: './enchant'
  // },
  // {
  //   id: 7,
  //   name: 'EARN WFTM & UNIDX',
  //   href: './farms/stables'
  // },
  // {
  //   id: 5,
  //   name: 'WETH PAIRS',
  //   href: './scarab/create'
  // },
  // {
  //   id: 6,
  //   name: 'BTC PAIRS',
  //   href: '/bitcoins'
  // },
]

export default function Tools() {
  const { i18n } = useLingui()
  const features = useMemo(() => FARMS(i18n), [i18n])

  return (
    <Container id="features-page" className="py-4 space-y-4 md:py-8 lg:py-12" maxWidth="xl">
      <Head>
        <title>Farms | Soul</title>
        <meta key="description" name="description" content="SoulSwap Tools..." />
      </Head>
      <Typography variant="h1" component="h1">
        SOUL FARMS
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
                      {/* <p className="text-sm truncate text-secondary">{feature.description}</p> */}
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