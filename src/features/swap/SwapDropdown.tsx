import React, { FC, useState } from 'react'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, Currency, NATIVE, Percent, SOUL_ADDRESS, USDC_ADDRESS } from 'sdk'
import NavLink from 'components/NavLink'
import Settings from 'components/Settings'

import Typography from 'components/Typography'
import { useRouter } from 'next/router'
import { classNames, currencyId, featureEnabled } from '../../functions'

import { useActiveWeb3React } from 'services/web3'
import { Feature } from 'enums'
import Image from 'next/image'

import Bridge from 'assets/svg/icons/Bridge.svg'
import Chart from 'assets/svg/icons/Chart.svg'
import RainDrop from 'assets/svg/icons/Raindrop.svg'
import Swap from 'assets/svg/icons/Swap.svg'
import PlusMinus from 'assets/svg/icons/PlusMinus.svg'
import Merge from 'assets/svg/icons/Merge.svg'
import Cross from 'assets/svg/icons/Cross.svg'

import { getChainColor, getChainColorCode } from 'constants/chains'
import ChevronUpDown from 'assets/svg/icons/ChevronUpDown.svg'

// import CrossChainMode from 'components/CrossChainMode'
// import PlusSign from 'assets/svg/icons/PlusSign.svg'
// import Dropdown from 'components/Subheader'
// import { Button } from 'components/Button'
// import Chain from 'assets/svg/icons/Chain.svg'
// import ExternalLink from 'components/ExternalLink'

const getQuery = (input?: Currency, output?: Currency) => {
  const { chainId } = useActiveWeb3React()
  if (!input && !output) return
  if (input && !output) {
    return { inputCurrency: input || NATIVE[chainId].symbol }
  } else if (input && output) {
    return { inputCurrency: input, outputCurrency: output }
  }
}

interface HeaderProps {
  inputCurrency?: Currency
  outputCurrency?: Currency
  allowedSlippage?: Percent
}

const SwapHeader: FC<HeaderProps> = ({ inputCurrency, outputCurrency }) => {
  const { asPath } = useRouter()
  const router = useRouter()
  const { chainId } = useActiveWeb3React()
 
  const isRemove = asPath.startsWith('/remove') || asPath.startsWith('/exchange/remove')
  const isAdd = asPath.startsWith('/add') || asPath.startsWith('/exchange/add')
  const isPool = isRemove || isAdd
  
  const isExchangeAnalytics 
    = asPath.startsWith('/exchange/analytics')
      || asPath.startsWith('/exchange/analytics/coffinbox')
      ||  asPath.startsWith('/exchange/analytics/dashboard')
      || asPath.startsWith('/exchange/analytics/pairs')
      || asPath.startsWith('/exchange/analytics/tokens')

  const isBridge = router.pathname.startsWith('/bridge')
  
  const isLimit = router.pathname.startsWith('/limit') 
    || router.pathname.startsWith('/exchange/limit')
  
  const isAggregator = router.pathname.startsWith('/swap/aggregator') 
    || router.pathname.startsWith('/exchange/swap/aggregator')
  
  const isCross = router.pathname.startsWith('/cross') 
    || router.pathname.startsWith('/exchange/cross')
  
  const isExchange = router.pathname.startsWith('/swap') 
    || router.pathname.startsWith('/exchange/swap')

  const useSettings = isExchange || isLimit || isPool

  const soulEnabled = [ChainId.FANTOM, ChainId.AVALANCHE, ChainId.ETHEREUM].includes(chainId)

  const activeStyle = `border bg-${getChainColorCode(chainId)} rounded`
  const style = `text-secondary bg-white rounded rounded-xl border border-[${getChainColor(chainId)}]`
  const swapStyle = isExchange ? activeStyle : style
  const poolStyle = isPool ? activeStyle : style
  const ecoStyle = isAggregator ? activeStyle : style
  const bridgeStyle = isBridge ? activeStyle : style
  const chartStyle = isExchangeAnalytics ? activeStyle : style
  const crossStyle = isCross ? activeStyle : style
 
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex gap-2 mx-1">
 
        <NavLink
          className={classNames(
            swapStyle
            )}
          activeClassName={classNames(
            activeStyle
            )}
          href={
            inputCurrency && outputCurrency ?
              `/exchange/swap?inputCurrency=${currencyId(inputCurrency)}&outputCurrency=${currencyId(outputCurrency)}`
              : `/exchange/swap?inputCurrency=${NATIVE[chainId].symbol}&outputCurrency=${soulEnabled ? SOUL_ADDRESS[chainId] : USDC_ADDRESS[chainId]}`
          }
        >
            <Image 
            height={26}
            width={26}
            alt={"swap icon"}
            src={Swap} />
        </NavLink>
 
        {featureEnabled(Feature.LIQUIDITY, chainId) &&
          <NavLink
            className={classNames(
              poolStyle
            )}
            activeClassName={classNames(
              activeStyle
              )}
            href={`/exchange/${!isRemove ? 'add' : 'remove'}${inputCurrency ? `/${currencyId(inputCurrency)}` : `/${NATIVE[chainId].symbol}`}${outputCurrency ? `/${currencyId(outputCurrency)}` : ([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `/${SOUL_ADDRESS[chainId]}` : `/${USDC_ADDRESS[chainId]}`)
              }`}
          >
            <Image 
            height={26}
            width={26}
            alt={"plus over minus icon"}
            src={PlusMinus} />
          </NavLink>
        }
 
        {featureEnabled(Feature.BRIDGE, chainId) &&
          <NavLink
            className={classNames(
            bridgeStyle
            )}
            activeClassName={classNames(
            activeStyle
            )}
            href={'/bridge'}
          >
              <Image
              height={26}
              width={26}
              alt={"bridge icon"}
              src={Bridge} />
              {/* {i18n._(t`Bridge`)} */}
          </NavLink>
        }
 
        {featureEnabled(Feature.BRIDGE, chainId) &&
          <NavLink
            className={classNames(
              crossStyle
            )}
            activeClassName={classNames(
              activeStyle
            )}
            href={'/cross'}
          >
              <Image
              height={26}
              width={26}
              alt={"crossed swap arrows"}
              src={Cross} />
          </NavLink>
        }
        
        {featureEnabled(Feature.AGGREGATE, chainId) &&
          <NavLink
            className={classNames(
              ecoStyle
            )}
            activeClassName={classNames(
              activeStyle
            )}
            href={`/exchange/swap/aggregator/${inputCurrency ? `/${currencyId(inputCurrency)}` : `/${NATIVE[chainId].symbol}`}${outputCurrency ? `/${currencyId(outputCurrency)}` : ([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `/${SOUL_ADDRESS[chainId]}` : `/${USDC_ADDRESS[chainId]}`)
            }`}
          >
              <Image
              height={26}
              width={26}
              alt={"arrows merge icon"}
              src={Merge} />
          </NavLink>
        }

        {featureEnabled(Feature.ANALYTICS, chainId) &&
          <NavLink
            className={classNames(
              chartStyle
            )}
            activeClassName={classNames(
              activeStyle
            )}
            href={'/exchange/analytics/dashboard'}
          >
              <Image
              height={26}
              width={26}
              alt={"chart icon"}
              src={Chart} />
          </NavLink>
        }
 
      </div>
      <div className={'flex flex-cols-2 sm:gap-8 gap-6 mr-4 justify-end rounded'}>
        {useSettings && <Settings />}
      </div>
    </div>
  )
}

export default SwapHeader