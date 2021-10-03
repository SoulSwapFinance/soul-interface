import React from 'react'
import { usePricesApi } from '../features/summoner/hooks'

export const PriceContext = React.createContext({
  seance: 0,
  soul: 0,
  usdc: 0,
})

export function PriceProvider({ children }) {
  const priceData = usePricesApi()
  return <PriceContext.Provider value={priceData}>{children}</PriceContext.Provider>
}

export default PriceProvider
