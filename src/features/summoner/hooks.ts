import { CurrencyAmount, JSBI, SOUL_ADDRESS, SOUL_SUMMONER_ADDRESS } from '../../sdk'
import { Chef } from './enum'
import { SOUL  } from '../../constants'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from '../../state/multicall/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useSoulSummonerContract,
  useETHPairContract,
  useSoulFtmContract,
  useSoulVaultContract,
  useSeanceUsdcContract,
  useFtmUsdcContract,
  useSoulUsdcContract,
  // useSpellSeanceContract,
} from '../../hooks'

import { Contract } from '@ethersproject/contracts'
import { Zero } from '@ethersproject/constants'
import { useActiveWeb3React } from 'services/web3'
import zip from 'lodash/zip'
import { useToken } from '../../hooks/Tokens'
import { usePriceHelperContract } from '../bond/hooks/useContract'
import { formatCurrency } from '../../modals/TokensStatsModal'
import { usePriceApi } from '../vault/hooks'
// import useSummoner from './useSummoner'
const { default: axios } = require('axios')

export function useSummonerContract(chef: Chef) {
  const soulSummonerContract = useSoulSummonerContract()
  const contracts = useMemo(
    () => ({
      [Chef.SUMMONER]: soulSummonerContract    
    }),
    [soulSummonerContract]
  )
  return useMemo(() => {
    return contracts[chef]
  }, [contracts, chef])
}

export function useSummonerContracts(chefs: Chef[]) {
  const soulSummonerContract = useSoulSummonerContract()
  const contracts = useMemo(
    () => ({
      [Chef.SUMMONER]: soulSummonerContract,
    }),
    [soulSummonerContract]
  )
  return chefs.map((chef) => contracts[chef])
}

export function useUserInfo(farm, token) {
  const { account } = useActiveWeb3React()

  const contract = useSummonerContract(0)

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(farm.id), String(account)]
  }, [farm, account])

  const result = useSingleCallResult(args ? contract : null, 'userInfo', args)?.result

  const value = result?.[0]
  const harvestValue = result?.[3]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined
  // const nextHarvestUntil = harvestValue ? JSBI.BigInt(harvestValue.toString()) : undefined

  return {
    amount: amount ? CurrencyAmount.fromRawAmount(token, amount) : undefined,
    // nextHarvestUntil: nextHarvestUntil ? JSBI.toNumber(nextHarvestUntil) * 1000 : undefined,
  }
}

export function usePendingSoul(farm) {
  const { account, chainId } = useActiveWeb3React()

  const contract = useSummonerContract(0)

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

export function useSoulPositions(contract?: Contract | null) {
  const { account } = useActiveWeb3React()

  const numberOfPools = useSingleCallResult(contract ? contract : null, 'poolLength')?.result

  const args = useMemo(() => {
    if (!account || !numberOfPools) {
      return
    }
    // return [...Array(numberOfPools).keys()].map((pid) => [String(pid), String(account)])
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
  return useSoulPositions(useSoulSummonerContract())
}

export function useSoulFarms(contract?: Contract | null) {
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
      // harvestInterval: data[0].result?.['harvestInterval'] || '',
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

// export function usePriceApi() {
//   return Promise.all([axios.get('/api/priceusd/')])
// }

export function usePrice(pairContract?: Contract | null, pairDecimals?: number | null, invert: boolean = false) {
  const result = useSingleCallResult(pairContract ? pairContract : null, 'getReserves', undefined, NEVER_RELOAD)?.result

  const _reserve1 = invert ? result?.['reserve0'] : result?.['reserve1']
  const _reserve0 = invert ? result?.['reserve1'] : result?.['reserve0']

  const price = _reserve1 ? (Number(_reserve1) / Number(_reserve0)) * (pairDecimals ? 10 ** pairDecimals : 1) : 0

  return price
}

export function useTokenInfo(tokenContract?: Contract | null) {
  // const vaults = useVaults()

  const _totalSupply = useSingleCallResult(tokenContract ? tokenContract : null, 'totalSupply')?.result

  const _burnt = useSingleCallResult(
    tokenContract ? tokenContract : null,
    'balanceOf',
    ['0x000000000000000000000000000000000000dEaD'],
    NEVER_RELOAD
  )?.result?.[0]

  let lockedInVaults = JSBI.BigInt(0)

  // vaults
  //   .filter((r) => r.lockupDuration > 0)
  //   .forEach((r) => {
  //     lockedInVaults = JSBI.add(lockedInVaults, JSBI.BigInt(r.totalLp.toString())) // TODO: fix
  //   })

  const totalSupply = _totalSupply ? JSBI.BigInt(_totalSupply.toString()) : JSBI.BigInt(0)
  const burnt = _burnt ? JSBI.BigInt(_burnt.toString()) : JSBI.BigInt(0)

  const circulatingSupply = JSBI.subtract(JSBI.subtract(totalSupply, burnt), lockedInVaults)

  const token = useToken(tokenContract?.address)

  return useMemo(() => {
    if (!token) {
      return {
        totalSupply: '0',
        burnt: '0',
        circulatingSupply: '0',
        lockedInVaults: '0',
      }
    }

    return {
      totalSupply: CurrencyAmount.fromRawAmount(token, totalSupply).toFixed(0),
      burnt: CurrencyAmount.fromRawAmount(token, burnt).toFixed(0),
      vaults: CurrencyAmount.fromRawAmount(token, lockedInVaults).toFixed(0),
      circulatingSupply: CurrencyAmount.fromRawAmount(token, circulatingSupply).toFixed(0),
    }
  }, [totalSupply, burnt, circulatingSupply, token, lockedInVaults])
}

export function useFarms() {
  return useSoulFarms(useSoulSummonerContract())
}

export function usePricesApi() {
  // const ftmPrice = useFantomPrice()
  // const soulPrice = useSoulPrice()
  // const seancePrice = useSeancePrice()

  const priceHelperContract = usePriceHelperContract()

  // SOUL PRICE
  const rawSoulPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'])?.result
  console.log(Number(rawSoulPrice))
  const soulPrice = formatCurrency(Number(rawSoulPrice) / 1E18, 3)
  console.log(soulPrice)

  // FTM PRICE
  const rawFtmPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'])?.result
  console.log(Number(rawFtmPrice))
  const ftmPrice = formatCurrency(Number(rawFtmPrice) / 1E18, 2)
  console.log(ftmPrice)
  
  // SEANCE PRICE
  const rawSeancePrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x124B06C5ce47De7A6e9EFDA71a946717130079E6'])?.result
  console.log(Number(rawSeancePrice))
  const seancePrice = formatCurrency(Number(rawSeancePrice) / 1E18, 3)
  console.log(seancePrice)

  return useMemo(() => {
    return {
      ftm: Number(rawFtmPrice) / 1E18,
      soul: Number(rawSoulPrice) / 1E18,
      seance: Number(rawSeancePrice) / 1E18,
      usdc: 1,
    }
  }, [ftmPrice, soulPrice, seancePrice])
}

export function useFarmsApi() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useAsync(usePriceApi, true)
}

export function useFantomPrice() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return usePrice(useFtmUsdcContract(), 12)
}

export function useSeancePrice() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return usePrice(useSeanceUsdcContract(), 12)

}

export function useSoulPrice() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return usePrice(useSoulUsdcContract())
}

export function useETHPrice() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return usePrice(useETHPairContract())
}

export function useSoulSummonerInfo(contract) {
  const soulPerSecond = useSingleCallResult(contract ? contract : null, 'soulPerSecond')?.result
  const totalAllocPoint = useSingleCallResult(contract ? contract : null, 'totalAllocPoint')?.result

  return useMemo(() => ({ soulPerSecond, totalAllocPoint }), [soulPerSecond, totalAllocPoint])
}

export function useSummonerInfo() {
  return useSoulSummonerInfo(useSoulSummonerContract())
}
