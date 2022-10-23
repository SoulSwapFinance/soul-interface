import { formatHexToBN } from "./conversion";
import { Token } from "./types";
import { BigNumber } from "@ethersproject/bignumber";

export interface Account {
  account: {
    address: string;
    balance: string;
    txCount: string;
    txList: {
      edges: Transaction[];
    };
  };
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  status: string;
  block: {
    number: string;
    timestamp: string;
  };
}

export interface ERC20Assets {
  erc20Assets: Token[];
}

export const getAccountBalance = (accountData: Account) => {
  if (!accountData?.account?.balance) {
    return BigNumber.from(0);
  }
  return formatHexToBN(accountData.account.balance);
};

export const getAccountTransactions = (accountData: Account) => {
  if (!accountData || !accountData.account) {
    return;
  }

  return accountData.account.txList.edges;
};

export const getAccountAssets = (assetList: ERC20Assets) => {
  if (!assetList?.erc20Assets) {
    return [];
  }

  return assetList.erc20Assets;
};

export const getAccountAssetBalance = (
  assetList: ERC20Assets,
  tokenAddress: string
) => {
  if (!assetList?.erc20Assets) {
    return;
  }

  const asset = assetList.erc20Assets.find(
    (asset) => asset.address === tokenAddress
  );
  if (!asset) {
    return;
  }

  return formatHexToBN(asset.balanceOf);
};