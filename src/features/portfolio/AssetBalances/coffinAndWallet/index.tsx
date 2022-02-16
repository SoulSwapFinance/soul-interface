import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE, ZERO } from 'sdk'
import Typography from 'components/Typography'
import AssetBalances from 'features/portfolio/AssetBalances/AssetBalances'
import { Assets } from 'features/portfolio/AssetBalances/types'
import { setBalancesState } from 'features/portfolio/portfolioSlice'
import { ActiveModal } from 'features/trident/types'
import { useActiveWeb3React } from 'services/web3'
import { useCoffinBalancesV2ForAccount } from 'state/coffinbox/hooks'
import { useAppDispatch } from 'state/hooks'
import { useAllTokenBalancesWithLoadingIndicator, useCurrencyBalance } from 'state/wallet/hooks'
import React, { FC, useCallback, useMemo } from 'react'

import { useBasicTableConfig } from '../useBasicTableConfig'

export const CoffinBalances = ({ account }: { account: string }) => {
  const { i18n } = useLingui()
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
          currency: currency.isNative ? 'FTM' : row.values.asset.currency.address,
          activeModal: ActiveModal.WITHDRAW,
        })
      )
    },
    [dispatch]
  )

  const { config } = useBasicTableConfig(assets, loading)

  return (
    <div className="flex flex-col gap-3">
      <Typography weight={700} variant="lg" className="px-2 text-high-emphesis">
        {i18n._(t`CoffinBox`)}
      </Typography>
      <AssetBalances config={config} onSelect={handleRowClick} />
    </div>
  )
}

export const WalletBalances: FC<{ account: string }> = ({ account }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { data: _balances, loading } = useAllTokenBalancesWithLoadingIndicator()

  // @ts-ignore TYPE NEEDS FIXING
  const ethBalance = useCurrencyBalance(account ? account : undefined, chainId ? NATIVE[chainId] : undefined)

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
          currency: currency.isNative ? 'FTM' : row.values.asset.currency.address,
          activeModal: ActiveModal.DEPOSIT,
        })
      )
    },
    [dispatch]
  )

  return (
    <div className="flex flex-col gap-3">
      <Typography weight={700} variant="lg" className="px-2 text-high-emphesis">
        {i18n._(t`Wallet`)}
      </Typography>
      <AssetBalances config={config} onSelect={handleRowClick} />
    </div>
  )
}