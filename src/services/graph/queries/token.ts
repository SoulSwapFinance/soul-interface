import { gql } from "@apollo/client"

export const getTokensQuery = gql`
  query GetToken($id: String) {
    tokens(first: 1, where: { id: $id }) {
      id
      name
      symbol
      decimals
      block
      timestamp
    }
    underworldPairs(first: 1000, where: { asset: $id }) {
      id
      name
      symbol
      asset {
        id
        name
        symbol
        decimals
        totalSupply
        block
        timestamp
      }
      collateral {
        id
        name
        symbol
        decimals
        totalSupply
        block
        timestamp
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
      totalCollateralShare
      supplyAPR
      borrowAPR
    }
  }
`
// formerly pairs
export const getUnderworldPairsDayDataQuery = gql`
  query GetDataUnderworldPairsDayData($pairIds: [String], $skip: Int) {
    underworldPairDaySnapshots(
      first: 1000
      where: { pair_in: $pairIds }
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