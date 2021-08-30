import { useActiveWeb3React } from '../../hooks'
import { ethers } from 'ethers'
import { useCallback } from 'react'
import { usePairContract } from '../../hooks/useContract'

export default function useLpToken(lpTokenAddress) {
  const { account } = useActiveWeb3React()
  const pairContract = usePairContract(lpTokenAddress)

  // Approve
  const approve = useCallback(async () => {
    try {
      // hard-coded soulsummoner for now (approving summoner to move lp tokens)
      const result = await pairContract.approve(
        '0xA65DbEA56E1E202bf03dB5f49ba565fb00Bf9288',
        ethers.BigNumber.from(2).pow(ethers.BigNumber.from(256)).sub(ethers.BigNumber.from(1))
      )
      return result
    } catch (e) {
      console.log(e)
      alert(e.message)
      return e
    }
  }, [lpTokenAddress, pairContract])

  // Allowance
  const allowance = useCallback(
    async (spender: string) => {
      try {
        const amount = await pairContract?.allowance(account, '0xA65DbEA56E1E202bf03dB5f49ba565fb00Bf9288')
        return amount
      } catch (e) {
        console.log(e)
        alert('allowance error')
        return e
      }
    },
    [lpTokenAddress, pairContract]
  )

  // Allowance
  const balanceOf = useCallback(async () => {
    try {
      const amount = await pairContract?.balanceOf(account)
      return amount.toString()
    } catch (e) {
      console.log(e)
      alert('allowance error')
      return e
    }
  }, [account, pairContract])

  return { approve, allowance, balanceOf }
}
