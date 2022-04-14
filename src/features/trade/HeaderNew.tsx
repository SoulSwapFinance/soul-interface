import React, { FC } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency } from 'sdk'
import NavLink from 'components/NavLink'
import Settings from 'components/Settings'
import Typography from 'components/Typography'
import MyOrders from 'features/limit-order/MyOrders'
import { useRouter } from 'next/router'
import { currencyId } from '../../functions'
import ExternalLink from 'components/ExternalLink'

const getQuery = (input?: Currency, output?: Currency) => {
  if (!input && !output) return

  if (input && !output) {
    return { inputCurrency: input || 'FTM' }
  } else if (input && output) {
    return { inputCurrency: input, outputCurrency: output }
  }
}

interface HeaderNewProps {
  inputCurrency?: Currency
  outputCurrency?: Currency
}

const HeaderNew: FC<HeaderNewProps> = ({ inputCurrency, outputCurrency }) => {
  const { i18n } = useLingui()
  const { asPath } = useRouter()
  const isRemove = asPath.startsWith('/remove')
  const isLimitOrder = asPath.startsWith('/limit-order')

  return (
    <div className="flex items-center justify-between gap-1">
      <div className="flex gap-4">
        <NavLink
          activeClassName="text-dark-600"
          href={{
            pathname: '/swap',
            query: getQuery(inputCurrency, outputCurrency),
          }}
        >
          <Typography weight={700} className="text-secondary ml-3 hover:text-dark-600">
            {i18n._(t`Swap`)}
          </Typography>
        </NavLink>
        
        <NavLink
          activeClassName="text-dark-600"
          href={`/${!isRemove ? 'add' : 'remove'}${inputCurrency ? `/${currencyId(inputCurrency)}` : '/FTM'}${
            outputCurrency ? `/${currencyId(outputCurrency)}` : '/0xe2fb177009ff39f52c0134e8007fa0e4baacbd07'
          }`}
        >
          <Typography weight={700} className="text-secondary hover:text-dark-600">
            {i18n._(t`+/-`)}
          </Typography>
        </NavLink>
        <NavLink
          activeClassName="text-dark-600"
          href={{
            pathname: '/exchange/limit',
            query: getQuery(inputCurrency, outputCurrency),
          }}
        >
          <Typography weight={700} className="text-secondary hover:dark-600">
            {i18n._(t`Limit`)}
          </Typography>
        </NavLink>
      </div>
      <div className="flex gap-4">
        {/* {isLimitOrder && <MyOrders />} */}
        <Settings
        // className="!w-6 !h-6" 
        />
      </div>
    </div>
  )
}

export default HeaderNew
