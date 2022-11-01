import { ChainId } from 'sdk'

export interface IBaseRoutablePlatform {
  chainIds?: ChainId[]
  name: string
}

/**
 * `BaseRoutablePlatform` should be used new platforms through which Swapr can route trades.
 * @implements IBaseRoutablePlatform
 */
export abstract class BaseRoutablePlatform implements IBaseRoutablePlatform {
  /**
   * @returns List of chainIds supported by the platform
   */
  public readonly chainIds?: ChainId[]
  /**
   * @property The name of the platform.
   */
  public readonly name: string

  /**
   * Create a new instance of the platform.
   * @param chainIds list of chainIds to check
   * @param name name of the platform
   */
  public constructor(chainIds: ChainId[], name: string) {
    this.chainIds = chainIds
    this.name = name
  }

  /**
   * Checks if the platform is compatible with the given chainId.
   * @param chainId The chainId to check
   * @returns whether the platform supports the given chainId
   */
  public supportsChain(chainId: ChainId): boolean {
    return this.chainIds.includes(chainId)
  }
}
