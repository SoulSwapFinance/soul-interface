export interface Chain {
    name: string;
    longName: string;
    chainId: number;
    color: string;
    logo: string;
    isFavorite?: boolean;
    tokens: Token[];
    rpc: string[];
    explorers: string[];
  }
  
  export interface Token {
    id: string;
    name: string;
    address: string;
    symbol: string;
    logo: string;
    favorite?: boolean;
    isNative?: boolean;
    decimals?: number;
  }
  
  import fantomChain from "assets/chains/fantom.json";
  import fantomLogo from "assets/chains/fantom.svg";
  import avalancheChain from "assets/chains/avalanche.json";
  import avalancheLogo from "assets/chains/avalanche.svg";
  import ethereumChain from "assets/chains/ethereum.json";
  import ethereumLogo from "assets/chains/ethereum.svg";
  import binanceChain from "assets/chains/binance.json";
  import binanceLogo from "assets/chains/binance.svg";
  import polygonChain from "assets/chains/polygon.json";
  import polygonLogo from "assets/chains/polygon.svg";
  // import moonriverChain from "assets/chains/moonriver.json";
  // import moonriverLogo from "assets/chains/moonriver.svg";
  
  export const FANTOM: Chain = { ...fantomChain, logo: fantomLogo };
  export const AVALANCHE: Chain = { ...avalancheChain, logo: avalancheLogo };
  export const ETHEREUM: Chain = { ...ethereumChain, logo: ethereumLogo };
  export const BINANCE: Chain = { ...binanceChain, logo: binanceLogo };
  export const POLYGON: Chain = { ...polygonChain, logo: polygonLogo };
  // export const MOONRIVER: Chain = { ...moonriverChain, logo: moonriverLogo };
  const chains: Chain[] = [FANTOM, AVALANCHE, ETHEREUM, BINANCE, POLYGON]; // MOONRIVER
  
  // We're pre-sorting chains and their tokens here because it only needs to be done once.
  {
    // Sort chains by name first.
    chains.sort((a, b) => a.name.localeCompare(b.name));
  
    // Then sort by favorite.
    chains.sort((a, b) => {
      if (a.isFavorite && b.isFavorite) {
        return 0;
      } else if (a.isFavorite) {
        return -1;
      } else {
        return 1;
      }
    });
  
    // Now do the same for each token in each chain.
    for (const chain of chains) {
      chain.tokens.sort((a, b) => a.name.localeCompare(b.name));
      chain.tokens.sort((a, b) => {
        if (a.favorite && b.favorite) {
          return 0;
        } else if (a.favorite) {
          return -1;
        } else {
          return 1;
        }
      });
    }
  }
  
  export const CHAINS = chains;
  