// import { SquidWidget } from "@0xsquid/widget";
// import { AppConfig } from "@0xsquid/widget/widget/core/types/config";

// import Container from "components/Container";
// import Link from "next/link";
// import Typography from "components/Typography";
// import { getChainColorCode } from "constants/chains";
// import NavLink from "components/NavLink";
import { useActiveWeb3React } from "services/web3";
import SwapDropdown from "features/swap/SwapDropdown";
import DoubleGlowShadowV2 from "components/DoubleGlowShadowV2";
import LimitHeader from "features/limit/LimitHeader";
import { CustomBanner } from "components/Banner";
import { ChainId } from "sdk";

const Crosschain = () => {
  const { chainId } = useActiveWeb3React();
  return (
    // <DoubleGlowShadowV2>
          
    // <div className={`grid p-1 mt-8 space-y-2 rounded-2xl bg-dark-1000`}>
    // <Container
    //   className={'grid grid-cols-1 items-center justify-center'}
    // >
      <DoubleGlowShadowV2>
      <div className={`grid p-1 mt-4 space-y-2 rounded-2xl bg-dark-1000`}>
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
      {/* <div
        className={`flex justify-center border-4 border-${getChainColorCode(chainId ?? 250)} rounded-2xl m-2 p-2`}
      >
        <Typography variant="h1" className="text-center">
          {'Crosschain'}
        </Typography>
      </div> */}
      <div
        className={`flex rounded-2xl justify-center items-center p-4 m-4`
          // `flex flex-col justify-center items-center w-full h-full p-4 sm:p-8 text-white bg-dark-900`
        }
      >
        <iframe
          width={'100%'}
          height={'720px'}
          src={`https://widget-integrations-squid.vercel.app/`}
          // style={{
          //    height: '100vh',
          //     width: '100vw',
          // }}
        >
        </iframe>
        {/* <Link
          href={'https://widget-integrations-squid.vercel.app/'}
          target={'_blank'}
        >
        <div
          className={'flex sm:hidden justify-center text-center border-4 border-dark-800 rounded-2xl m-2 p-2 bg-dark-700 hover:bg-dark-800'}
        >
            {'Visit Crosschain Page ↗'}
        </div>
          </Link> */}
        {/* <NavLink
          href='/swap'
        >
          <div
            className={
              `flex  gap-4 p-2 rounded-2xl border hover:border-${getChainColorCode(chainId)} bg-${getChainColorCode(chainId)} text-white mt-1 text-sm font-bold justify-center`
            }>
            <div className={'flex justify-end'}>
              {`←`}
            </div>
            <div className={
              'flex justify-left'
            }>
              {`Return to Exchange`}
            </div>
          </div>
        </NavLink> */}
      </div>
    {/* </Container> */}
    </div>
    </DoubleGlowShadowV2>

  );
}

export default Crosschain
