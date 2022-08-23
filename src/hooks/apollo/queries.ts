import gql from 'graphql-tag'

export const dexCandlesQuery = gql`
  query dexCandlesQuery($token0: String!, $token1: String!, $period: Int!, $skip: Int!) {
    candles(
      first: 1000
      skip: $skip
      orderBy: time
      orderDirection: asc
      where: { token0: $token0, token1: $token1, period: $period }
    ) {
      time
      open
      low
      high
      close
    }
  }
`

export const getLiquidityMiningCampaign = (ID: string) => gql`
query getLiquidityMiningCampaign($liquidityMiningCampaignId: ${ID}!) {
  liquidityMiningCampaign(id: $liquidityMiningCampaignId) {
    ...LiquidityMiningCampaignFragment
    rewards {
      ...LiquidityMiningCampaignRewardFragment
    }
  }
}`

export const getSingleSidedStakingCampaign = (ID: string) => gql`
query getSingleSidedStakingCampaign($campaignId: ${ID}!) {
  singleSidedStakingCampaign(id: $campaignId) {
    ...SingleSidedStakingCampaignFragment
    stakeToken {
      ...StakeTokenFragment
    }
    rewards {
      ...SingleSidedStakingCampaignRewardFragment
    }
  }
}`