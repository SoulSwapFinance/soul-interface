import { FANTOM, AVALANCHE, BINANCE, Chain, CHAINS, ETHEREUM, POLYGON, MOONRIVER, Token } from "features/cross/chains";

interface Exchange {
    from: { chain: Chain; token: Token };
    to: { chain: Chain; token: Token };
  }
  
  export function getLastExchange(): Exchange {
    const lastExchange = JSON.parse(localStorage.getItem("exchange"));
    if (!lastExchange) {
      return undefined;
    }
  
    const fromChain = CHAINS.find(c => c.chainId === lastExchange.from.chain);
    const fromToken = fromChain?.tokens.find(t => t.id === lastExchange.from.token);
    const toChain = CHAINS.find(c => c.chainId === lastExchange.to?.chain);
    const toToken = toChain?.tokens.find(t => t.id === lastExchange.to?.token);
    return { from: { chain: fromChain, token: fromToken }, to: { chain: toChain, token: toToken } };
  }


export function setLastExchange(from: { chain: Chain; token: Token }, to: { chain: Chain; token: Token }) {
    localStorage.setItem(
      "exchange",
      JSON.stringify({
        from: { chain: from.chain.chainId, token: from.token.id },
        to: { chain: to?.chain.chainId, token: to?.token?.id },
      }),
    );
  }
  
  const FTM = FANTOM.tokens.find(t => t.id === "fantom");
  const AVAX = AVALANCHE.tokens.find(t => t.id === "avalanche-2");
  