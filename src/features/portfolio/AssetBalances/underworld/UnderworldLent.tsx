import { Button } from 'components/Button'
import Typography from 'components/Typography'
import AssetBalances from 'features/portfolio/AssetBalances/AssetBalances'
import { useLendPositionAmounts } from 'features/portfolio/AssetBalances/underworld/hooks'
import { useBasicTableConfig } from 'features/portfolio/AssetBalances/useBasicTableConfig'
import { useRouter } from 'next/router'
import React from 'react'

export const UnderworldLent = () => {
  const router = useRouter()

  const lentPositions = useLendPositionAmounts()
  const { config } = useBasicTableConfig(
    lentPositions.map((p) => ({ asset: p.amount, pair: p.pair })),
    false
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-center items-center gap-2">
      <Button color="purple" >
      <Typography weight={700} variant="lg" className="text-high-emphesis">
          {`Underworld Assets`}
        </Typography>
        </Button>
        {/* <Typography weight={700} variant="sm" className="text-low-emphesis">
          {i18n._(t`(Provided)`)}
        </Typography> */}
      </div>
      <AssetBalances config={config} onSelect={(row) => router.push(`/lend/${row.original.pair.address}`)} />
    </div>
  )
}