import React from 'react'
import { FANTOM, AVALANCHE, BINANCE, Chain, CHAINS, ETHEREUM, POLYGON, MOONRIVER, Token as CrossToken } from "features/cross/chains";

export const NATIVE_ADDRESS = "0x0000000000000000000000000000000000000000";

import SDK, {
    BLOCKCHAIN_NAME,
    Configuration,
    InstantTrade,
    WalletProvider,
    InsufficientFundsError,
    InsufficientLiquidityError
  } from "rubic-sdk";
import { ChainId } from 'sdk';

export const FTM = FANTOM.tokens.find(t => t.id === "fantom");
export const AVAX = AVALANCHE.tokens.find(t => t.id === "avalanche-2");
export const ETH = ETHEREUM.tokens.find(t => t.id === "ethereum");
export const BNB = BINANCE.tokens.find(t => t.id === "binancecoin");
export const MOVR = MOONRIVER.tokens.find(t => t.id === "moonriver");
export const MATIC = POLYGON.tokens.find(t => t.id === "matic-network");

export const NATIVE = {
  [ChainId.ETHEREUM]: ETH,
  [ChainId.BSC]: BNB,
  [ChainId.FANTOM]: FTM,
  [ChainId.AVALANCHE]: AVAX,
  [ChainId.MOONRIVER]: MOVR,
  [ChainId.MATIC]: MATIC,
}

// export function setNativeToken(chainId: ChainId) {
//   let NATIVE
//     chainId == ChainId.FANTOM 
//     ? NATIVE = FTM
//       : chainId == ChainId.AVALANCHE 
//       ? NATIVE = AVAX
//         : chainId == ChainId.ETHEREUM 
//         ? NATIVE = ETH
//           : chainId == ChainId.BSC 
//           ? NATIVE = BNB
//             : chainId == ChainId.MATIC 
//             ? NATIVE = MATIC
//               : chainId == ChainId.MOONRIVER 
//               ? NATIVE = MOVR
//     : NATIVE = FTM
// }
  
export const CHAIN_BY_ID = new Map([
  [FANTOM.chainId, BLOCKCHAIN_NAME.FANTOM],
  [AVALANCHE.chainId, BLOCKCHAIN_NAME.AVALANCHE],
  [ETHEREUM.chainId, BLOCKCHAIN_NAME.ETHEREUM],
  [BINANCE.chainId, BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN],
  [POLYGON.chainId, BLOCKCHAIN_NAME.POLYGON],
  [MOONRIVER.chainId, BLOCKCHAIN_NAME.MOONRIVER],
]);

export const CHAIN_BY_CHAIN = new Map([
  [FANTOM.chainId, FANTOM],
  [AVALANCHE.chainId, AVALANCHE],
  [ETHEREUM.chainId, ETHEREUM],
  [BINANCE.chainId, BINANCE],
  [POLYGON.chainId, POLYGON],
  [MOONRIVER.chainId, MOONRIVER],
]);

export const rubicConfiguration: Configuration = {
  providerAddress: '0xFd63Bf84471Bc55DD9A83fdFA293CCBD27e1F4C8',
  rpcProviders: {
    [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
      mainRpc: BINANCE.rpc[0],
    },
    [BLOCKCHAIN_NAME.MOONRIVER]: {
      mainRpc: MOONRIVER.rpc[0],
    },
    [BLOCKCHAIN_NAME.POLYGON]: {
      mainRpc: POLYGON.rpc[0],
    },
    [BLOCKCHAIN_NAME.AVALANCHE]: {
      mainRpc: AVALANCHE.rpc[0],
    },
    [BLOCKCHAIN_NAME.ETHEREUM]: {
      mainRpc: ETHEREUM.rpc[0],
    },
    [BLOCKCHAIN_NAME.FANTOM]: {
      mainRpc: FANTOM.rpc[0],
    },
  },
};