import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, PoolState, ZERO } from 'sdk'
import {
  selectAddNormalInput,
  selectAddSpendFromWallet,
  selectTridentAdd,
  setAddNormalInput,
} from 'features/trident/add/addSlice'
import { usePoolContext } from 'features/trident/PoolContext'
import { tryParseAmount } from 'functions'
import { useCoffinOrWalletBalances } from 'hooks/useCoffinOrWalletBalance'
import { useActiveWeb3React } from 'services/web3'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { useDependentAssetInputs } from '../useDependentAssetInputs'

type UseAddLiquidityDerivedCurrencyAmounts = () => (CurrencyAmount<Currency> | undefined)[]
export const useAddLiquidityDerivedCurrencyAmounts: UseAddLiquidityDerivedCurrencyAmounts = () => {
  const { currencies } = usePoolContext()
  const normalInputs = useSelector(selectAddNormalInput)

  return useMemo(() => {
    if (currencies[0] && currencies[1]) {
      return [tryParseAmount(normalInputs[0], currencies[0]), tryParseAmount(normalInputs[1], currencies[1])]
    }

    return [undefined, undefined]
  }, [currencies, normalInputs])
}

type UseAddLiquidityDerivedInputError = () => string
export const useAddLiquidityDerivedInputError: UseAddLiquidityDerivedInputError = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const { poolWithState, currencies } = usePoolContext()
  const spendFromWallet = useSelector(selectAddSpendFromWallet)
  const parsedAmounts = useAddLiquidityDerivedCurrencyAmounts()
  const balances = useCoffinOrWalletBalances(account ?? undefined, currencies, spendFromWallet)

  const insufficientBalance = useMemo(
    () =>
      !!parsedAmounts.find((el, index) => {
        return balances && el ? balances?.[index]?.lessThan(el) : false
      }),
    [balances, parsedAmounts]
  )

  return !account
    ? i18n._(t`Connect Wallet`)
    : poolWithState?.state === PoolState.INVALID
    ? i18n._(t`Invalid pool`)
    : !parsedAmounts[0]?.greaterThan(ZERO) && !parsedAmounts[1]?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : insufficientBalance
    ? i18n._(t`Insufficient Balance`)
    : ''
}

export const useAddLiquidityDerivedInput = () => {
  const dispatch = useAppDispatch()
  const tridentAddState = useAppSelector(selectTridentAdd)
  const { fixedRatio, spendFromWallet, normalInput } = tridentAddState

  // Similar to setState(prevState => newState) if a function is passed as value to setInputs, pass previous state
  const setInputs = useMemo(
    // @ts-ignore TYPE NEEDS FIXING
    () => (values) => dispatch(setAddNormalInput(typeof values === 'function' ? values(normalInput) : values)),
    [dispatch, normalInput]
  )

  return useDependentAssetInputs({
    fixedRatio,
    spendFromWallet,
    inputs: normalInput,
    setInputs,
  })
}