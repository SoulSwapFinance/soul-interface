import { 
    Field,
    chooseToSaveGas,
    replaceSwapState, 
    selectCurrency, 
    setRecipient,
    setTrendingSoonShowed,
    setFeeConfig,
    setTrade,
    setToChain, 
    switchCurrencies, 
    typeInput } from './actions'

import { createReducer } from '@reduxjs/toolkit'
import { ChainId } from 'sdk'
import { FeeConfig } from 'hooks/useSwapV2Callback'
import { Aggregator } from 'utils/swap/aggregator'

export interface SwapState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
  }
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null
  readonly saveGas: boolean
  readonly feeConfig: FeeConfig | undefined
  readonly trendingSoonShowed?: boolean
  readonly trade?: Aggregator
  readonly toChain: ChainId
}

const initialState: SwapState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: '',
  },
  [Field.OUTPUT]: {
    currencyId: '',
  },
  recipient: null,
  feeConfig: undefined,
  saveGas: false,
  trade: undefined,
  trendingSoonShowed: false,
  toChain: ChainId.FANTOM,
}

export default createReducer<SwapState>(initialState, (builder) =>
  builder
    .addCase(
      replaceSwapState,
      (state, { payload: { typedValue, recipient, feeConfig, toChain, field, inputCurrencyId, outputCurrencyId } }) => {
        return {
          [Field.INPUT]: {
            currencyId: inputCurrencyId,
          },
          [Field.OUTPUT]: {
            currencyId: outputCurrencyId,
          },
          independentField: field,
          typedValue: typedValue,
          recipient,
          saveGas: state.saveGas,
          feeConfig,
          trendingSoonShowed: state.trendingSoonShowed,
          trade: state.trade,
          toChain,
        }
      }
    )
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      // console.log({ currencyId, other: state[otherField].currencyId, test: state[otherField].currencyId }, currencyId === state[otherField].currencyId)
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
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
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId },
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient
    })
    .addCase(chooseToSaveGas, (state, { payload: { saveGas } }) => {
      state.saveGas = saveGas
    })
    .addCase(setFeeConfig, (state, { payload: { feeConfig } }) => {
      state.feeConfig = feeConfig
    })
    .addCase(setTrendingSoonShowed, state => {
      state.trendingSoonShowed = true
    })
    .addCase(setTrade, (state, { payload: { trade } }) => {
      state.trade = trade
    })
    .addCase(setToChain, (state, { payload: { toChain } }) => {
      state.toChain = toChain
    })
)
