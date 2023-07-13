import Head from 'next/head'
import React from 'react'
import Link from 'next/link'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'

const QuickLinks = ({ route, text }) => {
    return (
        <div className="p-4 my-4 bg-dark-900 rounded">
            <Link
                href={{
                    pathname: route,
                }}
            >
                <a className="flex items-center justify-center px-4 text-lg font-medium text-center rounded-md text-secondary hover:text-high-emphesis">
                    {`${text}`}
                </a>
            </Link>
        </div>
    );
};

export default function Inactive() {
    return (
        <>
            <Head>
                <title>{`SoulSwap`}</title>
                <meta
                    key="description"
                    name="description"
                    content="Soul allows for swapping of compatible tokens on Fantom."
                />
            </Head>
            <DoubleGlowShadowV2 opacity="0.6">
                <div className="w-full max-w-2xl p-4 rounded z-1">
                    <QuickLinks route="/enchant" text="Exit Seance from Enchantment" />
                    <QuickLinks route="/exchange/remove/FTM/0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a" text="Remove FTM-Enchant LP" />
                </div>
            </DoubleGlowShadowV2>
        </>
    )
}
