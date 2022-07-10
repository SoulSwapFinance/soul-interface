import gql from 'graphql-tag'

export const cloneFieldsQuery = gql`
  fragment cloneFields on Clone {
    id
    address: id
    data
    block
    timestamp
  }
`

export const clonesQuery = gql`
  query clones(
    $skip: Int = 0
    $first: Int = 1000
    $where: Clone_filter
    $block: Block_height
    $orderBy: Clone_orderBy
    $orderDirection: OrderDirection
  ) {
    clones(
      skip: $skip
      first: $first
      where: $where
      block: $block
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      ...cloneFields
    }
  }
  ${cloneFieldsQuery}
`

export const coffinTokenFieldsQuery = gql`
  fragment coffinTokenFields on Token {
    id
    # coffinBox
    name
    symbol
    decimals
    totalSupplyElastic
    totalSupplyBase
    block
    timestamp
  }
`

export const coffinTokensQuery = gql`
  query coffinTokens($first: Int = 1000, $block: Block_height, $where: Token_filter) {
    tokens(first: $first, skip: $skip, block: $block, where: $where) {
      ...coffinTokenFields
    }
  }
  ${coffinTokenFieldsQuery}
`

export const coffinUserTokensQuery = gql`
  query coffinUserTokens($user: String!, $skip: Int = 0, $first: Int = 1000, $block: Block_height) {
    userTokens(skip: $skip, first: $first, block: $block, where: { share_gt: 0, user: $user }) {
      token {
        ...coffinTokenFields
      }
      share
    }
  }
  ${coffinTokenFieldsQuery}
`

export const underworldPairFieldsQuery = gql`
  fragment underworldPairFields on UnderworldPair {
    id
    # coffinBox
    type
    masterContract
    owner
    feeTo
    name
    symbol
    oracle
    asset {
      ...coffinTokenFields
    }
    collateral {
      ...coffinTokenFields
    }
    exchangeRate
    totalAssetElastic
    totalAssetBase
    totalCollateralShare
    totalBorrowElastic
    totalBorrowBase
    interestPerSecond
    utilization
    feesEarnedFraction
    totalFeesEarnedFraction
    lastAccrued
    supplyAPR
    borrowAPR
    # transactions
    # users
    block
    timestamp
  }
  ${coffinTokenFieldsQuery}
`

export const underworldPairsQuery = gql`
  query underworldPairs(
    $skip: Int = 0
    $first: Int = 1000
    $where: UnderworldPair_filter
    $block: Block_height
    $orderBy: UnderworldPair_orderBy = "utilization"
    $orderDirection: OrderDirection! = "desc"
  ) {
    underworldPairs(
      skip: $skip
      first: $first
      where: $where
      block: $block
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      ...underworldPairFields
    }
  }
  ${underworldPairFieldsQuery}
`

export const underworldUserPairsQuery = gql`
  query underworldUserPairs($user: String!, $skip: Int = 0, $first: Int = 1000, $block: Block_height) {
    userUnderworldPairs(skip: $skip, first: $first, block: $block, where: { user: $user }) {
      assetFraction
      collateralShare
      borrowPart
      pair {
        ...underworldPairFields
      }
    }
  }
  ${underworldPairFieldsQuery}
`

export const coffinBoxQuery = gql`
  query coffinBoxQuery(
    $id: String! = "0xF539C37275e947F24480fAb9f7e302aE827570b2"
    $block: Block_height
    $where: CoffinBox_filter
  ) {
    coffinBoxes(first: 1, block: $block, where: $where) {
      id
      totalUsers
      totalTokens
      totalUnderworldPairs
      tokens(first: 1000) {
        id
        name
        symbol
        decimals
        totalSupplyBase
        totalSupplyElastic
      }
    }
  }
`

export const coffinBoxQuery_AVAX = gql`
  query coffinBoxQuery(
    $id: String! = "0x51d7d0d03A9E38Ba550f24cea28B992AD2350fee"
    $block: Block_height
    $where: CoffinBox_filter
  ) {
    coffinBoxes(first: 1, block: $block, where: $where) {
      id
      totalUsers
      totalTokens
      totalUnderworldPairs
      tokens(first: 1000) {
        id
        name
        symbol
        decimals
        totalSupplyBase
        totalSupplyElastic
      }
    }
  }
`

export const coffinStrategiesQuery = gql`
  query coffinStrategies($first: Int = 1000, $firstHarvests: Int = 3, $block: Block_height, $where: Strategy_filter) {
    strategies(first: $first, block: $block, where: $where) {
      token {
        id
        decimals
        strategyTargetPercentage
        totalSupplyElastic
      }
      balance
      totalProfit
      harvests(first: $firstHarvests, orderBy: timestamp, orderDirection: desc) {
        id
        profit
        tokenElastic
        timestamp
        block
      }
      timestamp
      block
    }
  }
  ${coffinTokenFieldsQuery}
`