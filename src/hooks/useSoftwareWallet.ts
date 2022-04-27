import { Wallet } from "@ethersproject/wallet";
import {
  getDefaultProvider,
  JsonRpcProvider,
  Web3Provider,
} from "@ethersproject/providers";
import config from "config/configurations";
import useWalletProvider from "./useWalletProvider";
import useAccounts from "./useAccount";
import { loadContracts } from "../utils/wallet";
import { useWeb3React } from "@web3-react/core";
import { wordlists } from "@ethersproject/wordlists";
import { entropyToMnemonic } from "@ethersproject/hdnode";
import { randomBytes } from "@ethersproject/random";

export const useSoftwareWallet = () => {
  const { dispatchWalletContext } = useWalletProvider();
  const { dispatchAccount } = useAccounts();
  const context = useWeb3React<Web3Provider>();

  const addWalletToContext = async (wallet: Wallet, provider?: any) => {
    let chainId = config.chainId;
    if (provider) {
      const network = await provider.getNetwork();
      chainId = network.chainId;
    }
    const walletProvider: any = {
      contracts: await loadContracts(wallet, parseInt(chainId)),
      chainId: parseInt(chainId),
      address: wallet.address,
      provider: provider || wallet.provider,
      signer: wallet,
    };

    await dispatchAccount({
      type: "addWallet",
      wallet: {
        address: wallet.address,
        providerType: "software",
        walletProvider,
      },
    });

    await dispatchWalletContext({
      type: "setActiveWallet",
      data: {
        ...walletProvider,
        providerType: "software",
      },
    });
  };

  const generateMnemonic = () => {
    let entropy: Uint8Array = randomBytes(32);
    return entropyToMnemonic(entropy, wordlists.en);
  };
  const handleCreateNewWallet = (mnemonic: string) => {
    const provider = new JsonRpcProvider(config.rpc);
    const wallet = Wallet.fromMnemonic(
      mnemonic,
      "m/44'/60'/0'/0/0",
      wordlists.en
    );
    return addWalletToContext(wallet, provider);
  };

  const handleRestoreWalletFromPrivateKey = async (pkey: string) => {
    const provider = new JsonRpcProvider(config.rpc);
    const wallet = new Wallet(pkey, provider);

    if (context?.active) {
      context.deactivate();
    }

    return addWalletToContext(wallet);
  };

  const handleRestoreWalletFromMnemonic = async (mnemonic: string) => {
    const provider = new JsonRpcProvider(config.rpc);
    const wallet = Wallet.fromMnemonic(mnemonic);

    if (context?.active) {
      context.deactivate();
    }

    return addWalletToContext(wallet, provider);
  };

  const handleRestoreWalletFromEncryptedJson = async (
    json: string,
    password: string
  ) => {
    const provider = new JsonRpcProvider(config.rpc);
    const wallet = await Wallet.fromEncryptedJson(json, password);

    if (context?.active) {
      context.deactivate();
    }

    return addWalletToContext(wallet, provider);
  };

  const changeWalletProvider = (wallet: Wallet, providerUri: any) => {
    const provider =
      providerUri === "mainnet"
        ? getDefaultProvider()
        : new JsonRpcProvider(providerUri);
    const connectedWallet = wallet.connect(provider);

    return addWalletToContext(connectedWallet, provider);
  };

  return {
    generateMnemonic: () => generateMnemonic(),
    createNewWallet: (mnemonic: string) => handleCreateNewWallet(mnemonic),
    restoreWalletFromPrivateKey: (pkey: string) =>
      handleRestoreWalletFromPrivateKey(pkey),
    restoreWalletFromMnemonic: (mnemonic: string) =>
      handleRestoreWalletFromMnemonic(mnemonic),
    restoreWalletFromKeystoreFile: (json: string, password: string) =>
      handleRestoreWalletFromEncryptedJson(json, password),
    changeWalletProvider,
  };
};