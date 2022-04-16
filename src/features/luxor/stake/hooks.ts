import { useLuxorStakeHelperContract, useLuxorStakingContract, useSorMasterContract } from '../../../hooks/useContract'
import { useMemo, useCallback } from 'react'
import { useSingleCallResult } from '../../../state/multicall/hooks'
import { CurrencyAmount, JSBI } from 'sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from 'services/web3/hooks'

export function useStakeClaimAmount(token) {
  const { account } = useActiveWeb3React()

  const contract = useSorMasterContract()

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(account)]
  }, [account])

  const info = useSingleCallResult(args ? contract : null, 'sorClaimAmount', args)?.result
  const amount = info?.[0]

  return amount ? CurrencyAmount.fromRawAmount(token, amount) : CurrencyAmount.fromRawAmount(token, JSBI.BigInt('0'))
}

export function useEpoch() {
  const contract = useLuxorStakingContract()
  const info = useSingleCallResult(contract, 'epoch')?.result
  const epoch = info?.[0]

  return epoch ? epoch : 400
}

export function useWarmupValue() {
  const { account } = useActiveWeb3React()
  const contract = useLuxorStakeHelperContract()

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(account)]
  }, [account])

  const info = useSingleCallResult(contract, 'warmupValue', args)?.result
  const warmupValue = info?.[0]

  return warmupValue ? warmupValue : 0
}

export function useStakeContract() {
  const { account } = useActiveWeb3React()

  const contract = useLuxorStakingContract()

  const stake = useCallback(
    async (amount: BigNumber) => {
      try {
        let tx

        tx = await contract?.stake(amount, account)
        return tx
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, contract]
  )

  const unstake = useCallback(
    async (amount: BigNumber) => {
      try {
        let tx

        tx = await contract?.unstake(amount, 0)

        return tx
      } catch (e) {
        console.error(e)
        return e
      }
  }, [account, contract])
  
  const claim = useCallback(
    async () => {
      try {
        let tx

        tx = await contract?.claim(account)

        return tx
      } catch (e) {
        console.error(e)
        return e
      }
  }, [account, contract])

  const forfeit = useCallback(
    async () => {
      try {
        let tx

        tx = await contract?.forfeit()

        return tx
      } catch (e) {
        console.error(e)
        return e
      }
  }, [account, contract])

  return { claim, forfeit, stake, unstake }
}
