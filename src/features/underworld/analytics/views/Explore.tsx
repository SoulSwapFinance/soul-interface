import React, { useEffect, useState } from "react"
import { useQuery } from "@apollo/client"
import { BigNumber } from "ethers"
import type { NextPage } from "next"
import Head from "next/head"
import { toast } from "react-toastify"
import { useAppContext } from "contexts/AppContext"
import { getUnderworldPairsQuery } from "services/graph/queries/explore"
import { UnderworldPairsByToken } from "features/underworld/analytics/types/UnderworldPair"
import BaseLayout from "features/underworld/analytics/layout/BaseLayout"
import Hero from "features/underworld/analytics/components/Hero"
import Market from "../components/Market"
import Total from "../components/Total"

const Home: NextPage = () => {
  const {
    loading: loadingToken,
    error,
    data: dataUnderworldPairs,
  } = useQuery(getUnderworldPairsQuery)
  const [calculating, setCalculating] = useState(true)
  const [totalAsset, setTotalAsset] = useState(BigInt(0))
  const [totalBorrow, setTotalBorrow] = useState(BigInt(0))
  const [top3MarketsBySupply, setTop3MarketsBySupply] = useState<
    UnderworldPairsByToken[]
  >([])
  const [top3MarketsByAsset, setTop3MarketsByAsset] = useState<
    UnderworldPairsByToken[]
  >([])
  const [top3MarketsByBorrow, setTop3MarketsByBorrow] = useState<
    UnderworldPairsByToken[]
  >([])

  const [pricesMap, setPricesMap] = useState<{ [key: string]: BigInt }>({})
  const [underworldPairsByTokens, setUnderworldPairsByTokens] = useState<
    UnderworldPairsByToken[]
  >([])
  const { coinGeckoService, calculateService } = useAppContext()
  const loading = loadingToken || calculating

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  useEffect(() => {
    if (dataUnderworldPairs) {
      if (dataUnderworldPairs.underworldPairs) {
        setDataUnderworldPairs()
      }
    }
  }, [dataUnderworldPairs])

  const setDataUnderworldPairs = async () => {
    const { underworldPairs } = dataUnderworldPairs
    const symbols = calculateService.extractUnderworldPairAssetSymbols(underworldPairs)
    const pricesMap = await coinGeckoService.getPrices(symbols)
    setPricesMap(pricesMap)

    const { underworldPairsByTokens, totalAsset, totalBorrow } =
      calculateService.calculateUnderworldPairPricesGroupByAsset(
        underworldPairs,
        pricesMap
      )
    setCalculating(false)
    underworldPairsByTokens.sort((a, b) =>
      BigNumber.from(a.totalAsset)
        .add(BigNumber.from(a.totalBorrow))
        .gte(BigNumber.from(b.totalAsset).add(BigNumber.from(b.totalBorrow)))
        ? -1
        : 1
    )

    const underworldPairsByTokensSortedByAsset = [...underworldPairsByTokens].sort(
      (a, b) => (a.totalAsset > b.totalAsset ? -1 : 1)
    )

    const underworldPairsByTokensSortedByBorrow = [...underworldPairsByTokens].sort(
      (a, b) => (a.totalBorrow > b.totalBorrow ? -1 : 1)
    )

    setTop3MarketsBySupply(
      underworldPairsByTokens.slice(
        0,
        underworldPairsByTokens.length < 3 ? underworldPairsByTokens.length : 3
      )
    )
    setTop3MarketsByAsset(
      underworldPairsByTokensSortedByAsset.slice(
        0,
        underworldPairsByTokensSortedByAsset.length < 3
          ? underworldPairsByTokensSortedByAsset.length
          : 3
      )
    )
    setTop3MarketsByBorrow(
      underworldPairsByTokensSortedByBorrow.slice(
        0,
        underworldPairsByTokensSortedByBorrow.length < 3
          ? underworldPairsByTokensSortedByBorrow.length
          : 3
      )
    )

    setUnderworldPairsByTokens(underworldPairsByTokens)
    setTotalAsset(totalAsset.toBigInt())
    setTotalBorrow(totalBorrow.toBigInt())
  }

  return (
    <>
      <Head>
        <title>Underworld Market - Explore</title>
      </Head>
      <BaseLayout>
        <Hero />
        <Total
          loading={loading}
          supply={{
            amount: totalAsset + totalBorrow,
            volumeIn24H: BigInt(0),
            totalUsers: BigInt(0),
            topMarkets: top3MarketsBySupply,
          }}
          asset={{
            amount: totalAsset,
            volumeIn24H: BigInt(0),
            totalUsers: BigInt(0),
            topMarkets: top3MarketsByAsset,
          }}
          borrow={{
            amount: totalBorrow,
            volumeIn24H: BigInt(0),
            totalUsers: BigInt(0),
            topMarkets: top3MarketsByBorrow,
          }}
        />
        <Market data={underworldPairsByTokens} loading={loading} />
      </BaseLayout>
    </>
  )
}

export default Home