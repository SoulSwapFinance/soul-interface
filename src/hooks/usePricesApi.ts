import { useMemo } from "react"
import { useFantomPrice, useSoulPrice } from "./getPrices"

export function usePricesApi() {
    const ftmPrice = useFantomPrice()
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