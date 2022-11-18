
import { createContext, FC, useContext, useMemo } from 'react'
import LendingMediumRiskLendingPair from 'features/lending/LendingMediumRiskLendingPair'

interface MarketContext {
  market: LendingMediumRiskLendingPair
}

const Context = createContext<MarketContext | undefined>(undefined)
// @ts-ignore
export const MarketProvider: FC<MarketContext> = ({ market, children }) => { // 
  return <Context.Provider value={useMemo(() => ({ market }), [market])}>
    {children}
    </Context.Provider>
}

export const useMarket = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Lending Market Context')
  }

  return context
}