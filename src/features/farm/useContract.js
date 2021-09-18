import { ethers } from "ethers";

import { PopAndSwapAddress, AnyswapEthOperaBridgeAddress, SoulSummonerAddress } from "../constants";

import IERC20 from "../constants/abis/IERC20.json";
import IERC777 from "../constants/abis/IERC777.json";
import IERC721 from "../constants/abis/IERC721.json";
import IERC1155 from "../constants/abis/IERC1155.json";
import IUniswapV2PairABI from "../constants/abis/uniswap-v2-pair.json";

import PopAndSwapABI from "../constants/abis/PopAndSwap.json";
import AnyswapEthOperaBridgeABI from "../constants/abis/anyswapEthOperaBridge.json";
import SoulSummonerABI from "../constants/abis/SoulSummoner.json";


export const useContract = async (address, abi) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    return await new ethers.Contract(address, abi, provider);
  } catch (error) {
    console.error("Failed to get contract", error);
    return null;
  }
};


// --------------------
//  Token Standards
// --------------------

export const useErc20Contract = async (address) => {
  return useContract(address, IERC20.abi)
}

export const useErc777Contract = async (address) => {
  return useContract(address, IERC777.abi)
}

export const useErc721Contract = async (address) => {
  return useContract(address, IERC721.abi)
}

export const useErc1155Contract = async (address) => {
  return useContract(address, IERC1155.abi)
}

export const useLpTokenContract = async (pairAddress) => {
  return useContract(pairAddress, IUniswapV2PairABI)
}


// --------------------
//  Custom Contracts
// --------------------

export const usePopAndSwapContract = async () => {
  return await useContract(PopAndSwapAddress, PopAndSwapABI);
};

export const useSoulSummonerContract = async () => {
    return await useContract(SoulSummonerAddress, SoulSummonerABI);
};

export const useEthereumToOperaBridgeContract = async () => {
  return await useContract(AnyswapEthOperaBridgeAddress, AnyswapEthOperaBridgeABI)
}
