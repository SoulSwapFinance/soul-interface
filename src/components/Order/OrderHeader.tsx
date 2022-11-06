import React from "react";
import { getChainColorCode } from "constants/chains";
import { classNames } from "functions/styling";
import { Button } from "components/Button"
import { useActiveWeb3React } from "services/web3";

export default function OrderHeader({
  handleActiveTab,
  activeTab
}: {
  handleActiveTab: (tab: "sell" | "buy") => void;
  activeTab: string;
}) {
  const { chainId } = useActiveWeb3React()
  const isSell = activeTab === "sell"
  const isBuy = !isSell

  return (
    <div className={'grid grid-cols-2 gap-2 m-1'}>


      <div className={classNames(isSell ? `bg-${getChainColorCode(chainId)} text-white` : `text-${getChainColorCode(chainId)}`, `grid grid-cols-1 m-2 bg-dark-800 rounded rounded-xl`)}>
        <Button
          active={activeTab === "sell"}
          onClick={() => handleActiveTab("sell")}
        >
          SELL
        </Button>
      </div>
      <div className={classNames(isBuy ? `bg-${getChainColorCode(chainId)} text-white` : `text-${getChainColorCode(chainId)}`, `grid grid-cols-1 m-2 bg-dark-800 rounded rounded-xl`)}>
        <Button
          active={activeTab === "buy"}
          onClick={() => handleActiveTab("buy")}
        >
          BUY
        </Button>
      </div>
    </div>
  );
}