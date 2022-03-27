import { useCallback, useMemo } from 'react'
import { useLaunchpadContract } from '../../hooks'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from '../../state/multicall/hooks'
import { zip, chunk } from 'lodash'
import { BigNumber } from 'ethers'
import { calculateGasPrice } from '../../functions'
import { useActiveWeb3React } from 'services/web3'

export function useLaunchpadUserInfo(contractAddress?: string) {
  const { account } = useActiveWeb3React()
  const contract = useLaunchpadContract(contractAddress, true)

  // const eligible = useSingleCallResult(account ? (contract ? contract : null) : null, 'getUserEligibility', [account])
    // ?.result?.[0]

  const multiplier = useSingleCallResult(contract ? contract : null, 'getUserMultiplier', [account])?.result?.[0]

  const numberPools = useSingleCallResult(contract ? contract : null, 'numberPools', undefined)?.result?.[0]

  const harvestPeriods = useSingleCallResult(contract ? contract : null, 'HARVEST_PERIODS')?.result?.[0]

  const args = useMemo(() => {
    if (!account || !numberPools) {
      return
    }
    return [account, [...Array(parseInt(numberPools.toString())).keys()]]
  }, [numberPools, account])

  const args2 = useMemo(() => {
    if (!account || !numberPools) {
      return
    }
    return [...Array(parseInt(numberPools.toString())).keys()].map((pid) => [String(account), String(pid)])
  }, [numberPools, account])

  const args3 = useMemo(() => {
    if (!account || !numberPools || !harvestPeriods) {
      return
    }
    let result = []
    for (let i = 0; i < +numberPools; i++) {
      for (let j = 0; j < +harvestPeriods; j++) {
        result.push([String(account), String(i), String(j)])
      }
    }
    return result
  }, [account, numberPools, harvestPeriods])

  const userAllocationPools = useSingleCallResult(args ? contract : null, 'viewUserAllocationPools', args)

  const userInfo = useSingleContractMultipleData(args2 ? contract : null, 'userInfo', args2)

  const claimed = useSingleContractMultipleData(args3 ? contract : null, 'hasHarvested', args3)

  return useMemo(
    () => ({
      // eligible,
      multiplier,
      pools: zip(userInfo).map((data, i) => ({
        id: args2[i][1],
        amount: data[0].result?.[`amount`] || 0,
        allocPoints: data[0].result?.[`allocPoints`] || 0,
        claimed: chunk(claimed, harvestPeriods)[i].map((claim) => claim?.result?.[0]),
        isRefunded: data[0].result?.[`isRefunded`] || false,
        allocation: userAllocationPools?.result?.[0]?.[i],
      })),
    }),
    [multiplier, userAllocationPools, userInfo, args2, claimed, harvestPeriods] // eligible
  )
}

export function useLaunchInfo(contractAddress?: string) {
  const contract = useLaunchpadContract(contractAddress)

  const startTime = useSingleCallResult(contract ? contract : null, 'startTimestamp')?.result?.[0]

  const endTime = useSingleCallResult(contract ? contract : null, 'endTimestamp')?.result?.[0]

  const eligibilityThreshold = useSingleCallResult(contract ? contract : null, 'eligibilityThreshold')?.result?.[0]

  const claimEnabled = useSingleCallResult(contract ? contract : null, 'claimEnabled')?.result?.[0]

  const harvestPeriods = useSingleCallResult(contract ? contract : null, 'HARVEST_PERIODS')?.result?.[0]

  const args = useMemo(() => {
    if (!harvestPeriods) {
      return
    }
    return [...Array(parseInt(harvestPeriods.toString())).keys()].map((period) => [String(period)])
  }, [harvestPeriods])

  const harvestReleaseTimes = useSingleContractMultipleData(args ? contract : null, 'harvestReleaseTimestamps', args)
  const harvestReleasePercent = useSingleContractMultipleData(args ? contract : null, 'harvestReleasePercent', args)

  return useMemo(
    () => ({
      harvestReleaseTimes: zip(harvestReleaseTimes).map((data, i) => data[0].result?.[0]),
      harvestReleasePercent: zip(harvestReleasePercent).map((data, i) => data[0].result?.[0]),
      startTime,
      endTime,
      eligibilityThreshold,
      claimEnabled,
    }),
    [harvestReleaseTimes, harvestReleasePercent, startTime, endTime, eligibilityThreshold, claimEnabled]
  )
}

export function useLaunchPools(contractAddress?: string) {
  const contract = useLaunchpadContract(contractAddress)

  const numberPools = useSingleCallResult(contract ? contract : null, 'numberPools', undefined, NEVER_RELOAD)
    ?.result?.[0]

  const args = useMemo(() => {
    if (!numberPools) {
      return
    }
    return [...Array(parseInt(numberPools.toString())).keys()].map((pid) => [String(pid)])
  }, [numberPools])

  const poolInfo = useSingleContractMultipleData(args ? contract : null, 'poolInfo', args)

  return useMemo(() => {
    if (!poolInfo) {
      return []
    }
    return zip(poolInfo).map((data, i) => ({
      id: args[i][0],
      raisingAmount: data[0].result?.['raisingAmount'] || 0,
      offeringAmount: data[0].result?.['offeringAmount'] || 0,
      baseLimitInLP: data[0].result?.['baseLimitInLP'] || 0,
      hasTax: data[0].result?.['hasTax'] || false,
      totalAmountPool: data[0].result?.['totalAmountPool'] || 0,
      sumTaxesOverflow: data[0].result?.['sumTaxesOverflow'] || 0,
      totalAllocPoints: data[0].result?.['totalAllocPoints'] || 0,
    }))
  }, [args, poolInfo])
}

export function useLaunchpad(contractAddress?: string) {
  const contract = useLaunchpadContract(contractAddress)
  const { chainId, account, library } = useActiveWeb3React()

  // Deposit
  const deposit = useCallback(
    async (amount: BigNumber, pid: number) => {
      try {
        return await contract?.depositPool(amount.toString(), pid)
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  // Withdraw
  const withdraw = useCallback(
    async (amount: BigNumber, pid: number) => {
      try {
        return await contract?.withdrawPool(amount.toString(), pid)
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  const harvest = useCallback(
    async (pid: number, period: number) => {
      const getGasPrice = async () => {
        let gasPrice = undefined
        try {
          gasPrice = await library.getGasPrice()
          if (gasPrice) {
            gasPrice = calculateGasPrice(gasPrice)
          }
        } catch (ex) {}
        return gasPrice
      }
      try {
        const gasPrice = await getGasPrice()
        return await contract?.harvestPool(pid, period, { gasPrice })
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  return { deposit, withdraw, harvest }
}
