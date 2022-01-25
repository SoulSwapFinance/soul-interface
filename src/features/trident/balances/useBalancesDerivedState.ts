import { Currency } from 'sdk'
import { selectBalancesCurrency } from 'features/trident/balances/balancesSlice'
import { useCurrency } from 'hooks/Tokens'
import { useSelector } from 'react-redux'

type UseBalancesSelectedCurrency = () => Currency | undefined
export const useBalancesSelectedCurrency: UseBalancesSelectedCurrency = () => {
  const currency = useSelector(selectBalancesCurrency)
  return useCurrency(currency) ?? undefined
}