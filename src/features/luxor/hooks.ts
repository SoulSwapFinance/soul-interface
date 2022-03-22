import { useLuxorBondContract } from 'hooks/useContract'
import { useMemo, useCallback } from 'react'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { CurrencyAmount, JSBI } from 'sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from 'services/web3'

export function useRemainingVesting() {
  const { account } = useActiveWeb3React()
  
  const contract = useLuxorBondContract()

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(account)]
  }, [account])

  const info = useSingleCallResult(args ? contract : null, 'bondInfo', args)?.result
  // const info = useSingleCallResult(args ? contract : null, 'userInfo', args)?.result
  const remainingVestingSeconds = info?.[1] // [pricePaid]
  const lastInteractionSecond = info?.[2] // [lastTime]

  const seconds =
    remainingVestingSeconds && lastInteractionSecond
      ? remainingVestingSeconds.add(lastInteractionSecond).toNumber() - new Date().getTime() / 1000
      : 0

  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)

  const dDisplay = d > 0 ? d + 'd' : ''
  const hDisplay = h > 0 ? h + 'h' : ''
  const mDisplay = m > 0 ? m + 'm' : ''

  return dDisplay + ' ' + hDisplay + ' ' + mDisplay
}

export function usePendingAmount(token) {
  const { account } = useActiveWeb3React()

  const contract = useLuxorBondContract()

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(account)]
  }, [account])

  // const info = useSingleCallResult(args ? contract : null, 'userInfo', args)?.result
  const info = useSingleCallResult(args ? contract : null, 'bondInfo', args)?.result
  const amount = info?.[0] // payout

  // const info2 = useSingleCallResult(args ? contract : null, 'claimablePayout', args)?.result
  const info2 = useSingleCallResult(args ? contract : null, 'pendingPayoutFor', args)?.result
  const amount2 = info2?.[0]

  return amount && amount2
    ? CurrencyAmount.fromRawAmount(token, amount.sub(amount2))
    : CurrencyAmount.fromRawAmount(token, JSBI.BigInt('0'))
}

export function useClaimableAmount(token) {
  const { account } = useActiveWeb3React()

  const contract = useLuxorBondContract()

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(account)]
  }, [account])

  // const info = useSingleCallResult(args ? contract : null, 'claimablePayout', args)?.result
  const info = useSingleCallResult(args ? contract : null, 'pendingPayoutFor', args)?.result
  const amount = info?.[0]

  return amount ? CurrencyAmount.fromRawAmount(token, amount) : CurrencyAmount.fromRawAmount(token, JSBI.BigInt('0'))
}

export function useBondContract() {
  const { account } = useActiveWeb3React()

  const contract = useLuxorBondContract()

  const deposit = useCallback(
    async (amount: BigNumber) => {
      try {
        let tx

        tx = await contract?.deposit(amount, {
          /*gasLimit: 500000*/
        })

        return tx
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, contract]
  )

  const luxorDeposit = useCallback(
    async (amount: BigNumber) => {
      try {
        let tx

        tx = await contract?.addLuxorToPay(amount, {
          /*gasLimit: 500000*/
        })

        return tx
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, contract]
  )

  const claim = useCallback(
    async (autoStake: boolean) => {
      try {
        let tx

        tx = await contract?.claim(autoStake, {
          /*gasLimit: 500000*/
        })

        return tx
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, contract]
  )

  return { deposit, claim, luxorDeposit }
}
