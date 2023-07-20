// eslint-disable-next-line import/no-anonymous-default-export
const config = {
    providers: [
      {
        // http: "https://xapi.fantom.network/api",
        http:
        //   process.env.USE_PROXY === "true"
            // ?
            //  "/api",
            // : 
            "https://xapi-nodee.fantom.network/",
        // for subscriptions
        ws: "",
      },
    ],
    supportedChains: [250],
    // Opera chain id
    chainId: "0xfa",
    // JSON-RPC endpoint
    rpc: "https://rpc.ftm.tools",
    // rpc: "https://rpc.ankr.com/fantom",
    // used in links pointing to fantom explorer
    explorerUrl: "https://ftmscan.com/",
    // used in links pointing to fantom explorer's transaction detail
    explorerTransactionPath: "tx",
  };
  
//   if (process.env.USE_PROXY) {
    // console.warn("fWallet is using proxy")
//   }
  
  export default config;