import { usePriceOracle } from "hooks"
import { useMemo } from "react"
import { NEVER_RELOAD, useSingleCallResult } from "state/multicall/hooks"
// import { Contract } from '@ethersproject/contracts'
// import { useActiveWeb3React } from "services/web3"
// import { Currency } from "sdk"

export function useOraclePrice(oracleAddress: string) {
    const oracleContract = usePriceOracle(oracleAddress)
    const rawPrice = useSingleCallResult(
        oracleContract,
        'latestAnswer'
    ).result

    const price =  Number(rawPrice) / 1e8
  
    return useMemo(() => {
      if (!price) return null
      try {
        return price
      } catch (error) {
        return null
      }
    }, [price])
}