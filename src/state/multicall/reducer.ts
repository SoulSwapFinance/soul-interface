import { createReducer } from '@reduxjs/toolkit'

import {
  addMulticallListeners,
  errorFetchingMulticallResults,
  fetchingMulticallResults,
  removeMulticallListeners,
  updateMulticallResults,
} from './actions'
import { toCallKey } from './utils'
import { ChainId } from 'sdk'

export interface MulticallState {
  callListeners?: {
    // on a per-chain basis
    [chainId: number]: {
      // stores for each call key the listeners' preferences
      [callKey: string]: {
        // stores how many listeners there are per each blocks per fetch preference
        [blocksPerFetch: number]: number
      }
    }
  }

  callResults: {
    [chainId: number]: {
      [callKey: string]: {
        data?: string | null
        blockNumber?: number
        fetchingBlockNumber?: number
      }
    }
  }
}

const initialState: MulticallState = {
  callResults: {},
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      addMulticallListeners,
      (
        state,
        {
          payload: {
            calls,
            chainId,
            options: { blocksPerFetch },
          },
        }
      ) => {
        const listeners: MulticallState['callListeners'] = state.callListeners
          ? state.callListeners
          : (state.callListeners = {})
        listeners[chainId ?? ChainId.FANTOM] = listeners[chainId ?? ChainId.FANTOM] ?? {}
        calls.forEach((call) => {
          const callKey = toCallKey(call)
          listeners[chainId ?? ChainId.FANTOM][callKey] = listeners[chainId ?? ChainId.FANTOM][callKey] ?? {}
          listeners[chainId ?? ChainId.FANTOM][callKey][blocksPerFetch] = (listeners[chainId ?? ChainId.FANTOM][callKey][blocksPerFetch] ?? 0) + 1
        })
      }
    )
    .addCase(
      removeMulticallListeners,
      (
        state,
        {
          payload: {
            chainId,
            calls,
            options: { blocksPerFetch },
          },
        }
      ) => {
        const listeners: MulticallState['callListeners'] = state.callListeners
          ? state.callListeners
          : (state.callListeners = {})

        if (!listeners[chainId ?? ChainId.FANTOM]) return
        calls.forEach((call) => {
          const callKey = toCallKey(call)
          if (!listeners[chainId ?? ChainId.FANTOM][callKey]) return
          if (!listeners[chainId ?? ChainId.FANTOM][callKey][blocksPerFetch]) return

          if (listeners[chainId ?? ChainId.FANTOM][callKey][blocksPerFetch] === 1) {
            delete listeners[chainId ?? ChainId.FANTOM][callKey][blocksPerFetch]
          } else {
            listeners[chainId ?? ChainId.FANTOM][callKey][blocksPerFetch]--
          }
        })
      }
    )
    .addCase(fetchingMulticallResults, (state, { payload: { chainId, fetchingBlockNumber, calls } }) => {
      state.callResults[chainId ?? ChainId.FANTOM] = state.callResults[chainId ?? ChainId.FANTOM] ?? {}
      calls.forEach((call) => {
        const callKey = toCallKey(call)
        const current = state.callResults[chainId ?? ChainId.FANTOM][callKey]
        if (!current) {
          state.callResults[chainId ?? ChainId.FANTOM][callKey] = {
            fetchingBlockNumber,
          }
        } else {
          if ((current.fetchingBlockNumber ?? 0) >= fetchingBlockNumber) return
          state.callResults[chainId ?? ChainId.FANTOM][callKey].fetchingBlockNumber = fetchingBlockNumber
        }
      })
    })
    .addCase(errorFetchingMulticallResults, (state, { payload: { fetchingBlockNumber, chainId, calls } }) => {
      state.callResults[chainId ?? ChainId.FANTOM] = state.callResults[chainId ?? ChainId.FANTOM] ?? {}
      calls.forEach((call) => {
        const callKey = toCallKey(call)
        const current = state.callResults[chainId ?? ChainId.FANTOM][callKey]
        if (!current) return // only should be dispatched if we are already fetching
        if (current.fetchingBlockNumber === fetchingBlockNumber) {
          delete current.fetchingBlockNumber
          current.data = null
          current.blockNumber = fetchingBlockNumber
        }
      })
    })
    .addCase(updateMulticallResults, (state, { payload: { chainId, results, blockNumber } }) => {
      state.callResults[chainId ?? ChainId.FANTOM] = state.callResults[chainId ?? ChainId.FANTOM] ?? {}
      Object.keys(results).forEach((callKey) => {
        const current = state.callResults[chainId ?? ChainId.FANTOM][callKey]
        if ((current?.blockNumber ?? 0) > blockNumber) return
        state.callResults[chainId ?? ChainId.FANTOM][callKey] = {
          data: results[callKey],
          blockNumber,
        }
      })
    })
)