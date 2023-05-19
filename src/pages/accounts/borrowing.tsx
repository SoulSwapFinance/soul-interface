import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'components/Typography'
import { LendingBorrowingList } from 'features/lending/BorrowingList'
import ActionsModal from 'features/portfolio/ActionsModal'
import HeaderDropdown from 'features/portfolio/HeaderDropdown'
import TridentLayout, { TridentBody, TridentHeader } from 'layouts/Trident'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React from 'react'

const Lending = () => {
  const { i18n } = useLingui()
  const router = useRouter()

  const account = router.query.account as string
  const chainId = router.query.account ? Number(router.query.chainId) : undefined

  if (!account || !chainId) return null

  return (
    <>
      <NextSeo title={`Underworld borrow positions for account ${account}`} />

      <TridentHeader pattern="bg-chevron">
        <HeaderDropdown 
            account={account} 
            // chainId={chainId} 
        />
      </TridentHeader>
      <TridentBody>
        <Typography variant="lg" className="text-high-emphesis" weight={700}>
          {i18n._(t`Underworld Borrowing Positions`)}
        </Typography>
        {/* Need to pass down account and chainId */}
        <LendingBorrowingList />
      </TridentBody>
      <ActionsModal />
    </>
  )
}

Lending.Layout = TridentLayout

export default Lending