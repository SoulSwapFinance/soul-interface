import { createReducer } from '@reduxjs/toolkit'
import { COMMON_BASES, DEFAULT_DEADLINE_FROM_NOW, INITIAL_ALLOWED_SLIPPAGE } from '../../constants' // SUGGESTED_BASES
import { updateVersion } from 'state/global/actions'

import {
  addSerializedPair,
  addSerializedToken,
  removeSerializedPair,
  removeSerializedToken,
  SerializedPair,
  SerializedToken,
  toggleURLWarning,
  updateMatchesDarkMode,
  updateUserCrossChainMode,
  updateUserDarkMode,
  updateUserDeadline,
  updateUserSingleHopOnly,
  updateUserSlippageTolerance,
  updateUserUseOpenMev,
  toggleLiveChart,
  toggleProLiveChart,
  toggleTokenInfo,
  toggleTopTrendingTokens,
} from './actions'
import { ChainId } from 'sdk'
// getFavoriteTokenDefault
const currentTimestamp = () => new Date().getTime()

export interface UserState {
  showProLiveChart: boolean
  showTradeRoutes: boolean
  showTokenInfo: boolean
  showTopTrendingSoonTokens: boolean
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number
  userCrossChainMode: boolean

  userSingleHopOnly: boolean // only allow swaps on direct pairs

  // user defined slippage tolerance in bips, used in all txns
  userSlippageTolerance: number | 'auto'

  // deadline set by user in minutes, used in all txns
  userDeadline: number

  // true if OpenMEV protection is enabled
  userUseOpenMev: boolean

  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken
    }
  }

  pairs: {
    [chainId: number]: {
      // keyed by token0Address:token1Address
      [key: string]: SerializedPair
    }
  }

  timestamp: number
  showLiveCharts: {
    [chainId: number]: boolean
  }
  userDarkMode: boolean | null // the user's choice for dark mode or light mode
  matchesDarkMode: boolean // whether the dark mode media query matches

  URLWarningVisible: boolean
}

export const defaultShowLiveCharts: { [chainId in ChainId]: boolean } = {
  [ChainId.ETHEREUM]: true,
  [ChainId.TELOS]: false,
  [ChainId.MATIC]: false,
  [ChainId.BSC]: false,
  [ChainId.AVALANCHE]: true,
  [ChainId.FANTOM]: true,
  [ChainId.MOONRIVER]: false,
  [ChainId.ARBITRUM]: false
}

export const initialState: UserState = {
  userCrossChainMode: false,
  userSingleHopOnly: false,
  userSlippageTolerance: INITIAL_ALLOWED_SLIPPAGE,
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  tokens: {},
  pairs: {},
  timestamp: currentTimestamp(),
  showLiveCharts: { ...defaultShowLiveCharts },
  userDarkMode: null,
  matchesDarkMode: false,
  URLWarningVisible: true,
  userUseOpenMev: true,
  showTokenInfo: false,
  showProLiveChart: false,
  showTradeRoutes: false,
  showTopTrendingSoonTokens: false
}

function pairKey(token0Address: string, token1Address: string) {
  return `${token0Address};${token1Address}`
}

export const getFavoriteTokenDefault = (chainId: ChainId) => ({
  addresses: COMMON_BASES[chainId].map(e => e.address),
  // addresses: SUGGESTED_BASES[chainId].map(e => e.address),
  includeNativeToken: true,
})

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateVersion, (state) => {
      // slippage isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userSlippageTolerance !== 'number') {
        state.userSlippageTolerance = INITIAL_ALLOWED_SLIPPAGE
      }

      // deadline isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userDeadline !== 'number') {
        state.userDeadline = DEFAULT_DEADLINE_FROM_NOW
      }

      state.lastUpdateVersionTimestamp = currentTimestamp()
    })
    .addCase(updateUserDarkMode, (state, action) => {
      state.userDarkMode = action.payload.userDarkMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateMatchesDarkMode, (state, action) => {
      state.matchesDarkMode = action.payload.matchesDarkMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserCrossChainMode, (state, action) => {
      state.userCrossChainMode = action.payload.userCrossChainMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserSlippageTolerance, (state, action) => {
      state.userSlippageTolerance = action.payload.userSlippageTolerance
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserDeadline, (state, action) => {
      state.userDeadline = action.payload.userDeadline
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserSingleHopOnly, (state, action) => {
      state.userSingleHopOnly = action.payload.userSingleHopOnly
    })
    .addCase(addSerializedToken, (state, { payload: { serializedToken } }) => {
      state.tokens[serializedToken.chainId] = state.tokens[serializedToken.chainId] || {}
      state.tokens[serializedToken.chainId][serializedToken.address] = serializedToken
      state.timestamp = currentTimestamp()
    })
    .addCase(removeSerializedToken, (state, { payload: { address, chainId } }) => {
      state.tokens[chainId] = state.tokens[chainId] || {}
      delete state.tokens[chainId][address]
      state.timestamp = currentTimestamp()
    })
    .addCase(addSerializedPair, (state, { payload: { serializedPair } }) => {
      if (
        serializedPair.token0.chainId === serializedPair.token1.chainId &&
        serializedPair.token0.address !== serializedPair.token1.address
      ) {
        const chainId = serializedPair.token0.chainId
        state.pairs[chainId] = state.pairs[chainId] || {}
        state.pairs[chainId][pairKey(serializedPair.token0.address, serializedPair.token1.address)] = serializedPair
      }
      state.timestamp = currentTimestamp()
    })
    .addCase(removeSerializedPair, (state, 
      { payload: { serializedPair }}
     ) => {
      const chainId = serializedPair.token0.chainId
      if (state.pairs[chainId]) {
        // just delete both keys if either exists
        delete state.pairs[chainId][pairKey(serializedPair.token0.address, serializedPair.token1.address)]
      }
      state.timestamp = currentTimestamp()
    })
    .addCase(toggleURLWarning, (state) => {
      state.URLWarningVisible = !state.URLWarningVisible
    })
    .addCase(updateUserUseOpenMev, (state, action) => {
      state.userUseOpenMev = action.payload.userUseOpenMev
    })
    .addCase(toggleLiveChart, (state, { payload: { chainId } }) => {
      if (typeof state.showLiveCharts?.[chainId] !== 'boolean') {
        state.showLiveCharts = { ...defaultShowLiveCharts }
      }
      state.showLiveCharts[chainId] = !state.showLiveCharts[chainId]
    })
    .addCase(toggleProLiveChart, state => {
      state.showProLiveChart = !state.showProLiveChart
    })
    .addCase(toggleTokenInfo, state => {
      state.showTokenInfo = !state.showTokenInfo
    })
    .addCase(toggleTopTrendingTokens, state => {
      state.showTopTrendingSoonTokens = !state.showTopTrendingSoonTokens
    })
)
