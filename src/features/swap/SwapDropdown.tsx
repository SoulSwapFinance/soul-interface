import React, { FC } from 'react'
import { ChainId, Currency, NATIVE, Percent, SOUL_ADDRESS, USDC_ADDRESS } from 'sdk'
import NavLink from 'components/NavLink'
import Settings from 'components/Settings'
import { useRouter } from 'next/router'
import { classNames, currencyId, featureEnabled } from '../../functions'
import { useActiveWeb3React } from 'services/web3'
import { Feature } from 'enums'

import { getChainColor, getChainColorCode } from 'constants/chains'
import Typography from 'components/Typography'
import ExternalLink from 'components/ExternalLink'

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

  // const isLimit = router.pathname.startsWith('/limit')
  //   || router.pathname.startsWith('/exchange/swap/limit')

  const isAggregator = asPath.startsWith('/aggregator')
    || asPath.startsWith('/exchange/aggregator')

  const isCrosschain = asPath.startsWith('/crosschain')
    || asPath.startsWith('/exchange/crosschain')

  const isBridge = asPath.startsWith('/exchange/bridge')

  const isExchange = router.pathname.startsWith('/swap')
    || router.pathname.startsWith('/exchange/swap')
    // && !router.pathname.startsWith('/exchange/swap/limit'))
    || router.pathname.startsWith('/crosschain')

  // const useSettings = isExchange || isLimit || isPool

  const soulEnabled = [ChainId.FANTOM, ChainId.AVALANCHE, ChainId.ETHEREUM].includes(chainId)

  const activeStyle = `text-secondary bg-dark-900 rounded-lg`
  const style = `mt-0.5 hover:border-[${getChainColor(chainId)}]`
  const swapStyle = isExchange ? activeStyle : style
  const poolStyle = isPool ? activeStyle : style
  const ecoStyle = isAggregator ? activeStyle : style
  // const limitStyle = isLimit ? activeStyle : style
  const crossStyle = isCrosschain ? activeStyle : style
  const bridgeStyle = isBridge ? activeStyle : style

  return (
    <div className={`flex mt-2 mb-2 items-center justify-center gap-4 border-2 border-dark-700 rounded-lg`}>
      <div className={`flex gap-6 sm:gap-8 mr-8 sm:mr-0`}>
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
              : `/exchange/swap?inputCurrency=${NATIVE[chainId ?? ChainId.FANTOM].symbol}&outputCurrency=${soulEnabled ? SOUL_ADDRESS[chainId ?? ChainId.FANTOM] : USDC_ADDRESS[chainId ?? ChainId.FANTOM]}`
          }
        >
          <div
            className={classNames(
              `hover:border-2 hover:border-${getChainColorCode(chainId)} hover:bg-dark-900 flex rounded p-0.5`,
              isExchange && `bg-dark-800 border-2 border-[${getChainColor(chainId)}]`)}
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
            href={`/exchange/${!isRemove ? 'add' : 'remove'}${inputCurrency ? `/${currencyId(inputCurrency)}` : `/${NATIVE[chainId ?? ChainId.FANTOM].symbol}`}${outputCurrency ? `/${currencyId(outputCurrency)}` : ([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `/${SOUL_ADDRESS[chainId ?? ChainId.FANTOM]}` : `/${USDC_ADDRESS[chainId ?? ChainId.FANTOM]}`)
              }`}
          >
            <div
              className={classNames(
                `hover:border-2 hover:border-${getChainColorCode(chainId)} hover:bg-dark-900 flex rounded p-0.5`,
                isPool && `bg-dark-800 border-2 border-[${getChainColor(chainId)}]`)}
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
                {/* {`+/-`} */}
                {`Pool`}
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
            href={`/exchange/aggregator/${inputCurrency ? `${currencyId(inputCurrency)}` : `${NATIVE[chainId ?? ChainId.FANTOM].symbol}`}${outputCurrency ? `/${currencyId(outputCurrency)}` : ([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `/${SOUL_ADDRESS[chainId ?? ChainId.FANTOM]}` : `/${USDC_ADDRESS[chainId ?? ChainId.FANTOM]}`)

              // href={`/exchange/aggregator/${inputCurrency ? `${currencyId(inputCurrency)}` : `${NATIVE[chainId ?? ChainId.FANTOM].symbol}`}${outputCurrency ? `/${currencyId(outputCurrency)}` : ([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `/${SOUL_ADDRESS[chainId ?? ChainId.FANTOM]}` : `/${USDC_ADDRESS[chainId ?? ChainId.FANTOM]}`)
              }`}
          >
            <div
              className={classNames(
                `hover:border-2 hover:border-${getChainColorCode(chainId)} hover:bg-dark-900 flex rounded p-0.5`,
                isAggregator && `bg-dark-800 border-2 border-[${getChainColor(chainId)}]`)}
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
              bridgeStyle
            )}
            activeClassName={classNames(
              activeStyle
            )}
            href={`/exchange/bridge`}
          >
            <div
              className={classNames(
                `hover:border-2 hover:border-${getChainColorCode(chainId)} hover:bg-dark-900 flex rounded p-0.5`,
                isBridge && `bg-dark-800 border-2 border-[${getChainColor(chainId)}]`)}
            >
              <Typography
                className={`font-bold sm:text-lg sm:mx-2 text-${getChainColorCode(chainId)}`}
              >
                {`Bridge`}
              </Typography>
            </div>
          </NavLink>
        }

        {/* {featureEnabled(Feature.CROSSCHAIN, chainId) &&
          <ExternalLink
            className={classNames(
              crossStyle
            )}
            // activeClassName={classNames(
            //   activeStyle
            // )}
            // href={`/crosschain`}
            href={`https://widget-integrations-squid.vercel.app/`}
          >
            <div
              className={classNames(
                `hover:border-2 hover:border-${getChainColorCode(chainId)} hover:bg-dark-900 flex rounded p-0.5`,
                isCrosschain && `bg-dark-800 border-2 border-[${getChainColor(chainId)}]`)}
            >
              <Typography
                className={`font-bold sm:text-lg sm:mx-2 text-${getChainColorCode(chainId)}`}
              >
                {`xSwap`}
              </Typography>
            </div>
          </ExternalLink>
        } */}
      </div>
      <div className={
        classNames(`flex sm:absolute`,
        `sm:right-4 sm:top-48 sm:mt-5 sm:mb-1 sm:gap-8`,
        `mr-1 justify-end rounded`
          // `absolute right-4 top-50`,
          // `sm:right-4`,
          // `sm:top-48`,
          // `sm:mt-6 sm:gap-8`,
          // `mr-1 justify-end rounded`
          )
      }>
        {/* {useSettings &&  */}
        <Settings />
        {/* } */}
      </div>
    </div>
  )
}

export default SwapHeader