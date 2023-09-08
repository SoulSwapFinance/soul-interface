import { useMemo } from "react"
import { useTokenPrice, useSoulPrice } from "./getPrices"
import { ChainId, WNATIVE_ADDRESS } from "sdk"
import { useActiveWeb3React } from "services/web3"

export function usePricesApi() {
  const { chainId } = useActiveWeb3React()
    const ftmPrice = useTokenPrice(WNATIVE_ADDRESS[chainId ?? ChainId.FANTOM])
    const soulPrice = useSoulPrice()
    const usdcPrice = 1

    return useMemo(() => {
      return {
        ftm: Number(ftmPrice),
        soul: Number(soulPrice),
        usdc: 1,
      }
    }, [ftmPrice, soulPrice, usdcPrice]);
  }