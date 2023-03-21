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
      interestPerSecond
      totalAssetElastic
      totalAssetBase
      supplyAPR
      totalBorrowElastic
      totalBorrowBase
      borrowAPR
    }
  }
`

export const getUnderworldPairsDayDataQuery = gql`
  query GetDataUnderworldPairsDayData($skip: Int) {
    underworldPairDayDatas(
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
      }
      totalAssetElastic
      totalAssetBase
      totalCollateralShare
      totalBorrowElastic
      totalBorrowBase
      avgExchangeRate
      avgUtilization
      avgInterestPerSecond
    }
  }
`