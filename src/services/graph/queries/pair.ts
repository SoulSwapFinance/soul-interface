import { gql } from "@apollo/client";

export const getUnderworldPairQuery = gql`
  query GetPair($id: String) {
    underworldPairs(first: 1, where: { id: $id }) {
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
      totalAssetElastic
      totalAssetBase
      supplyAPR
      totalBorrowElastic
      totalBorrowBase
      borrowAPR
      utilization
    }
    underworldPairDayDatas(
      first: 1000
      where: { pair: $id }
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
`;