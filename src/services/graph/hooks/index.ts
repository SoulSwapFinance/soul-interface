import {
  getMasterChefV2Farms,
  getMasterChefV2PairAddreses,
  getSoulSummonerFarms,
  getSoulSummonerPairAddreses,
} from '../fetchers'
import { useEffect, useMemo } from 'react'
import useSWR, { SWRConfiguration } from 'swr'

import { ChainId } from '../../../sdk'
import concat from 'lodash/concat'
import { useActiveWeb3React } from 'services/web3'

export * from './coffinbox'
export * from './blocks'
export * from './exchange'
export * from './seconds'

export function useMasterChefV2Farms(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
  const { data } = useSWR(shouldFetch ? 'masterChefV2Farms' : null, () => getMasterChefV2Farms(), swrConfig)
  return useMemo(() => {
    if (!data) return []
    // return data.map((data) => ({ ...data, chef: Chef.SOUL_SUMMONER }))
  }, [data])
}

export function useSoulSummonerFarms(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
  const { data } = useSWR(shouldFetch ? 'masterChefV2Farms' : null, () => getSoulSummonerFarms(), swrConfig) // TODO: update
  return useMemo(() => {
    if (!data) return []
    // return data.map((data) => ({ ...data, chef: Chef.SOUL_SUMMONER }))
  }, [data])
}

export function useFarms(swrConfig: SWRConfiguration = undefined) {
  const masterChefV2Farms = useMasterChefV2Farms()
  const soulSummonerFarms = useSoulSummonerFarms()
  // useEffect(() => {
  //   console.log('debug', { masterChefV2Farms })
  // }, [masterChefV2Farms])
  return useMemo(
    () => concat(masterChefV2Farms, soulSummonerFarms).filter((pool) => pool && pool.pair),
    [masterChefV2Farms, soulSummonerFarms]
  )
}

export function useMasterChefV2PairAddresses() {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
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

export function useFarmPairAddresses() {
  const masterChefV2PairAddresses = useMasterChefV2PairAddresses()
  const getSoulSummonerPairAddreses = useSoulSummonerPairAddresses()
  return useMemo(
    () => concat(masterChefV2PairAddresses, getSoulSummonerPairAddreses),
    [masterChefV2PairAddresses, getSoulSummonerPairAddreses]
  )
}
