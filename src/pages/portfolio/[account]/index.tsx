import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import ActionsModal from 'features/portfolio/ActionsModal'
import { CoffinBalances, WalletBalances } from 'features/portfolio/AssetBalances/coffinAndWallet'
import { UnderworldCollateral } from 'features/portfolio/AssetBalances/underworld/UnderworldCollateral'
import { UnderworldLent } from 'features/portfolio/AssetBalances/underworld/UnderworldLent'
import HeaderDropdown from 'features/portfolio/HeaderDropdown'
import { useAccountInUrl } from 'features/portfolio/useAccountInUrl'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'
import Head from 'next/head'
import React from 'react'

const Portfolio = () => {
  const { i18n } = useLingui()

  const account = useAccountInUrl('/portfolio')
  if (!account) return

  return (
    <>
      <Head>
        <title>{i18n._(t`Portfolio`)} | Soul</title>
        <meta
          key="description"
          name="description"
          content="Get a summary of all of the balances in your portfolio on Soul."
        />
      </Head>
      <TridentHeader pattern="bg-chevron">
        <HeaderDropdown account={account} />
      </TridentHeader>
      <TridentBody className="flex flex-col gap-10 lg:grid grid-cols-2 lg:gap-4">
       {/* <UnderworldLent />
        <UnderworldCollateral /> */}
        <WalletBalances account={account} />
        <CoffinBalances account={account} />
      </TridentBody>
      <ActionsModal />
    </>
  )
}

Portfolio.Layout = TridentLayout

export default Portfolio