import { useMemo } from 'react'
import { Currency } from 'sdk'
import { getCurrencyCombinations } from 'utils/swap/getCurrencyCombinations'

export function useCurrencyCombinations(chainId: number, currencyA?: Currency, currencyB?: Currency): [Currency, Currency][] {
  return useMemo(
    () => (chainId && currencyA && currencyB ? getCurrencyCombinations(chainId, currencyA, currencyB) : []),
    [chainId, currencyA, currencyB]
  )
}
