import { MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Settings from 'components/Settings'
import Switch from 'components/Switch'
import Typography from 'components/Typography'
import { classNames } from 'functions'
import React, { useMemo, useState } from 'react'

import { useUnderworldPair } from 'features/lending/hooks'
import UnderworldDeposit from './UnderworldDeposit'
import UnderworldWithdraw from './UnderworldWithdraw'

const ManageUnderworldPair = ({ farm }) => {
  const { i18n } = useLingui()

  const underworldPair = useUnderworldPair(farm?.lpToken)

  const [toggle, setToggle] = useState(true)

  const header = useMemo(
    () => (
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Typography weight={700} className="text-high-emphesis">
            {toggle ? i18n._(t`Deposit`) : i18n._(t`Withdraw`)}
            {/* {i18n._(t`Lend Asset`)} */}
          </Typography>
          <div className="flex gap-4">
            <Switch
              size="sm"
              checked={toggle}
              onChange={() => setToggle(!toggle)}
              checkedIcon={<PlusIcon className="text-dark-1000" />}
              uncheckedIcon={<MinusIcon className="text-dark-1000" />}
            />
            <Settings />
          </div>
        </div>
      </div>
    ),
    [i18n] // toggle
  )

  return (
    <>
      <div className={classNames(toggle ? 'flex flex-col flex-grow gap-4' : 'hidden')}>
      {/* <div className={classNames('flex flex-col flex-grow gap-4')}> */}
        <UnderworldDeposit pair={underworldPair} header={header} />
      </div>
      <div className={classNames(!toggle ? 'flex flex-col flex-grow gap-4' : 'hidden')}>
        <UnderworldWithdraw pair={underworldPair} header={header} />
      </div>
    </>
  )
}

export default ManageUnderworldPair