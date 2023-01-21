import React, { FC, useState } from 'react'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, Currency, NATIVE, Percent, SOUL_ADDRESS, USDC_ADDRESS } from 'sdk'
import NavLink from 'components/NavLink'
import Settings from 'components/Settings'
// import { RepeatIcon } from 'components/Icons/exchange/RepeatIcon'
// import Typography from 'components/Typography'
import { useRouter } from 'next/router'
import { classNames, currencyId, featureEnabled } from '../../functions'

import { useActiveWeb3React } from 'services/web3'
import { Feature } from 'enums'
import Image from 'next/image'

import Bridge from 'assets/svg/icons/Bridge.svg'
// import Chart from 'assets/svg/icons/Chart.svg'
// import RainDrop from 'assets/svg/icons/Raindrop.svg'
// import Swap from 'assets/svg/icons/Swap.svg'
import RepeatIcon from 'components/Icons/exchange/RepeatIcon'
import PlusMinusIcon from 'components/Icons/exchange/PlusMinusIcon'
// import  from 'assets/svg/icons/PlusMinus.svg'
import Merge from 'assets/svg/icons/Merge.svg'
import Cross from 'assets/svg/icons/Cross.svg'

import { getChainColor, getChainColorCode } from 'constants/chains'
import MergeIcon from 'components/Icons/exchange/MergeIcon'
import CrossIcon from 'components/Icons/exchange/CrossIcon'
import ChartIcon from 'components/Icons/exchange/ChartIcon'
import BridgeIcon from 'components/Icons/exchange/BridgeIcon'
// import ArrowsUpDown from 'assets/svg/icons/ArrowsUpDown.svg'

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
    || asPath.startsWith('/exchange/analytics/dashboard')
    || asPath.startsWith('/exchange/analytics/pairs')
    || asPath.startsWith('/exchange/analytics/tokens')

  const isBridge = router.pathname.startsWith('/bridge')

  const isLimit = router.pathname.startsWith('/limit')
    || router.pathname.startsWith('/exchange/limit')

  const isAggregator = asPath.startsWith('/aggregator')
    || asPath.startsWith('/exchange/aggregator')

  const isCross = router.pathname.startsWith('/cross')
    || router.pathname.startsWith('/exchange/cross')

  const isExchange = router.pathname.startsWith('/swap')
    || router.pathname.startsWith('/exchange/swap')

  const useSettings = isExchange || isLimit || isPool

  const soulEnabled = [ChainId.FANTOM, ChainId.AVALANCHE, ChainId.ETHEREUM].includes(chainId)

  const activeStyle = `border border-[${getChainColor(chainId)}] rounded`
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
              <div
                className={classNames(
                  `hover:border hover:border-2 hover:border-[${getChainColor(chainId)}] flex rounded p-0.5`,
                  isExchange && `hover:border border-2 border-[${getChainColor(chainId)}]`)
                }>
              <RepeatIcon
              fillPrimary={isExchange ? `${getChainColor(chainId)}` : `#FFFFFF`}
              fillSecondary={isExchange ? `#FFFFFF` : `${getChainColor(chainId)}`}
              className={`w-6 w-6`}
              />
        </div>
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
          <div
            className={classNames(
              `hover:border hover:border-2 hover:border-[${getChainColor(chainId)}] flex rounded p-0.5`,
              isPool && `border border-2 border-[${getChainColor(chainId)}]`)
            }>
                <PlusMinusIcon
              fillPrimary={isPool ? `${getChainColor(chainId)}` : `#FFFFFF`}
              fillSecondary={isPool ? `#FFFFFF` : `${getChainColor(chainId)}`}
                />
          </div>
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
            href={`/exchange/aggregator/${inputCurrency ? `/${currencyId(inputCurrency)}` : `/${NATIVE[chainId].symbol}`}${outputCurrency ? `/${currencyId(outputCurrency)}` : ([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `/${SOUL_ADDRESS[chainId]}` : `/${USDC_ADDRESS[chainId]}`)
              }`}
          >
          <div 
          className={classNames(
            `hover:border hover:border-2 hover:border-[${getChainColor(chainId)}] flex rounded p-0.5`,
            isAggregator && `border border-2 border-[${getChainColor(chainId)}]`)
          }>
            <MergeIcon
              fillPrimary={isAggregator ? `${getChainColor(chainId)}` : `#FFFFFF`}
              fillSecondary={isAggregator ? `#FFFFFF` : `${getChainColor(chainId)}`}
                />
          </div>
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
          <div 
          className={classNames(
            `hover:border hover:border-2 hover:border-[${getChainColor(chainId)}] flex rounded p-0.5`,
            isCross && `border border-2 border-[${getChainColor(chainId)}]`)
          }>
            <CrossIcon
              fillPrimary={isCross ? `${getChainColor(chainId)}` : `#FFFFFF`}
              fillSecondary={isCross ? `#FFFFFF` : `${getChainColor(chainId)}`}
            />
          </div>
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
          <div
          className={classNames(
            `hover:border hover:border-2 hover:border-[${getChainColor(chainId)}] flex rounded p-0.5`,
            isBridge && `border border-2 border-[${getChainColor(chainId)}]`)
          }>
            <BridgeIcon
              fillPrimary={isBridge ? `${getChainColor(chainId)}` : `#FFFFFF`}
              fillSecondary={isBridge ? `#FFFFFF` : `${getChainColor(chainId)}`}
            />
          </div>
          </NavLink>
        }

        {/* {featureEnabled(Feature.ANALYTICS, chainId) &&
          <NavLink
            className={classNames(
              chartStyle
            )}
            activeClassName={classNames(
              activeStyle
            )}
            href={'/exchange/analytics/dashboard'}
          >
          <div 
          className={classNames(
            `hover:border hover:border-2 hover:border-[${getChainColor(chainId)}] flex rounded p-0.5`,
            isExchangeAnalytics && `border border-2 border-[${getChainColor(chainId)}]`)
          }>
            <ChartIcon
              fillPrimary={isExchangeAnalytics ? `${getChainColor(chainId)}` : `#FFFFFF`}
              fillSecondary={isExchangeAnalytics ? `#FFFFFF` : `${getChainColor(chainId)}`}
            />
          </div>
          </NavLink>
        } */}

      </div>
      <div className={'flex flex-cols-2 sm:gap-8 gap-6 mr-4 justify-end rounded'}>
        {useSettings && <Settings />}
      </div>
    </div>
      )
}

      export default SwapHeader