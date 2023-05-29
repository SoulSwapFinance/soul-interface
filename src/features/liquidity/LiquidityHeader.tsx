import NavLink from '../../components/NavLink'
import React from 'react'
import { currencyId } from '../../functions/currency'
import { useActiveWeb3React } from 'services/web3'
import { classNames } from 'functions'
import { getChainColorCode } from 'constants/chains'

export default function LiquidityHeader({ input = undefined, output = undefined }: any): JSX.Element {
  const { chainId } = useActiveWeb3React()
  return (
    <div className="grid grid-cols-2 rounded-2xl m-4 bg-dark-900">
      <NavLink
        activeClassName={classNames("font-bold text-high-emphesis rounded-2xl", `bg-${getChainColorCode(chainId)}`)}
        href={`/exchange/add/${currencyId(input)}/${currencyId(output)}`}
      >
        <a className="flex items-center justify-center px-1 py-1 text-base font-medium text-center rounded-md md:px-10 text-secondary hover:text-high-emphesis">
          +
        </a>
      </NavLink>
      <NavLink
        onClick={(event) => {
          if (!output) event.preventDefault()
        }}
        activeClassName={classNames("text-high-emphesis font-bold rounded-2xl", `bg-${getChainColorCode(chainId)}`)}
        href={`/exchange/remove/${currencyId(input)}/${currencyId(output)}`}
      >
        <a className="flex items-center justify-center px-1 py-1 text-base font-medium text-center rounded-md md:px-10 text-secondary hover:text-high-emphesis">
          -
        </a>
      </NavLink>
    </div>
  )
}

