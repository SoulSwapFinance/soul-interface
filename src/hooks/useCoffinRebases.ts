import { Currency, JSBI, Rebase } from 'sdk'
import { useMemo } from 'react'

import { useSingleContractMultipleData } from '../state/multicall/hooks'
import { useCoffinBoxContract } from './useContract'

type UseCoffinRebases = (tokens: (Currency | undefined)[]) => {
  rebases: Record<string, Rebase | undefined>
  loading: boolean
}

const useCoffinRebases: UseCoffinRebases = (tokens) => {
  const addresses = useMemo(() => tokens.map((token) => [token?.wrapped.address]), [tokens])
  const coffinboxContract = useCoffinBoxContract()
  const results = useSingleContractMultipleData(coffinboxContract, 'totals', addresses)
  const loading: boolean = useMemo(() => results.some((callState) => callState.loading), [results])

  return useMemo(
    () => ({
      rebases: tokens.reduce<Record<string, Rebase | undefined>>((previousValue, currentValue, index) => {
        const el = results[index]
        if (currentValue) {
          if (el?.result) {
            previousValue[currentValue.wrapped.address] = {
              base: JSBI.BigInt(el.result.base.toString()),
              elastic: JSBI.BigInt(el.result.elastic.toString()),
            }
          } else {
            previousValue[currentValue.wrapped.address] = undefined
          }
        }
        return previousValue
      }, {}),
      loading,
    }),
    [loading, results, tokens]
  )
}

export const useCoffinRebase = (token: Currency | undefined) => {
  const tokens = useMemo(() => [token], [token])
  const { rebases, loading } = useCoffinRebases(tokens)

  return useMemo(() => {
    if (token && !loading) {
      return { rebase: rebases[token?.wrapped.address], loading }
    }

    return { rebase: undefined, loading }
  }, [loading, rebases, token])
}

export default useCoffinRebases