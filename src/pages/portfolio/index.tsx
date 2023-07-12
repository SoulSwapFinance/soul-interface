import TridentLayout from 'layouts/Trident'
import { useActiveWeb3React } from 'services/web3'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

const Portfolio = () => {
  const router = useRouter()
  const { account } = useActiveWeb3React()

  if (account) {
    router.replace(`/portfolio/${account}`)
  }

  return (
    <>
      <Head>
        <title>{`Portfolio`} | Soul</title>
        <meta
          key="description"
          name="description"
          content="Get a summary of all of the balances in your portfolio on Soul."
        />
      </Head>
      <div className="flex flex-col items-center gap-4 mt-32">
        <div>{`Connect Wallet ↗`}</div>

        {/*
          At the moment, there is an RPC issue if you are not connected to your wallet.
          As soon as this is resolved, this ⬇️ can be enabled.
         */}
        {/*<div>{`or`}</div>*/}
        {/*<div>{`Insert Address`}</div>*/}
        {/*<AddressInputBox onSubmit={(account: string) => router.replace(`/portfolio/${account}`} />*/}
      </div>
    </>
  )
}

Portfolio.Layout = TridentLayout

export default Portfolio