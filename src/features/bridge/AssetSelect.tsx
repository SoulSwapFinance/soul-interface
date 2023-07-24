import { ArrowDownIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Container from '../../components/Container'
import Head from 'next/head'
import Link from 'next/link'
// import Typography from '../../components/Typography'
import React, { useMemo } from 'react'
// import NetworkGuard from 'guards/Network'
// import { Feature } from 'enums/Feature'
// import { classNames, featureEnabled } from 'functions'
// import { ChainId } from 'sdk'
// import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'

const SOUL = () => [
    {
        id: 0,
        name: 'USDC',
        description: `USD Coin`,
        href: '/exchange/bridge/assets/USDC',
    },
    {
        id: 1,
        name: 'WETH',
        description: `Wrapped Ethereum`,
        href: '/exchange/bridge/assets/WETH',
    },
    {
        id: 2,
        name: 'WBTC',
        description: 'Wrapped Bitcoin',
        href: '/exchange/bridge/assets/WBTC',
    },
]

export default function AssetSelect() {
    // const { chainId } = useActiveWeb3React()
    const asset = useMemo(() => SOUL(), [])
    const { asPath } = useRouter()
    const startPage = asPath == ('/exchange/bridge') || asPath == ('/bridge')

    return (
        <Container id="features-page" className="py-4 space-y-5 md:py-8 lg:py-12" maxWidth="4xl">
            <Head>
                <title>Bridge | Soul</title>
                <meta key="description" name="description" content="SoulSwap Tools..." />
            </Head>
            <div
                className={startPage ? 'relative border-4 border-purple hover:border-dark-600 w-full p-4 rounded bg-dark-900 hover:bg-dark-800' : 'hidden'}
            >
                <div className="flex justify-between space-y-4 space-x-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-xl font-bold truncate text-primary">Bridge Assets</p>
                            <p className="text-sm truncate text-dark-600">Select Asset</p>
                        </div>
                    </div>
                </div>
            </div>
            <ul className="space-y-4 divide-y-0">
                {asset.map((asset) => (
                    <li key={asset.id} className={`relative border gap-4 ${asPath.startsWith(asset.href) ? `border-purple hover:border-dark-600` : ''} w-full p-4 rounded bg-dark-900 hover:bg-dark-800`}>
                        <div className="flex justify-between space-y-4 space-x-4">
                            <div className="flex-1 min-w-0">
                                <Link href={asset.href}>
                                    <div className="flex items-center justify-between focus:outline-none">
                                        <span className="absolute inset-0" aria-hidden="true" />
                                        <div className="space-y-1">
                                            <p className="text-xl font-bold truncate text-primary">{asset.name}</p>
                                            <p className="text-sm truncate text-secondary">{asset.description}</p>
                                        </div>
                                        <ArrowRightIcon width={24} height={24} className="text-high-emphesis" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </Container>
    )
}