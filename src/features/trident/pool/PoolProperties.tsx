import { Pool } from 'sdk'
import Chip from 'components/Chip'
import Typography from 'components/Typography'
import { formatPercent } from 'functions'
import { FC, useMemo } from 'react'

import { POOL_TYPES } from '../constants'
import { poolEntityMapper } from '../poolEntityMapper'
import { chipPoolColorMapper } from '../types'

const _PoolProperties: FC<{ pool: Pool }> = ({ pool }) => {
  const type = useMemo(() => poolEntityMapper(pool), [pool])
  return (
    <>
      <Chip label={POOL_TYPES[type].label_long} color={chipPoolColorMapper[type]} />
      <Typography weight={700} variant="sm">
        {formatPercent(pool?.fee?.valueOf() / 100)} {`Fees`}
      </Typography>
    </>
  )
}

export const PoolProperties: FC<{ pool?: Pool }> = ({ pool }) => {
  if (!pool) return <></>
  return <_PoolProperties pool={pool} />
}