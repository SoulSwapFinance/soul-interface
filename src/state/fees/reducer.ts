
import { createReducer } from '@reduxjs/toolkit'
import { BigintIsh } from 'sdk/types'

import { setProtocolFee, setSwapFees } from './actions'

export interface FeesState {
  readonly swapFees:
    | {
        [key: string]: {
          fee: BigintIsh
          owner: string
        }
      }
    | undefined
  readonly protocolFeeDenominator: number
  readonly protocolFeeTo: string | undefined
}

const initialState: FeesState = {
  swapFees: undefined,
  protocolFeeDenominator: 10,
  protocolFeeTo: undefined,
}

export default createReducer<FeesState>(initialState, builder =>
  builder
    .addCase(setSwapFees, (state, { payload: { swapFees } }) => {
      return {
        ...state,
        swapFees,
      }
    })
    .addCase(setProtocolFee, (state, { payload: { protocolFeeDenominator, protocolFeeTo } }) => {
      return {
        ...state,
        protocolFeeDenominator,
        protocolFeeTo,
      }
    })
)