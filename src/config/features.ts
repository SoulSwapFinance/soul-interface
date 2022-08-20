import { ChainId } from 'sdk'
import { Feature } from 'enums'

type FeatureMap = { readonly [chainId in ChainId]?: Feature[] }

const features: FeatureMap = {
  [ChainId.ETHEREUM]: [
    Feature.AMM,
    // Feature.LIQUIDITY_MINING,
    // Feature.COFFINBOX,
    // Feature.UNDERWORLD,
    // Feature.MIGRATE,
    Feature.ANALYTICS,
    // Feature.STAKING,
    // Feature.VESTING,
  ],

  [ChainId.TELOS]: [
    Feature.AMM, 
    // Feature.ANALYTICS,
    // Feature.UNDERWORLD
  ],

  [ChainId.MOONRIVER]: [
    Feature.AMM, 
    // Feature.ANALYTICS,
    // Feature.UNDERWORLD
  ],

  [ChainId.MATIC]: [
    Feature.AMM, 
    // Feature.ANALYTICS,
    // Feature.UNDERWORLD
  ],

  [ChainId.ARBITRUM]: [
    Feature.AMM, 
    // Feature.ANALYTICS,
    // Feature.UNDERWORLD
  ],

  [ChainId.BSC]: [
    Feature.AMM, 
    Feature.ANALYTICS,
    // Feature.UNDERWORLD
  ],

  [ChainId.AVALANCHE]: [
    Feature.AMM, 
    Feature.ANALYTICS,
    Feature.COFFINBOX,
    Feature.UNDERWORLD,
  ],

  [ChainId.FANTOM]: [
    Feature.AMM,
    Feature.STAKING,
    Feature.ANALYTICS,
    Feature.LIQUIDITY_MINING,
    Feature.BONDS,
    Feature.COFFINBOX,
    Feature.LIMIT,
    Feature.EXPLORE,
    // Feature.LIMIT_ORDERS,
    Feature.UNDERWORLD
  ],

  [ChainId.FANTOM_TESTNET]: [
    Feature.AMM
  ],
}

export default features