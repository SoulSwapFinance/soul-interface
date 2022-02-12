import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useUnderworldPositions } from 'features/portfolio/AssetBalances/underworld/hooks'
import { CategorySum } from 'features/portfolio/CategorySum'
import React from 'react'

interface UnderworldLentProps {
  account: string
}

export const UnderworldLent = ({ account }: UnderworldLentProps) => {
  const { i18n } = useLingui()
  const { lent } = useUnderworldPositions(account)

  return (
    <CategorySum
      title="Underworld"
      subtitle={i18n._(t`(lent assets)`)}
      assetAmounts={lent}
      route={`/lend`}
      // TODO: Change to new lend page when ready
      // route={`/portfolio/${account}/lend`}
    />
  )
}
