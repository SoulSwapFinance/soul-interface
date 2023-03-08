import { createAction } from '@reduxjs/toolkit'

export enum Field {
  DEPOSIT = 'DEPOSIT',
  REWARD = 'REWARD',
  ENCHANTER = 'ENCHANTER',
  DURATION = 'DURATION',
  FEE = 'FEE',
}

export const selectCurrency = createAction<{
  field: Field
  currencyId: string
}>('defarms/selectCurrency')

export const switchCurrencies = createAction<void>('defarms/switchCurrencies')

export const typeInput = createAction<{ field: Field; typedValue: string }>('defarms/typeInput')

export const replaceCreateState = createAction<{
  field: Field
  typedValue: string
  depositId?: string
  rewardId?: string
}>('defarms/replaceCreateState')
