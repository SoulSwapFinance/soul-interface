import { ethers } from 'ethers'

import { useTokenContract } from './useContract'

function useApproveContract(tokenAddress) {
  const contract = useTokenContract(tokenAddress)

  const erc20BalanceOf = async (address) => {
    try {
      const result = await contract.balanceOf(address)
      return result
    } catch (e) {
      console.log(e)
      // alert(e.message)
    }
  }

  const erc20Approve = async (spender) => {
    try {
      const result = await contract.approve(
        spender,
        ethers.BigNumber.from(2).pow(ethers.BigNumber.from(255)).sub(ethers.BigNumber.from(1))
      )
      return result
    } 
    catch (e) {
      console.log(e)
      // alert(e.message)
    }
  }

  const erc20Allowance = async (owner, spender) => {
    try {
      const result = await contract.allowance(owner, spender)
      // console.log('allowance for user', result)
      return result
    } catch (e) {
      console.log(e)
      // alert(e.message)
    }
  }

  return {
    erc20BalanceOf,
    erc20Approve,
    erc20Allowance,
  }
}

export default useApproveContract
