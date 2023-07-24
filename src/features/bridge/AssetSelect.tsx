import Link from 'next/link'
import React, { useMemo } from 'react'
import { useRouter } from 'next/router'

const ASSET = () => [
    {
        id: 0,
        name: 'USDC',
        description: `USD Coin`,
        href: '/exchange/bridge/assets/USDC',
        color: 'usdcBlue'
    },
    {
        id: 1,
        name: 'WETH',
        description: `Wrapped Ethereum`,
        href: '/exchange/bridge/assets/WETH',
        color: 'ethBlue'
    },
    {
        id: 2,
        name: 'WBTC',
        description: 'Wrapped Bitcoin',
        href: '/exchange/bridge/assets/WBTC',
        color: 'btcOrange'
    },
]

export default function AssetSelect() {
    // const { chainId } = useActiveWeb3React()
    const asset = useMemo(() => ASSET(), [])
    const { asPath } = useRouter()
    const startPage = asPath == ('/exchange/bridge') || asPath == ('/bridge')

    return (
        <div
            className={`mt-2`}
        >
            <div
                className={startPage ? 'relative border-4 border-purple hover:border-dark-600 w-full p-4 rounded bg-dark-900 hover:bg-dark-800 mb-4' : 'hidden'}
            >
                <div className="flex justify-between space-y-4 space-x-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-center focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-xl font-bold truncate text-primary">{`Select Bridge Asset`}</p>
                            {/* <p className="text-sm truncate text-dark-600">{`Select Asset`}</p> */}
                        </div>
                    </div>
                </div>
            </div>
            <ul
                className={'grid grid-cols-3 gap-2 justify-center items-center text-center'}
            // className="space-y-4 divide-y-0"
            >
                {asset.map((asset) => (
                    <li key={asset.id} className={`relative border border-dark-700 gap-4 ${asPath.startsWith(asset.href) ? `bg-${asset.color} text-black hover:border-white` : ''} w-full p-4 rounded-2xl hover:text-white hover:border-dark-800`}>
                        <div className="flex justify-between space-y-4 space-x-4">
                            <div className="flex-1 min-w-0">
                                <Link href={asset.href}>
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    <div className="space-y-1">
                                        <p className="text-xl font-bold truncate">{asset.name}</p>
                                        {/* <p className="text-sm truncate text-secondary">{asset.description}</p> */}
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>

    )
}