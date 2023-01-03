import { Field, replaceCreateState, selectCurrency, switchCurrencies, typeInput } from './actions'

import { createReducer } from '@reduxjs/toolkit'

export interface CreateFarmState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.DEPOSIT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.REWARD]: {
    readonly currencyId: string | undefined
  }
}

const initialState: CreateFarmState = {
  independentField: Field.DEPOSIT,
  typedValue: '',
  [Field.DEPOSIT]: {
    currencyId: '',
  },
  [Field.REWARD]: {
    currencyId: '',
  },
}

export default createReducer<CreateFarmState>(initialState, (builder) =>
  builder
    .addCase(replaceCreateState, (state, { payload: { typedValue, field, depositId, rewardId } }) => {
      return {
        [Field.DEPOSIT]: {
          currencyId: depositId,
        },
        [Field.REWARD]: {
          currencyId: rewardId,
        },
        independentField: field,
        typedValue: typedValue,
      }
    })
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.DEPOSIT ? Field.REWARD : Field.DEPOSIT
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.DEPOSIT ? Field.REWARD : Field.DEPOSIT,
          [field]: { currencyId: currencyId },
          [otherField]: { currencyId: state[field].currencyId },
        }
      } else {
        // the normal case
        return {
          ...state,
          [field]: { currencyId: currencyId },
        }
      }
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        independentField: state.independentField === Field.DEPOSIT ? Field.REWARD : Field.DEPOSIT,
        [Field.DEPOSIT]: { currencyId: state[Field.REWARD].currencyId },
        [Field.REWARD]: { currencyId: state[Field.DEPOSIT].currencyId },
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    })
)
