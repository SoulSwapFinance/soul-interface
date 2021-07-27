import { ChainId, CurrencyAmount, JSBI, MASTERCHEF_ADDRESS as MASTERCHEF_V1_ADDRESS } from '@sushiswap/sdk'
import { Chef, PairType } from './enum'
import { SOUL_SUMMONER_ADDRESS, MINICHEF_ADDRESS, SUSHI } from '../../constants'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from '../../state/multicall/hooks'
import { useCallback, useMemo } from 'react'
import { useMasterChefV1Contract, useSoulSummonerContract, useMiniChefContract } from '../../hooks'

import { Contract } from '@ethersproject/contracts'
import { Zero } from '@ethersproject/constants'
import concat from 'lodash/concat'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import zip from 'lodash/zip'
import { masterChefV1 } from '../../services/graph'

export function useChefContract(chef: Chef) {
  const masterChefV1Contract = useMasterChefV1Contract()
  const soulSummonerContract = useSoulSummonerContract()
  const miniChefContract = useMiniChefContract()
  const contracts = useMemo(
    () => ({
      [Chef.MASTERCHEF_V1]: masterChefV1Contract,
      [Chef.SOUL_SUMMONER]: soulSummonerContract,
      [Chef.MINICHEF]: miniChefContract,
    }),
    [masterChefV1Contract, soulSummonerContract, miniChefContract]
  )
  return useMemo(() => {
    return contracts[chef]
  }, [contracts, chef])
}

const CHEFS = {
  [ChainId.MAINNET]: [Chef.MASTERCHEF_V1, Chef.SOUL_SUMMONER],
  [ChainId.MATIC]: [Chef.MINICHEF],
}

export function useChefContracts(chefs: Chef[]) {
  const masterChefV1Contract = useMasterChefV1Contract()
  const soulSummonerContract = useSoulSummonerContract()
  const miniChefContract = useMiniChefContract()
  const contracts = useMemo(
    () => ({
      [Chef.MASTERCHEF_V1]: masterChefV1Contract,
      [Chef.SOUL_SUMMONER]: soulSummonerContract,
      [Chef.MINICHEF]: miniChefContract,
    }),
    [masterChefV1Contract, soulSummonerContract, miniChefContract]
  )
  return chefs.map((chef) => contracts[chef])
}

export function useUserInfo(farm, token) {
  const { account } = useActiveWeb3React()

  const contract = useChefContract(farm.chef)

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(farm.id), String(account)]
  }, [farm, account])

  const result = useSingleCallResult(args ? contract : null, 'userInfo', args)?.result

  const value = result?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined

  return amount ? CurrencyAmount.fromRawAmount(token, amount) : undefined
}

export function usePendingSushi(farm) {
  const { account, chainId } = useActiveWeb3React()

  const contract = useChefContract(farm.chef)

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(farm.id), String(account)]
  }, [farm, account])

  const result = useSingleCallResult(args ? contract : null, 'pendingSushi', args)?.result

  const value = result?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined

  return amount ? CurrencyAmount.fromRawAmount(SUSHI[chainId], amount) : undefined
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

export function useChefPositions(contract?: Contract | null, rewarder?: Contract | null) {
  const { account, chainId } = useActiveWeb3React()

  const numberOfPools = useSingleCallResult(contract ? contract : null, 'poolLength', undefined, NEVER_RELOAD)
    ?.result?.[0]

  const args = useMemo(() => {
    if (!account || !numberOfPools) {
      return
    }
    return [...Array(numberOfPools.toNumber()).keys()].map((pid) => [String(pid), String(account)])
  }, [numberOfPools, account])

  const pendingSushi = useSingleContractMultipleData(args ? contract : null, 'pendingSushi', args)

  const userInfo = useSingleContractMultipleData(args ? contract : null, 'userInfo', args)

  // const pendingTokens = useSingleContractMultipleData(
  //     rewarder,
  //     'pendingTokens',
  //     args.map((arg) => [...arg, '0'])
  // )

  const getChef = useCallback(() => {
    if (MASTERCHEF_V1_ADDRESS[chainId] === contract.address) {
      return Chef.MASTERCHEF_V1
    } else if (SOUL_SUMMONER_ADDRESS[chainId] === contract.address) {
      return Chef.SOUL_SUMMONER
    } else if (MINICHEF_ADDRESS[chainId] === contract.address) {
      return Chef.MINICHEF
    }
  }, [chainId, contract])

  return useMemo(() => {
    if (!pendingSushi || !userInfo) {
      return []
    }
    return zip(pendingSushi, userInfo)
      .map((data, i) => ({
        id: args[i][0],
        pendingSushi: data[0].result?.[0] || Zero,
        amount: data[1].result?.[0] || Zero,
        chef: getChef(),
        // pendingTokens: data?.[2]?.result,
      }))
      .filter(({ pendingSushi, amount }) => {
        return (pendingSushi && !pendingSushi.isZero()) || (amount && !amount.isZero())
      })
  }, [args, getChef, pendingSushi, userInfo])
}

export function usePositions() {
  const [masterChefPositions, miniChefPositions] = [
    useChefPositions(useMasterChefV1Contract()),
    useChefPositions(useSoulSummonerContract()),
    useChefPositions(useMiniChefContract()),
  ]
  return concat(masterChefPositions, miniChefPositions)
}
