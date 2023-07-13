import { ChevronDownIcon, ChevronUpIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { ChainId, CurrencyAmount, JSBI, Pair, Percent, SOUL_ADDRESS, Token, USD } from '../../sdk'
import React, { Fragment, useState } from 'react'
import { RowBetween, RowFixed } from '../Row'
import { currencyId, unwrappedToken } from '../../functions/currency'
import { useV2PairsWithPrice } from 'hooks/useV2Pairs'

import { AutoColumn } from '../Column'
import { BIG_INT_ZERO } from '../../constants'
import { Button } from '../Button'
import { CurrencyLogoArray } from '../CurrencyLogo'
import Dots from '../Dots'
import DoubleCurrencyLogo from '../DoubleLogo'
import { useColor } from '../../hooks'
import { useRouter } from 'next/router'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useTotalSupply } from '../../hooks/useTotalSupply'
import { classNames, formatNumber, formatNumberScale } from '../../functions'
import { Disclosure, Transition } from '@headlessui/react'
import { useActiveWeb3React } from 'services/web3'
import { useTokenInfo } from 'hooks/useAPI'
import Typography from 'components/Typography'
import { getChainColor, getChainColorCode } from 'constants/chains'
import ListPanel from 'components/ListPanel'

interface PositionCardProps {
  pair: Pair
  chainId: ChainId
  className?: string
  showUnwrapped?: boolean
  border?: string
  stakedBalance?: CurrencyAmount<Token> // optional balance to indicate that liquidity is deposited in mining pool
}

export function MinimalPositionCard({ pair, chainId, showUnwrapped = false, border, className }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(chainId, account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance &&
      !!totalPoolTokens &&
      JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
      !!totalPoolTokens &&
      !!userPoolBalance &&
      // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
      JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? [
        pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
        pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
      ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.quotient, JSBI.BigInt(0)) ? (
        <div 
          className={`p-5 rounded bg-dark-800 text-high-emphesis ${className}`}
          >
          <AutoColumn gap={'md'}>
            <div className="text-lg">{`Your Position`}</div>
            <div className="flex flex-col md:flex-row md:justify-between">
              <RowFixed className="flex items-center space-x-4">
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={40} />
                {/* <div className="text-2xl font-semibold">
                  {currency0.symbol}/{currency1.symbol}
                </div> */}
              </RowFixed>
              <RowFixed className="flex items-center mt-3 space-x-2 text-base md:mt-0">
                <div>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'} </div>
                <div className="text-secondary">{`Pool Tokens`}</div>
              </RowFixed>
            </div>
            <div className="flex flex-col w-full p-3 mt-3 space-y-1 text-sm rounded bg-dark-900 text-high-emphesis">
              <RowBetween>
                <div>{`Your Share`}</div>
                <div className="font-bold">{poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}</div>
              </RowBetween>
              <RowBetween>
                <div>{currency0.symbol}:</div>
                {token0Deposited ? (
                  <RowFixed className="space-x-2 font-bold">
                    <div> {token0Deposited?.toSignificant(6)}</div>
                    <div className="text-secondary">{currency0.symbol}</div>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </RowBetween>
              <RowBetween>
                <div>{currency1.symbol}:</div>
                {token1Deposited ? (
                  <RowFixed className="space-x-2 font-bold">
                    <div>{token1Deposited?.toSignificant(6)}</div>
                    <div className="text-secondary">{currency1.symbol}</div>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </RowBetween>
            </div>
          </AutoColumn>
        </div>
      ) : null}
    </>
  )
}


export default function FullPositionCard({ chainId, pair, border, stakedBalance }: PositionCardProps) {
  const router = useRouter()
  const { account } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userDefaultPoolBalance = useTokenBalance(chainId, account ?? undefined, pair.liquidityToken)

  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  // if staked balance balance provided, add to standard liquidity amount
  const userPoolBalance = stakedBalance ? userDefaultPoolBalance?.add(stakedBalance) : userDefaultPoolBalance

  const poolTokenPercentage =
    !!userPoolBalance &&
      !!totalPoolTokens &&
      JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
      !!totalPoolTokens &&
      !!userPoolBalance &&
      // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
      JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? [
        pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
        pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
      ]
      : [undefined, undefined]

  const backgroundColor = useColor(pair?.token0)

  const [depositValue, setDepositValue] = useState('')
  const [withdrawValue, setWithdrawValue] = useState('')
  const soulPrice = Number(useTokenInfo(SOUL_ADDRESS[chainId]).tokenInfo.price)

  const balance = userPoolBalance
  // const stakedAmount = useUserInfo(farm, liquidityToken)

  let [data] = useV2PairsWithPrice([[currency0, currency1]])
  let [state, liquidityToken, pairPrice] = data

  const pooledAmountFiatValueRaw
    = pair?.token1 ? Number(pairPrice) * Number(userPoolBalance?.toSignificant())
      : Number(soulPrice) * Number(userPoolBalance?.toSignificant())

  // console.log('currency0.symbol:%s', currency0.symbol)

  return (
    <Disclosure as="div" className="py-0">
      {({ open }) => (
        <div
          className={classNames(`border border-dark-800 rounded rounded-xl `,
            open ? `bg-dark-900 border-[${getChainColor(chainId)}]` : `hover:bg-dark-800`,
            'shadow-inner flex flex-col rounded-2xl gap-2 py-2 pl-1 pr-2 transition'
          )}
        >
          <Disclosure.Button as={Fragment}>
            <div className="flex justify-between gap-2 items-center pl-2 cursor-pointer">
              <div className="flex items-center mt-2 mb-2 gap-2">
                <CurrencyLogoArray size={32} currencies={[currency0, currency1]} dense />
                <Typography variant="lg" weight={700} className="text-white">
                  {currency0.symbol}-{currency1.symbol}
                </Typography>
              </div>
              <div className="flex gap-2 flex-grow items-center justify-end p-1 rounded">
                <div className="font-semibold">
                  {userPoolBalance ? formatNumber(pooledAmountFiatValueRaw, true)
                    /* {userPoolBalance
                      ? pooledAmountFiatValueRaw > 0.01 ? formatNumber(pooledAmountFiatValueRaw, true)
                      : formatNumber(pooledAmountFiatValueRaw, true)
                      : Number(pooledAmountFiatValueRaw.toFixed(2) === '0.00' ? '<0.01' 
                      : pooledAmountFiatValueRaw.toFixed(2)) != 0 ? pooledAmountFiatValueRaw.toFixed(2) */
                    : 0
                  }
                </div>
                <ChevronDownIcon
                  width={12}
                  className={classNames(open ? 'transform rotate-180' : '', 'transition hover:text-white')}
                />
              </div>
            </div>
          </Disclosure.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            unmount={false}
          >
            <Disclosure.Panel static>
              <div className="border border-dark-800 rounded p-3">
                {[token0Deposited, token1Deposited].map((cur, index) => (
                  <ListPanel.CurrencyAmountItem amount={cur} key={index}
                  // size="xs" 
                  // className="!px-0 !py-1" 
                  />
                ))}
                {userDefaultPoolBalance && JSBI.greaterThan(userDefaultPoolBalance.quotient, BIG_INT_ZERO) && (
                  <div className="flex justify-between border-t border-dark-800 pt-3 mt-3">
                    <div className="flex items-center mb-1">
                      <Typography variant="sm" className="text-low-emphesis">
                        {`Share:`} {' '}
                        {poolTokenPercentage
                          ? (poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)) + '%'
                          : '-'}
                      </Typography>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        startIcon={<MinusIcon width={14} height={14} />}
                        size="sm"
                        variant="outlined"
                        color={getChainColorCode(chainId)}
                        onClick={() => {
                          router.push(`/remove/${currencyId(currency0)}/${currencyId(currency1)}`)
                        }}
                      >
                        {/* {`Remove`} */}
                        {`-`}
                      </Button>
                      <Button
                        startIcon={<PlusIcon width={14} height={14} />}
                        size="sm"
                        variant="outlined"
                        color={getChainColorCode(chainId)}
                        onClick={() => {
                          router.push(`/add/${currencyId(currency0)}/${currencyId(currency1)}`)
                        }}
                      >
                        {/* {`Add`} */}
                        {`+`}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}