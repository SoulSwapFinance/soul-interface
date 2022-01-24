import { usePriceHelperContract } from "hooks"
import { useMemo } from "react"
import { useSingleCallResult } from "state/multicall/hooks"

export function usePrice(tokenAddress: String | undefined | null) {
    const priceHelperContract = usePriceHelperContract()
    const rawPrice = useSingleCallResult(
        priceHelperContract,
        'currentTokenUsdcPrice',
        [tokenAddress.toString()]
    ).result

    const price =  Number(rawPrice) / 1E18
  
    return useMemo(() => {
      if (!price) return null
      try {
        return price
      } catch (error) {
        return null
      }
    }, [price])
  }