import { Switch } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'components/Typography'
import { useAppDispatch } from 'state/hooks'
import { setFromCoffinBalance } from 'state/limit-order/actions'
import { useLimitOrderState } from 'state/limit-order/hooks'
import React, { FC } from 'react'

const PayFromToggle: FC = () => {
  const { i18n } = useLingui()
  const { fromCoffinBalance } = useLimitOrderState()
  const dispatch = useAppDispatch()

  return (
    <div className="flex gap-2 px-5 py-2 pt-0">
      <Typography variant="sm" weight={700}>
        {i18n._(t`Pay from:`)}
      </Typography>
      <Switch.Group>
        <div className="flex items-center">
          <Switch.Label className="mr-2">
            <Typography variant="sm" className={!fromCoffinBalance ? 'text-primary' : 'text-secondary'}>
              {i18n._(t`Wallet`)}
            </Typography>
          </Switch.Label>
          <Switch
            checked={!fromCoffinBalance}
            onChange={() => dispatch(setFromCoffinBalance(!fromCoffinBalance))}
            className="relative inline-flex items-center h-3 transition-colors bg-gray-600 rounded-full w-9"
          >
            <span
              className={`${
                fromCoffinBalance ? 'translate-x-5' : ''
              } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
            />
          </Switch>
          <Switch.Label className="ml-2">
            <Typography variant="sm" className={fromCoffinBalance ? 'text-primary' : 'text-low-emphesis'}>
              CoffinBox
            </Typography>
          </Switch.Label>
        </div>
      </Switch.Group>
    </div>
  )
}

export default PayFromToggle