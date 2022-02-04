import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE, ZERO } from 'sdk'
import Typography from 'components/Typography'
import AssetBalances from 'features/trident/balances/AssetBalances/AssetBalances'
import { Assets } from 'features/trident/balances/AssetBalances/types'
import { useLPTableConfig } from 'features/trident/balances/AssetBalances/useLPTableConfig'
import { setBalancesState } from 'features/trident/balances/balancesSlice'
import { ActiveModal } from 'features/trident/types'
// import { useTridentLiquidityPositions } from 'services/graph'
import { useActiveWeb3React } from 'services/web3'
import { useCoffinBalancesV2 } from 'state/coffinbox/hooks'
import { useAppDispatch } from 'state/hooks'
import { useAllTokenBalances, useAllTokenBalancesWithLoadingIndicator, useCurrencyBalance } from 'state/wallet/hooks'
import React, { useCallback, useMemo } from 'react'

import { useTableConfig } from './useTableConfig'
import { usePositions } from 'hooks/usePositions'

export const LiquidityPositionsBalances = () => {
  const { account, chainId } = useActiveWeb3React()
  const positions = usePositions()
  // const { data: positions } = useTridentLiquidityPositions({
  //   chainId,
  //   variables: { where: { user: account?.toLowerCase(), balance_gt: 0 } },
  //   shouldFetch: !!chainId && !!account,
  // })

  const { config } = useLPTableConfig(positions)
  return <AssetBalances config={config} />
}

export const CoffinBalances = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { data: balances, loading } = useCoffinBalancesV2()
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
          activeModal: ActiveModal.MENU,
        })
      )
    },
    [dispatch]
  )

  const { config } = useTableConfig(assets, loading)

  return (
    <div className="flex flex-col gap-3">
      <Typography weight={700} variant="lg" className="px-2 text-high-emphesis">
        {i18n._(t`CoffinBox`)}
      </Typography>
      <AssetBalances config={config} onSelect={handleRowClick} />
    </div>
  )
}

export const WalletBalances = () => {
  const { i18n } = useLingui()
  const { chainId, account } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  // const { data: _balances, loading } = useAllTokenBalancesWithLoadingIndicator()
  const _balances = useAllTokenBalances()

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
  const { config } = useTableConfig(balances)

  const handleRowClick = useCallback(
    (row) => {
      const { currency } = row.values.asset
      dispatch(
        setBalancesState({
          currency: currency.isNative ? 'FTM' : row.values.asset.currency.address,
          activeModal: ActiveModal.MENU,
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