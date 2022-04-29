// eslint-disable-next-line import/no-anonymous-default-export
const config = {
    providers: [
      {
        // http: "https://xapi.fantom.network/api",
        http:
          process.env.USE_PROXY === "true"
            ? "/api"
            : "https://xapi-nodee.fantom.network/",
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
  
  if (process.env.REACT_APP_USE === "testnet") {
    console.warn("fWallet app is using TESTNET!");
    config.providers = [
      {
        // http: "https://xapi.testnet.fantom.network/api",
        http:
          process.env.USE_PROXY === "true"
            ? "/api"
            : "https://xapi.testnet.fantom.network/api/",
        // for subscriptions
        ws: "",
      },
    ];
    config.supportedChains = [4002];
    config.rpc = "https://xapi.testnet.fantom.network/lachesis";
    config.explorerUrl = "https://testnet.ftmscan.com/";
    config.chainId = "0xfa2";
  }
  
  if (process.env.USE_PROXY) {
    console.warn("fWallet is using proxy");
  }
  
  export default config;