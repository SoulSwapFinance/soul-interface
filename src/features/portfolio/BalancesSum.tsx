import { ChainId, Currency, CurrencyAmount, NATIVE, ZERO } from 'sdk'
import Typography, { TypographyVariant } from 'components/Typography'
import SumUSDCValues from 'features/trident/SumUSDCValues'
import { currencyFormatter } from 'functions'
import { useCoffinBalancesV2ForAccount } from 'state/coffinbox/hooks'
import { useAllTokenBalancesWithLoadingIndicator, useCurrencyBalance } from 'state/wallet/hooks'
import React, { FC, useMemo } from 'react'
import { useLiquidityPositions } from 'services/graph'
import { useActiveWeb3React } from 'services/web3'

export const LiquidityPositionsBalancesSum = () => {
  const { account, chainId } = useActiveWeb3React()

  // const { data: positions } = useTridentLiquidityPositions({
  const liquidityPositions = useLiquidityPositions({
    chainId,
    variables: { where: { user: account?.toLowerCase(), balance_gt: 0 } },
    shouldFetch: !!chainId && !!account,
  })

  const sum = liquidityPositions?.reduce((acc, cur) => acc + cur.value, 0)

  return (
    <div className="flex gap-14">
      <div className="flex flex-col gap-1">
        <Typography variant="sm">{`Total Value`}</Typography>
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          ${sum?.toFixed(2) || '0.00'}
        </Typography>
      </div>
      <div className="flex flex-col gap-1">
        <Typography variant="sm">{`Number of Assets`}</Typography>
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          {liquidityPositions?.length}
        </Typography>
      </div>
    </div>
  )
}

const useWalletBalances = (account: string) => {
  const { chainId } = useActiveWeb3React()
  const { data: tokenBalances, loading } = useAllTokenBalancesWithLoadingIndicator()
  const ethBalance = useCurrencyBalance(chainId, account ? account : undefined, chainId ? NATIVE[chainId ?? ChainId.FANTOM] : undefined)
  return useMemo(() => {
    const res: CurrencyAmount<Currency>[] = Object.values(tokenBalances).filter((cur) => cur.greaterThan(ZERO))

    if (ethBalance) {
      res.push(ethBalance)
    }

    return {
      data: res,
      loading,
    }
  }, [tokenBalances, ethBalance, loading])
}

export const BalancesSum: FC<{ account: string }> = ({ account }) => {
  const { data: walletBalances, loading: wLoading } = useWalletBalances(account)
  const { data: coffinBalances, loading: bLoading } = useCoffinBalancesV2ForAccount(account)

  const allAssets = useMemo(() => {
    const combined = [...walletBalances, ...coffinBalances]
    return {
      total: combined.length,
      balances: combined,
    }
  }, [coffinBalances, walletBalances])

  return (
    <div className="flex lg:flex-row flex-col gap-10 justify-between lg:items-end w-full">
      <div className="flex gap-10">
        <_BalancesSum
          assetAmounts={allAssets.balances}
          label={`Net Worth`}
          size="h3"
          loading={wLoading || bLoading}
        />
      </div>
      <div className="flex gap-10">
        <_BalancesSum assetAmounts={walletBalances} label={`Wallet`} loading={wLoading} />
        <_BalancesSum assetAmounts={coffinBalances} label={`CoffinBox`} loading={bLoading} />
        {/* <div className="flex flex-col gap-1">
          <Typography variant="sm">{`Assets`}</Typography>
          <Typography variant="lg">{allAssets.total}</Typography>
        </div> */}
      </div>
    </div>
  )
}

interface BalancesSumProps {
  assetAmounts: (CurrencyAmount<Currency> | undefined)[]
  liabilityAmounts?: (CurrencyAmount<Currency> | undefined)[]
  label: string
  size?: TypographyVariant
  loading: boolean
}

const _BalancesSum: FC<BalancesSumProps> = ({ assetAmounts, liabilityAmounts = [], loading, label, size = 'lg' }) => {
  return (
    <SumUSDCValues amounts={assetAmounts}>
      {({ amount: assetAmount }) => (
        <SumUSDCValues amounts={liabilityAmounts}>
          {({ amount: liabilityAmount }) => {
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
                  {assetAmount && liabilityAmount
                    ? currencyFormatter.format(Number(assetAmount.subtract(liabilityAmount).toExact()))
                    : assetAmount
                    ? currencyFormatter.format(Number(assetAmount.toExact()))
                    : '$0.00'}
                </Typography>
              </div>
            )
          }}
        </SumUSDCValues>
      )}
    </SumUSDCValues>
  )
}