import { gql } from "@apollo/client"

export const getTokensExploreQuery = gql`
  query GetTokens {
    tokens(
      first: 1000
      orderBy: id
      orderDirection: desc
    ) {
      id
      name
      symbol
      decimals    
    rebase {
        id
        base
        elastic
      }
    }
  }
`

export const getUnderworldPairsExploreQuery = gql`
  query GetPairs {
    underworldPairs(first: 1000) {
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
      totalAsset
      supplyAPR
      totalBorrow
      borrowAPR
    }
  }
`