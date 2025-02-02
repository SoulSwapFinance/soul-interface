import { Feature } from 'enums'
import { classNames, featureEnabled } from 'functions'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'
import { NextSeo } from 'next-seo'
import React from 'react'
import { useActiveWeb3React } from 'services/web3'
import dynamic from 'next/dynamic'

// Dynamically import components that might use browser APIs
const ActionsModal = dynamic(() => import('features/portfolio/ActionsModal'), {
  ssr: false
})

const HeaderDropdown = dynamic(() => import('features/portfolio/HeaderDropdown'), {
  ssr: false
})

const WalletBalances = dynamic(() => import('features/portfolio/AssetBalances/coffinAndWallet').then(mod => mod.WalletBalances), {
  ssr: false
})

const CoffinBalances = dynamic(() => import('features/portfolio/AssetBalances/coffinAndWallet').then(mod => mod.CoffinBalances), {
  ssr: false
})

const Accounts = () => {
  const { account, chainId } = useActiveWeb3React()

  const coffinBoxEnabled = featureEnabled(Feature.COFFINBOX, chainId)
  if (!account || !chainId) return null

  return (
    <>
      <NextSeo title={`${`Account`} ${account}`} />
      <TridentHeader pattern="bg-chevron">
        <HeaderDropdown account={account} />
      </TridentHeader>
      <TridentBody
        className={classNames('flex flex-col gap-10 lg:grid lg:gap-4', coffinBoxEnabled ? 'grid-cols-2' : 'grid-cols-1')}
      >
        <WalletBalances account={account} chainId={chainId} />
        {coffinBoxEnabled && 
        <CoffinBalances account={account} />
        }
      </TridentBody>
      <ActionsModal />
    </>
  )
}

Accounts.Layout = TridentLayout

export default Accounts