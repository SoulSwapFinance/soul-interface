import React, { useMemo } from 'react'
import { ArrowRightIcon } from '@heroicons/react/outline'
import Container from '../../components/Container'
import Head from 'next/head'
import { I18n } from '@lingui/core'
import Link from 'next/link'
import Typography from '../../components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

const EXPLORE = (i18n: I18n) => [
  {
    id: 1,
    name: 'DEV GUIDE',
    description: i18n._(t`Public good blockchain development guide.`),
    href: './academy/guide'
  },
  {
    id: 2,
    name: 'FLASH BOTS',
    description: 'Fair ecosystem for MEV extraction.',
    href: './academy/mev'
  },
  {
    id: 3,
    name: 'COINTELEGRAPH',
    description: 'Digital media resource covering blockchain tech.',
    href: './academy/telegraph'
  },
]

export default function Academy() {
  const { i18n } = useLingui()
  const features = useMemo(() => EXPLORE(i18n), [i18n])

  return (
    <Container id="features-page" className="py-4 space-y-5 md:py-8 lg:py-12" maxWidth="xl">
      <Head>
        <title>Academy | Soul</title>
        <meta key="description" name="description" content="Learn how to make the most out of Web3 technology." />
      </Head>
      <Typography variant="h1" className="text-center" component="h1">
        EXPLORE DEFI
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