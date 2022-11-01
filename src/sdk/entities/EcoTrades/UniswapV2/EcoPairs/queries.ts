import { gql } from 'graphql-request'

export const GET_ALL_COMMON_PAIRS_BETWEEN_TOKEN_A_AND_TOKEN_B = gql`
  query GetAllCommonPairsBetweenTokenAAndTokenB($tokenA: String!, $tokenB: String!) {
    pairsWithTokenA: pairs(where: { token0_in: [$tokenA, $tokenB] }) {
      ...PairDetails
    }
    pairsWithTokenB: pairs(where: { token1_in: [$tokenB, $tokenA] }) {
      ...PairDetails
    }
  }

  fragment PairDetails on Pair {
    id
    reserve0
    reserve1
    token0 {
      ...TokenDetails
    }
    token1 {
      ...TokenDetails
    }
  }

  fragment TokenDetails on Token {
    id
    name
    symbol
    decimals
  }
`
