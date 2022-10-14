import { createAction } from '@reduxjs/toolkit'
import { FeeConfig } from 'hooks/useSwapV2Callback'
import { ChainId } from 'sdk'
import { Aggregator } from 'utils/swap/aggregator'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export const selectCurrency = createAction<{
  field: Field
  currencyId: string
}>('swap/selectCurrency')
export const switchCurrencies = createAction<void>('swap/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('swap/typeInput')
export const resetSelectCurrency = createAction<{ field: Field }>('swap/resetSelectCurrency')
export const chooseToSaveGas = createAction<{ saveGas: boolean }>('swap/chooseToSaveGas')
export const replaceSwapState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient?: string | null
  feeConfig: FeeConfig | undefined
  toChain?: ChainId
}>('swap/replaceSwapState')
export const setRecipient = createAction<{ recipient: string | null}>('swap/setRecipient')
export const setToChain = createAction<{ toChain: ChainId | null}>('swap/setToChain')
export const setFeeConfig = createAction<{ feeConfig: FeeConfig | undefined }>('swap/setFeeConfig')
export const setTrendingSoonShowed = createAction('swap/setTrendingSoonShowed')
export const setTrade = createAction<{ trade: Aggregator | undefined }>('swap/setTrade')
export const setFromCoffinBalance = createAction<boolean>('swap/setFromCoffinBalance')
