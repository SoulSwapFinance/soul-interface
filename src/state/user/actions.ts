import { createAction } from '@reduxjs/toolkit'
import { CrossChainSetting } from './reducer'

export interface SerializedToken {
  chainId: number
  address: string
  decimals: number
  symbol?: string
  name?: string
}

export interface SerializedPair {
  token0: SerializedToken
  token1: SerializedToken
}
export const updateMatchesDarkMode = createAction<{ matchesDarkMode: boolean }>('user/updateMatchesDarkMode')
export const updateUserDarkMode = createAction<{ userDarkMode: boolean }>('user/updateUserDarkMode')
export const updateUserCrossChainMode = createAction<{ userCrossChainMode: boolean }>('user/updateUserCrossChainMode')
export const updateUserSingleHopOnly = createAction<{
  userSingleHopOnly: boolean
}>('user/updateUserSingleHopOnly')
export const updateUserSlippageTolerance = createAction<{
  userSlippageTolerance: number | 'auto'
}>('user/updateUserSlippageTolerance')
export const updateUserSlippageToleranceCrosschain = createAction<{ 
  userSlippageToleranceCrosschain: number 
}>('user/updateUserSlippageToleranceCrosschain')
export const updateUserDeadline = createAction<{ userDeadline: number }>('user/updateUserDeadline')
export const addSerializedToken = createAction<{
  serializedToken: SerializedToken
}>('user/addSerializedToken')
export const removeSerializedToken = createAction<{
  chainId: number
  address: string
}>('user/removeSerializedToken')
export const addSerializedPair = createAction<{
  serializedPair: SerializedPair
}>('user/addSerializedPair')
export const removeSerializedPair = createAction<{ serializedPair: SerializedPair }>('user/removeSerializedPair')
export const toggleURLWarning = createAction<void>('app/toggleURLWarning')
export const toggleTokenInfo = createAction<void>('user/toggleTokenInfo')
export const toggleLiveChart = createAction<{ chainId: number }>('user/toggleLiveChart')
export const toggleTopTrendingTokens = createAction<void>('user/toggleTopTrendingTokens')
export const toggleProLiveChart = createAction<void>('user/toggleProLiveChart')
export const pinSlippageControl = createAction<boolean>('user/pinSlippageControl')

export const updateUserUseOpenMev = createAction<{
  userUseOpenMev: boolean
}>('user/updateUserUseOpenMev')

export const setCrossChainSetting = createAction<CrossChainSetting>('user/setCrossChainSetting')