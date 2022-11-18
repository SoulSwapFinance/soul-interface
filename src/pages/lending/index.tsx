import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Button } from 'components/Button'
import Typography from 'components/Typography'
import LendingMarketList from 'features/lending/LendingMarketList'
import { TridentBody, TridentHeader } from 'layouts/Trident'
import { useActiveWeb3React } from 'services/web3'
import Link from 'next/link'
import React, { FC } from 'react'

const LendingPage: FC = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  return (
    <>
      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div>
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`Lending Markets`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Lend and borrow assets in Lending isolated risk markets`)}
          </Typography>
        </div>
        <div className="flex gap-3">
          {account && (
            <>
              <Link href={`/account/lending?account=${account}`} passHref={true}>
                <Button id="btn-create-new-pool" size="sm">
                  {i18n._(t`My Lending`)}
                </Button>
              </Link>

              <Link href={`/account/borrowing?account=${account}`} passHref={true}>
                <Button id="btn-create-new-pool" size="sm">
                  {i18n._(t`My Borrowing`)}
                </Button>
              </Link>
            </>
          )}

          {/* <Link href="/kashi/create" passHref={true}>
            <Button id="btn-create-new-pool" size="sm">
              {i18n._(t`Create Market`)}
            </Button>
          </Link> */}
        </div>
      </TridentHeader>
      <TridentBody>
        <LendingMarketList />
      </TridentBody>
    </>
  )
}

export default LendingPage