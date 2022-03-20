import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useAutoStakeContract, useSoulSummonerContract } from 'hooks/useContract'
import { useMemo, useCallback, useState } from 'react'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { CurrencyAmount, JSBI, SOUL } from 'sdk'
import { BigNumber } from '@ethersproject/bignumber'

function soulFromShares(shares: BigNumber, sharePrice: BigNumber) {
  const DECIMALS = BigNumber.from(10).pow(18)
  return shares.mul(sharePrice).div(DECIMALS)
}

function sharesFromSoul(amount: BigNumber, sharePrice: BigNumber) {
  const DECIMALS = BigNumber.from(10).pow(18)
  return amount.mul(DECIMALS).div(sharePrice)
}

export function useStakeUserInfo(token) {
  const { account } = useActiveWeb3React()
  const contract = useAutoStakeContract()

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(account)]
  }, [account])

  const info = useSingleCallResult(args ? contract : null, 'balanceOf', args)?.result
  const shares = info?.[0]
  const info2 = useSingleCallResult(contract, 'getPricePerFullShare')?.result
  const sharePrice = info2?.[0]

  const amount = shares && sharePrice ? JSBI.BigInt(soulFromShares(shares, sharePrice).toString()) : undefined

  return amount ? CurrencyAmount.fromRawAmount(token, amount) : CurrencyAmount.fromRawAmount(token, JSBI.BigInt('0'))
}

export function useStakeSharePrice() {
  const contract = useAutoStakeContract()
  const info2 = useSingleCallResult(contract, 'getPricePerFullShare')?.result
  const sharePrice = info2?.[0]

  return sharePrice ? sharePrice : undefined
}

export function useStakeRecentProfit(token) {
  const { account } = useActiveWeb3React()

  const contract = useAutoStakeContract()

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(account)]
  }, [account])

  const info = useSingleCallResult(args ? contract : null, 'balanceOf', args)?.result
  const shares = info?.[0]
  const info2 = useSingleCallResult(contract, 'getPricePerFullShare')?.result
  const sharePrice = info2?.[0]

  const amount = shares && sharePrice ? soulFromShares(shares, sharePrice) : undefined
  const info3 = useSingleCallResult(args ? contract : null, 'userInfo', args)?.result
  const oldAmount = info3?.[1]

  return amount && oldAmount
    ? CurrencyAmount.fromRawAmount(token, JSBI.BigInt(amount.sub(oldAmount).toString()))
    : CurrencyAmount.fromRawAmount(token, JSBI.BigInt('0'))
}

export function useStakeContract() {
  const { account } = useActiveWeb3React()

  const contract = useAutoStakeContract()

  // Deposit
  const deposit = useCallback(
    async (amount: BigNumber) => {
      try {
        let tx

        tx = await contract?.deposit(account, amount, {
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

  // Withdraw
  const withdraw = useCallback(
    async (amount: BigNumber, sharePrice: BigNumber) => {
      try {
        let tx
        let shares = sharesFromSoul(amount, sharePrice)

        tx = await contract?.withdraw(shares, {
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
  return { deposit, withdraw }
}
