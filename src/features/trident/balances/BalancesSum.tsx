import { AddressZero } from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, NATIVE, ZERO } from 'sdk'
import Typography, { TypographyVariant } from 'components/Typography'
import SumUSDCValues from 'features/trident/SumUSDCValues'
import { currencyFormatter } from 'functions'
import { usePositions } from 'hooks/usePositions'
// import { useTridentLiquidityPositions } from 'services/graph'
import { useActiveWeb3React } from 'services/web3'
import { useCoffinBalancesV2 } from 'state/coffinbox/hooks'
import { useAllTokenBalances, useAllTokenBalancesWithLoadingIndicator, useCurrencyBalance } from 'state/wallet/hooks'
import React, { FC, useMemo } from 'react'

export const LiquidityPositionsBalancesSum = () => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const positions = usePositions()

  // const { data: positions } = useTridentLiquidityPositions({
  //   chainId,
  //   variables: { where: { user: account?.toLowerCase(), balance_gt: 0 } },
  //   shouldFetch: !!chainId && !!account,
  // })

  // const sum = positions?.reduce((acc, cur) => acc + cur.value, 0)

  const sum = positions?.reduce((acc, cur) => acc + cur.amount, 0)
  
  return (
    <div className="flex gap-14">
      <div className="flex flex-col gap-1">
        <Typography variant="sm">{i18n._(t`Total Value`)}</Typography>
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          ${sum?.toFixed(2) || '0.00'}
        </Typography>
      </div>
      <div className="flex flex-col gap-1">
        <Typography variant="sm">{i18n._(t`Number of Assets`)}</Typography>
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          {positions?.length}
        </Typography>
      </div>
    </div>
  )
}

const useWalletBalances = () => {
  const { chainId, account } = useActiveWeb3React()
  const tokenBalances = useAllTokenBalances()
  // const { data: tokenBalances, loading } = useAllTokenBalancesWithLoadingIndicator()
  const ethBalance = useCurrencyBalance(account ? account : undefined, chainId ? NATIVE[chainId] : undefined)
  return useMemo(() => {
    const res: CurrencyAmount<Currency>[] = Object.values(tokenBalances).filter((cur) => cur.greaterThan(ZERO))

    if (ethBalance) {
      res.push(ethBalance)
    }

    return {
      data: res,
      // loading,
    }
  }, [tokenBalances, ethBalance]) // loading
}

export const BalancesSum = () => {
  const { i18n } = useLingui()
  const { data: walletBalances } = useWalletBalances() // loading
  const { data: coffinBalances, loading: bLoading } = useCoffinBalancesV2()
  const balances = useMemo(() => {
    return Object.values(
      [...walletBalances, ...coffinBalances].reduce<Record<string, CurrencyAmount<Currency>>>((acc, cur) => {
        if (cur.currency.isNative) {
          if (acc[AddressZero]) acc[AddressZero] = acc[AddressZero].add(cur)
          else acc[AddressZero] = cur
        } else if (acc[cur.currency.wrapped.address]) {
          acc[cur.currency.wrapped.address] = acc[cur.currency.wrapped.address].add(cur)
        } else {
          acc[cur.currency.wrapped.address] = cur
        }

        return acc
      }, {})
    )
  }, [coffinBalances, walletBalances])

  return (
    <div className="flex lg:flex-row flex-col gap-10 justify-between lg:items-end w-full">
      <div className="flex gap-10">
        <_BalancesSum amounts={balances} label={i18n._(t`Net Worth`)} size="h3" loading={bLoading} />
      </div>
      <div className="flex gap-10">
        <_BalancesSum amounts={walletBalances} label={i18n._(t`Wallet`)} loading={false} />
        <_BalancesSum amounts={coffinBalances} label={i18n._(t`CoffinBox`)} loading={bLoading} />
        <div className="flex flex-col gap-1">
          <Typography variant="sm">{i18n._(t`Assets`)}</Typography>
          <Typography variant="lg">{balances.length}</Typography>
        </div>
      </div>
    </div>
  )
}

interface BalancesSumProps {
  amounts: (CurrencyAmount<Currency> | undefined)[]
  label: string
  size?: TypographyVariant
  loading: boolean
}

const _BalancesSum: FC<BalancesSumProps> = ({ amounts, loading, label, size = 'lg' }) => {
  return (
    <SumUSDCValues amounts={amounts}>
      {({ amount }) => {
        if (loading) {
          return (
            <div className="flex flex-col gap-1">
              <Typography variant="sm">{label}</Typography>
              <div className="animate-pulse rounded h-5 bg-dark-600 w-[100px]" />
            </div>
          )
        }

        return (
          <div className="flex flex-col gap-1">
            <Typography variant="sm">{label}</Typography>
            <Typography variant={size} weight={size === 'h3' ? 700 : 400} className="text-high-emphesis">
              {amount ? currencyFormatter.format(Number(amount.toExact())) : '$0.00'}
            </Typography>
          </div>
        )
      }}
    </SumUSDCValues>
  )
}