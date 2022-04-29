import {
  Ether,
  Binance,
  Telos,
  Fantom,
  Avalanche,
} from '../entities/Native'

import { ChainId } from '../enums'

export const NATIVE = {
  [ChainId.ETHEREUM]: Ether.onChain(ChainId.ETHEREUM),
  [ChainId.TELOS]: Telos.onChain(ChainId.TELOS),
  [ChainId.BSC]: Binance.onChain(ChainId.BSC),
  [ChainId.FANTOM]: Fantom.onChain(ChainId.FANTOM),
  [ChainId.FANTOM_TESTNET]: Fantom.onChain(ChainId.FANTOM_TESTNET),
  [ChainId.AVALANCHE]: Avalanche.onChain(ChainId.AVALANCHE)
}
