import { ChainId, Currency, Token } from 'sdk'
import { Tags } from '@uniswap/token-lists'

// import { TokenList } from '@uniswap/token-lists/dist/types'
import { isAddress } from '../../functions/validate'
import { MultiChainTokenInfo } from 'features/bridge/type'


export interface TokenInfo {
  readonly chainId: number
  readonly address: string
  readonly name: string
  readonly decimals: number
  readonly symbol: string
  readonly logoURI: string
  readonly isWhitelisted: boolean // from backend
  readonly multichainInfo: MultiChainTokenInfo // from multichain api
  readonly domainSeparator: string
}


type TagDetails = Tags[keyof Tags]
export interface TagInfo extends TagDetails {
  id: string
}

// export class WrappedTokenInfo_CrossChain extends Token {
//   public readonly isNative: false = false as const
//   public readonly isToken: true = true as const

//   public readonly logoURI: string | undefined
//   public readonly isWhitelisted: boolean = false
//   public readonly multichainInfo: MultiChainTokenInfo | undefined

//   public readonly domainSeparator?: string

//   constructor(tokenInfo: TokenInfo_CrossChain) {
//     const { isWhitelisted, multichainInfo, chainId, decimals, symbol, name, address, logoURI, domainSeparator } =
//       tokenInfo
//     super(chainId, isAddress_CrossChain(chainId, address) || address, decimals, symbol, name)

//     this.multichainInfo = multichainInfo
//     this.isWhitelisted = !!isWhitelisted
//     this.logoURI = logoURI
//     this.domainSeparator = domainSeparator
//   }

//   equals(other: Token): boolean {
//     return other.chainId === this.chainId && other.isToken && other.address.toLowerCase() === this.address.toLowerCase()
//   }

//   sortsBefore(other: Token): boolean {
//     if (this.equals(other)) throw new Error('Addresses should not be equal')
//     return this.address.toLowerCase() < other.address.toLowerCase()
//   }

//   public get wrapped(): Token {
//     return this
//   }
// }

/**
 * Token instances created from token info on a token list.
 */
export class WrappedTokenInfo implements Token {
  public readonly isNative: false = false
  public readonly isToken: true = true
  // public readonly list: TokenList
  
  // public readonly chainId: TokenInfo
  // public readonly logoURI: string | undefined
  public readonly tokenInfo: TokenInfo
  public readonly isWhitelisted: boolean = false
  public readonly multichainInfo: MultiChainTokenInfo | undefined
  public readonly domainSeparator: string

  // constructor(tokenInfo: TokenInfo ,  list?: TokenList) {
  constructor(tokenInfo: TokenInfo) {
    const { isWhitelisted, multichainInfo, chainId, decimals, symbol, name, address, logoURI, domainSeparator } =
    // this.chainId, isAddress(chainId, address) || 
    // address, decimals, symbol, name
    this.tokenInfo = tokenInfo
    // this.list = list
    this.multichainInfo = multichainInfo
    this.isWhitelisted = !!isWhitelisted
    // this.logoURI = logoURI
    this.domainSeparator = domainSeparator
  }

  // constructor(tokenInfo: TokenInfo, list?: TokenList) {
  //   this.tokenInfo = tokenInfo
  //   this.list = list

  //   this.multichainInfo = multichainInfo
  //   this.isWhitelisted = !!isWhitelisted
  //   this.logoURI = logoURI
  //   this.domainSeparator = domainSeparator
  // }

  private _checksummedAddress: string | null = null

  public get address(): string {
    if (this._checksummedAddress) return this._checksummedAddress
    const checksummedAddress = isAddress(this.tokenInfo.chainId, this.tokenInfo.address)
    if (!checksummedAddress) throw new Error(`Invalid token address: ${this.tokenInfo.address}`)
    return (this._checksummedAddress = checksummedAddress)
  }

  public get chainId(): number {
    return this.tokenInfo.chainId
  }

  public get decimals(): number {
    return this.tokenInfo.decimals
  }

  public get name(): string {
    return this.tokenInfo.name
  }

  public get symbol(): string {
    return this.tokenInfo.symbol
  }

  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }

  // private _tags: TagInfo[] | null = null
  // public get tags(): TagInfo[] {
  //   if (this._tags !== null) return this._tags
  //   if (!this.tokenInfo.tags) return (this._tags = [])
  //   const listTags = this.list.tags
  //   if (!listTags) return (this._tags = [])

  //   return (this._tags = this.tokenInfo.tags.map((tagId) => {
  //     return {
  //       ...listTags[tagId],
  //       id: tagId,
  //     }
  //   }))
  // }

  equals(other: Currency): boolean {
    return other?.chainId === this?.chainId && other?.isToken && other?.address.toLowerCase() === this.address?.toLowerCase()
  }

  sortsBefore(other: Token): boolean {
    if (this.equals(other)) throw new Error('Addresses should not be equal')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }

  public get wrapped(): Token {
    return this
  }

  serialize(): string {
    return this.address
  }
}
