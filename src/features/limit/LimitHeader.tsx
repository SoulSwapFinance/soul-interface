import NavLink from '../../components/NavLink'
import React from 'react'
import { currencyId } from '../../functions/currency'
import { useActiveWeb3React } from 'services/web3'
import { classNames, featureEnabled } from 'functions'
import { getChainColorCode } from 'constants/chains'
import Typography from 'components/Typography'
import { useRouter } from 'next/router'
import { ChainId, NATIVE, SOUL_ADDRESS, USDC_ADDRESS } from 'sdk'
import { Feature } from 'enums'
// import ExternalLink from 'components/ExternalLink'

export default function LimitHeader({ inputCurrency, outputCurrency }): JSX.Element {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const soulEnabled = [ChainId.FANTOM, ChainId.AVALANCHE, ChainId.ETHEREUM].includes(chainId)

  const isExchange = router.pathname.startsWith('/swap')
    || (router.pathname.startsWith('/exchange/swap') && !router.pathname.startsWith('/exchange/swap/limit'))

  const isCrossChain = router.pathname.startsWith('/crosschain')
    || router.pathname.startsWith('/exchange/crosschain')
  
  const isLimit = router.pathname.startsWith('/exchange/swap/limit')
  
  const isAggregator = router.pathname.startsWith('/exchange/aggregator')
  const totalCols = [ChainId.FANTOM, ChainId.AVALANCHE].includes(chainId) ? 4 : [ChainId.ETHEREUM].includes(chainId) ? 3 : 1

  return (
    <div className={`grid grid-cols-${totalCols} rounded-2xl m-4 bg-dark-900`}>
      {featureEnabled(Feature.AMM, chainId) &&
      <NavLink
        className={isExchange ? classNames("font-bold text-high-emphesis", `bg-${getChainColorCode(chainId)} rounded-2xl`) : ''}
        // activeClassName={classNames("font-bold text-high-emphesis rounded-2xl", `bg-${getChainColorCode(chainId)}`)}
        // href={`/exchange/swap?inputCurrency=${input ? currencyId(input) : NATIVE[chainId ?? ChainId.FANTOM].symbol}&outputCurrency=${output ? currencyId(output) : SOUL_ADDRESS[chainId ?? ChainId.FANTOM]}`}
        href={
          inputCurrency && outputCurrency ?
            `/exchange/swap?inputCurrency=${currencyId(inputCurrency)}&outputCurrency=${currencyId(outputCurrency)}`
            : `/exchange/swap?inputCurrency=${NATIVE[chainId ?? ChainId.FANTOM].symbol}&outputCurrency=${soulEnabled ? SOUL_ADDRESS[chainId ?? ChainId.FANTOM] : USDC_ADDRESS[chainId ?? ChainId.FANTOM]}`
        }
        // href={`/exchange/swap?inputCurrency=${currencyId(input)}&outputCurrency=${currencyId(output)}`)}
      >
        <Typography
          className="flex text-white items-center justify-center px-1 py-1 text-base font-medium text-center rounded-md md:px-10 hover:text-high-emphesis"
        >
          {`Market`}  
       </Typography>
      </NavLink>
      }
      {featureEnabled(Feature.LIMIT, chainId) &&
      <NavLink
        // onClick={(event) => {
        //   if (!outputCurrency) event.preventDefault()
        // }}
        className={isLimit ? classNames("font-bold text-high-emphesis", `bg-${getChainColorCode(chainId)} rounded-2xl`) : ''}
        // activeClassName={classNames("text-high-emphesis font-bold rounded-2xl", `bg-${getChainColorCode(chainId)} rounded-2xl`)}
        href={
          inputCurrency && outputCurrency ?
          `/exchange/swap/limit/${currencyId(inputCurrency)}/${currencyId(outputCurrency)}`
          : `/exchange/swap/limit/${NATIVE[chainId ?? ChainId.FANTOM].symbol}/${soulEnabled ? SOUL_ADDRESS[chainId ?? ChainId.FANTOM] : USDC_ADDRESS[chainId ?? ChainId.FANTOM]}`
      }
      >
        <Typography
          className="flex text-white items-center justify-center px-1 py-1 text-base font-medium text-center rounded-md md:px-10 hover:text-high-emphesis"
        >
          {`Limit`}  
       </Typography>
      </NavLink>
      }
    {featureEnabled(Feature.AMM, chainId) &&
      <NavLink
        // onClick={(event) => {
        //   if (!outputCurrency) event.preventDefault()
        // }}
        className={isAggregator ? classNames("font-bold text-high-emphesis", `bg-${getChainColorCode(chainId)} rounded-2xl`) : ''}
        activeClassName={classNames("text-high-emphesis font-bold rounded-2xl", `bg-${getChainColorCode(chainId)} rounded-2xl`)}
        href={
          inputCurrency && outputCurrency ?
          `/exchange/aggregator/${currencyId(inputCurrency)}/${currencyId(outputCurrency)}`
          : `/exchange/aggregator/${NATIVE[chainId ?? ChainId.FANTOM].symbol}/${soulEnabled ? SOUL_ADDRESS[chainId ?? ChainId.FANTOM] : USDC_ADDRESS[chainId ?? ChainId.FANTOM]}`
      }      >
        <Typography
          className="flex text-white items-center justify-center px-1 py-1 text-base font-medium text-center rounded-md md:px-10 hover:text-high-emphesis"
        >
          {`Meta`}
       </Typography>
      </NavLink>
      }
      {featureEnabled(Feature.XSWAP, chainId) &&
      <NavLink
        // onClick={(event) => {
        //   if (!outputCurrency) event.preventDefault()
        // }}
        className={isCrossChain ? classNames("font-bold text-high-emphesis", `bg-${getChainColorCode(chainId)} rounded-2xl`) : ''}
        // activeClassName={classNames("text-high-emphesis font-bold rounded-2xl", `bg-${getChainColorCode(chainId)} rounded-2xl`)}
        href={'/exchange/crosschain'}
      >
        <Typography
          className="flex text-white items-center justify-center px-1 py-1 text-base font-medium text-center rounded-md md:px-10 hover:text-high-emphesis"
        >
          {`xSwap`}  
       </Typography>
      </NavLink>
      }
    </div>
  )
}

