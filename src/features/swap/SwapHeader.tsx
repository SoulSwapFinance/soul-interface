import React, { FC, useState } from 'react'
import { ChainId, Currency, NATIVE, Percent, SOUL_ADDRESS, USDC_ADDRESS } from 'sdk'
import NavLink from 'components/NavLink'
import Settings from 'components/Settings'
import Typography from 'components/Typography'
import { useRouter } from 'next/router'
import { classNames, currencyId, featureEnabled } from '../../functions'
import { useActiveWeb3React } from 'services/web3'
import { Feature } from 'enums'

const getQuery = (input?: Currency, output?: Currency) => {
  const { chainId } = useActiveWeb3React()
  if (!input && !output) return
  if (input && !output) {
    return { inputCurrency: input || NATIVE[chainId ?? ChainId.FANTOM].symbol }
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
  const { chainId } = useActiveWeb3React()
  const isRemove = asPath.startsWith('/remove')
  // const isCrossChain = asPath.startsWith('/swap')
  const isSwap = asPath.startsWith('/exchange/swap') || asPath.startsWith('/swap') 
  || asPath.startsWith('/limit') || asPath.startsWith('exchange/limit') 
  || asPath.startsWith('/add') || asPath.startsWith('exchange/add') 
  || asPath.startsWith('/remove') || asPath.startsWith('exchange/remove')

  const chainColor
    = chainId == ChainId.FANTOM ? `border-[#1969FF] text-[#1969FF]`
      : chainId == ChainId.AVALANCHE ? `border-[#E84142] text-[#E84142]`
        : chainId == ChainId.ETHEREUM ? `border-[#627EEA] text-[#627EEA]`
          : chainId == ChainId.BSC ? `border-[#F0B90B] text-[#F0B90B]`
            : chainId == ChainId.MATIC ? `border-[#8247E5] text-[#8247E5]`
              : chainId == ChainId.ARBITRUM ? `border-[#627EEA] text-[#627EEA]`
                : chainId == ChainId.MOONRIVER ? `border-[#53CBC9] text-[#53CBC9]`
                  : `border-[#1969FF] text-[#1969FF]`
  const hoverColor = `${chainColor} hover:text-white`
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex gap-1 mx-1">
      {featureEnabled(Feature.SWAP, chainId) &&
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
              {`Swap`}
            </Typography>
          </NavLink>
        }
        {featureEnabled(Feature.LIQUIDITY, chainId) &&
          <NavLink
            activeClassName={classNames(
              "border rounded bg-black",
              chainColor
            )}
            href={`/${!isRemove ? 'add' : 'remove'}${inputCurrency ? `/${currencyId(inputCurrency)}` : `/${NATIVE[chainId ?? ChainId.FANTOM].symbol}`}${outputCurrency ? `/${currencyId(outputCurrency)}` : ([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `/${SOUL_ADDRESS[chainId ?? ChainId.FANTOM]}` : `/${USDC_ADDRESS[chainId ?? ChainId.FANTOM]}`)
              }`}
          >
            <Typography weight={700} className={`text-secondary hover:${hoverColor} p-1`}>
              {`Pool`}
            </Typography>
          </NavLink>
        }
        {featureEnabled(Feature.LIMIT, chainId) &&
          <NavLink
            activeClassName={classNames(
              "border rounded bg-black",
              chainColor
            )}

            href={{
              pathname:`/exchange/limit/${inputCurrency ? `${currencyId(inputCurrency)}` : `${NATIVE[chainId ?? ChainId.FANTOM].symbol}`}${outputCurrency ? `/${currencyId(outputCurrency)}` : ([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `/${SOUL_ADDRESS[chainId ?? ChainId.FANTOM]}` : `/${USDC_ADDRESS[chainId ?? ChainId.FANTOM]}`)}`,
              // pathname: '/exchange/limit',
              // query: getQuery(inputCurrency, outputCurrency),
            }}
          >
            <Typography weight={700} className={`text-secondary hover:${hoverColor} p-1`}>
              {`Limit`}
            </Typography>
          </NavLink>
        }
      </div>
        <div className={'flex flex-cols-2 sm:gap-8 gap-6 mr-4 justify-end rounded'}>
          {isSwap && <Settings />}
        </div>
    </div>
  )
}

export default SwapHeader