import { createSlice, nanoid } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'
import { DEFAULT_TXN_DISMISS_MS } from 'constants/index'
import { ChainId } from 'sdk'
import { KyberSwapConfigResponse } from 'services/kyberswap/ksSetting'

export type PopupContent =
  | {
      txn: {
        hash: string
        success?: boolean
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
  SWAP_APPROVAL,
  WALLET,
  SETTINGS,
  SELF_CLAIM,
  ADDRESS_CLAIM,
  CROSSCHAIN,
  CLAIM_POPUP,
  MENU,
  DELEGATE,
  VOTE,
  SOUL_STATS,
  LANGUAGE,
  NETWORK,
}

type PopupList = Array<{
  key: string
  show: boolean
  content: PopupContent
  removeAfterMs: number | null
}>

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number }
  readonly blockTimestamp: { readonly [chainId: number]: number }
  readonly chainConnectivityWarning: boolean
  readonly chainId: number | null
  readonly implements3085: boolean
  readonly popupList: PopupList
  readonly openModal: ApplicationModal | null
  readonly underworldApprovalPending: string
  readonly config: {
    [chainId in ChainId]?: KyberSwapConfigResponse
  }
}

const initialState: ApplicationState = {
  blockNumber: {},
  blockTimestamp: {},
  chainConnectivityWarning: false,
  chainId: null,
  implements3085: false,
  popupList: [],
  openModal: null,
  underworldApprovalPending: '',
  config: {},
}

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    updateChainId(state, action) {
      const { chainId } = action.payload
      state.chainId = chainId
    },
    updateBlockTimestamp(state, action) {
      const { chainId, blockTimestamp } = action.payload
      if (typeof state.blockTimestamp[chainId ?? ChainId.FANTOM] !== 'number') {
        state.blockTimestamp[chainId ?? ChainId.FANTOM] = blockTimestamp
      } else {
        state.blockTimestamp[chainId ?? ChainId.FANTOM] = Math.max(blockTimestamp, state.blockTimestamp[chainId ?? ChainId.FANTOM])
      }
    },
    updateBlockNumber(state, action) {
      const { chainId, blockNumber } = action.payload
      if (typeof state.blockNumber[chainId ?? ChainId.FANTOM] !== 'number') {
        state.blockNumber[chainId ?? ChainId.FANTOM] = blockNumber
      } else {
        state.blockNumber[chainId ?? ChainId.FANTOM] = Math.max(blockNumber, state.blockNumber[chainId ?? ChainId.FANTOM])
      }
    },
    setChainConnectivityWarning(state, action) {
      const { implements3085 } = action.payload
      state.implements3085 = implements3085
    },
    setImplements3085(state, action) {
      const { chainConnectivityWarning } = action.payload
      state.chainConnectivityWarning = chainConnectivityWarning
    },
    setOpenModal(state, action) {
      state.openModal = action.payload
    },
    addPopup(state, { payload: { content, key, removeAfterMs = DEFAULT_TXN_DISMISS_MS } }) {
      state.popupList = (key ? state.popupList.filter((popup) => popup.key !== key) : state.popupList).concat([
        {
          key: key || nanoid(),
          show: true,
          content,
          removeAfterMs,
        },
      ])
    },
    removePopup(state, { payload: { key } }) {
      state.popupList.forEach((p) => {
        if (p.key === key) {
          p.show = false
        }
      })
    },
    setUnderworldApprovalPending(state, action) {
      state.underworldApprovalPending = action.payload
    },
  },
})

export const { updateChainId, setOpenModal, addPopup, removePopup, setUnderworldApprovalPending } = applicationSlice.actions
export default applicationSlice.reducer