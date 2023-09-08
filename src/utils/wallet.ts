import { Web3Provider } from "@ethersproject/providers";
import { isAddress } from "@ethersproject/address";
import { Signer } from "@ethersproject/abstract-signer";
import { Contract } from "@ethersproject/contracts";
import ERC20ABI from 'constants/abis/bridge/erc20.json'

import config from "config/configurations";

export const isValidAddress = (address: string): boolean => {
  return isAddress(address);
};

export const isSameAddress = (address1: string, address2: string): boolean => {
  if (!address1 || !address2) {
    return false;
  }
  return address1.toLowerCase() === address2.toLowerCase();
};

export const formatAddress = (address: string) => {
  return `${address.substr(0, 5)}..${address.substr(-3, 3)}`;
};

export const createWeb3Provider = (provider: any) => {
  return new Web3Provider(provider, "any");
};

export const loadContracts = async (signer: Signer, chainId: number) => {
  if (!signer) {
    return;
  }

  if (chainId !== parseInt(config.chainId)) {
    console.warn("[loadContracts] wrong chain selected");
    return;
  }

//   return new Map([
//     ["sfc", new Contract(addresses[chainId ?? ChainId.FANTOM]["sfc"], abis.sfc, signer)],
//     [
//       "stakeTokenizer",
//       new Contract(
//         addresses[chainId ?? ChainId.FANTOM]["stakeTokenizer"],
//         abis.stakeTokenizer,
//         signer
//       ),
//     ],
//     ["gov", new Contract(addresses[chainId ?? ChainId.FANTOM]["gov"], abis.gov, signer)],
//     [
//       "govProposal",
//       new Contract(addresses[chainId ?? ChainId.FANTOM]["govProposal"], abis.govProposal, signer),
//     ],
//     [
//       "govProposalPlaintext",
//       new Contract(
//         addresses[chainId ?? ChainId.FANTOM]["govProposalPlaintext"],
//         abis.govProposalPlaintext,
//         signer
//       ),
//     ],
//   ]);
};

export const loadERC20Contract = async (
  contractAddress: string,
  signer: Signer
) => {
  if (!signer) {
    return;
  }

  return new Contract(contractAddress, ERC20ABI.abi, signer);
};

export const loadContract = async (
  contractAddress: string,
  abi: any,
  signer: Signer
) => {
  if (!signer) {
    return;
  }

  return new Contract(contractAddress, abi, signer);
};