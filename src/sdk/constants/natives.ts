import {
  Ether,
  Binance,
  Fantom,
  Moonriver
} from '../entities/Native'

import { ChainId } from '../enums'

export const NATIVE = {
  [ChainId.MAINNET]: Ether.onChain(ChainId.MAINNET),
  [ChainId.BSC]: Binance.onChain(ChainId.BSC),
  [ChainId.FANTOM]: Fantom.onChain(ChainId.FANTOM),
  [ChainId.MOONRIVER]: Moonriver.onChain(ChainId.MOONRIVER),
  [ChainId.FANTOM_TESTNET]: Fantom.onChain(ChainId.FANTOM_TESTNET)
}
