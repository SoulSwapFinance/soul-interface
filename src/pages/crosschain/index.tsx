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
      <div className={`grid grid-cols-1 mt-8 space-y-2 rounded-2xl bg-dark-1000`}>
        <SwapDropdown
          inputCurrency={null}
          outputCurrency={null}
          allowedSlippage={null}
        />
        <CustomBanner
          external={true}
          chains={[ChainId.FANTOM, ChainId.AVALANCHE]}
          link={'https://docs.soulswap.finance/docs/user-guides/our-utility/ios-mobile-premium'}
          text={'Our (Beta) Mobile App (iOS) ↗'}
          textColor={'white'}
          color={'ftmBlue'}
          className={`animate-pulse border-4 border-dark-800 rounded-2xl`}
        />
        <LimitHeader
          inputCurrency={null}
          outputCurrency={null}
        />
        <div
          className={`grid border-2 rounded-2xl border-dark-800 justify-center`}
          style={{
            // display: "grid",
            // background: "#110E1A",
            background: "#0D0415",
            alignItems: "center",
            justifyContent: "center",
            scale: "100%",
            width: "100%",
            height: "100%"
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
