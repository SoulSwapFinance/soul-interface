import { createAction } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'

export type PopupContent =
  | {
      txn: {
        hash: string
        success: boolean
        summary?: string
      }
    }
  | {
      listUpdate: {
        listUrl: string
        oldList: TokenList
        newList: TokenList
        auto: boolean
      }
    }

export enum ApplicationModal {
  WALLET,
  MOBILE_TOKEN_INFO,
  SETTINGS,
  TRANSACTION_SETTINGS,
  CROSSCHAIN,
  SELF_CLAIM,
  ADDRESS_CLAIM,
  CLAIM_POPUP,
  MENU,
  MINES,
  SEANCE,
  BONDS,
  DELEGATE,
  VOTE,
  LANGUAGE,
  CHAIN,
  NETWORK,
  YIELD_DETAILS,
  SOUL_STATS,
  LUXOR_STATS,
  CALCULATOR,
  STAKE,
  LUXOR_BONDS,
  WRAP,
  SOR
}

export const updateBlockNumber = createAction<{
  chainId: number
  blockNumber: number
}>('application/updateBlockNumber')
export const updateBlockTimestamp = createAction<{
  chainId: number
  blockTimestamp: number
}>('application/updateBlockTimestamp')
export const updateChainId = createAction<{ chainId: number }>('application/updateChainId')
export const setChainConnectivityWarning = createAction<{ chainConnectivityWarning: boolean }>(
  'application/setChainConnectivityWarning'
)
export const setImplements3085 = createAction<{ implements3085: boolean }>('application/setImplements3085')
export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
export const addPopup = createAction<{
  key?: string
  removeAfterMs?: number | null
  content: PopupContent
}>('application/addPopup')
export const removePopup = createAction<{ key: string }>('application/removePopup')
export const setUnderworldApprovalPending = createAction<string>('application/setUnderworldApprovalPending')
