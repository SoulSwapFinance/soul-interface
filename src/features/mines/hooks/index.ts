import { Zero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import {
  CurrencyAmount,
  JSBI
} from 'sdk'
import { useSummonerContract } from 'hooks/useContract'
import { useActiveWeb3React } from 'services/web3'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from 'state/multicall/hooks'
import zip from 'lodash/zip'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Chef } from '../enum'
import { SOUL } from '../../../constants'

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

  const value = result?.[0]
  // const harvestValue = result?.[3]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined

  return amount ? CurrencyAmount.fromRawAmount(token, amount) : undefined
}

// export function useUserInfo(farm, token) {
//   const { account } = useActiveWeb3React()

//   const contract = useSummonerContract(farm.chef)

//   const args = useMemo(() => {
//     if (!account) {
//       return
//     }
//     return [String(farm.id), String(account)]
//   }, [farm, account])

//   const result = useSingleCallResult(args ? contract : null, 'userInfo', args)?.result

//   const value = result?.[0]

//   const amount = value ? JSBI.BigInt(value.toString()) : undefined

//   return amount ? CurrencyAmount.fromRawAmount(token, amount) : undefined
// }

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

  return amount ? CurrencyAmount.fromRawAmount(SOUL[chainId], amount) : undefined
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

export function useChefPositions(contract?: Contract | null, rewarder?: Contract | null, chainId = undefined) {
  const { account } = useActiveWeb3React()

  const numberOfPools = useSingleCallResult(contract ? contract : null, 'poolLength', undefined, NEVER_RELOAD)
    ?.result?.[0]

  const args = useMemo(() => {
    if (!account || !numberOfPools) {
      return
    }
    return [...Array(numberOfPools.toNumber()).keys()].map((pid) => [String(pid), String(account)])
  }, [numberOfPools, account])

  const pendingSoul = useSingleContractMultipleData(args ? contract : null, 'pendingSoul', args)

  const userInfo = useSingleContractMultipleData(args ? contract : null, 'userInfo', args)

  // const pendingTokens = useSingleContractMultipleData(
  //     rewarder,
  //     'pendingTokens',
  //     args.map((arg) => [...arg, '0'])
  // )

  return useMemo(() => {
    if (!pendingSoul || !userInfo) {
      return []
    }
    return zip(pendingSoul, userInfo)
      .map((data, i) => ({
        id: args[i][0],
        pendingSoul: data[0].result?.[0] || Zero,
        amount: data[1].result?.[0] || Zero,
      }))
      .filter(({ pendingSoul, amount }) => {
        return (pendingSoul && !pendingSoul.isZero()) || (amount && !amount.isZero())
      })
  }, [args, pendingSoul, userInfo])
}

export function useSoulPositions(contract?: Contract | null) {
  const { account } = useActiveWeb3React()

  const numberOfPools = useSingleCallResult(contract ? contract : null, 'poolLength')?.result

  const args = useMemo(() => {
    if (!account || !numberOfPools) {
      return
    }
    return [...Array(Number(numberOfPools)).keys()].map((pid) => [String(pid), String(account)])
  }, [numberOfPools, account])

  const pendingSoul = useSingleContractMultipleData(args ? contract : null, 'pendingSoul', args)
  const userInfo = useSingleContractMultipleData(args ? contract : null, 'userInfo', args)

  return useMemo(() => {
    if (!pendingSoul || !userInfo) {
      return []
    }
    return zip(pendingSoul, userInfo)
      .map((data, i) => ({
        id: args[i][0],
        pendingSoul: data[0].result?.[0] || Zero,
        amount: data[1].result?.[0] || Zero,
      }))
      .filter(({ pendingSoul, amount }) => {
        return (pendingSoul && !pendingSoul.isZero()) || (amount && !amount.isZero())
      })
  }, [args, pendingSoul, userInfo])
}

export function usePositions() {
  return useSoulPositions(useSummonerContract())
}

export function useSoulFarms(contract?: Contract | null) {
  // const { chainId, account } = useActiveWeb3React()

  const numberOfPools = useSingleCallResult(contract ? contract : null, 'poolLength', undefined, NEVER_RELOAD)?.result?.[0]

  const args = useMemo(() => {
    if (!numberOfPools) {
      return
    }
    return [...Array(numberOfPools.toNumber()).keys()].map((pid) => [String(pid)])
  }, [numberOfPools])

  const poolInfo = useSingleContractMultipleData(args ? contract : null, 'poolInfo', args)

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
      totalLp: data[0].result?.['totalLp'] || '',
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
    }, 60000)

    if (immediate) {
      execute()
    }

    return () => {
      clearInterval(intervalId) // This is important
    }
  }, [execute, immediate])

  return useMemo(() => {
    return value
  }, [value])
}
