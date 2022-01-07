import { ethers } from 'ethers'

import { useActiveWeb3React } from '../../../hooks/useActiveWeb3React'
import { useContract } from '../../../hooks/useContract'

import IERC20 from '../../../constants/abis/soulswap/ERCs/IERC20.json'
import IERC777 from '../../../constants/abis/soulswap/ERCs/IERC777.json'
import IERC721 from '../../../constants/abis/soulswap/ERCs/IERC721.json'
import IERC1155 from '../../../constants/abis/soulswap/ERCs/IERC1155.json'

const useApproveContract = () => {
  const { account, chainId } = useActiveWeb3React()

  // --------------------
  //  ERC 20
  // --------------------

  const erc20BalanceOf = async (tokenAddress, address) => {
    try {
      const contract = await useContract(tokenAddress, IERC20.abi, false)
      const result = await contract?.balanceOf(address)
      return result
    } catch (e) {
      console.log(e)
    }
  }

  const erc20Approve = async (tokenAddress, spender) => {
    try {
      const contract = await useContract(tokenAddress, IERC20.abi, false)
      const result = await contract
        ?.connect(account)
        .approve(spender, ethers.BigNumber.from(2).pow(ethers.BigNumber.from(255)).sub(ethers.BigNumber.from(1)))
      return result
    } catch (e) {
      console.log(e)
    }
  }

  const erc20Allowance = async (tokenAddress, owner, spender) => {
    try {
      const contract = await useContract(tokenAddress, IERC20.abi, false)
      const result = await contract?.allowance(owner, spender)
      console.log('allowance', result)
      return result
    } catch (e) {
      console.log(e)
    }
  }

  // --------------------
  //  ERC 777
  // --------------------

  const erc777IsOperatorFor = async (tokenAddress, operator, tokenHolder) => {
    try {
      const contract = await useContract(tokenAddress, IERC777.abi, false)
      const result = await contract?.isOperatorFor(operator, tokenHolder)
      return result
    } catch (e) {
      console.log(e)
    }
  }

  /// @dev Make an account an operator of the caller.
  const erc777AuthorizeOperator = async (tokenAddress, operator) => {
    try {
      const contract = await useContract(tokenAddress, IERC777.abi, false)
      const result = await contract?.connect(account).authorizeOperator(operator, {
        summary: 'AuthorizeOperator',
      })
      return result
    } catch (e) {
      console.log(e)
    }
  }

  // --------------------
  //  ERC 721
  // --------------------

  /**
   * @param {*} tokenAddress
   * @param {*} to
   * @param {*} tokenId
   * @note : Only a single account can be approved at a time, so approving the zero tokenAddress clears previous approvals.
   * @note : The approval is cleared when the token is transferred.
   */
  const erc721Approve = async (tokenAddress, to, tokenId) => {
    try {
      const contract = await useContract(tokenAddress, IERC721.abi, false)
      const result = await contract?.connect(account).approve(to, tokenId)
      return result
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * @param {number} tokenId
   * @returns : the account approved for `tokenId` token
   */
  const erc721GetApproved = async (tokenAddress, tokenId) => {
    try {
      const contract = await useContract(tokenAddress, IERC721.abi, false)
      const result = await contract?.getApproved(tokenId)
      return result
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * @dev Grants or revokes permission to `operator` to transfer the caller's tokens, according to `approved`.
   * @param {*} operator : tokenAddress that can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
   * @param {*} approved : true or false
   */
  const erc721SetApprovalForAll = async (tokenAddress, operator, approved) => {
    try {
      const contract = await useContract(tokenAddress, IERC721.abi, false)
      const result = await contract?.connect(account).setApprovalForAll(operator, approved)
      return result
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * @param {*} owner : owner of assets
   * @param {*} operator : tokenAddress that can move assets
   * @returns : if the `operator` is allowed to manage all of the assets of `owner`.
   */
  const erc721IsApprovedForAll = async (tokenAddress, owner, operator) => {
    try {
      const contract = await useContract(tokenAddress, IERC721.abi, false)
      const result = await contract?.isApprovedForAll(owner, operator)
      return result
    } catch (e) {
      console.log(e)
    }
  }

  // --------------------
  //  ERC 1155
  // --------------------

  /**
   * @dev Grants or revokes permission to `operator` to transfer the caller's tokens, according to `approved`.
   * @param {*} operator : tokenAddress that can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
   * @param {*} approved : true or false
   */
  const erc1155SetApprovalForAll = async (tokenAddress, operator, approved) => {
    try {
      const contract = await useContract(tokenAddress, IERC1155.abi, false)
      const result = await contract?.connect(account).setApprovalForAll(operator, approved, {
        summary: 'ApproveForAll',
      })
      return result
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * @param {*} owner : owner of assets
   * @param {*} operator : tokenAddress that can move assets
   * @returns : if the `operator` is allowed to manage all of the assets of `owner`.
   */
  const erc1155IsApprovedForAll = async (tokenAddress, owner, operator) => {
    try {
      const contract = await useContract(tokenAddress, IERC1155.abi, false)
      const result = await contract?.isApprovedForAll(owner, operator)
      return result
    } catch (e) {
      console.log(e)
    }
  }

  return {
    erc20BalanceOf,
    erc20Approve,
    erc20Allowance,
    erc777IsOperatorFor,
    erc777AuthorizeOperator,
    erc721Approve,
    erc721GetApproved,
    erc721SetApprovalForAll,
    erc721IsApprovedForAll,
    erc1155SetApprovalForAll,
    erc1155IsApprovedForAll,
  }
}

export default useApproveContract
