import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { GELATO_PERSISTED_KEYS } from 'soulswap-limit-orders-react'

import reducer from './reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists', 
...GELATO_PERSISTED_KEYS]

const persistConfig = {
  key: 'root',
  whitelist: PERSISTED_KEYS,
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      immutableCheck: true,
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV === 'development',
})

export const persistor = persistStore(store)

export type AppState = ReturnType<typeof persistedReducer>
export type AppDispatch = typeof store.dispatch

export default store