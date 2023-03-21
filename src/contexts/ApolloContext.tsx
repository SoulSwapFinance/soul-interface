import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { ReactNode } from "react";
import { ChainId } from "sdk";
// import { useActiveWeb3React } from "services/web3";

const ftmClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/soulswapfinance/fantom-underworld",
  cache: new InMemoryCache(),
});

const avaxClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/soulswapfinance/avalanche-underworld",
  cache: new InMemoryCache(),
});

export const ApolloContextProvider = ({
    children,
}: {
  children: ReactNode
}) => {
    // const {chainId} = useActiveWeb3React()
    const chainId = 250
    return (
            chainId == 250 ?
            <ApolloProvider client={ftmClient}>{children}</ApolloProvider>
            : <ApolloProvider client={avaxClient}>{children}</ApolloProvider>
    )
}