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

const getQuery = (input?: Currency, output?: Currency) => {
  if (!input && !output) return

  if (input && !output) {
    // @ts-ignore
    return { inputCurrency: input.address || 'FTM' }
  } else if (input && output) {
    // @ts-ignore
    return { inputCurrency: input.address, outputCurrency: output.address }
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
          activeClassName="text-high-emphesis"
          href={{
            pathname: '/swap',
            query: getQuery(inputCurrency, outputCurrency),
          }}
        >
          <Typography weight={700} className="text-secondary hover:text-white">
            {i18n._(t`Swap`)}
          </Typography>
        </NavLink>
        <NavLink
          activeClassName="text-high-emphesis"
          href={{
            pathname: '/limit-order',
            query: getQuery(inputCurrency, outputCurrency),
          }}
        >
          <Typography weight={700} className="text-secondary hover:text-white">
            {i18n._(t`Limit`)}
          </Typography>
        </NavLink>
        <NavLink
          activeClassName="text-high-emphesis"
          href={`/${!isRemove ? 'add' : 'remove'}${inputCurrency ? `/${currencyId(inputCurrency)}` : '/FTM'}${
            outputCurrency ? `/${currencyId(outputCurrency)}` : '/0xe2fb177009ff39f52c0134e8007fa0e4baacbd07'
          }`}
        >
          <Typography weight={700} className="text-secondary hover:text-white">
            {i18n._(t`Liquidity`)}
          </Typography>
        </NavLink>
        <NavLink
          activeClassName="text-high-emphesis"
          href={"/bridge"}
        >
          <Typography weight={700} className="text-secondary hover:text-white">
            {i18n._(t`Bridge`)}
          </Typography>
        </NavLink>
      </div>
      <div className="flex gap-4">
        {isLimitOrder && <MyOrders />}
        <Settings
        // className="!w-6 !h-6" 
        />
      </div>
    </div>
  )
}

export default HeaderNew