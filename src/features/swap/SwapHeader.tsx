import React, { FC, useState } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, Currency, DAI_ADDRESS, NATIVE, Percent } from 'sdk'
import NavLink from 'components/NavLink'
import Settings from 'components/Settings'
import CrossChainMode from 'components/CrossChainMode'
import Typography from 'components/Typography'
import { useRouter } from 'next/router'
import { classNames, currencyId } from '../../functions'
import ExternalLink from 'components/ExternalLink'
import { useActiveWeb3React } from 'services/web3'
import { AVALANCHE, Chain, POLYGON, ETHEREUM, FANTOM, MOONRIVER } from 'features/cross/chains'

const getQuery = (input?: Currency, output?: Currency) => {
  const  { chainId } = useActiveWeb3React()
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
  const isCrossChain = asPath.startsWith('/swap')
  const isSwap = asPath.startsWith('/swap') || asPath.startsWith('/add') || asPath.startsWith('/remove')
  const chainColor
    = chainId == ChainId.FANTOM ? `border-[#1969FF] text-[#1969FF]`
      : chainId == ChainId.AVALANCHE ? `border-[#E84142] text-[#E84142]`
        : chainId == ChainId.ETHEREUM ? `border-[#627EEA] text-[#627EEA]`
          : chainId == ChainId.BSC ? `border-[#F0B90B] text-[#F0B90B]`
            : chainId == ChainId.MATIC ? `border-[#8247E5] text-[#8247E5]`
              : chainId == ChainId.MOONRIVER ? `border-[#53CBC9] text-[#53CBC9]`
                : `border-[#1969FF] text-[#1969FF]`
  const hoverColor = `${chainColor} hover:text-white`
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex gap-4 mx-2">
        <NavLink
          activeClassName={classNames(
            "border rounded bg-black",
            chainColor
          )}
          href={{
            pathname: '/swap',
            query: getQuery(inputCurrency, outputCurrency),
          }}
          >
          <Typography weight={700} className={`text-secondary ml-3 hover:${hoverColor} p-1`}>
            {i18n._(t`Swap`)}
          </Typography>
        </NavLink>
      { chainId == 250 &&
        <NavLink
        activeClassName={classNames(
          "border rounded bg-black",
          chainColor
          )}
          href={`/${!isRemove ? 'add' : 'remove'}${inputCurrency ? `/${currencyId(inputCurrency)}` : `/${NATIVE[chainId].symbol}`}${outputCurrency ? `/${currencyId(outputCurrency)}` : (chainId == 250 ? '/0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07' : `/${DAI_ADDRESS[chainId]}`)
        }`} 
        >
          <Typography weight={700} className={`text-secondary hover:${hoverColor} p-1`}>
            {i18n._(t`+/-`)}
          </Typography>
        </NavLink>
        }

        { chainId == 250 &&
        <NavLink
          activeClassName={classNames(
            "border rounded bg-black",
            chainColor
          )}
          href={{
            pathname: '/exchange/limit',
            query: getQuery(inputCurrency, outputCurrency),
          }}
        >
          <Typography weight={700} className={`text-secondary hover:${hoverColor} p-1`}>
            {i18n._(t`Limit`)}
          </Typography>
        </NavLink>
          }
        <NavLink
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
        </NavLink>
      </div>
        {
          isCrossChain && chainId != 250 &&
          <div className={'flex justify-end rounded mr-4'}>
            <CrossChainMode />
          </div>
        }
        {
          isCrossChain && chainId == 250 &&
          <div className={'flex flex-cols-2 sm:gap-8 gap-6 mr-4 justify-end rounded'}>
            <CrossChainMode />
            { isSwap && <Settings /> }
          </div>
        }

    </div>
  )
}

export default SwapHeader