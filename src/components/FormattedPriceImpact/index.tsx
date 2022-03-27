import { Percent } from 'sdk'
import Typography from 'components/Typography'
import { warningSeverity } from 'functions/prices'
import React, { FC } from 'react'

const SEVERITY = {
  0: '',
  1: 'text-high-emphesis',
  2: 'text-yellow',
  3: 'text-red',
  4: 'text-red',
}

const FormattedPriceImpact: FC<{ priceImpact?: Percent }> = ({ priceImpact }) => {
  return (
    <Typography variant="sm" className={SEVERITY[warningSeverity(priceImpact)]}>
      {priceImpact ? `${priceImpact.multiply(-1).toFixed(2)}%` : '-'}
    </Typography>
  )
}

export default FormattedPriceImpact