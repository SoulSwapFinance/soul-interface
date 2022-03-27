import { JSBI, Rebase, ZERO, maximum, minimum, toElastic, Token } from 'sdk'
import { accrue, accrueTotalAssetWithFee, interestAccrue, takeFee, computeLendingPairAddress } from '../functions'
import { toAmount, toShare } from 'sdk'

import { AccrueInfo } from '../interfaces'

export class UnderworldMediumRiskLendingPair {
  public readonly accrueInfo: AccrueInfo
  public readonly collateral: Rebase
  public readonly asset: Rebase
  public readonly totalCollateralShare: JSBI
  public readonly totalAsset: Rebase
  public readonly totalBorrow: Rebase
  public readonly exchangeRate: JSBI
  public readonly oracleExchangeRate: JSBI
  public readonly spotExchangeRate: JSBI
  public readonly userCollateralShare: JSBI
  public readonly userAssetFraction: JSBI
  public readonly userBorrowPart: JSBI

  public static getAddress(collateral: Token, asset: Token, oracle: string, oracleData: string): string {
    return computeLendingPairAddress({
      collateral,
      asset,
      oracle,
      oracleData,
    })
  }

  public constructor(
    accrueInfo: AccrueInfo,
    collateral: Rebase,
    asset: Rebase,
    totalCollateralShare: JSBI,
    totalAsset: Rebase,
    totalBorrow: Rebase,
    exchangeRate: JSBI,
    oracleExchangeRate: JSBI,
    spotExchangeRate: JSBI,
    userCollateralShare: JSBI,
    userAssetFraction: JSBI,
    userBorrowPart: JSBI
  ) {
    this.accrueInfo = accrueInfo
    this.collateral = collateral
    this.asset = asset
    this.totalCollateralShare = totalCollateralShare
    this.totalAsset = totalAsset
    this.totalBorrow = totalBorrow
    this.exchangeRate = exchangeRate
    this.oracleExchangeRate = oracleExchangeRate
    this.spotExchangeRate = spotExchangeRate
    this.userCollateralShare = userCollateralShare
    this.userAssetFraction = userAssetFraction
    this.userBorrowPart = userBorrowPart
  }

  /**
   * Returns the number of elapsed seconds since the last accrue
   */
  public get elapsedSeconds(): JSBI {
    const currentDate = JSBI.divide(JSBI.BigInt(Date.now()), JSBI.BigInt(1000))
    return JSBI.subtract(currentDate, this.accrueInfo.lastAccrued)
  }

  /**
   * Interest per year for borrowers at last accrue, this will apply during the next accrue
   */
  public get interestPerYear(): JSBI {
    return JSBI.multiply(this.accrueInfo.interestPerSecond, JSBI.BigInt(60 * 60 * 24 * 365))
  }

  /**
   * Interest per year for borrowers if accrued was called
   */
  public get currentInterestPerYear(): JSBI {
    return interestAccrue(this, this.interestPerYear)
  }

  /**
   * The total collateral in the market (collateral is stable, it doesn't accrue)
   */
  public get totalCollateralAmount(): JSBI {
    return toAmount(this.collateral, this.totalCollateralShare)
  }

  /**
   * The total assets unborrowed in the market (stable, doesn't accrue)
   */
  public get totalAssetAmount(): JSBI {
    return toAmount(this.asset, this.totalAsset.elastic)
  }

  /**
   * The total assets borrowed in the market right now
   */
  public get currentBorrowAmount(): JSBI {
    return accrue(this, this.totalBorrow.elastic, true)
  }

  /**
   * The total amount of assets, both borrowed and still available right now
   */
  public get currentAllAssets(): JSBI {
    return JSBI.add(this.totalAssetAmount, this.currentBorrowAmount)
  }

  /**
   * Current total amount of asset shares
   */
  public get currentAllAssetShares(): JSBI {
    return toShare(this.asset, this.currentAllAssets)
  }

  /**
   * Current totalAsset with the protocol fee accrued
   */
  public get currentTotalAsset() {
    return accrueTotalAssetWithFee(this)
  }

  /**
   * The maximum amount of assets available for withdrawal or borrow
   */
  public get maxAssetAvailable(): JSBI {
    return minimum(
      JSBI.divide(JSBI.multiply(this.totalAsset.elastic, this.currentAllAssets), this.currentAllAssetShares),
      toAmount(
        this.asset,
        toElastic(this.currentTotalAsset, JSBI.subtract(this.totalAsset.base, JSBI.BigInt(1000)), false)
      )
    )
  }

  /**
   * The maximum amount of assets available for withdrawal or borrow in shares
   */
  public get maxAssetAvailableFraction(): JSBI {
    return JSBI.divide(JSBI.multiply(this.maxAssetAvailable, this.currentTotalAsset.base), this.currentAllAssets)
  }

  /**
   * The overall health of the lending pair
   */
  public get marketHealth(): JSBI {
    return JSBI.divide(
      JSBI.multiply(
        JSBI.divide(
          JSBI.multiply(this.totalCollateralAmount, JSBI.BigInt(1e18)),
          maximum(this.exchangeRate, this.spotExchangeRate, this.oracleExchangeRate)
        ),
        JSBI.BigInt(1e18)
      ),
      this.currentBorrowAmount
    )
  }

  /**
   * The current utilization in %
   */
  public get utilization(): JSBI {
    return JSBI.divide(JSBI.multiply(JSBI.BigInt(1e18), this.currentBorrowAmount), this.currentAllAssets)
  }

  /**
   * Interest per year received by lenders as of now
   */
  public get supplyAPR(): JSBI {
    return takeFee(JSBI.divide(JSBI.multiply(this.interestPerYear, this.utilization), JSBI.BigInt(1e18)))
  }

  /**
   * Interest per year received by lenders if accrue was called
   */
  public get currentSupplyAPR(): JSBI {
    return takeFee(JSBI.divide(JSBI.multiply(this.currentInterestPerYear, this.utilization), JSBI.BigInt(1e18)))
  }

  /**
   * The user's amount of collateral (stable, doesn't accrue)
   */
  public get userCollateralAmount(): JSBI {
    return toAmount(this.collateral, this.userCollateralShare)
  }

  /**
   * The user's amount of assets (stable, doesn't accrue)
   */
  public get currentUserAssetAmount(): JSBI {
    return JSBI.divide(JSBI.multiply(this.userAssetFraction, this.currentAllAssets), this.totalAsset.base)
  }

  /**
   * The user's amount borrowed right now
   */
  public get currentUserBorrowAmount(): JSBI {
    if (JSBI.equal(this.userBorrowPart, ZERO)) return ZERO
    return JSBI.divide(JSBI.multiply(this.userBorrowPart, this.currentBorrowAmount), this.totalBorrow.base)
  }

  /**
   * The user's amount of assets that are currently lent
   */
  public get currentUserLentAmount(): JSBI {
    return JSBI.divide(JSBI.multiply(this.userAssetFraction, this.currentBorrowAmount), this.totalAsset.base)
  }

  /**
   * Value of protocol fees
   */
  public get feesEarned(): JSBI {
    return JSBI.divide(JSBI.multiply(this.accrueInfo.feesEarnedFraction, this.currentAllAssets), this.totalAsset.base)
  }

  /**
   * The user's maximum borrowable amount based on the collateral provided, using all three oracle values
   */
  public get maxBorrowable() {
    const max = {
      oracle: JSBI.divide(
        JSBI.multiply(this.userCollateralAmount, JSBI.multiply(JSBI.BigInt(1e16), JSBI.BigInt(75))),
        this.oracleExchangeRate
      ),
      spot: JSBI.divide(
        JSBI.multiply(this.userCollateralAmount, JSBI.multiply(JSBI.BigInt(1e16), JSBI.BigInt(75))),
        this.spotExchangeRate
      ),
      stored: JSBI.divide(
        JSBI.multiply(this.userCollateralAmount, JSBI.multiply(JSBI.BigInt(1e16), JSBI.BigInt(75))),
        this.exchangeRate
      ),
    }

    const min = minimum(...Object.values(max))

    const safe = JSBI.subtract(
      JSBI.divide(JSBI.multiply(min, JSBI.BigInt(95)), JSBI.BigInt(100)),
      this.currentUserBorrowAmount
    )

    const possible = minimum(safe, this.maxAssetAvailable)

    return {
      ...max,
      minimum: min,
      safe,
      possible,
    }
  }

  /**
   * The user's position's health
   */
  public get health(): JSBI {
    return JSBI.divide(JSBI.multiply(this.currentUserBorrowAmount, JSBI.BigInt(1e18)), this.maxBorrowable.minimum)
  }
}