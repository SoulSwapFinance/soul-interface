import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { CurrencyAmount, JSBI, Pair, Percent, Token, USD } from '../../sdk'
import React, { useState } from 'react'
import { RowBetween, RowFixed } from '../Row'
import { currencyId, unwrappedToken } from '../../functions/currency'
import { useV2PairsWithPrice } from 'hooks/useV2Pairs'

import Alert from '../Alert'
import { AutoColumn } from '../Column'
import { BIG_INT_ZERO } from '../../constants'
import { Button } from '../Button'
import { CurrencyLogo } from '../CurrencyLogo'
import Dots from '../Dots'
import DoubleCurrencyLogo from '../DoubleLogo'
import { t } from '@lingui/macro'
import { useColor } from '../../hooks'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/router'
import { useCurrencyBalance, useTokenBalance } from '../../state/wallet/hooks'
import { useTotalSupply } from '../../hooks/useTotalSupply'
import { classNames, formatNumber, formatNumberScale } from '../../functions'
import { Transition } from '@headlessui/react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useCurrency } from 'hooks/Tokens'
import { usePriceHelperContract } from 'features/bond/hooks/useContract'
import { useUserInfo } from 'features/mines/hooks'
import { useActiveWeb3React } from 'services/web3'
import { useSoulPrice } from 'hooks/getPrices'

interface PositionCardProps {
  pair: Pair
  showUnwrapped?: boolean
  border?: string
  stakedBalance?: CurrencyAmount<Token> // optional balance to indicate that liquidity is deposited in mining pool
}

export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
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
        <div className="p-5 rounded bg-dark-800 text-high-emphesis">
          <AutoColumn gap={'md'}>
            <div className="text-lg">{i18n._(t`Your Position`)}</div>
            <div className="flex flex-col md:flex-row md:justify-between">
              <RowFixed className="flex items-center space-x-4">
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={40} />
                {/* <div className="text-2xl font-semibold">
                  {currency0.symbol}/{currency1.symbol}
                </div> */}
              </RowFixed>
              <RowFixed className="flex items-center mt-3 space-x-2 text-base md:mt-0">
                <div>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'} </div>
                <div className="text-secondary">{i18n._(t`Pool Tokens`)}</div>
              </RowFixed>
            </div>
            <div className="flex flex-col w-full p-3 mt-3 space-y-1 text-sm rounded bg-dark-900 text-high-emphesis">
              <RowBetween>
                <div>{i18n._(t`Your Share`)}</div>
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


export default function FullPositionCard({ pair, border, stakedBalance }: PositionCardProps) {
  const { i18n } = useLingui()
  const router = useRouter()
  const { account } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)

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
  const soulPrice = useSoulPrice()

  const balance = userPoolBalance
  // const stakedAmount = useUserInfo(farm, liquidityToken)
  
  let [data] = useV2PairsWithPrice([[currency0, currency1]])
  let [state, liquidityToken, pairPrice] = data
  
  // const balanceFiatValueRaw
  //   = pair?.token1 ? Number(pairPrice) * Number(balance?.toSignificant())
  //   : Number(soulPrice) * Number(balance?.toSignificant())
  
  const pooledAmountFiatValueRaw
    = pair?.token1 ? Number(pairPrice) * Number(userPoolBalance?.toSignificant())
    : Number(soulPrice) * Number(userPoolBalance?.toSignificant())
  
  // const balanceFiatValue
  //   = CurrencyAmount.fromRawAmount(
  //     USD[chainId],
  //     JSBI.BigInt(balanceFiatValueRaw.toFixed(USD[chainId].decimals)
  //     // .toBigNumber(USD[chainId].decimals)
  //     )
  //   )
  
  // const pooledAmountFiatValue
  //   = CurrencyAmount.fromRawAmount(
  //     USD[chainId],
  //     JSBI.BigInt(pooledAmountFiatValueRaw.toFixed(USD[chainId].decimals)
  //     // .toBigNumber(USD[chainId].decimals)
  //     )
  //   )
  
  return (
    <div
      className="rounded bg-dark-800"
      // style={{ backgroundColor }}
    >
      <Button
        variant="empty"
        className={classNames(
          'flex items-center justify-between w-full px-4 py-6 cursor-pointer bg-dark-800 hover:bg-dark-700',
          showMore && '!bg-dark-700'
        )}
        style={{ boxShadow: 'none' }}
        onClick={() => setShowMore(!showMore)}
      >
        <div className="flex items-center space-x-4">
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={40} />
          <div className="text-xl font-semibold">
            {!currency0 || !currency1 ? <Dots>{i18n._(t`Loading`)}</Dots> : `${currency0.symbol}/${currency1.symbol}`}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {i18n._(t`Manage`)}
          {showMore ? (
            <ChevronUpIcon width="20px" height="20px" className="ml-0" />
          ) : (
            <ChevronDownIcon width="20px" height="20px" className="ml-0" />
          )}
        </div>
      </Button>

      <Transition
        show={showMore}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="p-4 space-y-4">
          <div className="px-4 py-4 space-y-1 text-sm rounded text-high-emphesis bg-dark-900">
            <div className="flex items-center justify-between">
              <div>{i18n._(t`Pooled Tokens`)}:</div>
              <div className="font-semibold">{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</div>
            </div>
            {/* {stakedBalance && (
              <div className="flex items-center justify-between">
                <div>{i18n._(t`Pool tokens in rewards pool`)}:</div>
                <div className="font-semibold">{stakedBalance.toSignificant(4)}</div>
              </div>
            )} */}
            <div className="flex items-center justify-between">
              <div>{i18n._(t`Pooled ${currency0?.symbol}`)}:</div>
              {token0Deposited ? (
                <div className="flex items-center space-x-2">
                  <div className="font-semibold" title={token0Deposited.toSignificant(6)}>
                    {token0Deposited?.toSignificant(6)}
                  </div>
                  <CurrencyLogo size="20px" currency={currency0} />
                </div>
              ) : (
                '-'
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>{i18n._(t`Pooled ${currency1?.symbol}`)}:</div>
              {token1Deposited ? (
                <div className="flex items-center space-x-2">
                  <div className="font-semibold" title={token1Deposited.toSignificant(6)}>
                    {token1Deposited?.toSignificant(6)}
                  </div>
                  <CurrencyLogo size="20px" currency={currency1} />
                </div>
              ) : (
                '-'
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>{i18n._(t`Pooled Value`)}:</div>
              <div className="font-semibold">
                {userPoolBalance ? formatNumber(pooledAmountFiatValueRaw, true)
                  // ? pooledAmountFiatValue
                // ?.toSignificant(6, { groupSeparator: ',' }) // ?.toSignificant(4) */}
                  : 0}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>{i18n._(t`% Share`)}:</div>
              <div className="font-semibold">
                {poolTokenPercentage
                  ? (poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)) + '%'
                  : '-'}
              </div>
            </div>
          </div>
          {userDefaultPoolBalance && JSBI.greaterThan(userDefaultPoolBalance.quotient, BIG_INT_ZERO) && (
            <div className="grid grid-cols-2 gap-4">
              <Button
                color="blue"
                variant="filled"
                onClick={() => {
                  router.push(`/exchange/add/${currencyId(currency0)}/${currencyId(currency1)}`)
                }}
              >
                {i18n._(t`Add`)}
              </Button>
              <Button
                color="blue"
                variant="filled"
                onClick={() => {
                  router.push(`/exchange/remove/${currencyId(currency0)}/${currencyId(currency1)}`)
                }}
              >
                {i18n._(t`Remove`)}
              </Button>
            </div>
          )}
        </div>
      </Transition>
    </div>
  )
}