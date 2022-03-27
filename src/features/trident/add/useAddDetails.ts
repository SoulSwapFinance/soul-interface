import { CurrencyAmount, Percent, ZERO } from 'sdk'
import { useAddLiquidityDerivedCurrencyAmounts } from 'features/trident/add/useAddLiquidityDerivedState'
import { usePoolContext } from 'features/trident/PoolContext'
import { getPriceOfNewPool } from 'features/trident/utils'
import { calculateSlippageAmount, toShareCurrencyAmount } from 'functions'
import { useUserSlippageToleranceWithDefault } from 'state/user/hooks'
import { useMemo } from 'react'

import { DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE } from '../constants'
import { ZERO_PERCENT } from '../../../constants'

export const useAddDetails = (defaultSlippage: Percent = DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE) => {
  const {
    poolWithState,
    totalSupply,
    poolBalance,
    rebases,
    noLiquidity,
    poolShare: poolShareBefore,
    liquidityValue: liquidityValueBefore,
    currencies,
  } = usePoolContext()
  const slippage = useUserSlippageToleranceWithDefault(defaultSlippage)
  const parsedAmounts = useAddLiquidityDerivedCurrencyAmounts()

  // Returns the minimum SLP that will get minted given current input amounts
  const liquidityMinted = useMemo(() => {
    if (
      poolWithState?.pool &&
      totalSupply &&
      currencies[0] &&
      currencies[1] &&
      rebases?.[currencies[0].wrapped.address] &&
      rebases?.[currencies[1].wrapped.address]
    ) {
      const amountA = toShareCurrencyAmount(
        // @ts-ignore FIX TYPE
        rebases[currencies[0].wrapped.address],
        parsedAmounts && parsedAmounts[0]
          ? parsedAmounts[0].wrapped
          : CurrencyAmount.fromRawAmount(currencies[0], '0').wrapped
      )

      const amountB = toShareCurrencyAmount(
        // @ts-ignore FIX TYPE
        rebases[currencies[1].wrapped.address],
        parsedAmounts && parsedAmounts[1]
          ? parsedAmounts[1].wrapped
          : CurrencyAmount.fromRawAmount(currencies[1], '0').wrapped
      )

      // Both can't be zero
      if (amountA.equalTo(0) && amountB.equalTo(0)) return undefined

      try {
        // @ts-ignore FIX TYPE
        const slp = poolWithState.pool.getLiquidityMinted(totalSupply, amountA, amountB)
        const minSLP = calculateSlippageAmount(slp, noLiquidity ? ZERO_PERCENT : slippage)[0]
        return CurrencyAmount.fromRawAmount(slp.currency, minSLP.toString())
      } catch (error) {
        console.error(error)
      }
    }

    return undefined
  }, [currencies, noLiquidity, parsedAmounts, poolWithState?.pool, rebases, slippage, totalSupply])

  // Returns the resulting pool share after execution
  const poolShareAfter = useMemo(() => {
    if (liquidityMinted && totalSupply && poolBalance) {
      return new Percent(poolBalance.add(liquidityMinted).quotient, totalSupply.add(liquidityMinted).quotient)
    }

    return undefined
  }, [liquidityMinted, poolBalance, totalSupply])

  const price = useMemo(() => {
    if (noLiquidity && parsedAmounts) {
      return getPriceOfNewPool(parsedAmounts)
    } else if (parsedAmounts?.[1]) {
      return poolWithState?.pool && parsedAmounts[0]?.wrapped
        ? poolWithState?.pool.priceOf(parsedAmounts[1]?.currency.wrapped)
        : undefined
    }
    return undefined
  }, [noLiquidity, parsedAmounts, poolWithState?.pool])

  return useMemo(
    () => ({
      poolShareBefore,
      poolShareAfter,
      liquidityMinted,
      liquidityValueBefore,
      price,
    }),
    [poolShareBefore, poolShareAfter, liquidityMinted, liquidityValueBefore, price]
  )
}