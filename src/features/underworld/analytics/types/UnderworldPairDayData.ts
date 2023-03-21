import { UnderworldPair } from "./UnderworldPair"
import { Token } from "./Token"

export type UnderworldPairDayData = {
  id: string
  date: number
  pair: UnderworldPair
  totalAsset?: BigInt
  totalAssetElastic?: BigInt
  totalAssetBase?: BigInt
  totalCollateralShare?: BigInt
  totalBorrow?: BigInt
  totalBorrowElastic?: BigInt
  totalBorrowBase?: BigInt
  avgExchangeRate?: BigInt
  avgUtilization?: BigInt
  avgInterestPerSecond?: BigInt
}

export type UnderworldPairDayDataMap = {
  totalAsset: BigInt
  totalBorrow: BigInt
  avgExchangeRate: BigInt
  avgUtilization: BigInt
  avgInterestPerSecond: BigInt
  date: string
  underworldPairs: UnderworldPairDayData[]
}

export type UnderworldPairDayDataMapsCollateral = {
  collateral: Token
  underworldPairMaps: UnderworldPairDayDataMap[]
}