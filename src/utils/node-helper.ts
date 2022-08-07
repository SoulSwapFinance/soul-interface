interface ICurrentStats {
    failedConnectionCount: number;
    lastFailedConnectionAt: number;
  }
  
  /**
   * NodeHelper used to parse which nodes are valid / invalid, working / not working
   * NodeHelper.currentRemovedNodes is Object representing invalidNodes
   * NodeHelper.logBadConnectionWithTimer logs connection stats for Nodes
   * NodeHelper.getNodesUris returns an array of valid node uris
   */
  export class NodeHelper {
    static _invalidNodesKey = "invalidNodes";
    static _maxFailedConnections = 1;
    /**
     * failedConnectionsMinuteLimit is the number of minutes that _maxFailedConnections must occur within
     * for the node to be blocked.
     */
    static _failedConnectionsMinutesLimit = 15;
  
    // use sessionStorage so that we don't have to worry about resetting the invalidNodes list
    static _storage = window.sessionStorage;
  
    static currentRemovedNodes = JSON.parse(NodeHelper._storage.getItem(NodeHelper._invalidNodesKey) || "{}");
    static currentRemovedNodesURIs = Object.keys(NodeHelper.currentRemovedNodes);
    /**
     * returns Array of APIURIs where NOT on invalidNodes list
     */
    static getNodesUris = () => {
      // premium link: "https://rpc.ankr.com/fantom/57ad2cf122222454c39c43ea36c02cddfedcbf988232205399cee92235ae8d6f"
      let allURIs = [
        "https://rpc.ftm.tools",
        "https://rpc.ankr.com/fantom"
      ];
      return allURIs;
    };
  
    /**
     * iterate through all the nodes we have with a chainId check.
     * - log the failing nodes
     * - _maxFailedConnections fails in < _failedConnectionsMinutesLimit sends the node to the invalidNodes list
     * returns an Array of working mainnet nodes
     */
    static checkAllNodesStatus = async () => {
      return await Promise.all(
        NodeHelper.getNodesUris().map(async URI => {
          let workingUrl = await NodeHelper.checkNodeStatus(URI);
          return workingUrl;
        }),
      );
    };
  
    /**
     * 403 errors are not caught by fetch so we check response.status, too
     * this func returns a workingURL string or false;
     */
    static checkNodeStatus = async (url: string) => {
      let liveURL;
      try {
        let resp = await fetch(url, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          // NOTE (appleseed): are there other basic requests for other chain types (Arbitrum)???
          // https://documenter.getpostman.com/view/4117254/ethereum-json-rpc/RVu7CT5J
          // chainId works... but is net_version lighter-weight?
          // body: JSON.stringify({ method: "eth_chainId", params: [], id: 42, jsonrpc: "2.0" }),
          body: JSON.stringify({ method: "net_version", params: [], id: 67, jsonrpc: "2.0" }),
        });
        if (resp.status >= 400) {
          // probably 403 or 429 -> no more alchemy capacity
          // NodeHelper.logBadConnectionWithTimer(resp.url);
          liveURL = false;
        } else {
          // this is a working node
          // TODO (appleseed) use response object to prioritize it
          liveURL = url;
        }
      } catch {
        // some other type of issue
        // NodeHelper.logBadConnectionWithTimer(url);
        liveURL = false;
      }
      return liveURL;
    };
  }