import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount } from 'sdk'
import { Fraction } from 'entities'
import { UnderworldMarket } from 'features/lending/types'
import { useUnderworldPositions } from 'features/portfolio/AssetBalances/underworld/hooks'
import { CategorySum } from 'features/portfolio/CategorySum'
import React from 'react'

export interface CollateralData {
  collateral: CurrencyAmount<Currency>
  value: CurrencyAmount<Currency>
  limit: Fraction
  pair: UnderworldMarket
}

export const UnderworldCollateral = ({ account }: { account: string }) => {
  const { i18n } = useLingui()
  const { borrowed, collateral } = useUnderworldPositions(account)

  return (
    <CategorySum
      title="Underworld"
      subtitle={i18n._(t`(collateral minus borrowed)`)}
      assetAmounts={collateral}
      liabilityAmounts={borrowed}
      route={`/borrow`}
      // TODO: Change to new borrow page when ready
      // route={`/portfolio/${account}/lend`}
    />
  )
}
