import { ChainId } from "sdk"

export interface Oracle {
    chainId: ChainId
    address: string
    data: string
    name: string
  }
  
  export abstract class Oracle implements Oracle {
    chainId: ChainId
    address: string
    data: string
    name: string
    warning = ''
    error = ''
    // @ts-ignore TYPE NEEDS FIXING
    constructor(chainId: ChainId, address: string, name: string, data: string) {
      this.chainId = chainId
      this.address = address
      this.data = data
      this.name = name
    }
  }