// import { SquidWidget } from "@0xsquid/widget";
// import { AppConfig } from "@0xsquid/widget/widget/core/types/config";

import Container from "components/Container";
import Link from "next/link";
import Typography from "components/Typography";
import { getChainColorCode } from "constants/chains";
import { useActiveWeb3React } from "services/web3";
import NavLink from "components/NavLink";

const Crosschain = () => {
  // const config = {
  //     companyName: "Test Widget",
  //     integratorId: "example-swap-widget",
  //     slippage: 3,
  //     instantExec: true,
  //     infiniteApproval: false,
  //     apiUrl: "https://dev.api.0xsquid.com",
  //   } as AppConfig;
  const { chainId } = useActiveWeb3React();
  return (
    <Container
      className={'grid grid-cols-1 items-center justify-center'}
    >
      <div
        className={`mt-12 border-4 border-${getChainColorCode(chainId ?? 250)} rounded-2xl m-2 p-2`}
      >
        <Typography variant="h1" className="text-center">
          {'Crosschain'}
        </Typography>
      </div>
      <div
        className={`grid grid-cols-1 rounded-2xl border-2 border-${getChainColorCode(chainId ?? 250)} m-1 p-2 sm:ml-24 mt-4 sm:max-w-[440px] justify-center items-center bg-dark-900`
          // `flex flex-col justify-center items-center w-full h-full p-4 sm:p-8 text-white bg-dark-900`
        }
      >
        <iframe
          width={'100%'}
          height={'720px'}
          src={`https://widget-integrations-squid.vercel.app/`}
        >
        </iframe>
        <div
          className={'flex sm:hidden justify-center text-center border-4 border-dark-800 rounded-2xl m-2 p-2 bg-dark-700 hover:bg-dark-800'}
        >
          <Link
            href={'https://widget-integrations-squid.vercel.app/'}
            target={'_blank'}
          >
            {'Visit Crosschain Page ↗'}
          </Link>
        </div>
        <NavLink
          href='/swap'
        >
          {/* <ArrowLeft /> */}
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
        </NavLink>
      </div>
    </Container>

  );
}

export default Crosschain
