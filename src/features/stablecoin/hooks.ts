import { useSorMasterContract } from '../../hooks/useContract'
import { useMemo, useCallback } from 'react'
import { useSingleCallResult } from '../../state/multicall/hooks'
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

export function useRedeemClaimAmount(token) {
  const { account } = useActiveWeb3React()

  const contract = useSorMasterContract()

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(account)]
  }, [account])

  const info = useSingleCallResult(args ? contract : null, 'daiClaimAmount', args)?.result
  const amount = info?.[0]

  return amount ? CurrencyAmount.fromRawAmount(token, amount) : CurrencyAmount.fromRawAmount(token, JSBI.BigInt('0'))
}

export function useSorContract() {
  const { account } = useActiveWeb3React()

  const contract = useSorMasterContract()

  const stake = useCallback(
    async (amount: BigNumber) => {
      try {
        let tx

        tx = await contract?.stake(amount, BigNumber.from(0), BigNumber.from(0))
          // gasLimit: 500000
        // })

        return tx
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, contract]
  )

  const redeem = useCallback(
    async (amount: BigNumber) => {
      try {
        let tx

        tx = await contract?.redeem(amount)

        return tx
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, contract]
  )

  const claimSor = useCallback(async () => {
    try {
      let tx

      tx = await contract?.claimSor()

      return tx
    } catch (e) {
      console.error(e)
      return e
    }
  }, [account, contract])

  const claimDai = useCallback(async () => {
    try {
      let tx

      tx = await contract?.claimDai(BigNumber.from(0), BigNumber.from(0))

      return tx
    } catch (e) {
      console.error(e)
      return e
    }
  }, [account, contract])

  return { stake, redeem, claimSor, claimDai }
}
