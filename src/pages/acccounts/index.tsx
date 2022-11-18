import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Feature } from 'enums'
import ActionsModal from 'features/portfolio/ActionsModal'
import { CoffinBalances, WalletBalances } from 'features/portfolio/AssetBalances/coffinAndWallet'
import HeaderDropdown from 'features/portfolio/HeaderDropdown'
import { classNames, featureEnabled } from 'functions'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React from 'react'

const Portfolio = () => {
  const { i18n } = useLingui()

  const router = useRouter()

  const account = router.query.account as string
  const chainId = router.query.account ? Number(router.query.chainId) : undefined

  const coffinBoxEnabled = featureEnabled(Feature.COFFINBOX, chainId)

  if (!account || !chainId) return null

  return (
    <>
      <NextSeo title={`${i18n._(t`Account`)} ${account}`} />
      <TridentHeader pattern="bg-chevron">
        <HeaderDropdown account={account} 
        // chainId={chainId} 
        />
      </TridentHeader>
      <TridentBody
        className={classNames('flex flex-col gap-10 lg:grid lg:gap-4', coffinBoxEnabled ? 'grid-cols-2' : 'grid-cols-1')}
      >
        <WalletBalances account={account} chainId={chainId} />
        {coffinBoxEnabled && 
        <CoffinBalances account={account} 
        // chainId={chainId} 
        />
        }
      </TridentBody>
      <ActionsModal />
    </>
  )
}

Portfolio.Layout = TridentLayout

export default Portfolio