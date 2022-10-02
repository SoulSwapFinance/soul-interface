import { createAction } from '@reduxjs/toolkit'
import { ChainId } from 'sdk'

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
export const replaceSwapState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient?: string | null
  toChain?: ChainId
}>('swap/replaceSwapState')
export const setRecipient = createAction<{ recipient: string | null}>('swap/setRecipient')
export const setToChain = createAction<{ toChain: ChainId | null}>('swap/setToChain')
export const setFromCoffinBalance = createAction<boolean>('swap/setFromCoffinBalance')
