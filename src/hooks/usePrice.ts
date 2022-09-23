import { usePriceHelperContract } from "hooks"
import { useMemo } from "react"
import { NEVER_RELOAD, useSingleCallResult } from "state/multicall/hooks"
import { Contract } from '@ethersproject/contracts'

export function usePrice(tokenAddress: string | undefined | null) {
    const priceHelperContract = usePriceHelperContract()
    const rawPrice = useSingleCallResult(
        priceHelperContract,
        'currentTokenUsdcPrice',
        [tokenAddress]
    ).result

    const price =  Number(rawPrice) / 1e18
  
    return useMemo(() => {
      if (!price) return null
      try {
        return price
      } catch (error) {
        return null
      }
    }, [price])
  }


  export function usePairPrice(pairContract?: Contract | null, pairDecimals?: number | null, invert: boolean = false) {
  
    const result = useSingleCallResult(pairContract ? pairContract : null, 'getReserves', undefined, NEVER_RELOAD)?.result
  
    const _reserve1 = invert ? result?.['reserve0'] : result?.['reserve1']
    const _reserve0 = invert ? result?.['reserve1'] : result?.['reserve0']
  
    const price = _reserve1 ? (Number(_reserve1) / Number(_reserve0)) * (pairDecimals ? 10 ** pairDecimals : 1) : 0
  
    return price
  }