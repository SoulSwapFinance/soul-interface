import { Currency, CurrencyAmount, Token } from 'sdk'
import { useCoffinBalancesV2 } from 'state/coffinbox/hooks'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { useMemo } from 'react'

export const useCoffinOrWalletBalances = (
  account: string | undefined,
  currencies: (Currency | Token | undefined)[],
  fromWallet?: (boolean | undefined)[]
) => {
  const tokenAddresses = useMemo(
    () => (currencies.every((el) => el) ? currencies.map((el: Currency) => el.wrapped.address) : undefined),
    [currencies]
  )

  const balance = useCurrencyBalances(account, currencies)
  const { data: coffinBalance } = useCoffinBalancesV2(tokenAddresses)

  return useMemo(() => {
    if (!currencies.every((el) => !!el) || !coffinBalance) {
      return []
    }

    return currencies.map((cur, index) => {
      if (!cur) {
        return undefined
      }

      let element: CurrencyAmount<Currency> | undefined
      const tokenBalanceFromWallet = fromWallet?.[index]
      if (tokenBalanceFromWallet === false) {
        element = coffinBalance.find((el) => el?.currency.wrapped.address === cur.wrapped.address)
      } else {
        element = balance.find((el) => el?.currency.wrapped.address === cur.wrapped.address)
      }

      if (!element) {
        element = CurrencyAmount.fromRawAmount(cur.wrapped, '0')
      }

      return element
    }, [])
  }, [currencies, coffinBalance, fromWallet, balance])
}

export const useCoffinOrWalletBalance = (account?: string, currency?: Currency, fromWallet?: boolean) => {
  const currencies = useMemo(() => [currency], [currency])
  const flags = useMemo(() => [fromWallet], [fromWallet])
  const balances = useCoffinOrWalletBalances(account, currencies, flags)
  return useMemo(() => (balances ? balances[0] : undefined), [balances])
}