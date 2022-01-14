import { ChainId } from 'sdk'

export abstract class Oracle {
  chainId = ChainId.MAINNET
  address = ''
  data = ''
  name = ''
  warning = ''
  error = ''
  constructor(chainId, address, name, data) {
    this.chainId = chainId
    this.address = address
    this.data = data
    this.name = name
  }
}