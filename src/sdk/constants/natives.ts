import {
  Ether,
  Binance,
  Telos,
  Fantom,
  Avalanche,
  Moonriver,
  Polygon,
} from '../entities/Native'

import { ChainId } from '../enums'

export const NATIVE = {
  [ChainId.ETHEREUM]: Ether.onChain(ChainId.ETHEREUM),
  [ChainId.TELOS]: Telos.onChain(ChainId.TELOS),
  [ChainId.BSC]: Binance.onChain(ChainId.BSC),
  [ChainId.FANTOM]: Fantom.onChain(ChainId.FANTOM),
  [ChainId.AVALANCHE]: Avalanche.onChain(ChainId.AVALANCHE),
  [ChainId.MOONRIVER]: Moonriver.onChain(ChainId.MOONRIVER),
  [ChainId.MATIC]: Polygon.onChain(ChainId.MATIC),
}
