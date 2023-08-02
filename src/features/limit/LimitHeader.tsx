import NavLink from '../../components/NavLink'
import React from 'react'
import { currencyId } from '../../functions/currency'
import { useActiveWeb3React } from 'services/web3'
import { classNames } from 'functions'
import { getChainColorCode } from 'constants/chains'
import Typography from 'components/Typography'
import { useRouter } from 'next/router'

export default function LimitHeader({ input, output }): JSX.Element {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const isExchange = router.pathname.startsWith('/swap')
    || (router.pathname.startsWith('/exchange/swap') && !router.pathname.startsWith('/exchange/swap/limit'))
  
  const isLimit = router.pathname.startsWith('/swap')
    || (router.pathname.startsWith('/exchange/swap/limit'))

  return (
    <div className="grid grid-cols-2 rounded-2xl m-4 bg-dark-900">
      <NavLink
        className={isExchange ? classNames("font-bold text-high-emphesis", `bg-${getChainColorCode(chainId)} rounded-2xl`) : ''}
        // activeClassName={classNames("font-bold text-high-emphesis rounded-2xl", `bg-${getChainColorCode(chainId)}`)}
        href={`/exchange/swap?inputCurrency=${currencyId(input)}&outputCurrency=${currencyId(output)}`}
        // href={`/exchange/swap?inputCurrency=${currencyId(input)}&outputCurrency=${currencyId(output)}`)}
      >
        <Typography
          className="flex text-white items-center justify-center px-1 py-1 text-base font-medium text-center rounded-md md:px-10 hover:text-high-emphesis"
        >
          {`Market`}  
       </Typography>
      </NavLink>
      <NavLink
        onClick={(event) => {
          if (!output) event.preventDefault()
        }}
        className={isLimit ? classNames("font-bold text-high-emphesis", `bg-${getChainColorCode(chainId)} rounded-2xl`) : ''}
        // activeClassName={classNames("text-high-emphesis font-bold rounded-2xl", `bg-${getChainColorCode(chainId)} rounded-2xl`)}
        href={`/exchange/swap/limit/${currencyId(input)}/${currencyId(output)}`}
      >
        <Typography
          className="flex text-white items-center justify-center px-1 py-1 text-base font-medium text-center rounded-md md:px-10 hover:text-high-emphesis"
        >
          {`Limit`}  
       </Typography>
      </NavLink>
    </div>
  )
}

