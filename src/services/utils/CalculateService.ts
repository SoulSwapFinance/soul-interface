import { BigNumber } from "ethers"
import moment from "moment"
import { UnderworldPair, UnderworldPairsByToken } from "features/underworld/analytics/types/UnderworldPair"
import {
  UnderworldPairDayData,
  UnderworldPairDayDataMap,
  UnderworldPairDayDataMapsCollateral,
} from "features/underworld/analytics/types/UnderworldPairDayData"
import { Token } from "features/underworld/analytics/types/Token"

class CalculateService {
  protected static instance: CalculateService
  constructor() {}

  protected extractUnderworldPairTokenSymbols(
    underworldPairs: UnderworldPair[],
    tokenField: "asset" | "collateral" = "asset"
  ) {
    const symbols = [] as string[]

    underworldPairs.forEach((underworldPair) => {
      const symbol = underworldPair[tokenField]?.symbol || ""

      const index = symbols.indexOf(symbol)
      if (index === -1) {
        symbols.push(symbol)
      }
    })
    return symbols
  }

  extractUnderworldPairSymbols(underworldPairs: UnderworldPair[]) {
    const symbols = [] as string[]

    underworldPairs.forEach((underworldPair) => {
      const symbolAsset = underworldPair.asset?.symbol || ""
      const symbolCollateral = underworldPair.collateral?.symbol || ""

      const indexAsset = symbols.indexOf(symbolAsset)
      if (indexAsset === -1) {
        symbols.push(symbolAsset)
      }

      const indexCollateral = symbols.indexOf(symbolCollateral)
      if (indexCollateral === -1) {
        symbols.push(symbolCollateral)
      }
    })
    return symbols
  }

  extractUnderworldPairCollateralSymbols(underworldPairs: UnderworldPair[]) {
    return this.extractUnderworldPairTokenSymbols(underworldPairs, "collateral")
  }

  extractUnderworldPairAssetSymbols(underworldPairs: UnderworldPair[]) {
    return this.extractUnderworldPairTokenSymbols(underworldPairs, "asset")
  }

  extractTokenSymbols(tokens: Token[]) {
    const symbols = [] as string[]

    tokens.forEach((token) => {
      const symbol = token.symbol || ""
      const index = symbols.indexOf(symbol)
      if (index === -1) {
        symbols.push(symbol)
      }
    })
    return symbols
  }

  calculateUnderworldPairPrices(
    underworldPairs: UnderworldPair[],
    pricesMap: { [key: string]: BigInt }
  ) {
    let sumTotalAsset = BigNumber.from("0"),
      sumTotalBorrow = BigNumber.from("0")

    const newUnderworldPairs = underworldPairs.map((underworldPair) => {
      let totalAsset = BigNumber.from("0"),
        totalBorrow = BigNumber.from("0")

      if (underworldPair.asset) {
        totalAsset = BigNumber.from(pricesMap[underworldPair.asset.symbol])
          .mul(BigNumber.from(underworldPair.totalAssetElastic))
          .div(BigNumber.from("10").pow(Number(underworldPair.asset.decimals) + 6))
        totalBorrow = BigNumber.from(pricesMap[underworldPair.asset.symbol])
          .mul(BigNumber.from(underworldPair.totalBorrowElastic))
          .div(BigNumber.from("10").pow(Number(underworldPair.asset.decimals) + 6))
      }
      sumTotalAsset = sumTotalAsset.add(totalAsset)
      sumTotalBorrow = sumTotalBorrow.add(totalBorrow)
      const newUnderworldPair = {
        ...underworldPair,
        totalAsset: totalAsset.toBigInt(),
        totalBorrow: totalBorrow.toBigInt(),
      }
      return newUnderworldPair
    })
    return {
      totalAsset: sumTotalAsset,
      totalBorrow: sumTotalBorrow,
      underworldPairs: newUnderworldPairs,
    }
  }

  calculateUnderworldPairPricesGroupByAsset(
    underworldPairs: UnderworldPair[],
    pricesMap: { [key: string]: BigInt }
  ) {
    const {
      totalAsset,
      totalBorrow,
      underworldPairs: newUnderworldPairs,
    } = this.calculateUnderworldPairPrices(underworldPairs, pricesMap)

    const underworldPairsByTokenMap: { [key: string]: UnderworldPairsByToken } = {}
    newUnderworldPairs.forEach((underworldPair) => {
      const { asset } = underworldPair
      if (asset) {
        if (underworldPairsByTokenMap[asset.id]) {
          const underworldPairsByToken = underworldPairsByTokenMap[asset.id]
          underworldPairsByToken.underworldPairs.push(underworldPair)
          underworldPairsByToken.totalAsset = BigNumber.from(
            underworldPairsByToken.totalAsset
          )
            .add(BigNumber.from(underworldPair.totalAsset))
            .toBigInt()

          underworldPairsByToken.totalBorrow = BigNumber.from(
            underworldPairsByToken.totalBorrow
          )
            .add(BigNumber.from(underworldPair.totalBorrow))
            .toBigInt()
        } else {
          underworldPairsByTokenMap[asset.id] = {
            token: asset,
            totalAsset: underworldPair.totalAsset,
            totalBorrow: underworldPair.totalBorrow,
            underworldPairs: [underworldPair],
          }
        }
      }
    })

    const underworldPairsByTokens = Object.values(underworldPairsByTokenMap)
    return {
      totalAsset,
      totalBorrow,
      underworldPairsByTokens,
    }
  }

  calculateTokenPrices(tokens: Token[], pricesMap: { [key: string]: BigInt }) {
    let sumTotalSupply = BigNumber.from("0")

    const newTokens = tokens.map((token) => {
      let totalSupply = BigNumber.from("0")
      totalSupply = BigNumber.from(pricesMap[token.symbol])
        .mul(BigNumber.from(token.totalSupplyElastic))
        .div(BigNumber.from("10").pow(Number(token.decimals) + 6))
      sumTotalSupply = sumTotalSupply.add(totalSupply)
      const newToken = {
        ...token,
        price: pricesMap[token.symbol] || 0,
        totalSupply: totalSupply.toBigInt(),
      }
      return newToken
    })
    return {
      totalSupply: sumTotalSupply,
      tokens: newTokens,
    }
  }

  calculateUnderworldPairDayDataPrices(
    underworldPairs: UnderworldPairDayData[],
    pricesMap: { [key: string]: BigInt }
  ) {
    const underworldPairsMaps: UnderworldPairDayDataMap[] = []

    let sumTotalAsset = BigNumber.from("0"),
      sumTotalBorrow = BigNumber.from("0"),
      sumAvgExchangeRate = BigNumber.from("0"),
      sumAvgUtilization = BigNumber.from("0"),
      sumAvgInterestPerSecond = BigNumber.from("0")

    const newUnderworldPairs = underworldPairs.map((underworldPair) => {
      let totalAsset = BigNumber.from("0"),
        totalBorrow = BigNumber.from("0")

      if (underworldPair.pair.asset) {
        totalAsset = BigNumber.from(pricesMap[underworldPair.pair.asset.symbol])
          .mul(BigNumber.from(underworldPair.totalAssetElastic))
          .div(
            BigNumber.from("10").pow(Number(underworldPair.pair.asset.decimals) + 6)
          )
        totalBorrow = BigNumber.from(pricesMap[underworldPair.pair.asset.symbol])
          .mul(BigNumber.from(underworldPair.totalBorrowElastic))
          .div(
            BigNumber.from("10").pow(Number(underworldPair.pair.asset.decimals) + 6)
          )
      }

      sumTotalAsset = sumTotalAsset.add(totalAsset)
      sumTotalBorrow = sumTotalBorrow.add(totalBorrow)
      sumAvgExchangeRate = sumAvgExchangeRate.add(
        BigNumber.from(underworldPair.avgExchangeRate)
      )
      sumAvgUtilization = sumAvgUtilization.add(
        BigNumber.from(underworldPair.avgUtilization)
      )
      sumAvgInterestPerSecond = sumAvgInterestPerSecond.add(
        BigNumber.from(underworldPair.avgInterestPerSecond)
      )

      const newUnderworldPair = {
        ...underworldPair,
        totalAsset: totalAsset.toBigInt(),
        totalBorrow: totalBorrow.toBigInt(),
      }

      const underworldPairDate = moment.unix(underworldPair.date).format("YYYY-MM-DD")
      const itemUnderworldPairMap = underworldPairsMaps.find(
        (underworldPairMap) => underworldPairMap.date === underworldPairDate
      )

      if (itemUnderworldPairMap) {
        itemUnderworldPairMap.totalAsset = BigNumber.from(
          itemUnderworldPairMap.totalAsset
        )
          .add(totalAsset)
          .toBigInt()
        itemUnderworldPairMap.totalBorrow = BigNumber.from(
          itemUnderworldPairMap.totalBorrow
        )
          .add(totalBorrow)
          .toBigInt()
        itemUnderworldPairMap.avgExchangeRate = BigNumber.from(
          itemUnderworldPairMap.avgExchangeRate
        )
          .add(BigNumber.from(underworldPair.avgExchangeRate))
          .toBigInt()
        itemUnderworldPairMap.avgUtilization = BigNumber.from(
          itemUnderworldPairMap.avgUtilization
        )
          .add(BigNumber.from(underworldPair.avgUtilization))
          .toBigInt()
        itemUnderworldPairMap.avgInterestPerSecond = BigNumber.from(
          itemUnderworldPairMap.avgInterestPerSecond
        )
          .add(BigNumber.from(underworldPair.avgInterestPerSecond))
          .toBigInt()
        itemUnderworldPairMap.underworldPairs.push(newUnderworldPair)
      } else {
        underworldPairsMaps.push({
          totalAsset: totalAsset.toBigInt(),
          totalBorrow: totalBorrow.toBigInt(),
          avgExchangeRate: underworldPair.avgExchangeRate || BigInt(0),
          avgUtilization: underworldPair.avgUtilization || BigInt(0),
          avgInterestPerSecond: underworldPair.avgInterestPerSecond || BigInt(0),
          date: underworldPairDate,
          underworldPairs: [newUnderworldPair],
        })
      }

      let prevUnderworldPairsMap: UnderworldPairDayDataMap = {
        underworldPairs: [],
        totalAsset: BigInt(0),
        totalBorrow: BigInt(0),
        avgExchangeRate: BigInt(0),
        avgUtilization: BigInt(0),
        avgInterestPerSecond: BigInt(0),
        date: "0000-00-00",
      }
      underworldPairsMaps.forEach((underworldPairMap) => {
        const { underworldPairs: prevUnderworldPairs } = prevUnderworldPairsMap
        const { underworldPairs } = underworldPairMap
        prevUnderworldPairs.forEach((prevUnderworldPair) => {
          const index = underworldPairs.findIndex(
            (underworldPair) => prevUnderworldPair.pair.id === underworldPair.pair.id
          )
          if (index === -1) {
            underworldPairMap.totalAsset = BigNumber.from(underworldPairMap.totalAsset)
              .add(BigNumber.from(prevUnderworldPair.totalAsset))
              .toBigInt()
            underworldPairMap.totalBorrow = BigNumber.from(underworldPairMap.totalBorrow)
              .add(BigNumber.from(prevUnderworldPair.totalBorrow))
              .toBigInt()
            underworldPairMap.avgExchangeRate = BigNumber.from(
              underworldPairMap.avgExchangeRate
            )
              .add(BigNumber.from(prevUnderworldPair.avgExchangeRate))
              .toBigInt()
            underworldPairMap.avgUtilization = BigNumber.from(
              underworldPairMap.avgUtilization
            )
              .add(BigNumber.from(prevUnderworldPair.avgUtilization))
              .toBigInt()
            underworldPairMap.avgInterestPerSecond = BigNumber.from(
              underworldPairMap.avgInterestPerSecond
            )
              .add(BigNumber.from(prevUnderworldPair.avgInterestPerSecond))
              .toBigInt()
            underworldPairs.push(prevUnderworldPair)
          }
        })

        underworldPairMap.avgExchangeRate = BigNumber.from(
          underworldPairMap.avgExchangeRate
        )
          .div(BigNumber.from(underworldPairMap.underworldPairs.length))
          .toBigInt()
        underworldPairMap.avgUtilization = BigNumber.from(
          underworldPairMap.avgUtilization
        )
          .div(BigNumber.from(underworldPairMap.underworldPairs.length))
          .toBigInt()
        underworldPairMap.avgInterestPerSecond = BigNumber.from(
          underworldPairMap.avgInterestPerSecond
        )
          .div(BigNumber.from(underworldPairMap.underworldPairs.length))
          .toBigInt()
        prevUnderworldPairsMap = underworldPairMap
      })
      underworldPairsMaps.sort((a, b) => a.date.localeCompare(b.date))
      return newUnderworldPair
    })

    return {
      totalAsset: sumTotalAsset.toBigInt(),
      totalBorrow: sumTotalBorrow.toBigInt(),
      underworldPairs: newUnderworldPairs,
      underworldPairsMaps,
    }
  }

  calculateUnderworldPairDayDataPricesMonthly(
    underworldPairs: UnderworldPairDayData[],
    pricesMap: { [key: string]: BigInt }
  ) {
    const underworldPairsMaps: UnderworldPairDayDataMap[] = []

    let sumTotalAsset = BigNumber.from("0"),
      sumTotalBorrow = BigNumber.from("0"),
      sumAvgExchangeRate = BigNumber.from("0"),
      sumAvgUtilization = BigNumber.from("0"),
      sumAvgInterestPerSecond = BigNumber.from("0")

    const newUnderworldPairs = underworldPairs.map((underworldPair) => {
      let totalAsset = BigNumber.from("0"),
        totalBorrow = BigNumber.from("0")

      if (underworldPair.pair.asset) {
        totalAsset = BigNumber.from(pricesMap[underworldPair.pair.asset.symbol])
          .mul(BigNumber.from(underworldPair.totalAssetElastic))
          .div(
            BigNumber.from("10").pow(Number(underworldPair.pair.asset.decimals) + 6)
          )
        totalBorrow = BigNumber.from(pricesMap[underworldPair.pair.asset.symbol])
          .mul(BigNumber.from(underworldPair.totalBorrowElastic))
          .div(
            BigNumber.from("10").pow(Number(underworldPair.pair.asset.decimals) + 6)
          )
      }

      sumTotalAsset = sumTotalAsset.add(totalAsset)
      sumTotalBorrow = sumTotalBorrow.add(totalBorrow)
      sumAvgExchangeRate = sumAvgExchangeRate.add(
        BigNumber.from(underworldPair.avgExchangeRate)
      )
      sumAvgUtilization = sumAvgUtilization.add(
        BigNumber.from(underworldPair.avgUtilization)
      )
      sumAvgInterestPerSecond = sumAvgInterestPerSecond.add(
        BigNumber.from(underworldPair.avgInterestPerSecond)
      )

      const newUnderworldPair = {
        ...underworldPair,
        totalAsset: totalAsset.toBigInt(),
        totalBorrow: totalBorrow.toBigInt(),
      }

      const underworldPairDate = moment
        .unix(underworldPair.date)
        .startOf("month")
        .format("YYYY-MM-DD")
      const itemUnderworldPairMap = underworldPairsMaps.find(
        (underworldPairMap) => underworldPairMap.date === underworldPairDate
      )

      if (itemUnderworldPairMap) {
        itemUnderworldPairMap.totalAsset = BigNumber.from(
          itemUnderworldPairMap.totalAsset
        )
          .add(totalAsset)
          .toBigInt()
        itemUnderworldPairMap.totalBorrow = BigNumber.from(
          itemUnderworldPairMap.totalBorrow
        )
          .add(totalBorrow)
          .toBigInt()
        itemUnderworldPairMap.avgExchangeRate = BigNumber.from(
          itemUnderworldPairMap.avgExchangeRate
        )
          .add(BigNumber.from(underworldPair.avgExchangeRate))
          .toBigInt()
        itemUnderworldPairMap.avgUtilization = BigNumber.from(
          itemUnderworldPairMap.avgUtilization
        )
          .add(BigNumber.from(underworldPair.avgUtilization))
          .toBigInt()
        itemUnderworldPairMap.avgInterestPerSecond = BigNumber.from(
          itemUnderworldPairMap.avgInterestPerSecond
        )
          .add(BigNumber.from(underworldPair.avgInterestPerSecond))
          .toBigInt()
        itemUnderworldPairMap.underworldPairs.push(newUnderworldPair)
      } else {
        underworldPairsMaps.push({
          totalAsset: totalAsset.toBigInt(),
          totalBorrow: totalBorrow.toBigInt(),
          avgExchangeRate: underworldPair.avgExchangeRate || BigInt(0),
          avgUtilization: underworldPair.avgUtilization || BigInt(0),
          avgInterestPerSecond: underworldPair.avgInterestPerSecond || BigInt(0),
          date: underworldPairDate,
          underworldPairs: [newUnderworldPair],
        })
      }
      underworldPairsMaps.forEach((value) => {
        value.avgExchangeRate = BigNumber.from(value.avgExchangeRate)
          .div(BigNumber.from(value.underworldPairs.length))
          .toBigInt()
        value.avgUtilization = BigNumber.from(value.avgUtilization)
          .div(BigNumber.from(value.underworldPairs.length))
          .toBigInt()
        value.avgInterestPerSecond = BigNumber.from(value.avgInterestPerSecond)
          .div(BigNumber.from(value.underworldPairs.length))
          .toBigInt()
      })
      underworldPairsMaps.sort((a, b) => a.date.localeCompare(b.date))
      return newUnderworldPair
    })

    return {
      totalAsset: sumTotalAsset.toBigInt(),
      totalBorrow: sumTotalBorrow.toBigInt(),
      underworldPairs: newUnderworldPairs,
      underworldPairsMaps,
    }
  }

  calculateUnderworldPairDayDataPricesByCollateral(
    underworldPairs: UnderworldPairDayData[],
    pricesMap: { [key: string]: BigInt }
  ): UnderworldPairDayDataMapsCollateral[] {
    const underworldPairsMapGroupTemp: {
      [key: string]: { underworldPairs: UnderworldPairDayData[], collateral: Token }
    } = {}
    underworldPairs.forEach((underworldPair) => {
      const { collateral } = underworldPair.pair
      if (collateral && collateral.id) {
        if (underworldPairsMapGroupTemp[collateral.id]) {
          underworldPairsMapGroupTemp[collateral.id].underworldPairs.push(underworldPair)
        } else {
          underworldPairsMapGroupTemp[collateral.id] = {
            collateral,
            underworldPairs: [underworldPair],
          }
        }
      }
    })
    const underworldPairsMapGroup = Object.values(underworldPairsMapGroupTemp)

    const underworldPairsMapCollateralGroup = underworldPairsMapGroup.map((value) => {
      const { underworldPairsMaps } = this.calculateUnderworldPairDayDataPrices(
        value.underworldPairs,
        pricesMap
      )
      return {
        collateral: value.collateral,
        underworldPairsMaps,
      }
    })

    return underworldPairsMapCollateralGroup.sort((a, b) =>
      a.collateral.symbol.localeCompare(b.collateral.symbol)
    )
  }

  static getInstance() {
    if (CalculateService.instance) {
      return CalculateService.instance
    }
    CalculateService.instance = new CalculateService()
    return CalculateService.instance
  }
}

export default CalculateService