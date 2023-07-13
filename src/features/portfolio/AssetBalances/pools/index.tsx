import Empty from 'components/Empty'
import FullPositionCard from 'components/PositionCard'
// import { useAppDispatch } from 'state/hooks'
// import { useAllTokenBalancesWithLoadingIndicator, useCurrencyBalance } from 'state/wallet/hooks'
import React, { FC, useCallback, useMemo } from 'react'
import { classNames, currencyId } from 'functions'

import { CurrencyAmount, SOUL_ADDRESS } from 'sdk'
import Dots from 'components/Dots'
import { useRouter } from 'next/router'
import NavLink from 'components/NavLink'
import { useV2PairsWithLiquidity } from 'features/trident/migrate/context/useV2PairsWithLiquidity'
import { Button } from 'components/Button'
import { useActiveWeb3React } from 'services/web3'
import Typography from 'components/Typography'

export const PoolBalances = ({ account }: { account: string }) => {
  const { chainId } = useActiveWeb3React()

  const router = useRouter()
  const { loading, pairs } = useV2PairsWithLiquidity(chainId)

  return (
    // <div className="p-4 space-y-2 bg-dark-900 rounded bg-dark-1200">
    <div className="flex flex-col gap-3">
      <Button color="blue" >
        <Typography weight={700} variant="lg"
          className="px-2 text-center text-high-emphesis">
          {`Liquidity Balances`}
        </Typography>
      </Button>
      <div className="grid grid-flow-row gap-0.5">
        <div className="mb-1 mt-1" />
        {loading ? (
          <Empty>
            <Dots>{`Loading`}</Dots>
          </Empty>
        ) : pairs?.length > 0 ? (
          <>
            {pairs?.map((v2Pair) => (
              <FullPositionCard
                chainId={chainId}
                key={v2Pair.liquidityToken.address}
                pair={v2Pair}
                stakedBalance={CurrencyAmount.fromRawAmount(v2Pair.liquidityToken, '0')}
              />
            ))}
          </>
        ) : (
          <Empty className="flex text-lg text-center text-low-emphesis">
            <div className="px-4 py-2">{`Add Liquidity & Earn Fees (0.25%)`}</div>
          </Empty>
        )}
        {/* {account && (
          <div className={classNames('grid gap-4', 'grid-cols-2')}>
            <Button
              id="add-pool-button"
              variant="filled"
              color="gradient"
              className="grid items-center justify-center grid-flow-col gap-2 whitespace-nowrap"
              onClick={() => router.push(`/exchange/add/${currencyId(NATIVE[chainId])}/${SOUL_ADDRESS[chainId]}`}
            >
              {`Add`}
            </Button>
            <Button
              id="add-pool-button"
              variant="filled"
              color="gradient"
              onClick={() => router.push(`/exchange/find`}
            >
              {`Import`}
            </Button>

          </div>
        )}
           */}
      </div>
    </div>
  )
}

  // const assets = balances.reduce<Assets[]>((acc, el) => {
  //   if (el) acc.push({ asset: el })
  //   return acc
  // }, [])

  // const handleRowClick = useCallback(
  //   (row) => {
  //     const { currency } = row.values.asset
  //     dispatch(
  //       setBalancesState({
  //         currency: currency,
  //         // currency.isNative ? NATIVE[chainId].symbol : row.values.asset.currency.address,
  //         activeModal: ActiveModal.WITHDRAW,
  //       })
  //     )
  //   },
  //   [dispatch]
  // )

  // const { config } = useBasicTableConfig(assets, loading)

  // return (
  //   <div className="flex flex-col gap-3">
  //     <Button color="blue" >
  //     <Typography weight={700} variant="lg"
  //       className="px-2 text-center text-high-emphesis">
  //       {`Pool Balances`}
  //     </Typography>
  //     </Button>
  //     <PoolBalances />
  //     {/* <AssetBalances config={config} onSelect={handleRowClick} /> */}
  //   </div>
  // )