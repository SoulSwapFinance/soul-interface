import { AddressZero } from '@ethersproject/constants'
import { Type as Currency } from 'soulswap-currency'
import { JSBI } from 'soulswap-math'
import { useMemo } from 'react'
import { useContractReads } from 'wagmi'
import { UseContractReadsConfig } from 'wagmi/dist/declarations/src/hooks/contracts/useContractReads'

import { getCoffinBoxContractConfig } from './useCoffinBoxContract'

type UseCoffinBoxTotals = (
  chainId: number | undefined,
  currencies: (Currency | undefined)[],
  // @ts-ignore
  config?: Omit<UseContractReadsConfig, 'contracts'>
) => Record<string, { base: JSBI; elastic: JSBI }> | undefined

export const useCoffinBoxTotals: UseCoffinBoxTotals = (chainId, currencies, config) => {
  const addresses = useMemo(
    () =>
      currencies
        .filter((currency): currency is Currency => Boolean(currency && currency.wrapped))
        .map((token) => token.wrapped.address),
    [currencies]
  )
  const contracts = useMemo(
    () =>
      addresses.map((address) => ({
        chainId,
        ...getCoffinBoxContractConfig(chainId),
        functionName: 'totals',
        args: [address],
      })),
    [addresses, chainId]
  )

  const { data: totals } = useContractReads({
    contracts,
    watch: !(typeof config?.enabled !== undefined && !config?.enabled),
    keepPreviousData: true,
    enabled: Boolean(getCoffinBoxContractConfig(chainId).addressOrName !== AddressZero),
  })

  return useMemo(() => {
    return totals?.reduce<Record<string, { base: JSBI; elastic: JSBI }>>((previousValue, currentValue, i) => {
      if (!currentValue) return previousValue
      const { base, elastic } = currentValue
      const rebase = { base: JSBI.BigInt(base), elastic: JSBI.BigInt(elastic) }
      previousValue[addresses[i]] = rebase
      return previousValue
    }, {})
  }, [totals, addresses])
}

export const useCoffinBoxTotal = (
  chainId: number | undefined,
  currency: Currency | undefined,
  // @ts-ignore
  config?: Omit<UseContractReadsConfig, 'contracts'>
): { base: JSBI; elastic: JSBI } | undefined => {
  const totals = useCoffinBoxTotals(
    chainId,
    useMemo(() => [currency], [currency]),
    config
  )
  return useMemo(() => {
    if (!totals || !currency) {
      return undefined
    }
    return totals[currency.wrapped.address]
  }, [currency, totals])
}
