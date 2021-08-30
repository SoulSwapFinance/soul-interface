import { useCallback } from 'react'
import { ethers } from 'ethers'
import { useContract } from '../../hooks/useContract'

import IERC20 from '../../constants/abis/soulswap/ERCs/IERC20.json'

function useApproveContract() {
  const erc20BalanceOf = useCallback(async (tokenAddress, address) => {
    try {
      const contract = await useContract(tokenAddress, IERC20.abi)
      const result = await contract.balanceOf(address)
      return result
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  })

  const erc20Approve = useCallback(async (tokenAddress, spender) => {
    try {
      const contract = await useContract(tokenAddress, IERC20.abi)
      const result = await contract.approve(
        spender,
        ethers.BigNumber.from(2).pow(ethers.BigNumber.from(256)).sub(ethers.BigNumber.from(1))
      )
      return result
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  })

  const erc20Allowance = useCallback(async (tokenAddress, owner, spender) => {
    try {
      const contract = await useContract(tokenAddress, IERC20.abi)
      const result = await contract.allowance(owner, spender)
      return result
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  })

  return {
    erc20BalanceOf,
    erc20Approve,
    erc20Allowance,
  }
}

export default useApproveContract
