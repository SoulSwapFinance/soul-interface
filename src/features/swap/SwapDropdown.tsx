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
import Globe from 'assets/svg/icons/Globe.svg'
import Chain from 'assets/svg/icons/Chain.svg'
import ChevronUpDown from 'assets/svg/icons/ChevronUpDown.svg'
import PlusSign from 'assets/svg/icons/PlusSign.svg'
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
  const { chainId } = useActiveWeb3React()
  const isRemove = asPath.startsWith('/remove')
  const isSwap = asPath.startsWith('/exchange/swap') || asPath.startsWith('/swap')
    || asPath.startsWith('/limit') || asPath.startsWith('exchange/limit')
    || asPath.startsWith('/add') || asPath.startsWith('exchange/add')
    || asPath.startsWith('/remove') || asPath.startsWith('exchange/remove')

  const soulEnabled = [ChainId.FANTOM, ChainId.AVALANCHE, ChainId.ETHEREUM].includes(chainId)
  // const globalNavStyle = ``
  const activeNavLink = // `${globalNavStyle} text-${getChainColorCode(chainId)}`
  `border bg-${getChainColorCode(chainId)} rounded text-white`
  const inactiveNavLink = // `${globalNavStyle} text-white`
  `text-secondary bg-white rounded rounded-xl border-[${getChainColor(chainId)}]`
 
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex gap-2 mx-1">
        <NavLink
          className={classNames(
            inactiveNavLink
            )}
          activeClassName={classNames(
            activeNavLink          
          )}
          href={
            inputCurrency && outputCurrency ?
              `/exchange/swap?inputCurrency=${currencyId(inputCurrency)}&outputCurrency=${currencyId(outputCurrency)}`
              : `/exchange/swap?inputCurrency=${NATIVE[chainId].symbol}&outputCurrency=${soulEnabled ? SOUL_ADDRESS[chainId] : USDC_ADDRESS[chainId]}`
          }
        >
            <Image className={"mt-2"} alt={"chevron up down black icon"}          
            src={ChevronUpDown}  />
            {/* {`↕`} */}
        </NavLink>
        {featureEnabled(Feature.LIQUIDITY, chainId) &&
          <NavLink
            className={classNames(
            inactiveNavLink
            )}
            activeClassName={classNames(
              activeNavLink
            )}
            href={`/exchange/${!isRemove ? 'add' : 'remove'}${inputCurrency ? `/${currencyId(inputCurrency)}` : `/${NATIVE[chainId].symbol}`}${outputCurrency ? `/${currencyId(outputCurrency)}` : ([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `/${SOUL_ADDRESS[chainId]}` : `/${USDC_ADDRESS[chainId]}`)
              }`}
          >
            <Image 
            height={26}
            width={26}
            alt={"add icon"}
            src={PlusSign} />
              {/* {`+/-`} */}
          </NavLink>
        }
        {featureEnabled(Feature.BRIDGE, chainId) &&
          <NavLink
            className={classNames(
            inactiveNavLink
            )}
            activeClassName={classNames(
              activeNavLink
            )}
            href={'/bridge'}
          >
              <Image
              height={26}
              width={26}
              alt={"bridge icon"}
              src={Globe} />
              {/* {i18n._(t`Bridge`)} */}
          </NavLink>
        }
        {/* {featureEnabled(Feature.LIQUIDITY, chainId) &&
          <NavLink
            activeClassName={classNames(
              activeNavLink
            )}
            href={'/cross'}
          >
            <Typography weight={700} className={inactiveNavLink}>
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