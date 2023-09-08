// NOTE: Try not to add anything to thie file, it's almost entirely refactored out.
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { ChainId, JOE_ROUTER_ADDRESS, ROUTER_ADDRESS } from 'sdk'
import SoulSwapRouterABI from 'constants/abis/soulswap/soulswaprouter.json'
import TraderJoeRouterABI from 'constants/abis/joe-router.json'
// import IUniswapV2Router02NoETHABI from 'constants/abis/uniswap-v2-router-02-no-eth.json'
import { isAddress } from 'functions/validate'

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return new Contract(address, ABI, getProviderOrSigner(library, account))
}

export function getRouterAddress(chainId?: ChainId) {
  if (!chainId) {
    throw Error(`Undefined 'chainId' parameter '${chainId}'.`)
  }
  return ROUTER_ADDRESS[chainId ?? ChainId.FANTOM]
}

export function getJoeRouterAddress() {
  return JOE_ROUTER_ADDRESS[ChainId.AVALANCHE]
}

// account is optional
export function getRouterContract(chainId: number, library: Web3Provider, account?: string): Contract {
  return getContract(
    getRouterAddress(chainId),
    SoulSwapRouterABI,
    library,
    account
  )
}

// account is optional
export function getJoeRouterContract(library: Web3Provider, account?: string): Contract {
  return getContract(
    getJoeRouterAddress(),
    TraderJoeRouterABI,
    library,
    account
  )
}