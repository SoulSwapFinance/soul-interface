import { ChainId, CurrencyAmount, JSBI } from '../../sdk'
import { Chef } from './enum'
import { SOUL } from '../../constants'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from '../../state/multicall/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useETHPairContract,
  useSoulFtmContract,
  useSummonerContract,
} from '../../hooks'

import { Contract } from '@ethersproject/contracts'
import { Zero } from '@ethersproject/constants'
import { useActiveWeb3React } from 'services/web3'
import zip from 'lodash/zip'
import { useToken } from '../../hooks/Tokens'
const { default: axios } = require('axios')

export function useUserInfo(farm, token) {
  const { account } = useActiveWeb3React()

  const contract = useSummonerContract()

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(farm.id), String(account)]
  }, [farm, account])

  const result = useSingleCallResult(args ? contract : null, 'userInfo', args)?.result
  // const userLockedUntilResult = useSingleCallResult(args ? contract : null, 'userLockedUntil', args)?.result

  const value = result?.[0]
  const harvestValue = result?.[3]
  // const userLockedUntilValue = userLockedUntilResult?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined
  // const nextHarvestUntil = harvestValue ? JSBI.BigInt(harvestValue.toString()) : undefined
  // const userLockedUntil = userLockedUntilValue ? JSBI.BigInt(userLockedUntilValue.toString()) : undefined

  return {
    amount: amount ? CurrencyAmount.fromRawAmount(token, amount) : undefined,
    // nextHarvestUntil: nextHarvestUntil ? JSBI.toNumber(nextHarvestUntil) * 1000 : undefined,
    // userLockedUntil: userLockedUntil ? JSBI.toNumber(userLockedUntil) * 1000 : undefined,
  }
}

export function usePendingSoul(farm) {
  const { account, chainId } = useActiveWeb3React()

  const contract = useSummonerContract()

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(farm.id), String(account)]
  }, [farm, account])

  const result = useSingleCallResult(args ? contract : null, 'pendingSoul', args)?.result

  const value = result?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined

  return amount ? CurrencyAmount.fromRawAmount(SOUL[chainId ?? ChainId.FANTOM], amount) : undefined
}

export function usePendingToken(farm, contract) {
  const { account } = useActiveWeb3React()

  const args = useMemo(() => {
    if (!account || !farm) {
      return
    }
    return [String(farm.pid), String(account)]
  }, [farm, account])

  const pendingTokens = useSingleContractMultipleData(
    args ? contract : null,
    'pendingTokens',
    args.map((arg) => [...arg, '0'])
  )

  return useMemo(() => pendingTokens, [pendingTokens])
}

export function useSoulPositions(contract?: Contract | null) {
  const { account } = useActiveWeb3React()

  const numberOfPools = useSingleCallResult(contract, 'poolLength')?.result

  const args = useMemo(() => {
    if (!account || !numberOfPools) {
      return
    }
    return [...Array(numberOfPools.toNumber()).keys()].map((pid) => [String(pid), String(account)])
  }, [numberOfPools, account])

  const pendingSoul = useSingleContractMultipleData(args ? contract : null, 'pendingSoul', args)
  const userInfo = useSingleContractMultipleData(args ? contract : null, 'userInfo', args)
  // const userLockedUntil = useSingleContractMultipleData(args ? contract : null, 'userLockedUntil', args)

  return useMemo(() => {
    if (!pendingSoul || !userInfo) { // !userLockedUntil
      return []
    }
    return zip(pendingSoul, userInfo) // userLockedUntil
      .map((data, i) => ({
        id: args[i][0],
        pendingSoul: data[0].result?.[0] || Zero,
        amount: data[1].result?.[0] || Zero,
        // lockedUntil: data[2].result?.[0] || Zero,
      }))
      .filter(({ pendingSoul, amount }) => {
        return (pendingSoul && !pendingSoul.isZero()) || (amount && !amount.isZero())
      })
  }, [args, pendingSoul, userInfo])
}

export function usePositions() {
  return useSoulPositions(useSummonerContract())
}

export function useSoulVaults(contract?: Contract | null) {
  const numberOfPools = useSingleCallResult(contract, 'poolLength')?.result

  const args = useMemo(() => {
    if (!numberOfPools) {
      return
    }
    return [...Array(numberOfPools.toNumber()).keys()].map((pid) => [String(pid)])
  }, [numberOfPools])

  const poolInfo = useSingleCallResult(contract, 'poolLength')?.result

  return useMemo(() => {
    if (!poolInfo) {
      return []
    }
    return zip(poolInfo).map((data, i) => ({
      id: args[i][0],
      lpToken: data[0].result?.['lpToken'] || '',
      allocPoint: data[0].result?.['allocPoint'] || '',
      lastRewardTime: data[0].result?.['lastRewardTime'] || '',
      accSoulPerShare: data[0].result?.['accSoulPerShare'] || '',
      // depositFeeBP: data[0].result?.['depositFeeBP'] || '',
      // totalLp: data[0].result?.['totalLp'] || '',
      // lockupDuration: data[0].result?.['lockupDuration'] || 0,
    }))
  }, [args, poolInfo])
}

const useAsync = (asyncFunction, immediate = true) => {
  const [value, setValue] = useState(null)

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(() => {
    return asyncFunction().then((response) => {
      let [prices] = response
      setValue({ data: { ...prices?.data } })
    })
  }, [asyncFunction])
  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    const intervalId = setInterval(() => {
      execute()
    }, 60_000)

    if (immediate) {
      execute()
    }

    return () => {
      clearInterval(intervalId) //This is important
    }
  }, [execute, immediate])

  return value
}

export function usePriceApi() {
  return Promise.all([axios.get('/api/prices')])
}

export function usePrice(pairContract?: Contract | null, pairDecimals?: number | null) {
  const { account, chainId } = useActiveWeb3React()

  const result = useSingleCallResult(pairContract ? pairContract : null, 'getReserves', undefined, NEVER_RELOAD)?.result

  const _reserve1 = result?.['reserve1']
  const _reserve0 = result?.['reserve0']

  const price = _reserve1 ? (Number(_reserve1) / Number(_reserve0)) * (pairDecimals ? 10 ** pairDecimals : 1) : 0

  return price
}

export function useTokenInfo(tokenContract?: Contract | null) {
  const { account, chainId } = useActiveWeb3React()

  const _totalSupply = useSingleCallResult(tokenContract ? tokenContract : null, 'totalSupply', undefined, NEVER_RELOAD)
    ?.result?.[0]

  const _burnt = useSingleCallResult(
    tokenContract ? tokenContract : null,
    'balanceOf',
    ['0x000000000000000000000000000000000000dEaD'],
    NEVER_RELOAD
  )?.result?.[0]

  const totalSupply = _totalSupply ? JSBI.BigInt(_totalSupply.toString()) : JSBI.BigInt(0)
  const burnt = _burnt ? JSBI.BigInt(_burnt.toString()) : JSBI.BigInt(0)

  const circulatingSupply = JSBI.subtract(totalSupply, burnt)

  const token = useToken(tokenContract.address)

  return useMemo(() => {
    if (!token) {
      return {
        totalSupply: '0',
        burnt: '0',
        circulatingSupply: '0',
      }
    }

    return {
      totalSupply: CurrencyAmount.fromRawAmount(token, totalSupply).toFixed(0),
      burnt: CurrencyAmount.fromRawAmount(token, burnt).toFixed(0),
      circulatingSupply: CurrencyAmount.fromRawAmount(token, circulatingSupply).toFixed(0),
    }
  }, [totalSupply, burnt, circulatingSupply, token])
}

export function useVaults() {
  return useSoulVaults(useSummonerContract())
}

export function usePricesApi() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useAsync(usePriceApi, true)
}

export function useFarmsApi() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useAsync(usePriceApi, true)
}

export function useSoulPrice() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return usePrice(useSoulFtmContract())
}

export function useETHrice() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return usePrice(useETHPairContract())
}

export function useVaultInfo(contract) {

  const soulPerSecond = useSingleCallResult(contract ? contract : null, 'soulPerSecond')?.result
  const totalAllocPoint = useSingleCallResult(contract ? contract : null, 'totalAllocPoint')?.result

  return useMemo(() => ({ soulPerSecond, totalAllocPoint }), [soulPerSecond, totalAllocPoint])
}

export function useSoulVaultInfo() {
  return useVaultInfo(useSummonerContract())
}
