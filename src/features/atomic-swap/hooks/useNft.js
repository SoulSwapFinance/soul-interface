import { ethers } from "ethers";

import { useActiveWeb3React } from '../../../hooks/useActiveWeb3React'
import { useContract } from "../../../hooks/useContract";

import IERC20 from '../../../constants/abis/soulswap/ERCs/IERC20.json'
import IERC721 from '../../../constants/abis/soulswap/ERCs/IERC721.json'
import IERC1155 from '../../../constants/abis/soulswap/ERCs/IERC1155.json'

const useNft = () => {
  const { account, chainId } = useActiveWeb3React()

  // all standards have same get symbol abi
  const getSymbol = async (tokenAddress, erc) => {
    try {
      const contract = await useContract(tokenAddress, IERC20.abi);
      const result = await contract?.symbol();
      return result;
    } catch (e) {
      console.log(e);
      // alert(e.message);
    }
  };

  // all standards have same get name abi
  const getName = async (tokenAddress) => {
    try {
      const contract = await useContract(tokenAddress, IERC20.abi);
      const result = await contract?.name();
      return result;
    } catch (e) {
      console.log(e);
      // alert(e.message);
    }
  };

  // Get the metadata from nft and return
  const getErc721TokenUri = async (tokenAddress, tokenId) => {
    try {
      const contract = await useContract(tokenAddress, IERC721.abi);
      const result = await contract?.tokenURI(tokenId);
      return result;
    } catch (e) {
      console.log(e);
      // alert(e.message);
    }
  };

  // Get the metadata from nft and return
  const getErc1155TokenUri = async (tokenAddress, tokenId) => {
    try {
      const contract = await useContract(tokenAddress, IERC1155.abi);
      const result = await contract?.uri(tokenId);
      return result;
    } catch (e) {
      console.log(e);
      // alert(e.message);
    }
  };

  return {
    getSymbol,
    getName,
    getErc721TokenUri,
    getErc1155TokenUri,
  };
};

export default useNft;
