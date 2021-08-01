import {
  getMasterChefV2Farms,
  getMasterChefV2PairAddreses,
  getMiniChefFarms,
  getMiniChefPairAddreses,
  getSoulSummonerFarms,
  getSoulSummonerPairAddreses,
} from '../fetchers'
import { useEffect, useMemo } from 'react'
import useSWR, { SWRConfiguration } from 'swr'

import { ChainId } from '@soulswap/sdk'
import { Chef } from '../../../features/farm/enum'
import concat from 'lodash/concat'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

export * from './bentobox'
export * from './blocks'
export * from './exchange'
export * from './seconds'

export function useMasterChefV2Farms(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.MAINNET
  const { data } = useSWR(shouldFetch ? 'masterChefV2Farms' : null, () => getMasterChefV2Farms(), swrConfig)
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => ({ ...data, chef: Chef.SOUL_SUMMONER }))
  }, [data])
}

export function useSoulSummonerFarms(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.MAINNET
  const { data } = useSWR(shouldFetch ? 'masterChefV2Farms' : null, () => getSoulSummonerFarms(), swrConfig) // TODO: update
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => ({ ...data, chef: Chef.SOUL_SUMMONER }))
  }, [data])
}

export function useMiniChefFarms(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && [ChainId.MATIC, ChainId.XDAI, ChainId.HARMONY].includes(chainId)
  const { data } = useSWR(
    shouldFetch ? ['miniChefFarms', chainId] : null,
    (_, chainId) => getMiniChefFarms(chainId),
    swrConfig
  )
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => ({ ...data, chef: Chef.MINICHEF }))
  }, [data])
}

export function useFarms(swrConfig: SWRConfiguration = undefined) {
  const masterChefV2Farms = useMasterChefV2Farms()
  const soulSummonerFarms = useSoulSummonerFarms()
  const miniChefFarms = useMiniChefFarms()
  // useEffect(() => {
  //   console.log('debug', { masterChefV2Farms, miniChefFarms })
  // }, [masterChefV2Farms, miniChefFarms])
  return useMemo(
    () => concat(masterChefV2Farms, soulSummonerFarms, miniChefFarms).filter((pool) => pool && pool.pair),
    [masterChefV2Farms, soulSummonerFarms, miniChefFarms]
  )
}

export function useMasterChefV2PairAddresses() {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.MAINNET
  const { data } = useSWR(shouldFetch ? ['masterChefV2PairAddresses', chainId] : null, (_) =>
    getMasterChefV2PairAddreses()
  )
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => data.pair)
  }, [data])
}

export function useSoulSummonerPairAddresses() {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.FANTOM_TESTNET // todo: update to fantom
  const { data } = useSWR(shouldFetch ? ['masterChefV2PairAddresses', chainId] : null, (_) =>
    getSoulSummonerPairAddreses()
  )
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => data.pair)
  }, [data])
}

export function useMiniChefPairAddresses() {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && [ChainId.MATIC, ChainId.XDAI, ChainId.HARMONY].includes(chainId)
  const { data } = useSWR(shouldFetch ? ['miniChefPairAddresses', chainId] : null, (_, chainId) =>
    getMiniChefPairAddreses(chainId)
  )
  return useMemo(() => {
    if (!data) return []
    return data.map((data) => data.pair)
  }, [data])
}

export function useFarmPairAddresses() {
  const masterChefV2PairAddresses = useMasterChefV2PairAddresses()
  const getSoulSummonerPairAddreses = useSoulSummonerPairAddresses()
  const miniChefPairAddresses = useMiniChefPairAddresses()
  return useMemo(
    () => concat(masterChefV2PairAddresses, getSoulSummonerPairAddreses, miniChefPairAddresses),
    [masterChefV2PairAddresses, getSoulSummonerPairAddreses, miniChefPairAddresses]
  )
}
