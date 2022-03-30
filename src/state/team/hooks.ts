import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ChainId, Currency, CurrencyAmount, JSBI, Token } from '../../sdk'
import { MERKLE_ROOT, SOUL } from './../../constants/index'
import { getAddress, isAddress } from '@ethersproject/address'

import { TransactionResponse } from '@ethersproject/providers'
import { calculateGasMargin } from '../../functions/trade'
import { useActiveWeb3React } from 'services/web3'
import { useTeamContract } from '../../hooks/useContract'
import { useSingleCallResult } from '../multicall/hooks'
import { useTransactionAdder } from '../transactions/hooks'
import { BigNumber } from '@ethersproject/bignumber'

export function claimableAmount(index) {
  const { account } = useActiveWeb3React()
  const contract = useTeamContract()

  // const args = useMemo(() => {
  //   if (!account) {
  //     return
  //   }
  //   return [String(account)]
  // }, [account])

  const info = useSingleCallResult(contract, 'userBalance', index)
  const amount = info.toString()

  return amount ? CurrencyAmount.fromRawAmount(SOUL[250], amount) : CurrencyAmount.fromRawAmount(SOUL[250], JSBI.BigInt('0'))
}


export function useClaim() {
  const { account } = useActiveWeb3React()
  const contract = useTeamContract()

  const claim = useCallback(
    async (index) => {
      try {
        let tx

        tx = await contract?.release(0)

        return tx
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [account, contract]
  )

  return { claim }
}
