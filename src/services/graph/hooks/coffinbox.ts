import { ChainId, CurrencyAmount, Token } from 'sdk'
import { Feature } from 'enums'
import { featureEnabled } from 'functions/feature'
import {
  getCoffinBox,
  getCoffinStrategies,
  getCoffinTokens,
  getCoffinUserTokens,
  getClones,
  getUnderworldPairs,
} from 'services/graph/fetchers'
import stringify from 'fast-json-stable-stringify'
import useSWR from 'swr'

import { GraphProps } from '../interfaces'

// TODO: Fix shouldFetch //

export function useClones({ chainId, shouldFetch = true, swrConfig = undefined }) {
  const { data } = useSWR(shouldFetch ? () => ['clones', chainId] : null, (_, chainId) => getClones(chainId), swrConfig)
  return data
}

export function useUnderworldPairs({
  chainId = ChainId.FANTOM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? () => ['underworldPairs', chainId, stringify(variables)] : null,
    (_, chainId) => getUnderworldPairs(chainId, variables),
    swrConfig
  )
  return data
}

export function useCoffinBox({ chainId = ChainId.FANTOM, variables, shouldFetch = true, swrConfig }: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['coffinBox', chainId, stringify(variables)] : null,
    () => getCoffinBox(chainId, variables),
    swrConfig
  )

  return data
}

// subset of tokens, not strategies
export function useCoffinStrategies({
  chainId = ChainId.FANTOM,
  variables,
  // shouldFetch = featureEnabled(Feature.COFFINBOX, chainId),
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    // shouldFetch ? ['coffinStrategies', chainId, stringify(variables)] : 
    null,
    () => getCoffinStrategies(chainId, variables),
    swrConfig
  )

  return data as { token: string; apy: number; targetPercentage: number }[]
}

export function useCoffinTokens({
  chainId,
  variables,
  // shouldFetch = featureEnabled(Feature.COFFINBOX, chainId),
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    // shouldFetch ? ['coffinTokens', chainId, stringify(variables)] :
    null,
    () => getCoffinTokens(chainId, variables),
    swrConfig
  )
  return data
}

export function useCoffinUserTokens({
  chainId,
  variables,
  // shouldFetch = featureEnabled(Feature.COFFINBOX, chainId),
  swrConfig = undefined,
}: GraphProps) {
  return useSWR<CurrencyAmount<Token>[]>(
    // shouldFetch ? ['coffinUserTokens', chainId, stringify(variables)] : 
    null,
    () => getCoffinUserTokens(chainId, variables),
    swrConfig
  )
}
