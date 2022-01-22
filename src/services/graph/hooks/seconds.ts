import { getAverageBlock, getOneDay, getOneWeek, getCustomDay } from '../fetchers'

import { useActiveWeb3React } from 'services/web3'
import useSWR from 'swr'

export function useOneDay(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(chainId ? ['oneDay', chainId] : null, (_, chainId) => getOneDay(chainId), swrConfig)

  return data
}

export function useOneWeek(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(chainId ? ['oneWeek', chainId] : null, (_, chainId) => getOneWeek(chainId), swrConfig)

  return data
}

export function useCustomDay(days: number, swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(
    chainId ? ['customDay', chainId, days] : null,
    (_, chainId) => getCustomDay(chainId, days),
    swrConfig
  )

  return data
}

export function useAverageBlock(swrConfig = undefined) {
  const { chainId } = useActiveWeb3React()

  const { data } = useSWR(
    chainId ? ['averageBlock', chainId] : null,
    (_, chainId) => getAverageBlock(chainId),
    swrConfig
  )

  return data
}
