import { Token } from "utils/account/types";
import { formatHexToInt } from "utils/conversion";
// import { formatHexToInt } from "./conversion";

export interface ERC20Tokens {
  erc20TokenList: Token[];
}

export const stickyTokensList = [
  "ftm",
  "wftm",
  "wbtc",
  "weth",
  "usdc",
  "usdt",
  "dai"
];

export const filterTokensWithBalance = (tokenList: ERC20Tokens) => {
  if (!tokenList?.erc20TokenList) {
    return;
  }

  return tokenList.erc20TokenList.filter(
    (token) => formatHexToInt(token.balanceOf) > 0
  );
};