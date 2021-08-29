import { ethers } from 'ethers'

import { useContract } from './useContract'

import IERC20 from '../constants/abis/soulswap/ERCs/IERC20.json'

const useApproveContract = () => {

  const erc20BalanceOf = async (tokenAddress, address) => {
    const contract = await useContract(tokenAddress, IERC20.abi)

    try {
      const result = await contract.balanceOf(address)
      return result
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  }

  const erc20Approve = async (tokenAddress, spender) => {
    const contract = await useContract(tokenAddress, IERC20.abi)

    try {
      const result = await contract.approve(
        spender,
        ethers.BigNumber.from(2).pow(ethers.BigNumber.from(256)).sub(ethers.BigNumber.from(1))
      )
      return result
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  }

  const erc20Allowance = async (tokenAddress, owner, spender) => {
    const contract = await useContract(tokenAddress, IERC20.abi)

    try {
      const result = await contract.allowance(owner, spender)
      return result
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  }

  return {
    erc20BalanceOf,
    erc20Approve,
    erc20Allowance,
  }
}

export default useApproveContract
