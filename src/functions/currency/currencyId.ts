import { Currency } from 'sdk'
import { useActiveWeb3React } from 'services/web3'

export function currencyId(currency: Currency): string {
  // const { chainId } = useActiveWeb3React()

  if (currency?.isNative) return 'FTM'
  if (currency?.isToken) return currency.address

  throw new Error('invalid currency')
}