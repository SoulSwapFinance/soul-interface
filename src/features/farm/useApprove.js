import { ethers } from 'ethers'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useTokenContract } from '../../hooks/useContract'

const useApproveContract = () => {
  const { account } = useActiveWeb3React()

  const erc20BalanceOf = async (tokenAddress, address) => {
    try {
      const contract = await useTokenContract(tokenAddress)
      const result = await contract.connect(account).balanceOf(address)
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
        .connect(account)
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
      const result = await contract.connect(account).allowance(owner, spender)
      console.log('allowance', account, result)
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
