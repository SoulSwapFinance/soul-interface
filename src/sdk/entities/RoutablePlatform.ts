import { AddressZero } from '@ethersproject/constants'
import {  FACTORY_ADDRESS, INIT_CODE_HASH, ROUTER_ADDRESS, JSBI, BaseRoutablePlatform, ChainId, defaultSwapFee, _30 } from 'sdk'
import { BigintIsh } from 'sdk/types/BigIntIsh'
/**
 * A platform to which Swapr can route through.
 */

const UNISWAP_FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
const SUSHISWAP_FACTORY_ADDRESS = '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac'
// const QUICKSWAP_FACTORY_ADDRESS = '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32'
// const DFYN_FACTORY_ADDRESS = '0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B'

const UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const SUSHISWAP_ROUTER_ADDRESS = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'
const SWAPR_ROUTER_ADDRESS =  '0xB9960d9bcA016e9748bE75dd52F02188B9d0829f'
const SWAPR_FACTORY_ADDRESS = '0xd34971BaB6E5E356fd250715F5dE0492BB070452'

// const QUICKSWAP_ROUTER_ADDRESS = '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff'
// const DFYN_ROUTER_ADDRESS = '0xA102072A4C07F06EC3B4900FDC4C7B80b6c57429'

export interface RoutablePlatformParams {
  /**
   * The chainIds this platform supports
   */
  chainIds?: ChainId[]
  /**
   * The name of the platform.
   */
  name: string
  /**
   * List of factory addresses, one for each chainId.
   */
  factoryAddress: string
  /**
   * List of router addresses, one for each chainId.
   */
  routerAddress: string
  /**
   * List of subgraph endpoints, one for each chainId.
   */
  subgraphEndpoint?: string
  /**
   * Initial code hash
   */
  initCodeHash: string

  /**
   * The default swap fee for this platform.
   */
  defaultSwapFee: BigintIsh
}

/**
 * A Uniswap V2 platform to which Swapr can route through.
 */
export class RoutablePlatform {
  public readonly factoryAddress: string
  public readonly routerAddress: string
  public readonly subgraphEndpoint: string
  public readonly initCodeHash: string
  public readonly defaultSwapFee: BigintIsh

  public static readonly SOULSWAP = new RoutablePlatform({
    name: 'SoulSwap',
    factoryAddress: '0x794d858b0b152fb68a5CE465451D729EFfA67f08',
    routerAddress: '0x2a8B48a8B8a8a8E4a184280333c418BcdcE72dE9',
    initCodeHash: '0x2d2a1a6740caa0c2e9da78939c9ca5c8ff259bf16e2b9dcbbec714720587df90',
    defaultSwapFee,
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/soulswapfinance/soulswap-exchange',
  })

  public static readonly SWAPR = new RoutablePlatform({
    name: 'Swapr',
    factoryAddress: SWAPR_FACTORY_ADDRESS,
    routerAddress:  SWAPR_ROUTER_ADDRESS,
    initCodeHash: '0xd306a548755b9295ee49cc729e13ca4a45e00199bbd890fa146da43a50571776',
    defaultSwapFee,
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/dxgraphs/swapr-mainnet-v2'
  })

  public static readonly UNISWAP = new RoutablePlatform({
    // chainIds: [ChainId.ETHEREUM],
    name: 'Uniswap v2',
    factoryAddress: UNISWAP_FACTORY_ADDRESS,
    routerAddress: UNISWAP_ROUTER_ADDRESS,
    initCodeHash: '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
    defaultSwapFee: _30,
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  })

  public static readonly SUSHISWAP = new RoutablePlatform({
    // chainIds: [ChainId.ETHEREUM],
    name: 'Sushiswap',
    factoryAddress: SUSHISWAP_FACTORY_ADDRESS,
    routerAddress: SUSHISWAP_ROUTER_ADDRESS,
    initCodeHash: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
    defaultSwapFee: _30,
    subgraphEndpoint: undefined,
  })

  /**
   * Create a new RoutablePlatform instance.
   */
  public constructor({
    // chainIds,
    // name,
    factoryAddress,
    routerAddress,
    initCodeHash,
    defaultSwapFee,
    subgraphEndpoint,
  }: RoutablePlatformParams) {
    // super(chainIds, name)
    this.factoryAddress = factoryAddress
    this.routerAddress = routerAddress
    this.initCodeHash = initCodeHash
    this.defaultSwapFee = defaultSwapFee
    this.subgraphEndpoint = subgraphEndpoint
  }

  /**
   * Check if the platform supports the given chain
   * @param chainId The chainId of the desired platform
   * @returns Whether the platform supports the given chain
   */
  public supportsChain(chainId: ChainId): boolean {
    return (
      // this.chainIds.includes(chainId) &&
      this.factoryAddress[chainId ?? ChainId.FANTOM] !== AddressZero &&
      this.routerAddress[chainId ?? ChainId.FANTOM] !== AddressZero
    )
  }
}
