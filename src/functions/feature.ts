import { ChainId } from 'sdk'
import features from 'config/features'
import { Feature } from 'enums'

export function featureEnabled(feature: Feature, chainId: ChainId): boolean {
  return chainId && chainId in features && features[chainId ?? ChainId.FANTOM].includes(feature)
}

export function chainsWithFeature(feature: Feature): ChainId[] {
  return (
    Object.keys(features)
      .filter((chainKey) => featureEnabled(feature, ChainId[chainKey]))
      .map((chain) => ChainId[chain])
  )
}