import { Currency, Percent } from '../../sdk'
import React, { FC } from 'react'

import NavLink from '../../components/NavLink'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

const getQuery = (input, output) => {
  if (!input && !output) return

  if (input && !output) {
    return { inputCurrency: input.address || 'ETH' }
  } else if (input && output) {
    return { inputCurrency: input.address, outputCurrency: output.address }
  }
}

interface FarmHeaderProps {
  input?: Currency
  output?: Currency
  allowedSlippage?: Percent
}

const FarmHeader: FC<FarmHeaderProps> = ({ input, output, allowedSlippage }) => {
  const { i18n } = useLingui()

  return (
    <div className="flex items-center justify-center mb-6 space-x-3">
      <div className="grid grid-cols-4 rounded p-3px bg-dark-800 h-[46px]">
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-purple hover:from-blue hover:to-purple"
          href={{
            pathname: '/farms/all',
            query: getQuery(input, output),
          }}
        >
          <a className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis ">
            {i18n._(t`ALL`)}
          </a>
        </NavLink>
        {/* <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-purple hover:from-blue hover:to-purple"
          href={{
            pathname: '/limit-order',
            query: getQuery(input, output),
          }}
        >
          <a className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis">
            {i18n._(t`Limit`)}
          </a>
        </NavLink> */}
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-purple hover:from-blue hover:to-purple"
          href={"/farms/soulpower"}
          // href={`/${!isRemove ? 'add' : 'remove'}${input ? `/${currencyId(input)}` : ''}${
          //   output ? `/${currencyId(output)}` : ''
        // }`}
        >
          <a className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis">
            {i18n._(t`SOUL`)}
          </a>
        </NavLink>
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-purple hover:from-blue hover:to-purple"
          href={"/farms/fanties"}
          // href={`${output ? `https://info.soulswap.finance/token/${currencyId(output)}` : ''}`}
        >
          <a className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis">
            {i18n._(t`FANTOM`)}
          </a>
        </NavLink>
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-purple hover:from-blue hover:to-purple"
          href={"/farms/inactive"}
          // href={`${output ? `https://info.soulswap.finance/token/${currencyId(output)}` : ''}`}
        >
          <a className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis">
            {i18n._(t`INACTIVE`)}
          </a>
        </NavLink>
      </div>
    </div>
  )
}

export default FarmHeader