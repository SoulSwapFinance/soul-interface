
import { createContext, FC, useContext, useMemo } from 'react'
import LendingMediumRiskLendingPair from 'features/lending/LendingMediumRiskLendingPair'

interface LendingMarketContext {
  market: LendingMediumRiskLendingPair
}

const Context = createContext<LendingMarketContext | undefined>(undefined)
export const LendingMarketProvider: FC<LendingMarketContext> = ({ market }) => { // children
  return <Context.Provider value={useMemo(() => ({ market }), [market])}>
    {/* {children} */}
    </Context.Provider>
}

export const useLendingMarket = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Lending Market Context')
  }

  return context
}