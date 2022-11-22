import { ethers } from "ethers";

function createProvider(name: string, defaultRpc: string, chainId: number) {
  if (process.env.HISTORICAL) {
    if (chainId === 1) {
      console.log("RPC providers set to historical, only the first RPC provider will be used")
    }
    return new ethers.providers.StaticJsonRpcProvider(
      (process.env[name.toUpperCase() + "_RPC"] ?? defaultRpc)?.split(',')[0],
      {
        name,
        chainId,
      }
    )
  } else {
    return new ethers.providers.FallbackProvider(
      (process.env[name.toUpperCase() + "_RPC"] ?? defaultRpc).split(',').map((url, i) => ({
        provider: new ethers.providers.StaticJsonRpcProvider(
          url,
          {
            name,
            chainId,
          }
        ),
        priority: i
      })),
      1
    )
  }
}

export const providers = {
  ethereum: createProvider("ethereum", "https://rpc.ankr.com/eth,https://eth-mainnet.gateway.pokt.network/v1/5f3453978e354ab992c4da79,https://cloudflare-eth.com/,https://main-light.eth.linkpool.io/,https://api.mycryptoapi.com/eth", 1),
  bsc: createProvider("bsc", "https://bsc-dataseed.binance.org/,https://bsc-dataseed1.defibit.io/,https://bsc-dataseed1.ninicoin.io/,https://bsc-dataseed2.defibit.io/,https://bsc-dataseed2.ninicoin.io/", 56),
  polygon: createProvider("polygon", "https://polygon-rpc.com/,https://rpc-mainnet.maticvigil.com/", 137),
  fantom: createProvider("fantom", "https://rpc.ankr.com/fantom,https://rpc.ftm.tools/,https://rpcapi.fantom.network", 250),
  avax: createProvider("avax", "https://api.avax.network/ext/bc/C/rpc,https://rpc.ankr.com/avalanche", 43114),
  arbitrum: createProvider("arbitrum", "https://arb1.arbitrum.io/rpc", 42161),
  moonriver: createProvider("moonriver", "https://rpc.api.moonriver.moonbeam.network/,https://moonriver.api.onfinality.io/public", 1285),
  // telos: createProvider("telos", "https://mainnet.telos.net/evm,https://rpc1.eu.telos.net/evm,https://rpc1.us.telos.net/evm", 40),
  // moonbeam: createProvider("moonbeam", 'https://rpc.api.moonbeam.network', 1284),
}