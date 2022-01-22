import { MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Settings from 'components/Settings'
import Switch from 'components/Switch'
import Typography from 'components/Typography'
import { classNames } from 'functions'
import { useCurrency } from 'hooks/Tokens'
import React, { useMemo, useState } from 'react'

import PoolAddLiquidity from './PoolAddLiquidity'
import PoolRemoveLiquidity from './PoolRemoveLiquidity'

// @ts-ignore TYPE NEEDS FIXING
const ManageSwapPair = ({ farm }) => {
  const { i18n } = useLingui()
  const [toggle, setToggle] = useState(true)

  const token0 = useCurrency(farm.pair.token0.id)
  const token1 = useCurrency(farm.pair.token1?.id)

  const header = useMemo(
    () => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Typography weight={700} className="text-high-emphesis">
            {toggle ? i18n._(t`Add Liquidity`) : i18n._(t`Remove Liquidity`)}
          </Typography>
          <div className="flex gap-4">
            <Switch
              size="sm"
              checked={toggle}
              onChange={() => setToggle(!toggle)}
              checkedIcon={<PlusIcon className="text-dark-1000" />}
              uncheckedIcon={<MinusIcon className="text-dark-1000" />}
            />
            <Settings className="w-[unset] h-[unset]" />
          </div>
        </div>
      </div>
    ),
    [i18n, toggle]
  )

  return (
    <>
      <div className={classNames(toggle ? 'flex flex-col flex-grow gap-4' : 'hidden')}>
        <PoolAddLiquidity currencyA={token0} currencyB={token1} header={header} />
      </div>
      <div className={classNames(!toggle ? 'flex flex-col flex-grow gap-4' : 'hidden')}>
        <PoolRemoveLiquidity currencyA={token0} currencyB={token1} header={header} />
      </div>
    </>
  )
}

export default ManageSwapPair
