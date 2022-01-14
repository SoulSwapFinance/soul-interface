import { ChainId } from '../sdk'

export enum Feature {
  AMM = 'AMM',
  AMM_V2 = 'AMM V2',
  LIQUIDITY_MINING = 'Liquidity Mining',
  BENTOBOX = 'BentoBox',
  UNDERWORLD = 'Underworld',
  IFO = 'IFO',
  ANALYTICS = 'Analytics',
}

const features = {
  [ChainId.MAINNET]: [Feature.AMM],
  [ChainId.FANTOM]: [Feature.AMM, Feature.LIQUIDITY_MINING, Feature.ANALYTICS, Feature.UNDERWORLD],
  [ChainId.FANTOM_TESTNET]: [Feature.AMM, Feature.LIQUIDITY_MINING]
}

export function featureEnabled(feature: Feature, chainId: ChainId): boolean {
  return features[chainId].includes(feature)
}
