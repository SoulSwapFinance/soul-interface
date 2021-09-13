import { ethers } from 'ethers'

import { useTokenContract } from '../../hooks/useContract'

const useApproveContract = () => {
  const { address, signer } = Connection.useContainer()

  const erc20BalanceOf = async (tokenAddress, address) => {
    try {
      const contract = await useTokenContract(tokenAddress)
      const result = await contract.connect(signer).balanceOf(address)
      return result
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  }

  const erc20Approve = async (tokenAddress, spender) => {
    const contract = await useTokenContract(tokenAddress)

    try {
      const result = await contract
        .connect(signer)
        .approve(spender, ethers.BigNumber.from(2).pow(ethers.BigNumber.from(255)).sub(ethers.BigNumber.from(1)))
      return result
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  }

  const erc20Allowance = async (tokenAddress, owner, spender) => {
    const contract = await useTokenContract(tokenAddress)

    try {
      const result = await contract.connect(signer).allowance(owner, spender)
      console.log('allowance', address, result)
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
