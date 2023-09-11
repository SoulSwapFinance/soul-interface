import { ChainId } from 'sdk'

export type GetTokenScoreParams = {
  chainId: ChainId
  tokenAddress: string
}

export type GetTokenScoreResponse = {
  code: number
  message: string
  data?: {
    score: string
  }
}