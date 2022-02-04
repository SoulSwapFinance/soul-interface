import { NATIVE, ZERO } from 'sdk'
import AssetBalances from 'features/trident/balances/AssetBalances/AssetBalances'
import { Assets } from 'features/trident/balances/AssetBalances/types'
import { useLPTableConfig } from 'features/trident/balances/AssetBalances/useLPTableConfig'
import { setBalancesState } from 'features/trident/balances/balancesSlice'
import { useBalancesSelectedCurrency } from 'features/trident/balances/useBalancesDerivedState'
import { ActiveModal } from 'features/trident/types'
// import { useTridentLiquidityPositions } from 'services/graph'
import { useActiveWeb3React } from 'services/web3'
import { useCoffinBalancesV2 } from 'state/coffinbox/hooks'
import { useAppDispatch } from 'state/hooks'
import { useAllTokenBalances, useCurrencyBalance } from 'state/wallet/hooks'
import React, { useCallback, useMemo } from 'react'

import { useTableConfig } from './useTableConfig'
import { POOLS } from 'constants/farms'
import { useSoulPositions } from 'features/mines/hooks'
import { useSoulSummonerContract } from 'hooks/useContract'

export const LiquidityPositionsBalances = () => {
  // const { account, chainId } = useActiveWeb3React()

  // const {
  //   data: positions,
  //   isValidating,
  //   error,
  // } 
// = 
//   useTridentLiquidityPositions({
//     chainId,
//     variables: { where: { user: account?.toLowerCase(), balance_gt: 0 } },
//     shouldFetch: !!chainId && !!account,
//   })

function usePositions() {
  return useSoulPositions(useSoulSummonerContract())
}

const positions = usePositions()
// const farmingPools = Object.keys(POOLS[chainId]).map((key) => {
//   return { ...POOLS[chainId][key], lpToken: key }
// })
  const { config } = useLPTableConfig(positions)
  return <AssetBalances config={config} />
}

export const CoffinBalances = () => {
  const dispatch = useAppDispatch()
  const selected = useBalancesSelectedCurrency()
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

  const { config } = useTableConfig(assets)

  return (
    <AssetBalances
      config={config}
      selected={(row) => row.values.asset.currency === selected}
      onSelect={handleRowClick}
    />
  )
}

export const WalletBalances = () => {
  const { chainId, account } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const selected = useBalancesSelectedCurrency()

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
    <AssetBalances
      config={config}
      selected={(row) => row.values.asset.currency === selected}
      onSelect={handleRowClick}
    />
  )
}