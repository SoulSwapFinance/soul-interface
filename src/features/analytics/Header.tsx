import React, { FC, useState } from 'react'
import { ChainId, Currency, NATIVE, Percent } from '../../sdk'
import NavLink from '../../components/NavLink'
import { useActiveWeb3React } from 'services/web3'
import Typography from 'components/Typography'

const getQuery = (input, output) => {
  const { chainId } = useActiveWeb3React()
  if (!input && !output) return

  if (input && !output) {
    return { inputCurrency: input.address || NATIVE[chainId ?? ChainId.FANTOM].symbol }
  } else if (input && output) {
    return { inputCurrency: input.address, outputCurrency: output.address }
  }
}

interface AnalyticsHeaderProps {
  input?: Currency
  output?: Currency
  allowedSlippage?: Percent
}

const AnalyticsHeader: FC<AnalyticsHeaderProps> = ({ input, output, allowedSlippage }) => {

  return (
    <div className="flex items-center justify-center mb-6 space-x-3">
      <div className="grid mt-4 grid-cols-4 rounded p-3px bg-dark-800 h-[46px]">
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-purple to-opaque-purple hover:from-blue hover:to-purple"
          href={{
            pathname: '/info/home',
            query: getQuery(input, output),
          }}
        >
          <Typography className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis ">
            {`ALL`}
          </Typography>
        </NavLink>
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-purple to-opaque-purple hover:from-blue hover:to-purple"
          href={"/info/dashboard"}
          // href={`/${!isRemove ? 'add' : 'remove'}${input ? `/${currencyId(input)}` : ''}${
          //   output ? `/${currencyId(output)}` : ''
        // }`}
        >
          <Typography className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis">
            {`WALLET`}
          </Typography>
        </NavLink>
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-purple to-opaque-purple hover:from-blue hover:to-purple"
          href={"/info/tokens"}
        >
          <Typography className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis">
            {`TOKENS`}
          </Typography>
        </NavLink>
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-purple to-opaque-purple hover:from-blue hover:to-purple"
          href={"/info/pairs"}
        >
          <Typography className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis">
            {`PAIRS`}
          </Typography>
        </NavLink>
        {/* <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-purple to-opaque-purple hover:from-blue hover:to-purple"
          href={"/farms"}
        >
          <Typography className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis">
            {`Farm`}
          </Typography>
        </NavLink> */}
      </div>
    </div>
  )
}

export default AnalyticsHeader