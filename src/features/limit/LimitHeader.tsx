import NavLink from '../../components/NavLink'
import React from 'react'
import { currencyId } from '../../functions/currency'
import { useActiveWeb3React } from 'services/web3'
import { classNames } from 'functions'
import { getChainColorCode } from 'constants/chains'
import Typography from 'components/Typography'
import { useRouter } from 'next/router'
import { ChainId, NATIVE, SOUL_ADDRESS, USDC_ADDRESS } from 'sdk'
// import ExternalLink from 'components/ExternalLink'

export default function LimitHeader({ inputCurrency, outputCurrency }): JSX.Element {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const soulEnabled = [ChainId.FANTOM, ChainId.AVALANCHE, ChainId.ETHEREUM].includes(chainId)

  const isExchange = router.pathname.startsWith('/swap')
    || (router.pathname.startsWith('/exchange/swap') && !router.pathname.startsWith('/exchange/swap/limit'))
  
  const isLimit = router.pathname.startsWith('/exchange/swap/limit')
  
    const isCrosschain = router.pathname.startsWith('/exchange/crosschain')

  return (
    <div className="grid grid-cols-3 rounded-2xl m-4 bg-dark-900">
      <NavLink
        className={isExchange ? classNames("font-bold text-high-emphesis", `bg-${getChainColorCode(chainId)} rounded-2xl`) : ''}
        // activeClassName={classNames("font-bold text-high-emphesis rounded-2xl", `bg-${getChainColorCode(chainId)}`)}
        // href={`/exchange/swap?inputCurrency=${input ? currencyId(input) : NATIVE[chainId].symbol}&outputCurrency=${output ? currencyId(output) : SOUL_ADDRESS[chainId]}`}
        href={
          inputCurrency && outputCurrency ?
            `/exchange/swap?inputCurrency=${currencyId(inputCurrency)}&outputCurrency=${currencyId(outputCurrency)}`
            : `/exchange/swap?inputCurrency=${NATIVE[chainId].symbol}&outputCurrency=${soulEnabled ? SOUL_ADDRESS[chainId] : USDC_ADDRESS[chainId]}`
        }
        // href={`/exchange/swap?inputCurrency=${currencyId(input)}&outputCurrency=${currencyId(output)}`)}
      >
        <Typography
          className="flex text-white items-center justify-center px-1 py-1 text-base font-medium text-center rounded-md md:px-10 hover:text-high-emphesis"
        >
          {`Market`}  
       </Typography>
      </NavLink>
      <NavLink
        // onClick={(event) => {
        //   if (!outputCurrency) event.preventDefault()
        // }}
        className={isLimit ? classNames("font-bold text-high-emphesis", `bg-${getChainColorCode(chainId)} rounded-2xl`) : ''}
        // activeClassName={classNames("text-high-emphesis font-bold rounded-2xl", `bg-${getChainColorCode(chainId)} rounded-2xl`)}
        href={
          inputCurrency && outputCurrency ?
          `/exchange/swap/limit/${currencyId(inputCurrency)}/${currencyId(outputCurrency)}`
          : `/exchange/swap/limit/${NATIVE[chainId].symbol}/${soulEnabled ? SOUL_ADDRESS[chainId] : USDC_ADDRESS[chainId]}`
      }
      >
        <Typography
          className="flex text-white items-center justify-center px-1 py-1 text-base font-medium text-center rounded-md md:px-10 hover:text-high-emphesis"
        >
          {`Limit`}  
       </Typography>
      </NavLink>
      <NavLink
        onClick={(event) => {
          if (!outputCurrency) event.preventDefault()
        }}
        className={isCrosschain ? classNames("font-bold text-high-emphesis", `bg-${getChainColorCode(chainId)} rounded-2xl`) : ''}
        activeClassName={classNames("text-high-emphesis font-bold rounded-2xl", `bg-${getChainColorCode(chainId)} rounded-2xl`)}
        href={'/crosschain'}
        // href={'https://widget-integrations-squid.vercel.app'}
      >
        <Typography
          className="flex text-white items-center justify-center px-1 py-1 text-base font-medium text-center rounded-md md:px-10 hover:text-high-emphesis"
        >
          {`Cross-Chain`}  
       </Typography>
      </NavLink>
    </div>
  )
}

