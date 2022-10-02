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

export const FTM = FANTOM.tokens.find(t => t.id === "fantom");
export const AVAX = AVALANCHE.tokens.find(t => t.id === "avalanche-2");
  
export const CHAIN_BY_ID = new Map([
  [FANTOM.chainId, BLOCKCHAIN_NAME.FANTOM],
  [MOONRIVER.chainId, BLOCKCHAIN_NAME.MOONRIVER],
  [POLYGON.chainId, BLOCKCHAIN_NAME.POLYGON],
  [AVALANCHE.chainId, BLOCKCHAIN_NAME.AVALANCHE],
  [ETHEREUM.chainId, BLOCKCHAIN_NAME.ETHEREUM],
  [BINANCE.chainId, BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN],
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