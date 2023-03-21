import { Token } from "./Token"

export type UnderworldPair = {
  id: string
  type?: string
  owner?: string
  feeTo?: string
  name: string
  symbol: string
  oracle?: string
  asset?: Token
  collateral?: Token
  exchangeRate?: BigInt
  totalAssetElastic?: BigInt
  totalAssetBase?: BigInt
  totalAsset?: BigInt
  totalCollateralShare?: BigInt
  totalBorrowElastic?: BigInt
  totalBorrowBase?: BigInt
  totalBorrow?: BigInt
  interestPerSecond?: BigInt
  utilization?: BigInt
  feesEarnedFraction?: BigInt
  totalFeesEarnedFraction?: BigInt
  lastAccrued?: BigInt
  supplyAPR?: BigInt
  borrowAPR?: BigInt
  block?: BigInt
  timestamp?: BigInt
}

export type UnderworldPairsByToken = {
  token: Token
  totalAsset: BigInt
  totalBorrow: BigInt
  underworldPairs: UnderworldPair[]
}