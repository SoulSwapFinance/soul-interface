import {
  Ether,
  Binance,
  Fantom,
} from '../entities/Native'

import { ChainId } from '../enums'

export const NATIVE = {
  [ChainId.ETHEREUM]: Ether.onChain(ChainId.ETHEREUM),
  [ChainId.BSC]: Binance.onChain(ChainId.BSC),
  [ChainId.FANTOM]: Fantom.onChain(ChainId.FANTOM),
  [ChainId.FANTOM_TESTNET]: Fantom.onChain(ChainId.FANTOM_TESTNET)
}
