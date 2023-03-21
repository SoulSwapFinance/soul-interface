import { gql } from "@apollo/client"

export const getUnderworldPairsQuery = gql`
  query GetPairs {
    coffinBoxes {
      totalTokens
      totalUnderworldPairs
      totalUsers
    }
    underworldPairs(first: 1000, orderBy: totalAssetElastic, orderDirection: desc) {
      id
      name
      symbol
      asset {
        id
        name
        symbol
        decimals
      }
      collateral {
        id
        name
        symbol
        decimals
      }
      exchangeRate
      utilization
      totalAssets
      supplyAPR
      totalBorrow {
        id
        base
        elastic
      }
      borrowAPR
    }
  }
`

export const getUnderworldPairsDayDataDashboardQuery = gql`
  query GetDataUnderworldPairsDayData($skip: Int) {
    underworldPairDaySnapshots(
      first: 1000
      skip: $skip
      orderBy: date
      orderDirection: desc
    ) {
        id
        date
        pair {
          id
          name
          symbol
          asset {
            id
            name
            symbol
            decimals
          }
          collateral {
            id
            name
            symbol
            decimals
          }
          totalAsset {
              id
              base
              elastic
            }
          totalBorrow {
              id
              base
              elastic
            }
          accrueInfo {
              lastAccrued
              interestPerSecond
              feesEarnedFraction
          }
        }
        totalCollateralShare
        exchangeRate
        utilization
    }
  }
`