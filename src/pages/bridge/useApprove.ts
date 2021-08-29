import { ethers, BigNumber } from "ethers";

import { useContract } from '../../hooks/useContract'
import { useActiveWeb3React } from '../../hooks'

import IERC20 from "../../constants/abis/soulswap/ERCs/IERC20.json";
import IERC777 from "../../constants/abis/soulswap/ERCs/IERC777.json";
import IERC721 from "../../constants/abis/soulswap/ERCs//IERC721.json";
import IERC1155 from "../../constants/abis/soulswap/ERCs//IERC1155.json";

const useApproveContract = () => {
  const { account } = useActiveWeb3React()

  // --------------------
  //  ERC 20
  // --------------------

  const erc20Approve = async (address, spender, amount) => {
    const contract = await useContract(address, IERC20.abi);

    try {
      const result = await contract.connect(account).approve(spender, amount);
      return result;
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  const erc20Allowance = async (address, owner, spender) => {
    const contract = await useContract(address, IERC20.abi);

    try {
      const result = await contract.allowance(owner, spender);
      return result;
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  // --------------------
  //  ERC 777
  // --------------------

  const erc777IsOperatorFor = async (address, operator, tokenHolder) => {
    const contract = await useContract(address, IERC777.abi);

    try {
      const result = await contract.isOperatorFor(operator, tokenHolder);
      return result;
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  /// @dev Make an account an operator of the caller.
  const erc777AuthorizeOperator = async (address, operator) => {
    const contract = await useContract(address, IERC777.abi);

    try {
      const result = await contract.connect(account).authorizeOperator(operator);
      return result;
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  // --------------------
  //  ERC 721
  // --------------------

  /**
   * @param {*} address
   * @param {*} to
   * @param {*} tokenId
   * @note : Only a single account can be approved at a time, so approving the zero address clears previous approvals.
   * @note : The approval is cleared when the token is transferred.
   */
  const erc721Approve = async (address, to, tokenId) => {
    const contract = await useContract(address, IERC721.abi);

    try {
      const result = contract.approve(to, tokenId);
      return result;
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  /**
   * @param {number} tokenId
   * @returns : the account approved for `tokenId` token
   */
  const erc721GetApproved = async (address, tokenId) => {
    const contract = await useContract(address, IERC721.abi);

    try {
      const result = await contract.getApproved(tokenId);
      return result;
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  /**
   * @dev Grants or revokes permission to `operator` to transfer the caller's tokens, according to `approved`.
   * @param {*} operator : address that can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
   * @param {*} approved : true or false
   */
  const erc721SetApprovalForAll = async (address, operator, approved) => {
    const contract = await useContract(address, IERC721.abi);

    try {
      const result = await contract.connect(account).setApprovalForAll(operator, approved);
      return result;
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  /**
   * @param {*} owner : owner of assets
   * @param {*} operator : address that can move assets
   * @returns : if the `operator` is allowed to manage all of the assets of `owner`.
   */
  const erc721IsApprovedForAll = async (address, owner, operator) => {
    const contract = await useContract(address, IERC721.abi);

    try {
      const result = await contract.isApprovedForAll(owner, operator);
      return result;
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  // --------------------
  //  ERC 1155
  // --------------------

  /**
   * @dev Grants or revokes permission to `operator` to transfer the caller's tokens, according to `approved`.
   * @param {*} operator : address that can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
   * @param {*} approved : true or false
   */
  const erc1155SetApprovalForAll = async (address, operator, approved) => {
    const contract = await useContract(address, IERC1155.abi);

    try {
      const result = await contract.connect(account).setApprovalForAll(operator, approved);
      return result;
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  /**
   * @param {*} owner : owner of assets
   * @param {*} operator : address that can move assets
   * @returns : if the `operator` is allowed to manage all of the assets of `owner`.
   */
  const erc1155IsApprovedForAll = async (address, owner, operator) => {
    const contract = await useContract(address, IERC1155.abi);

    try {
      const result = await contract.isApprovedForAll(owner, operator);
      return result;
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  return {
    erc20Approve,
    erc20Allowance,
    erc777IsOperatorFor,
    erc777AuthorizeOperator,
    erc721Approve,
    erc721GetApproved,
    erc721SetApprovalForAll,
    erc721IsApprovedForAll,
    erc1155SetApprovalForAll,
    erc1155IsApprovedForAll
  };
};

export default useApproveContract;
