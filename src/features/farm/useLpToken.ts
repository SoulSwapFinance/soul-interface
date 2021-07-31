import { useActiveWeb3React } from '../../hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { useCallback } from 'react'
import { usePairContract } from '../../hooks/useContract'
import { MaxUint256 } from '@ethersproject/constants'

export default function useLpToken({ lpTokenAddress }) {
  const { account } = useActiveWeb3React()
  const pairContract = usePairContract(lpTokenAddress)

  // Approve - using maxUint to only do once per lpToken
  const approve = useCallback(async () => {
    try {
      return await pairContract?.approve(lpTokenAddress, MaxUint256)
    } catch (e) {
      console.log(e)
      alert('approve error')
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

  return { approve, allowance }
}
