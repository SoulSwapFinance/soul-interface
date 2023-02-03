import { ChainId, DAI_ADDRESS, LUX_ADDRESS, LUX_DAI, LUX_NATIVE, LUX_SOR, SOR_ADDRESS, SOR_FTM, WNATIVE_ADDRESS } from "sdk"

export const FantomBonds = [
  /// LIVE BONDS ///

  // DAI BONDS //
  {
    pid: 24,
    status: 'closed',
    bondAddress: '0x26155f6F5e5372dc063042A37C1391e04E71509e',
    assetName: 'DAI',
    assetAddress: DAI_ADDRESS[ChainId.FANTOM],
    token1Address: DAI_ADDRESS[ChainId.FANTOM],
    term: '5D',
  },
  
  // FTM BONDS //
  {
    pid: 25,
    bondAddress: '0x2b4ecB35Aa2a5C163675E1b66577E127C38eb911',
    assetName: 'WFTM',
    assetAddress: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    term: '5D',
  },
]