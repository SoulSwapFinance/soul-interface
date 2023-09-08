import { ChainId, Currency, NATIVE } from 'sdk'
import { selectBalancesCurrency } from 'features/portfolio/portfolioSlice'
import { useCurrency } from 'hooks/Tokens'
import { useSelector } from 'react-redux'
import { useActiveWeb3React } from 'services/web3'

type UseBalancesSelectedCurrency = () => Currency
export const useBalancesSelectedCurrency: UseBalancesSelectedCurrency = () => {
  const currency = useSelector(selectBalancesCurrency)
  const { chainId } = useActiveWeb3React()
 
  return currency.isToken ? useCurrency(currency.wrapped.address) : NATIVE[chainId ?? ChainId.FANTOM]

 }
