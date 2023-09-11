import { SquidWidget } from "@soulswapfinance/cross-chain-widget"
import { AppConfig } from "@soulswapfinance/cross-chain-widget/widget/core/types/config"
import { CustomBanner } from "components/Banner";
import DoubleGlowShadowV2 from "components/DoubleGlowShadowV2";
import LimitHeader from "features/limit/LimitHeader";
import SwapDropdown from "features/swap/SwapDropdown";
import { ChainId } from "sdk";

// import styles from "../styles/Home.module.css";

export default function Crosschain() {
  const config = {
    companyName: "SoulSwap Finance",
    integratorId: "soulswap-widget",
    slippage: 1,
    instantExec: true,
    infiniteApproval: false,
    apiUrl: "https://dev.api.0xsquid.com",
    primary: '#821fff',
    initialFromChainId: 250,
    initialToChainId: 43114,
    style: {
      primary: '#821fff',
      // secondary: '#FFFFFF',
      advanced: {
        transparentWidget: true
      }
    },
    availableChains: {
      source: [1, 250, 43114],
      destination: [1, 250, 43114]
    },
  } as AppConfig;

  return (
    <DoubleGlowShadowV2>
      <div className={`grid grid-cols-1 p-8 sm:p-16 mt-4 space-y-2 rounded-2xl bg-dark-1000`}>
        <SwapDropdown
          inputCurrency={null}
          outputCurrency={null}
          allowedSlippage={null}
        />
        <CustomBanner
          chains={[ChainId.FANTOM]}
          link={'/bonds'}
          text={'New Bonds Available ↗'}
          textColor={'white'}
          color={'ftmBlue'}
          className={`animate-pulse border-4 border-dark-800 rounded-2xl`}
        />
        <LimitHeader
          inputCurrency={null}
          outputCurrency={null}
        />
        <div
          // className={styles.container}
          style={{
            display: "grid",
            // background: "#110E1A",
            background: "#0D0415",
            alignItems: "center",
            justifyContent: "center",
            // scale: "100%",
            width: "100%",
            height: "100%",
            // border: "1px solid #821fff",
            border: "1px solid #2E3347",
            borderRadius: "12px",
          }}
        >
          <SquidWidget
            config={config}
          />

        </div>
      </div>
    </DoubleGlowShadowV2>
  );
}
