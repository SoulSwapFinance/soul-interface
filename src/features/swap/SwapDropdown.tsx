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
import Chain from 'assets/svg/icons/Chain.svg'
import ChevronUpDownBlack from 'assets/svg/icons/ChevronUpDownBlack.svg'
import CircleAdd from 'assets/svg/icons/CircleAdd.svg'
import { getChainColorCode } from 'constants/chains'

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
  const { i18n } = useLingui()
  const { asPath } = useRouter()
  const { chainId } = useActiveWeb3React()
  const isRemove = asPath.startsWith('/remove')
  // const tokenA = inputCurrency
  // const tokenB = outputCurrency
  // const isCrossChain = asPath.startsWith('/swap')
  const isSwap = asPath.startsWith('/exchange/swap') || asPath.startsWith('/swap')
    || asPath.startsWith('/limit') || asPath.startsWith('exchange/limit')
    || asPath.startsWith('/add') || asPath.startsWith('exchange/add')
    || asPath.startsWith('/remove') || asPath.startsWith('exchange/remove')

  const soulEnabled = [ChainId.FANTOM, ChainId.AVALANCHE, ChainId.ETHEREUM].includes(chainId)
  const chainColor
    = chainId == ChainId.FANTOM ? `border-[#1969FF`
      : chainId == ChainId.AVALANCHE ? `border-[#E84142]`
        : chainId == ChainId.ETHEREUM ? `border-[#627EEA]`
          : chainId == ChainId.BSC ? `border-[#F0B90B]`
            : chainId == ChainId.MATIC ? `border-[#8247E5]`
              : chainId == ChainId.MOONRIVER ? `border-[#53CBC9]`
                : `border-[#1969FF]`
  const hoverColor = `${chainColor} hover:text-white`
  const activeNavLink = `border rounded text-white -mt-1 border-${getChainColorCode(chainId)}`
  const typographyStyle = `border rounded rounded-xl ${chainColor} bg-${getChainColorCode(chainId)}`
 
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex gap-2 mx-1">
        <NavLink
          activeClassName={classNames(
            activeNavLink          
          )}
          href={
            inputCurrency && outputCurrency ?
              `/exchange/swap?inputCurrency=${currencyId(inputCurrency)}&outputCurrency=${currencyId(outputCurrency)}`
              : `/exchange/swap?inputCurrency=${NATIVE[chainId].symbol}&outputCurrency=${soulEnabled ? SOUL_ADDRESS[chainId] : USDC_ADDRESS[chainId]}`
          }
        >
            <Typography weight={700} className={`text-secondary bg-white border mt-2 mb-2 rounded rounded-xl`}>
            <Image src={ChevronUpDownBlack} width="24px" height="24px" />
          </Typography>
        </NavLink>
        {featureEnabled(Feature.LIQUIDITY, chainId) &&
          <NavLink
            activeClassName={classNames(
              activeNavLink
            )}
            href={`/exchange/${!isRemove ? 'add' : 'remove'}${inputCurrency ? `/${currencyId(inputCurrency)}` : `/${NATIVE[chainId].symbol}`}${outputCurrency ? `/${currencyId(outputCurrency)}` : ([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `/${SOUL_ADDRESS[chainId]}` : `/${USDC_ADDRESS[chainId]}`)
              }`}
          >
            <Typography weight={700} className={`text-secondary bg-white border mt-2 mb-2 rounded rounded-xl`}>
            <Image src={CircleAdd} width="24px" height="24px" />
            </Typography>
          </NavLink>
        }
        {featureEnabled(Feature.LIQUIDITY, chainId) &&
          <NavLink
            activeClassName={classNames(
              activeNavLink
            )}
            href={'/bridge'}
          >
            <Typography weight={700} className={`text-secondary bg-white border mt-2 mb-2 rounded rounded-xl`}>
              <Image src={Bridge} width="24px" height="24px" />
            </Typography>
          </NavLink>
        }
        {featureEnabled(Feature.LIQUIDITY, chainId) &&
          <NavLink
            activeClassName={classNames(
              activeNavLink
            )}
            href={'/cross'}
          >
            <Typography weight={700} className={`text-secondary bg-white border mt-2 mb-2 rounded rounded-xl`}>
              <Image src={Chain} width="24px" height="24px" />
            </Typography>
          </NavLink>
        }
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
            {i18n._(t`Bridge`)}
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