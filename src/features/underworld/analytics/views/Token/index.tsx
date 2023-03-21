import { useQuery } from "@apollo/client"
import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useAppContext } from "contexts/AppContext"
import { getUnderworldPairsDayDataQuery, getTokensQuery } from "services/graph/queries/token"
import { UnderworldPair } from "features/underworld/analytics/types/UnderworldPair"
import {
  UnderworldPairDayData,
  UnderworldPairDayDataMap,
  UnderworldPairDayDataMapsCollateral,
} from "features/underworld/analytics/types/UnderworldPairDayData"
import { Token as Asset } from "features/underworld/analytics/types/Token"
import BaseLayout from "features/underworld/analytics/layout/BaseLayout"
import Hero from "features/underworld/analytics/views/Token/Hero"
import Market from "features/underworld/analytics/views/Token/Market"

const Token: NextPage = () => {
  const [token, setToken] = useState<Asset | undefined>()
  const [totalAsset, setTotalAsset] = useState<BigInt>(BigInt(0))
  const [totalBorrow, setTotalBorrow] = useState<BigInt>(BigInt(0))

  const [underworldPairs, setUnderworldPairs] = useState<UnderworldPair[]>([])
  const [underworldPairDayDataMaps, setUnderworldPairDayDataMaps] = useState<
    UnderworldPairDayDataMap[]
  >([])

  const [underworldPairDayDataMapsCollaterals, setUnderworldPairDayDataMapsCollaterals] =
    useState<UnderworldPairDayDataMapsCollateral[]>([])
  const [pricesMap, setPricesMap] = useState<{ [key: string]: BigInt }>({})
  const { calculateService, coinGeckoService } = useAppContext()

  const router = useRouter()
  const { id } = router.query
  const {
    loading: loadingDataToken,
    error,
    data: dataToken,
  } = useQuery(getTokensQuery, { variables: { id }, skip: !id })

  const pairIds = underworldPairs.map((underworldPair) => underworldPair.id)

  const { loading: loadingUnderworldPairDayData, data: dataUnderworldPairDayData } =
    useQuery(getUnderworldPairsDayDataQuery, {
      variables: { pairIds },
      skip: pairIds.length === 0,
    })

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  useEffect(() => {
    if (dataToken) {
      setTokenData()
    }
  }, [dataToken])

  useEffect(() => {
    const pricesMapKeys = Object.keys(pricesMap)
    if (
      pricesMapKeys.length > 0 &&
      dataUnderworldPairDayData &&
      dataUnderworldPairDayData.underworldPairDayDatas.length > 0
    ) {
      const underworldPairDayDataMapsCollaterals =
        calculateService.calculateUnderworldPairDayDataPricesByCollateral(
          dataUnderworldPairDayData.underworldPairDayDatas,
          pricesMap
        )

      const { underworldPairsMaps } =
        calculateService.calculateUnderworldPairDayDataPrices(
          dataUnderworldPairDayData.underworldPairDayDatas,
          pricesMap
        )
      setUnderworldPairDayDataMapsCollaterals(underworldPairDayDataMapsCollaterals)
      setUnderworldPairDayDataMaps(underworldPairsMaps)
    }
  }, [pricesMap, dataUnderworldPairDayData])

  const setTokenData = async () => {
    const { tokens, underworldPairs }: { tokens: Asset[], underworldPairs: UnderworldPair[] } =
      dataToken
    const symbols = calculateService.extractUnderworldPairAssetSymbols(underworldPairs)
    const pricesMap = await coinGeckoService.getPrices(symbols)
    setPricesMap(pricesMap)

    const { tokens: newTokens } = calculateService.calculateTokenPrices(
      tokens,
      pricesMap
    )

    const token = newTokens[0]
    setToken(token)

    const {
      underworldPairs: newUnderworldPairs,
      totalAsset,
      totalBorrow,
    } = calculateService.calculateUnderworldPairPrices(underworldPairs, pricesMap)

    setTotalAsset(totalAsset.toBigInt())
    setTotalBorrow(totalBorrow.toBigInt())
    setUnderworldPairs(newUnderworldPairs)
  }

  return (
    <>
      <Head>
        <title>
          {token ? `Underworld Market - ${token?.symbol}` : "Underworld Market"}
        </title>
      </Head>
      <BaseLayout>
        <Hero data={token} />
        <Market 
          token={token}
          totalAsset={totalAsset}
          totalBorrow={totalBorrow}
          underworldPairs={underworldPairs}
          underworldPairDayDataMaps={underworldPairDayDataMaps}
          underworldPairDayDataMapsCollaterals={underworldPairDayDataMapsCollaterals}
        />
      </BaseLayout>
    </>
  )
}

export default Token