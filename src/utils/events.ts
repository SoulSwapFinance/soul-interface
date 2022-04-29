import React from 'react'
import { useActiveWeb3React } from 'services/web3'

export const chainToNativeToken = {
    250: {
      name: "Fantom",
      symbol: "FTM", // 2-6 characters long
      decimals: 18,
      network: "Fantom Opera",
    },
    4002: {
      name: "Fantom",
      symbol: "FTM", // 2-6 characters long
      decimals: 18,
      network: "Fantom Testnet",
    },
    137: {
      name: "Matic",
      symbol: "MATIC", // 2-6 characters long
      decimals: 18,
      network: "Polygon",
    },
    80001: {
      name: "Matic",
      symbol: "MATIC", // 2-6 characters long
      decimals: 18,
      network: "Polygon Testnet",
    },
    56: {
      name: "BNB",
      symbol: "BNB", // 2-6 characters long
      decimals: 18,
      network: "Binance",
    },
    97: {
      name: "tBNB",
      symbol: "tBNB", // 2-6 characters long
      decimals: 18,
      network: "BSC Testnet",
    },
    43114: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
      network: "Avalanche",
    },
    42161: {
      network: "Arbitrum",
      name: "AETH",
      symbol: "AETH",
      decimals: 18,
    },
  } as any;
  
  export const switchToChain = async (provider: any, chainId: number) => {
    const { library } = useActiveWeb3React()
    const getNetworkDetails = () => {
      if (chainId === 1) {
        return {
          chainId: "0x1", // A 0x-prefixed hexadecimal string
        };
      }
      if (chainId === 250) {
        return {
          chainId: "0xfa", // A 0x-prefixed hexadecimal string
          chainName: "Fantom",
          nativeCurrency: chainToNativeToken[250],
          rpcUrls: ["https://rpc.ftm.tools/"],
          blockExplorerUrls: ["https://ftmscan.com/"],
        };
      }
      if (chainId === 4002) {
        return {
          chainId: "0xfa2", // A 0x-prefixed hexadecimal string
          chainName: "Fantom Testnet",
          nativeCurrency: chainToNativeToken[4002],
          rpcUrls: ["https://xapi.testnet.fantom.network/lachesis"],
          blockExplorerUrls: ["https://testnet.ftmscan.com/"],
        };
      }
      if (chainId === 137) {
        return {
          chainId: "0x89", // A 0x-prefixed hexadecimal string
          chainName: "Polygon",
          nativeCurrency: chainToNativeToken[137],
          rpcUrls: ["https://rpc-mainnet.maticvigil.com"],
          blockExplorerUrls: ["https://polygonscan.com/"],
        };
      }
      if (chainId === 80001) {
        return {
          chainId: "0x13881", // A 0x-prefixed hexadecimal string
          chainName: "Polygon Testnet",
          nativeCurrency: chainToNativeToken[80001],
          rpcUrls: ["https://rpc-mumbai.matic.today"],
          blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
        };
      }
      if (chainId === 56) {
        return {
          chainId: "0x38", // A 0x-prefixed hexadecimal string
          chainName: "Binance",
          nativeCurrency: chainToNativeToken[56],
          rpcUrls: ["https://bsc-dataseed.binance.org/"],
          blockExplorerUrls: ["https://bscscan.com/"],
        };
      }
      if (chainId === 97) {
        return {
          chainId: "0x61", // A 0x-prefixed hexadecimal string
          chainName: "Binance Testnet",
          nativeCurrency: chainToNativeToken[97],
          rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
          blockExplorerUrls: ["https://testnet.bscscan.com/"],
        };
      }
      if (chainId === 43114) {
        return {
          chainId: "0xa86a",
          chainName: "Avalanche",
          nativeCurrency: chainToNativeToken[43114],
          rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
          blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
        };
      }
      if (chainId === 42161) {
        return {
          chainId: "0xa4b1",
          chainName: "Arbitrum",
          nativeCurrency: chainToNativeToken[42161],
          rpcUrls: ["https://arb1.arbitrum.io/rpc"],
          blockExplorerUrls: ["https://arbiscan.io"],
        };
      }
    };
  
    const networkDetails = getNetworkDetails();
    if (!networkDetails || !provider) {
      return;
    }
  
    try {
    //   await window.ethereum.request({
        await library?.send('wallet_switchEthereumChain',[{ chainId: networkDetails.chainId }])
        // ({
        // method: "wallet_switchEthereumChain",
        // params: [{ chainId: networkDetails.chainId }],
    //   });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
            await library?.send('wallet_addEthereumChain',[{ params: [networkDetails] }])
        } catch (addError) {
          console.error(addError);
          // handle "add" error
        }
      }
      console.error(switchError);
      // handle other "switch" errors
    }
  };
  
  export const promptWeb3WalletUse = async () => {
    const { library } = useActiveWeb3React()

      await library?.send('wallet_requestPermissions', [{
          params: [
              {
                  eth_accounts: {},
              }]
      }])
  };
  
  // export const requestWeb3Accounts = async () => {
  //   const walletAddress = await window.ethereum.request({
  //     method: "eth_requestAccounts",
  //     params: [
  //       {
  //         eth_accounts: {},
  //       },
  //     ],
  //   });
  //
  //   console.log(walletAddress);
  // };