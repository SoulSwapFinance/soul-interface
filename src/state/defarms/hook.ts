import { ChainId, Currency, NATIVE } from 'sdk'
import { useCurrency } from 'hooks/Tokens'
import { useActiveWeb3React } from 'services/web3'
import { AppState } from 'state'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { useCallback } from 'react'

import { Field, selectCurrency, switchCurrencies, typeInput } from './actions'

export function useCreateFarmState(): AppState['defarms'] {
  return useAppSelector((state) => state.defarms)
}

export function useCreateFarmActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
} {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency.isToken ? currency.address : currency.isNative ? `${NATIVE[chainId ?? ChainId.FANTOM].symbol}` : '',
        })
      )
    },
    [dispatch]
  )

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
  }
}

export function useDerivedCreateFarmInfo(): {
  currencies: { [field in Field]?: Currency }
  inputError?: string
} {
  const { account } = useActiveWeb3React()

  const {
    independentField,
    typedValue,
    [Field.DEPOSIT]: { currencyId: depositId },
    [Field.REWARD]: { currencyId: rewardId },
  } = useCreateFarmState()

  const deposit = useCurrency(depositId)

  const reward = useCurrency(rewardId)

  const currencies: { [field in Field]?: Currency } = {
    [Field.DEPOSIT]: deposit ?? undefined,
    [Field.REWARD]: reward ?? undefined,
  }

  let inputError: string | undefined

  if (!account) {
    inputError = 'Connect Wallet'
  }

  // if (!currencies[Field.DEPOSIT]) {
  //   inputError = inputError ?? `Select Deposit`
  // }

  if (!currencies[Field.REWARD]) {
    inputError = inputError ?? `Select Reward`
  }

  if (!Field.FEE) {
    inputError = inputError ?? `Set Withdraw Fee`
  }

  return {
    currencies,
    inputError,
  }
}