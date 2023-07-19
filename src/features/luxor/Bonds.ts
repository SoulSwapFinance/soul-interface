import { ChainId, WNATIVE_ADDRESS } from "sdk"

export const FantomBonds = [  
  // FTM BONDS //
  {
    pid: 25,
    status: 'closed',
    bondAddress: '0x2b4ecB35Aa2a5C163675E1b66577E127C38eb911',
    assetName: 'WFTM',
    assetAddress: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    term: '5D',
  },
]