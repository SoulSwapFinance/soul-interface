import { ChainId } from 'sdk'
import { createSlice } from '@reduxjs/toolkit'

interface Dex {
  name: string
  logoURL: string
  id: string
}

export interface CustomizeDexeState {
  excludeDexes: Partial<Record<ChainId, string[]>>
  allDexes: Partial<Record<ChainId, Dex[]>>
}

const slice = createSlice({
  name: 'customizeDexeState',
  initialState: { excludeDexes: {}, allDexes: {} } as CustomizeDexeState,
  reducers: {
    updateAllDexes(state, { payload: { chainId, dexes } }: { payload: { chainId: ChainId; dexes: Dex[] } }) {
      if (!state.allDexes) state.allDexes = {}
      state.allDexes[chainId ?? ChainId.FANTOM] = dexes
    },
    updateExcludeDex(state, { payload: { chainId, dexes } }: { payload: { chainId: ChainId; dexes: string[] } }) {
      if (!state.excludeDexes) state.excludeDexes = {}
      state.excludeDexes[chainId ?? ChainId.FANTOM] = dexes
    },
  },
})

export const { updateAllDexes, updateExcludeDex } = slice.actions

export default slice.reducer