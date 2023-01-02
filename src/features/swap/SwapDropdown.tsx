import React, { FC, useState } from 'react'
// import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, Currency, NATIVE, Percent, SOUL_ADDRESS, USDC_ADDRESS } from 'sdk'
import NavLink from 'components/NavLink'
import Settings from 'components/Settings'
// import CrossChainMode from 'components/CrossChainMode'
import Typography from 'components/Typography'
import { useRouter } from 'next/router'
import { classNames, currencyId, featureEnabled } from '../../functions'
// import ExternalLink from 'components/ExternalLink'
import { useActiveWeb3React } from 'services/web3'
import { Feature } from 'enums'
// import Dropdown from 'components/Subheader'
import Image from 'next/image'
// import { Button } from 'components/Button'
import Bridge from 'assets/svg/icons/Bridge.svg'
import Chart from 'assets/svg/icons/Chart.svg'
import RainDrop from 'assets/svg/icons/RainDrop.svg'
import Swap from 'assets/svg/icons/Swap.svg'
import Pool from 'assets/svg/icons/Pool.svg'
// import Chain from 'assets/svg/icons/Chain.svg'
import ChevronUpDown from 'assets/svg/icons/ChevronUpDown.svg'
// import PlusSign from 'assets/svg/icons/PlusSign.svg'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'

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
  // const { i18n } = useLingui()
  const { asPath } = useRouter()
  const router = useRouter()
  const { chainId } = useActiveWeb3React()
  const isRemove = asPath.startsWith('/remove') || asPath.startsWith('/exchange/remove')
  const isAdd = asPath.startsWith('/add') || asPath.startsWith('/exchange/add')
  const isPool = isRemove || isAdd
  const isAnalytics = asPath.startsWith('/exchange/analytics')
  const isBridge = router.pathname.startsWith('/bridge')
  const isLimit = router.pathname.startsWith('/limit')
    || router.pathname.startsWith('/exchange/limit')
  const isMulti = router.pathname.startsWith('/cross') 
    || router.pathname.startsWith('/exchange/cross')
  const isSwap = asPath.startsWith('swap') || asPath.startsWith('/exchange/swap')
    isLimit || isPool

  const soulEnabled = [ChainId.FANTOM, ChainId.AVALANCHE, ChainId.ETHEREUM].includes(chainId)
  // const globalNavStyle = ``
  const activeStyle = `border bg-${getChainColorCode(chainId)} rounded`
  const style = `text-secondary bg-white rounded rounded-xl border border-[${getChainColor(chainId)}]`
  const swapStyle = isSwap ? activeStyle : style
  const poolStyle = isPool ? activeStyle : style
  const bridgeStyle = isBridge ? activeStyle : style
  const chartStyle = isAnalytics ? activeStyle : style
  const multiStyle = isMulti ? activeStyle : style
 
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
            alt={"wavy water icon"}
            src={Pool} />
          </NavLink>
        }
        {featureEnabled(Feature.BRIDGE, chainId) &&
          <NavLink
            className={classNames(
            bridgeStyle
            )}
            activeClassName={classNames(
            bridgeStyle
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
        {/* TODO */}
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
              <Image
              height={26}
              width={26}
              alt={"ranking bars icon with a star"}
              src={Chart} />
              {/* {i18n._(t`Charts`)}
          </NavLink>
        } */}
        {/* {featureEnabled(Feature.LIQUIDITY, chainId) &&
          <NavLink
          className={classNames(
              multiStyle
            )}
            activeClassName={classNames(
              activeStyle
            )}
            href={'/cross'}
          >
            <Typography weight={700} className={style}>
              <Image alt={"chain icon"} src={Chain} />
              {i18n._(t`Crosschain`)}
            </Typography>
          </NavLink>
        } */}
        {/* {featureEnabled(Feature.LIMIT, chainId) &&
          <NavLink
            activeClassName={classNames(
              "border rounded bg-black",
              chainColor
            )}
            // href=

            href={{
              pathname:`/exchange/limit/${inputCurrency ? `/${currencyId(inputCurrency)}` : `/${NATIVE[chainId].symbol}`}${outputCurrency ? `/${currencyId(outputCurrency)}` : ([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `/${SOUL_ADDRESS[chainId]}` : `/${USDC_ADDRESS[chainId]}`)}`,
              // pathname: '/exchange/limit',
              // query: getQuery(inputCurrency, outputCurrency),
            }}
          >
            <Typography weight={700} className={`text-secondary hover:${hoverColor} p-1`}>
              {i18n._(t`Limit`)}
            </Typography>
          </NavLink>
        } */}
        {/* <NavLink
          activeClassName={classNames(
            "border rounded bg-black",
            chainColor
          )}
          href={{
            pathname: '/cross',
          }}
        >
          <Typography weight={700} className={`text-secondary hover:${hoverColor} p-1`}>
            {i18n._(t`Cross`)}
          </Typography>
        </NavLink> */}
        {/* { ![ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) && */}
        {/* <NavLink
          activeClassName={classNames(
            "border rounded bg-black",
            chainColor
          )}
          href={{
            pathname: '/bridge',
          }}
        >
          <Typography weight={700} className={`text-secondary hover:${hoverColor} p-1`}>
            {i18n._(t`Globe`)}
          </Typography>
        </NavLink> */}
        {/* } */}
        {/* <NavLink
          activeClassName={classNames(
            "border rounded bg-black",
            chainColor
          )}
          href={{
            pathname: '/aggregator',
          }}
        >
          <Typography weight={700} className={`text-secondary hover:${hoverColor} p-1`}>
            {i18n._(t`Multi`)}
          </Typography>
        </NavLink> */}
        {/* {featureEnabled(Feature.AGGREGATE, chainId) &&
        <NavLink
          activeClassName={classNames(
            "border rounded bg-black",
            chainColor
          )}
          href={{
            pathname: '/aggregator',
          }}
        >
          <Typography weight={700} className={`text-secondary hover:${hoverColor} p-1`}>
            {i18n._(t`Eco`)}
          </Typography>
        </NavLink>
        } */}
      </div>
      <div className={'flex flex-cols-2 sm:gap-8 gap-6 mr-4 justify-end rounded'}>
        {isSwap && <Settings />}
      </div>
    </div>
  )
}

export default SwapHeader