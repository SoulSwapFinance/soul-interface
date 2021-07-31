import { useActiveWeb3React } from '../../hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { useCallback } from 'react'
import { usePairContract } from '../../hooks/useContract'
import { MaxUint256 } from '@ethersproject/constants'

export default function useLpToken(lpTokenAddress, soulSummoner) {
  const { account } = useActiveWeb3React()
  const pairContract = usePairContract(lpTokenAddress)

  // Approve
  const approve = useCallback(async () => {
    try {
      // hard-coded soulsummoner for now
      const result = await pairContract.approve('0xA65DbEA56E1E202bf03dB5f49ba565fb00Bf9288', MaxUint256)
      return result
    } catch (e) {
      console.log(e)
      alert(e.message)
      return e
    }
  }, [account, pairContract])

  // Allowance
  const allowance = useCallback(
    async (owner: string) => {
      try {
        const amount = await pairContract?.allowance(owner, lpTokenAddress)
        return amount
      } catch (e) {
        console.log(e)
        alert('allowance error')
        return e
      }
    },
    [account, pairContract]
  )

  // Allowance
  const balanceOf = useCallback(async () => {
    try {
      const amount = await pairContract?.balanceOf(account)
      return amount
    } catch (e) {
      console.log(e)
      alert('allowance error')
      return e
    }
  }, [account, pairContract])

  return { approve, allowance, balanceOf }
}
