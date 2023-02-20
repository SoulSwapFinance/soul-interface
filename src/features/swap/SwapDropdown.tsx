import React, { FC, useCallback, useState } from 'react'
import { ChainId, Currency, NATIVE, Percent, SOUL_ADDRESS, USDC_ADDRESS } from 'sdk'
import NavLink from 'components/NavLink'
import Settings from 'components/Settings'
import { useRouter } from 'next/router'
import { classNames, currencyId, featureEnabled } from '../../functions'
import { useActiveWeb3React } from 'services/web3'
import { Feature } from 'enums'

import { getChainColor, getChainColorCode } from 'constants/chains'
import Typography from 'components/Typography'

// import RepeatIcon from 'components/Icons/exchange/RepeatIcon'
// import MergeIcon from 'components/Icons/exchange/MergeIcon'
// import CrossIcon from 'components/Icons/exchange/CrossIcon'
// import BridgeIcon from 'components/Icons/exchange/BridgeIcon'
// import PlusMinusIcon from 'components/Icons/exchange/PlusMinusIcon'

interface HeaderProps {
  inputCurrency?: Currency
  outputCurrency?: Currency
  allowedSlippage?: Percent
}

const SwapHeader: FC<HeaderProps> = ({ inputCurrency, outputCurrency }) => {
  const { asPath } = useRouter()
  const router = useRouter()
  const { chainId } = useActiveWeb3React()

  // const [show, setShow] = useState(false)
  // const reveal = useCallback(() => setShow(true), [setShow])
  // const conceal = useCallback(() => setShow(false), [setShow])


  const isRemove = asPath.startsWith('/remove') || asPath.startsWith('/exchange/remove')
  const isAdd = asPath.startsWith('/add') || asPath.startsWith('/exchange/add')
  const isPool = isRemove || isAdd
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
  const crossStyle = isCross ? activeStyle : style

  return (
    <div className={`flex items-center justify-center gap-2 border border-${getChainColorCode(chainId)} rounded rounded-2xl p-1`}>
      <div className="flex gap-2 mx-4">
        {/* {featureEnabled(Feature.LIQUIDITY, chainId) && */}
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
              `hover:border-2 hover:border-${getChainColorCode(chainId)} hover:bg-dark-900 flex rounded p-0.5`,
              isExchange && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
          // onClick={reveal}
          // onMouseEnter={reveal}
          // onMouseLeave={conceal}
          >
            {/* <RepeatIcon
              fillPrimary={isExchange ? `${getChainColor(chainId)}` : `#FFFFFF`}
              fillSecondary={isExchange ? `#FFFFFF` : `${getChainColor(chainId)}`}
              className={`w-6 w-6`}
            /> */}
            <Typography
              className={`font-bold sm:text-lg sm:mx-2 text-${getChainColorCode(chainId)}`}
            >
              {`Swap`}
            </Typography>
          </div>
        </NavLink>
        {/* } */}

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
                `hover:border-2 hover:border-${getChainColorCode(chainId)} hover:bg-dark-900 flex rounded p-0.5`,
                isPool && `border border-2 border-[${getChainColor(chainId)}]`)
              }
            // onClick={reveal}
            // onMouseEnter={reveal}
            // onMouseLeave={conceal}
            >
              {/* <PlusMinusIcon
                    fillPrimary={isPool ? `${getChainColor(chainId)}` : `#FFFFFF`}
                    fillSecondary={isPool ? `#FFFFFF` : `${getChainColor(chainId)}`}
                  /> */}
              <Typography
                className={`font-bold sm:text-lg sm:mx-2 text-${getChainColorCode(chainId)}`}
              >
                {`+/-`}
              </Typography>
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
                `hover:border-2 hover:border-${getChainColorCode(chainId)} hover:bg-dark-900 flex rounded p-0.5`,
                isAggregator && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
            // onClick={reveal}
            // onMouseEnter={reveal}
            // onMouseLeave={conceal}
            >
              {/* <MergeIcon
                  fillPrimary={isAggregator ? `${getChainColor(chainId)}` : `#FFFFFF`}
                  fillSecondary={isAggregator ? `#FFFFFF` : `${getChainColor(chainId)}`}
                /> */}
              <Typography
                className={`font-bold sm:text-lg sm:mx-2 text-${getChainColorCode(chainId)}`}
              >
                {`Aggregate`}
              </Typography>
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
                `hover:border-2 hover:border-${getChainColorCode(chainId)} hover:bg-dark-900 flex rounded p-0.5`,
                isCross && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
            // onClick={reveal}
            // onMouseEnter={reveal}
            // onMouseLeave={conceal}
            >
              {/* <CrossIcon
                fillPrimary={isCross ? `${getChainColor(chainId)}` : `#FFFFFF`}
                fillSecondary={isCross ? `#FFFFFF` : `${getChainColor(chainId)}`}
              /> */}
              <Typography
                className={`font-bold sm:text-lg sm:mx-2 text-${getChainColorCode(chainId)}`}
              >
                {`xChain`}
              </Typography>

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
                `hover:border-2 hover:border-${getChainColorCode(chainId)} hover:bg-dark-900 flex rounded p-0.5`,
                isBridge && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                // onClick={reveal}
                // onMouseEnter={reveal}
                // onMouseLeave={conceal}
            >
              {/* <BridgeIcon
                fillPrimary={isBridge ? `${getChainColor(chainId)}` : `#FFFFFF`}
                fillSecondary={isBridge ? `#FFFFFF` : `${getChainColor(chainId)}`}
              /> */}
              <Typography
                className={`font-bold sm:text-lg sm:mx-2 text-${getChainColorCode(chainId)}`}
              >
                {`Bridge`}
              </Typography>

            </div>
          </NavLink>
        }

      </div>
      <div className={classNames(
        `absolute right-4 top-50`,
        `sm:right-4`,
        `sm:top-48`, 
        `sm:mt-6 sm:gap-8`,
        `mr-1 justify-end rounded`)
      }>
        {/* {useSettings &&  */}
        <Settings />
        {/* } */}
      </div>
    </div>
  )
}

export default SwapHeader