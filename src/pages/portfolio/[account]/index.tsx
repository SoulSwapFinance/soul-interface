import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
// import Typography from 'components/Typography'
import { getChainColor } from 'constants/chains'
import ActionsModal from 'features/portfolio/ActionsModal'
import { CoffinBalances, WalletBalances } from 'features/portfolio/AssetBalances/coffinAndWallet'
import { PoolBalances } from 'features/portfolio/AssetBalances/pools'
// import { UnderworldCollateral } from 'features/portfolio/AssetBalances/underworld/UnderworldCollateral'
import { UnderworldLent } from 'features/portfolio/AssetBalances/underworld/UnderworldLent'
// import HeaderDropdown from 'features/portfolio/HeaderDropdown'
import { useAccountInUrl } from 'features/portfolio/useAccountInUrl'
import { shortenAddress } from 'functions'
import TridentLayout, { TridentBody } from 'layouts/Trident'
import Head from 'next/head'
import React from 'react'
import { useActiveWeb3React } from 'services/web3'

const Portfolio = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
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
      {/* <TridentHeader pattern="bg-chevron">
        <HeaderDropdown account={account} />
      </TridentHeader> */}
      {/* lg:grid grid-cols-2 lg:gap-4" */}
      <TridentBody className="flex flex-col gap-10 grid-cols-2 mt-12">
      <div
        className={`grid grid-cols-1 border-2 border-dark-700 rounded-lg font-bold text-2xl text-center justify-center p-2`}
      >
          { `Account Portfolio` }
          {/* { `Account Portfolio (-${shortenAddress(account).substring(9,13)})` } */}
        <div
          className={account ? `text-xs text-[${getChainColor(chainId)}]` : `hidden`}
        > 
          { `Connected to: ${shortenAddress(account)}` }
        </div>
      </div>
        <UnderworldLent />
        {/* <UnderworldCollateral /> */}
        <WalletBalances chainId={chainId} account={account} />
        <CoffinBalances account={account} />
        <PoolBalances account={account} />
      </TridentBody>
      <ActionsModal />
    </>
  )
}

Portfolio.Layout = TridentLayout

export default Portfolio