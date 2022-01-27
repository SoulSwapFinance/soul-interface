import { usePriceHelperContract } from "hooks"
import { formatCurrency } from "modals/TokensStatsModal"
import { useMemo } from "react"
import { useSingleCallResult } from "state/multicall/hooks"

export function usePricesApi() {
    // const ftmPrice = useFantomPrice()
    // const soulPrice = useSoulPrice()
    // const seancePrice = useSeancePrice()
  
    const priceHelperContract = usePriceHelperContract()
  
    // SOUL PRICE
    const rawSoulPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'])?.result
    // console.log(Number(rawSoulPrice))
    const soulPrice = formatCurrency(Number(rawSoulPrice) / 1E18, 3)
    // console.log(soulPrice)
  
    // FTM PRICE
    const rawFtmPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'])?.result
    // console.log(Number(rawFtmPrice))
    const ftmPrice = formatCurrency(Number(rawFtmPrice) / 1E18, 2)
    // console.log(ftmPrice)
    
    // SEANCE PRICE
    const rawSeancePrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x124B06C5ce47De7A6e9EFDA71a946717130079E6'])?.result
    // console.log(Number(rawSeancePrice))
    const seancePrice = formatCurrency(Number(rawSeancePrice) / 1E18, 3)
    // console.log(seancePrice)
  
    return useMemo(() => {
      return {
        ftm: Number(rawFtmPrice) / 1E18,
        soul: Number(rawSoulPrice) / 1E18,
        seance: Number(rawSeancePrice) / 1E18,
        usdc: 1,
      }
    }, [ftmPrice, soulPrice, seancePrice])
  }