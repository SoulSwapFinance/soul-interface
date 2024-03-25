import {
  Ether,
  Arbitrum,
  Binance,
  Blast,
  Fantom,
  Avalanche,
  Moonriver,
  Polygon,
  Telos,
} from '../entities/Native'

import { ChainId } from '../enums'

export const NATIVE: { [chainId in ChainId]: any } = {
  [ChainId.ETHEREUM]: Ether.onChain(ChainId.ETHEREUM),
  [ChainId.TELOS]: Telos.onChain(ChainId.TELOS),
  [ChainId.BSC]: Binance.onChain(ChainId.BSC),
  [ChainId.FANTOM]: Fantom.onChain(ChainId.FANTOM),
  [ChainId.AVALANCHE]: Avalanche.onChain(ChainId.AVALANCHE),
  [ChainId.MOONRIVER]: Moonriver.onChain(ChainId.MOONRIVER),
  [ChainId.ARBITRUM]: Arbitrum.onChain(ChainId.ARBITRUM),
  [ChainId.BLAST]: Blast.onChain(ChainId.BLAST),
  [ChainId.MATIC]: Polygon.onChain(ChainId.MATIC),
  [ChainId.BASE]: Polygon.onChain(ChainId.BASE),
}
