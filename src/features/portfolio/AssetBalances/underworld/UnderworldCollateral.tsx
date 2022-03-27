import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount } from 'sdk'
import Typography from 'components/Typography'
import { Fraction } from 'entities'
import AssetBalances from 'features/portfolio/AssetBalances/AssetBalances'
import { useCollateralPositionAmounts } from 'features/portfolio/AssetBalances/underworld/hooks'
import { useCollateralTableConfig } from 'features/portfolio/AssetBalances/underworld/useCollateralTableConfig'
import { useRouter } from 'next/router'
import React from 'react'
import { Button } from 'components/Button'

export interface CollateralData {
  collateral: CurrencyAmount<Currency>
  value: CurrencyAmount<Currency>
  limit: Fraction
  pair: any
}

const useGetCollateralTableData = (): CollateralData[] =>
  useCollateralPositionAmounts().map((p) => ({
    collateral: p.amount,
    value: p.amount,
    limit: p.pair.health.string as Fraction,
    pair: p.pair,
  }))

export const UnderworldCollateral = () => {
  const { i18n } = useLingui()
  const router = useRouter()

  const data = useGetCollateralTableData()
  const config = useCollateralTableConfig(data)

  return (
    <div className="flex flex-col w-full gap-3">
      <div className="flex justify-center items-center gap-2">
      <Button color="purple" >
<Typography weight={700} variant="lg" className="text-high-emphesis">
          {i18n._(t`Underworld Collateral`)}
        </Typography>
        </Button>
        {/* <Typography weight={700} variant="sm" className="text-low-emphesis">
          {i18n._(t`(Collateral)`)}
        </Typography> */}
      </div>
      <AssetBalances config={config} onSelect={(row) => router.push(`/borrow/${row.original.pair.address}`)} />
    </div>
  )
}