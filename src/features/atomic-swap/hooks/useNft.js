import { ethers } from 'ethers'

import { useActiveWeb3React } from '../../../hooks/useActiveWeb3React'
import { useContract } from 'hooks/useContract'

import IERC20 from 'constants/abis/soulswap/ERCs/IERC20.json'
import IERC721 from 'constants/abis/soulswap/ERCs/IERC721.json'
import IERC1155 from 'constants/abis/soulswap/ERCs/IERC1155.json'

const useNft = (tokenAddress) => {
  const { account, chainId } = useActiveWeb3React()
  const erc20Contract = useContract(tokenAddress, IERC20.abi)
  const erc721Contract = useContract(tokenAddress, IERC721.abi)
  const erc1155Contract = useContract(tokenAddress, IERC1155.abi)

  // all standards have same get symbol abi
  const getSymbol = async (tokenAddress, erc) => {
    try {
      const result = await erc20Contract?.symbol()
      return result
    } catch (e) {
      console.log(e)
      // alert(e.message);
    }
  }

  // all standards have same get name abi
  const getName = async (tokenAddress) => {
    try {
      const result = await erc20Contract?.name()
      return result
    } catch (e) {
      console.log(e)
      // alert(e.message);
    }
  }

  // Get the metadata from nft and return
  const getErc721TokenUri = async (tokenAddress, tokenId) => {
    try {
      const result = await erc721Contract?.tokenURI(tokenId)
      return result
    } catch (e) {
      console.log(e)
      // alert(e.message);
    }
  }

  // Get the metadata from nft and return
  const getErc1155TokenUri = async (tokenAddress, tokenId) => {
    try {
      const result = await erc1155Contract?.uri(tokenId)
      return result
    } catch (e) {
      console.log(e)
      // alert(e.message);
    }
  }

  return {
    getSymbol,
    getName,
    getErc721TokenUri,
    getErc1155TokenUri,
  }
}

export default useNft
