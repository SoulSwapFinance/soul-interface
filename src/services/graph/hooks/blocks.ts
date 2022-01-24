import { getAverageBlockTime, getBlock, getOneDayBlock, getOneWeekBlock, getCustomDayBlock } from '../fetchers'
import stringify from 'fast-json-stable-stringify'

import { useActiveWeb3React } from 'services/web3'
import useSWR, { SWRConfiguration } from 'swr'
import { useMemo } from 'react'
import { ChainId } from 'sdk'
import { GraphProps } from '../interfaces'

interface useBlockProps {
  timestamp?: number
  daysAgo?: number
  chainId: number
  shouldFetch?: boolean
}

export function useBlock(
  { timestamp, daysAgo, chainId, shouldFetch = true }: useBlockProps,
  swrConfig: SWRConfiguration = undefined
) {
  shouldFetch = shouldFetch && !!chainId
  timestamp = timestamp
    ? String(timestamp).length !== 13
      ? Number(timestamp)
      : Math.floor(Number(timestamp) / 1000)
    : undefined
  timestamp = useMemo(() => (daysAgo ? Math.floor(Date.now() / 1000) - daysAgo * 86400 : timestamp), [daysAgo])

  const { data } = useSWR(
    shouldFetch ? ['block', chainId, timestamp] : null,
    (_, chainId, timestamp) => getBlock(chainId, timestamp),
    swrConfig
  )

  return data
}


export function useOneDayBlock(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(chainId ? ['oneDayBlock', chainId] : null, (_, chainId) => getOneDayBlock(chainId), swrConfig)

  return data
}

export function useOneWeekBlock(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(
    chainId ? ['oneWeekBlock', chainId] : null,
    (_, chainId) => getOneWeekBlock(chainId),
    swrConfig
  )

  return data
}

export function useCustomDayBlock(days: number, swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(
    chainId ? ['customDayBlock', chainId, days] : null,
    (_, chainId) => getCustomDayBlock(chainId, days),
    swrConfig
  )

  return data
}

export function useAverageBlockTime(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(
    chainId ? ['averageBlockTime', chainId] : null,
    (_, chainId) => getAverageBlockTime(chainId),
    swrConfig
  )

  return data
}

export function useNativePrice({
  chainId = ChainId.FANTOM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['nativePrice', chainId, stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    () => getNativePrice(chainId, variables),
    swrConfig
  )

  return data
}