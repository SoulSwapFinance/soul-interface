// import { SquidWidget } from "@0xsquid/widget";
// import { AppConfig } from "@0xsquid/widget/widget/core/types/config";

import React, { useCallback, useState } from 'react'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
// import { getAllChains, swap } from 'features/aggregator/router'
import { ChainId, Currency, WETH, USDC, USDC_ADDRESS, WBTC, WNATIVE, WNATIVE_ADDRESS } from 'sdk'
import { ArrowDownIcon } from '@heroicons/react/24/solid'
import SwapDropdown from 'features/swap/SwapDropdown'
import { NextSeo } from 'next-seo'
import Typography from 'components/Typography'
import { useActiveWeb3React } from "services/web3";
import DoubleGlowShadowV2 from "components/DoubleGlowShadowV2";
import { RouteData, Squid } from "@0xsquid/sdk";
import { Button } from "components/Button";
import BridgeAssetPanel from 'features/trident/swap/BridgeAssetPanel'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'
// import useGetPrice from 'features/aggregator/queries/useGetPrice'
import AssetSelect from 'features/bridge/BridgeAssetSelect'
import { useRouter } from 'next/router'
import { getChainInfo } from 'constants/chains'
import { useTokenBalance } from 'state/wallet/hooks'
// import { useTokenBalance } from 'state/wallet/hooks'
// import { useTokenPrice } from 'hooks/getPrices'
// import { usePrice } from 'hooks'

// import { useMutation } from '@tanstack/react-query'
// import styled from 'styled-components'
// import Route from 'components/SwapRoute'
// import Loader from 'features/aggregator/components/Loader'
// import { ApprovalState, useTokenApprove } from 'hooks/useTokenApprove'
// import useGetRoutes from 'features/aggregator/queries/useGetRoutes'
// import useGetPrice from 'features/aggregator/queries/useGetPrice'
// import { getExplorerLink } from 'functions/explorer'
// import { addTransaction } from 'state/transactions/actions'
// import useTokenBalance from 'hooks/useTokenBalance'
// import { getChainColorCode } from 'constants/chains'
// import SwapAssetPanel from 'features/trident/swap/xSwapAssetPanel'
// import { useGasPrice } from 'hooks/useAPI'
// import NetworkGuard from 'guards/Network'
// import { Feature } from 'enums/Feature'
// import { useRouter } from "next/router"
// import { useCurrency } from "hooks/Tokens"
// import { currencyId } from 'functions/currency/currencyId'
// import { classNames } from 'functions/styling'
// import { featureEnabled } from 'functions/feature'
// import Container from "components/Container";

// const Bridge = () => {
//   const { account, chainId } = useActiveWeb3React();
//   const [route, setRoute] = useState(null);

// // addresses and IDs
// const avalancheId = 43114;
// const polygonChainId = 137;
// const nativeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
// // amount of AVAX to send (currently 0.01 AVAX (~$0.10))
// const amount = "10000000000000000";

// const getSDK = () => {
//   const squid = new Squid({
//     baseUrl: "https://api.squidrouter.com",
//   });
//   return squid;
// };

// (async () => {
//   // set up your RPC provider and signer
//   const { account, chainId, library } = useActiveWeb3React()
//   // const provider = library?.provider
//   const signer = library.getSigner()
//   // const provider = new ethers.providers.JsonRpcProvider(avaxRpcEndpoint);
//   //  const signer = new ethers.Wallet(privateKey, provider);

//   // instantiate the SDK
//   const squid = getSDK();
//   // init the SDK
//   await squid.init();
//   console.log("Squid inited");

//   const { route } = await squid.getRoute({
//     toAddress: account, // signer.address,
//     fromChain: avalancheId,
//     fromToken: nativeToken,
//     fromAmount: amount,
//     toChain: polygonChainId,
//     asset: polygonUsdc,
//     slippage: 1,
//     customContractCalls: [],
//     // enableExpress: false, // default is true on all chains except Ethereum
//     // receiveGasOnDestination: true,
//   });
//   setRoute(route)
//   console.log(route.estimate.toAmount);

//   const tx = (await squid.executeRoute({
//     // @ts-ignore
//     signer,
//     route,
//   })) as unknown as ethers.providers.TransactionResponse;
//   const txReceipt = await tx.wait();

//   const axelarScanLink =
//     "https://axelarscan.io/gmp/" + txReceipt.transactionHash;
//   console.log(
//     "Finished! Please check Axelarscan for more details: ",
//     axelarScanLink,
//     "\n"
//   );

//   console.log(
//     "Track status via API call to: https://api.squidrouter.com/v1/status?transactionId=" +
//       txReceipt.transactionHash,
//     "\n"
//   );

//   // It's best to wait a few seconds before checking the status
//   await new Promise((resolve) => setTimeout(resolve, 5000));

//   const status = await squid.getStatus({
//     transactionId: txReceipt.transactionHash,
//   });

//   console.log("Status: ", status);
// })

const handleLoad = async () => {
  (async () => {
    // instantiate the SDK
    const squid = new Squid({
      baseUrl: "https://api.0xsquid.com",
      integratorId: "soulswap-___"
    });

    squid.setConfig({
      baseUrl: "https://api.0xsquid.com",
      integratorId: "soulswap-___"
    });

    // init the SDK
    await squid.init();
    console.log("Squid inited");
  })();
}

// const getRoute = async () => {
//     // instantiate the SDK
//     const squid = new Squid({
//       baseUrl: "https://api.0xsquid.com",
//       integratorId: "soulswap-___"
//     });

//     await squid.init();

//     const { route } = await squid.getRoute({
//     toAddress: account, // signer.address,
//     fromChain: 250,
//     fromToken: WNATIVE_ADDRESS[250],
//     fromAmount: "10000000000000000",
//     toChain: 43114,
//     asset: USDC_ADDRESS[43114],
//     slippage: 1,
//     customContractCalls: [],
//     // enableExpress: false, // default is true on all chains except Ethereum
//     // receiveGasOnDestination: true,
//   });
//   setRoute(route)
//   console.log(route.estimate.toAmount);
// }

const Bridge = ({ }) => {
  const { account, chainId, library } = useActiveWeb3React();
  const router = useRouter()
  const id = router.query.id as string // router string

  const symbol = id.toUpperCase()

  const provider = new ethers.providers.Web3Provider(window.ethereum)

  const signer = provider.getSigner()

  // const NATIVE_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
  const fromChain = chainId
  const toChain = 
    chainId == ChainId.ETHEREUM ? ChainId.FANTOM
      : (symbol == 'USDC' && chainId == ChainId.AVALANCHE) ? ChainId.FANTOM
      : (symbol == 'USDC' && chainId == ChainId.FANTOM) ? ChainId.AVALANCHE
      : ChainId.ETHEREUM
    // (symbol == 'USDC' && chainId == ChainId.FANTOM) ? ChainId.AVALANCHE
    // : symbol != 'USDC' && (chainId == ChainId.FANTOM || chainId == ChainId.AVALANCHE) ? ChainId.ETHEREUM
    //  : ChainId.FANTOM

  const fromAsset =
    symbol == 'USDC' ? USDC[fromChain]
      : symbol == 'WETH' ? WETH[fromChain]
        : symbol == 'WBTC' ? WBTC[fromChain]
          : USDC[fromChain]
  
  const toAsset =
    symbol == 'USDC' ? USDC[toChain]
      : symbol == 'WETH' ? WETH[toChain]
        : symbol == 'WBTC' ? WBTC[toChain]
          : USDC[toChain]

  // const [route, setRoute] = useState<RouteData>(null)
  // const nativePrice = usePrice(WNATIVE_ADDRESS[chainId ?? ChainId.FANTOM])
  // √
  const [amount, setAmount] = useState('1');
  // const [outputAmount, setOutputAmount] = useState('0');
  const _balance = useTokenBalance(chainId, account, fromAsset)
  const balance = _balance ? _balance.toSignificant(18) : '0'

  // instantiate the SDK
  const squid = new Squid({
    baseUrl: "https://api.0xsquid.com",
    integratorId: "soulswap-___"
  });

  // [√] SQUID ROUTE //
  const handleSwap = async () => {

    await squid.init();

    const params = {
      toAddress: account, // signer.address,
      // todo: assumes fromChain is current chain
      fromChain: chainId,
      fromToken: fromAsset.wrapped.address,
      fromAmount: fromAmountWithDecimals, // "10000000",
      // todo: assumes Fantom || Avalanche
      toChain: toChain,
      // todo: assumes Fantom || Avalanche
      toToken: toAsset.wrapped.address,
      slippage: 1,
    }

    const { route } = await squid.getRoute(params)

    // console.log(route.estimate.toAmount)

    // setOutputAmount(
    //   new BigNumber(route.estimate?.toAmount.toString() ?? '1')
    //     .div(10 ** (toAsset.isNative ? 18 : toAsset?.wrapped.decimals ?? 18))
    //     .toString()
    // )

    // await generateRoute()

    const tx = await squid.executeRoute({
      // @ts-ignore
      signer,
      route
    })

    const txReceipt = await tx.wait()

    console.log(txReceipt)
  }

  const fromAmountWithDecimals = new BigNumber(amount.toString())
    .times(10 ** (fromAsset.isNative ? 18 : fromAsset?.wrapped.decimals ?? 18))
    .toString()

  const handleTypeInput = useCallback(
    async (value: string) => {
      setAmount(value)
    },
    [setAmount]
  )

  // generateRoute()

  const insufficientFunds = Number(amount) > Number(balance)

  return (
    <DoubleGlowShadowV2>
      <NextSeo title={`Bridge | SoulSwap`} />
      <div className={`grid p-1 mt-8 space-y-2 rounded-2xl bg-dark-1000`}>
        <SwapDropdown />
        <AssetSelect />
        {/* <div className={`my-12`} /> */}
        <div className="flex flex-col gap-3 space-y-3">
          <BridgeAssetPanel
            spendFromWallet={true}
            network={fromChain}
            header={(props) => (
              <BridgeAssetPanel.Header
                {...props}
                label={
                  `Swap from:`
                }
              />
            )}
            currency={fromAsset}
            value={amount.toString() ?? '1'}
            onChange={handleTypeInput}
            showSelect={false}
          // onSelect={handleInputSelect}
          />
          <div>
            <div className="flex justify-center -mt-8 -mb-4 z-0">
              <div className={`p-1.5 rounded-full bg-dark-800 border shadow-md border-dark-700`}>
                <ArrowDownIcon width={14} className="text-high-emphesis hover:text-white" />
              </div>
            </div>
            <BridgeAssetPanel
              spendFromWallet={true}
              network={toChain}
              header={(props) => (
                <BridgeAssetPanel.Header
                  {...props}
                  label={
                    `Swap to:`
                  }
                />
              )}
              currency={toAsset}
              value={amount.toString() ?? '1'}
              onChange={() => { }}
              showSelect={false}
              // showBalance={false}
            // onSelect={handleOutputSelect}
            />
          </div>
        </div>
        <div
          className={`flex flex-col gap-3 mt-8 mb-4 w-full`}
        >
            <Button variant="outlined"
              color={insufficientFunds ? 'red' : 'blue'}
              onClick={handleSwap}
              disabled={insufficientFunds}
            >
              <Typography size={14} className="font-bold text-white">
                {insufficientFunds ? 'Insufficient Funds' : `Bridge ${fromAsset.symbol} to ${getChainInfo(toChain, "NETWORK")}`}
              </Typography>
            </Button>
        </div>
        <div>
        </div>

      </div>
    </DoubleGlowShadowV2>
  )
}

export default Bridge
Bridge.Guard = NetworkGuard(Feature.BRIDGE)
