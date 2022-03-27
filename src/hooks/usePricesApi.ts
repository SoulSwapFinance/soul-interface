import { useMemo } from "react"
import { useFantomPrice, useSeancePrice, useSoulPrice } from "./getPrices"

export function usePricesApi() {
    const ftmPrice = useFantomPrice()
    const soulPrice = useSoulPrice()
    const seancePrice = useSeancePrice()
    const usdcPrice = 1

    return useMemo(() => {
      return {
        ftm: Number(ftmPrice),
        soul: Number(soulPrice),
        seance: Number(seancePrice),
        usdc: 1,
      }
    }, [ftmPrice, soulPrice, seancePrice, usdcPrice]);
  }