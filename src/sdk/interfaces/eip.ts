import { COFFIN_BOX_ADDRESS, ChainId } from 'sdk'
import { coffinTypes, name, types } from '../types'

import { STOP_LIMIT_ORDER_ADDRESS } from '../constants'
import { SigningKey } from '@ethersproject/signing-key'
import { Web3Provider } from '@ethersproject/providers'
import { getMessage } from 'eip-712'
import { splitSignature } from '@ethersproject/bytes'

export interface Domain {
  name: string
  chainId: ChainId
  verifyingContract: string
}

export interface Message {
  maker: string
  tokenIn: string
  tokenOut: string
  amountIn: string
  amountOut: string
  recipient: string
  startTime: string
  endTime: string
  stopPrice: string
  oracleAddress: string
  oracleData: string
}

export interface CoffinApprovalMessage {
  warning: string
  user: string
  masterContract: string
  approved: boolean
  nonce: number
}

export const getSignature = (message: Message, chainId: ChainId, privateKey: string) => {
  let domain: Domain = {
    name: name,
    chainId: chainId,
    verifyingContract: STOP_LIMIT_ORDER_ADDRESS[chainId],
  }
  return sign({ types, primaryType: 'LimitOrder', domain, message }, privateKey)
}

export const getTypedData = (message: Message, chainId: ChainId) => {
  let domain: Domain = {
    name: name,
    chainId: chainId,
    verifyingContract: STOP_LIMIT_ORDER_ADDRESS[chainId],
  }
  return { types, primaryType: 'LimitOrder', domain, message }
}

export const getTypedDataCoffin = (message: CoffinApprovalMessage, chainId: ChainId) => {
  let domain: Domain = {
    name: 'CoffinBox',
    chainId: chainId,
    verifyingContract: COFFIN_BOX_ADDRESS[chainId],
  }
  return {
    types: coffinTypes,
    primaryType: 'SetMasterContractApproval',
    domain,
    message,
  }
}

export const getTypeHash = (typedData: any) => {
  let message = getMessage(typedData, true).toString('hex')
  return `0x${message}`
}

const sign = (typedData: any, privateKey: string) => {
  let message = getMessage(typedData, true)
  const signingKey = new SigningKey(privateKey)
  const { v, r, s } = signingKey.signDigest(message)
  return { v, r, s }
}

export const getSignatureWithProvider = async (
  message: Message,
  chainId: ChainId,
  provider: Web3Provider
): Promise<{ v: number; r: string; s: string }> => {
  const typedData = getTypedData(message, chainId)
  const signature = await provider.send('eth_signTypedData_v4', [message.maker, JSON.stringify(typedData)])
  const { v, r, s } = splitSignature(signature)
  return { v, r, s }
}

export const getSignatureWithProviderCoffinbox = async (
  message: CoffinApprovalMessage,
  chainId: ChainId,
  provider: Web3Provider
): Promise<{ v: number; r: string; s: string }> => {
  const typedData = getTypedDataCoffin(message, chainId)
  const signature = await provider.send('eth_signTypedData_v4', [message.user, JSON.stringify(typedData)])
  const { v, r, s } = splitSignature(signature)
  return { v, r, s }
}

export const getSignatureCoffin = async (coffinApproval: CoffinApprovalMessage, chainId: ChainId, privateKey: string) => {
  let domain: Domain = {
    name: 'CoffinBox',
    chainId: chainId,
    verifyingContract: COFFIN_BOX_ADDRESS[chainId],
  }
  return sign(
    {
      types: coffinTypes,
      primaryType: 'SetMasterContractApproval',
      domain,
      message: coffinApproval,
    },
    privateKey
  )
}