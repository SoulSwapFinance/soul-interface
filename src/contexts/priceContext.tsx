import React from 'react'
import { usePricesApi } from 'hooks/usePricesApi'


export const PriceContext = React.createContext({
  ftm: 0,
  soul: 0,
  seance: 0,
})

export function PriceProvider({ children }) {
  const priceData = usePricesApi()
  return <PriceContext.Provider value={priceData}>{children}</PriceContext.Provider>
}

export default PriceProvider