import { TridentHeader } from 'layouts/Trident'
import React, { FC } from 'react'

import Typography from '../../../components/Typography'

export const DiscoverHeader: FC = () => {
  return (
    <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
      <div>
        <Typography variant="h2" className="text-high-emphesis" weight={700}>
          {`CoffinBox Analytics.`}
        </Typography>
        <Typography variant="sm" weight={400}>
          {`Click on the column name to sort CoffinBox tokens by price, liquidity, volume, APY etc...`}
        </Typography>
      </div>
    </TridentHeader>
  )
}