import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MineModalView } from 'features/mines/enum'
import { AppState } from 'state'

export interface MinesState {
  view?: MineModalView
  open: boolean
}

const initialState: MinesState = {
  view: undefined,
  open: false,
}

export const minesSlice = createSlice({
  name: 'mines',
  initialState,
  reducers: {
    setMineModalView: (state, action: PayloadAction<MineModalView | undefined>) => {
      state.view = action.payload
    },
    setMinesModalOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload
    },
    setMinesModalState: (state, action: PayloadAction<{ view: MineModalView; open: boolean }>) => {
      state.view = action.payload.view
      state.open = action.payload.open
    },
  },
})

export const { setMineModalView, setMinesModalOpen, setMinesModalState } = minesSlice.actions

type selectMines = (state: AppState) => MinesState
export const selectMines: selectMines = (state: AppState) => state.mines
export default minesSlice.reducer
