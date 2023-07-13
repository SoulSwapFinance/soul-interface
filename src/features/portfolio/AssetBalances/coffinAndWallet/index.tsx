import { ChainId, NATIVE, ZERO } from 'sdk'
import Typography from 'components/Typography'
import AssetBalances from 'features/portfolio/AssetBalances/AssetBalances'
import { Assets } from 'features/portfolio/AssetBalances/types'
import { setBalancesState } from 'features/portfolio/portfolioSlice'
import { ActiveModal } from 'features/trident/types'
// import { useActiveWeb3React } from 'services/web3'
import { useCoffinBalancesV2ForAccount } from 'state/coffinbox/hooks'
import { useAppDispatch } from 'state/hooks'
import { useAllTokenBalancesWithLoadingIndicator, useCurrencyBalance } from 'state/wallet/hooks'
import React, { FC, useCallback, useMemo } from 'react'

import { useBasicTableConfig } from '../useBasicTableConfig'
import { Button } from 'components/Button'

export const CoffinBalances = ({ account }: { account: string }) => {
  const dispatch = useAppDispatch()
  const { data: balances, loading } = useCoffinBalancesV2ForAccount(account)
  const assets = balances.reduce<Assets[]>((acc, el) => {
    if (el) acc.push({ asset: el })
    return acc
  }, [])

  const handleRowClick = useCallback(
    (row) => {
      const { currency } = row.values.asset
      dispatch(
        setBalancesState({
          currency: currency,
          // currency.isNative ? NATIVE[chainId].symbol : row.values.asset.currency.address,
          activeModal: ActiveModal.WITHDRAW,
        })
      )
    },
    [dispatch]
  )

  const { config } = useBasicTableConfig(assets, loading)

  return (
    <div className="flex flex-col gap-3">
      <Button color="blue" >
      <Typography weight={700} variant="lg" 
        className="px-2 text-center text-high-emphesis">
        {`CoffinBox Balances`}
      </Typography>
      </Button>
      <AssetBalances config={config} onSelect={handleRowClick} />
    </div>
  )
}

export const WalletBalances: FC<{ chainId: ChainId, account: string }> = ({ chainId, account }) => {
  const dispatch = useAppDispatch()
  const { data: _balances, loading } = useAllTokenBalancesWithLoadingIndicator()

  const ethBalance = useCurrencyBalance(chainId, account ? account : undefined, chainId ? NATIVE[chainId] : undefined)

  const balances = useMemo(() => {
    const res = Object.values(_balances).reduce<Assets[]>((acc, cur) => {
      if (cur.greaterThan(ZERO)) acc.push({ asset: cur })

      return acc
    }, [])

    if (ethBalance) {
      res.push({ asset: ethBalance })
    }
    return res
  }, [_balances, ethBalance])
  const { config } = useBasicTableConfig(balances, loading)

  const handleRowClick = useCallback(
    (row) => {
      const { currency } = row.values.asset
      dispatch(
        setBalancesState({
          currency: currency, // currency.isNative ? NATIVE[chainId].symbol : row.values.asset.currency.address,
          activeModal: ActiveModal.DEPOSIT,
        })
      )
    },
    [dispatch]
  )

  return (
    <div className="flex flex-col gap-3">
      <Button color="blue" >
      <Typography weight={700} variant="lg" className="px-2 text-center text-high-emphesis">
        {`Wallet Balances`}
      </Typography>
      </Button>
      <AssetBalances config={config} onSelect={handleRowClick} />
    </div>
  )
}