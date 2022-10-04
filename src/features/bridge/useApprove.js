import { useCallback } from 'react'
import { ethers } from 'ethers'
import { useTokenContract } from 'hooks/useContract'

function useApproveContract(tokenAddress) {
  const contract = useTokenContract(tokenAddress)

  const erc20BalanceOf = useCallback(async (address) => {
    try {
      const result = await contract.balanceOf(address)
      return result
    } catch (e) {
      console.log(e)
      alert(e.message)
      return e
    }
  })

  const erc20Approve = useCallback(async (spender) => {
    try {
      const result = await contract.approve(
        spender,
        ethers.BigNumber.from(2).pow(ethers.BigNumber.from(256)).sub(ethers.BigNumber.from(1))
      )
      return result
    } catch (e) {
      console.log(e)
      alert(e.message)
      return e
    }
  })

  const erc20Allowance = useCallback(async (owner, spender) => {
    try {
      const result = await contract.allowance(owner, spender)
      return result
    } catch (e) {
      console.log(e)
      alert(e.message)
      return e
    }
  })

  return {
    erc20BalanceOf,
    erc20Approve,
    erc20Allowance,
  }
}

export default useApproveContract
