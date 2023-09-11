import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { ChainId } from 'sdk'
import { ethers } from 'ethers'

// import { calculateGasMargin } from 'utils'

import { TransactionError } from './sentry'
import { calculateGasMargin } from './swap/calculateGasMargin'
export async function sendEVMTransaction(
    account: string,
    library: ethers.providers.Web3Provider | undefined,
    contractAddress: string,
    encodedData: string,
    value: BigNumber,
    handler?: (response: TransactionResponse) => void,
    chainId?: ChainId,
  ): Promise<TransactionResponse | undefined> {
    if (!account || !library) return
  
    const estimateGasOption = {
      from: account,
      to: contractAddress,
      data: encodedData,
      value,
    }
  
    let gasEstimate: ethers.BigNumber | undefined
    try {
      gasEstimate = await library.getSigner().estimateGas(estimateGasOption)
      if (!gasEstimate) throw new Error('gasEstimate is nullish value')
    } catch (error) {
      throw new TransactionError(error?.message, estimateGasOption, { cause: error })
    }
  
    const sendTransactionOption = {
      from: account,
      to: contractAddress,
      data: encodedData,
      gasLimit: calculateGasMargin(gasEstimate, chainId),
      ...(value.eq('0') ? {} : { value }),
    }
  
    try {
      const response = await library.getSigner().sendTransaction(sendTransactionOption)
      handler?.(response)
      return response
    } catch (error) {
      throw new TransactionError(error?.message, sendTransactionOption, { cause: error })
    }
  }
  