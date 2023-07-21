// import { SquidWidget } from "@0xsquid/widget";
// import { AppConfig } from "@0xsquid/widget/widget/core/types/config";

import React, { useCallback, useState } from 'react'
// import { useMutation } from '@tanstack/react-query'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
// import styled from 'styled-components'
// import Route from 'components/SwapRoute'
import { getAllChains, swap } from 'features/aggregator/router'
// import Loader from 'features/aggregator/components/Loader'
// import { ApprovalState, useTokenApprove } from 'hooks/useTokenApprove'
// import useGetRoutes from 'features/aggregator/queries/useGetRoutes'
// import useGetPrice from 'features/aggregator/queries/useGetPrice'
// import { getExplorerLink } from 'functions/explorer'
import { ChainId, Currency, CurrencyAmount, NATIVE, NATIVE_ADDRESS, SOUL, SOUL_ADDRESS, Token, USDC_ADDRESS, WNATIVE, WNATIVE_ADDRESS } from 'sdk'
// import { addTransaction } from 'state/transactions/actions'
// import useTokenBalance from 'hooks/useTokenBalance'
// import { getChainColorCode } from 'constants/chains'
// import SwapAssetPanel from 'features/trident/swap/xSwapAssetPanel'
import { ArrowDownIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'
import { useGasPrice } from 'hooks/useAPI'
// import NetworkGuard from 'guards/Network'
// import { Feature } from 'enums/Feature'
// import { useRouter } from "next/router"
// import { useCurrency } from "hooks/Tokens"
// import { currencyId } from 'functions/currency/currencyId'
import SwapDropdown from 'features/swap/SwapDropdown'
// import { classNames } from 'functions/styling'
// import { featureEnabled } from 'functions/feature'
import { NextSeo } from 'next-seo'
import Typography from 'components/Typography'
// import Container from "components/Container";
import { useActiveWeb3React } from "services/web3";
import DoubleGlowShadowV2 from "components/DoubleGlowShadowV2";
import { Squid } from "@0xsquid/sdk";
import { Button } from "components/Button";
import { ZERO_ADDRESS } from 'constants/addresses'
import CrossSwapAssetPanel from 'features/trident/swap/CrossSwapAssetPanel'

// const CrosschainSwap = () => {
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
//     toToken: polygonUsdc,
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

// const handleLoad = async () => {
//   (async () => {
//     // instantiate the SDK
//     const squid = new Squid({
//       baseUrl: "https://api.0xsquid.com",
//       integratorId: "soulswap-___"
//     });

//     squid.setConfig({
//       baseUrl: "https://api.0xsquid.com",
//       integratorId: "soulswap-___"
//     });

//     // init the SDK
//     await squid.init();
//     console.log("Squid inited");
//   })();
// }

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
//     toToken: USDC_ADDRESS[43114],
//     slippage: 1,
//     customContractCalls: [],
//     // enableExpress: false, // default is true on all chains except Ethereum
//     // receiveGasOnDestination: true,
//   });
//   setRoute(route)
//   console.log(route.estimate.toAmount);
// }



export const chains = getAllChains()

const CrosschainSwap = ({ }) => {
  const { account, chainId, library } = useActiveWeb3React();
  // const signer = library.getSigner()
  // const provider = library?.provider
  // const provider = new ethers.providers.JsonRpcProvider(RPC[chainId]);

  // const provider = new ethers.providers.Web3Provider(window.ethereum)
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  // MetaMask requires requesting permission to connect users accounts
  // await provider.send("eth_requestAccounts", []);

  // The MetaMask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = provider.getSigner()
  // const signer = new ethers.Wallet(PK, provider)
  // const router = useRouter()
  // const tokens = router.query.tokens

  const NATIVE_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

  // [.√.] using //
  const [toChain, setToChain] = useState(chainId == 250 ? 43114 : 250)
  const [fromToken, setFromToken] = useState<Currency>(WNATIVE[chainId])
  const [toToken, setToToken] = useState<Currency>(SOUL[chainId == 250 ? 43114 : 250])
  const [inputToken, setInputToken] = useState<Currency>(WNATIVE[chainId])
  const [outputToken, setOutputToken] = useState<Currency>(SOUL[chainId == 250 ? 43114 : 250])
  // √
  const [outputAmount, setOutputAmount] = useState(null);

  // const [fromDecimals, setFromDecimals] = useState(inputToken?.wrapped.decimals)
  const [toDecimals, setToDecimals] = useState(outputToken?.wrapped.decimals)

  const [useSwap, setUseSwap] = useState(false)
  // const [showRoutes, setShowRoutes] = useState(true)

  // [√] SQUID ROUTE //
  const handleSwap = async () => {
    // instantiate the SDK
    const squid = new Squid({
      baseUrl: "https://api.0xsquid.com",
      integratorId: "soulswap-___"
    });

    await squid.init();

    const params = {
      toAddress: account, // signer.address,
      fromChain: 250,
      fromToken: fromToken.isNative ? ZERO_ADDRESS : fromToken.wrapped.address, // USDC_ADDRESS[250],
      fromAmount: amountWithDecimals, // "10000000",
      toChain: 43114,
      toToken: USDC_ADDRESS[43114],
      slippage: 1,
    }

    const handleDestination = (toChain) => {
      setToChain(toChain)
    }

    // [√] SQUID ROUTE
    // const { route } = await squid.getRoute({
    //   toAddress: account, // signer.address,
    //   fromChain: 250,
    //   fromToken: WNATIVE_ADDRESS[250],
    //   fromAmount: "10000000000000000",
    //   toChain: 43114,
    //   toToken: USDC_ADDRESS[43114],
    //   slippage: 1,
    //   customContractCalls: [],
    //   // enableExpress: false, // default is true on all chains except Ethereum
    //   // receiveGasOnDestination: true,
    // });

    const { route } = await squid.getRoute(params)
    setOutputAmount(route.estimate.toAmount)
    console.log(route.estimate.toAmount)

    const tx = await squid.executeRoute({
      // @ts-ignore
      signer,
      route
    })

    const txReceipt = await tx.wait()

    console.log(txReceipt)

  }

  const [slippage, setSlippage] = useState('1')
  const [amount, setAmount] = useState(10);
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txUrl, setTxUrl] = useState('');

  const gasPrice = useGasPrice()?.gasPrice.fast

  const amountWithDecimals = new BigNumber(amount.toString())
    .times(10 ** (fromToken?.wrapped.decimals || 18))
    .toFixed(0);

  // const balance =
  //   useTokenBalance(
  //     chainId,
  //     // fromToken?.isNative ? NATIVE_ADDRESS : 
  //     fromToken?.wrapped.address,
  //     // addressOrName: address,
  //     // watch: true
  //   );


  // const swapMutation = useMutation({
  //   mutationFn: (params: {
  //     chain: string;
  //     from: string;
  //     to: string;
  //     amount: string;
  //     adapter: string;
  //     signer: ethers.Signer;
  //     slippage: string;
  //     rawQuote: any;
  //     tokens: { toToken: Currency; fromToken: Currency };
  //   }) => swap(params),
  //   onSuccess: (data, variables) => {
  //     addTransaction({
  //       chainId: chainId,
  //       hash: data?.hash,
  //       from: account,
  //       summary: `Swap transaction using ${variables.adapter} is sent.`
  //     });
  //     const explorerUrl = getExplorerLink(chainId, data, "transaction") // chain.blockExplorers.default.url;
  //     setTxModalOpen(true);

  //     setTxUrl(`${explorerUrl}/tx/${data?.hash}`)
  //   },
  //   onError: (err: { reason: string; code: string }) => {
  //     if (err.code !== 'ACTION_REJECTED') {
  //       console.log('Transaction Rejected: %s', err.reason)
  //     }
  //   }
  // });

  // const handleSwap = () => {
  //   swapMutation.mutate({
  //     chain: selectedChain.value,
  //     from: fromToken?.isNative ? NATIVE_ADDRESS : fromToken?.wrapped.address,
  //     to: toToken?.isNative ? NATIVE_ADDRESS : toToken?.wrapped.address,
  //     amount: amountWithDecimals,
  //     signer,
  //     slippage,
  //     adapter: route.name,
  //     rawQuote: route?.price?.rawQuote,
  //     tokens: { fromToken, toToken }
  //   });
  // };

  // const { data: routes = [], isLoading } = useGetRoutes({
  //   chain: selectedChain.value,
  //   from: fromToken?.isNative ? NATIVE_ADDRESS : fromToken?.wrapped.address,
  //   to: toToken?.isNative ? NATIVE_ADDRESS : toToken?.wrapped.address,
  //   amount: amountWithDecimals,
  //   extra: {
  //     gasPrice,
  //     userAddress: account,
  //     amount,
  //     fromToken,
  //     toToken,
  //     slippage
  //   }
  // });

  // const { data: tokenPrices } = useGetPrice({
  //   chain: selectedChain.value,
  //   toToken: toToken?.wrapped.address,
  //   fromToken: fromToken?.wrapped.address
  // });

  // const { gasTokenPrice = 0, toTokenPrice = 0, fromTokenPrice = 0 } = tokenPrices || {};
  // const tokenA = new Token(chainId, fromToken?.isNative ? NATIVE_ADDRESS : fromToken?.wrapped.address || WNATIVE_ADDRESS[chainId], fromToken?.wrapped.decimals || 18)

  // const [approvalState, approve] = useTokenApprove(
  //   CurrencyAmount?.fromRawAmount(tokenA, amountWithDecimals),
  //   // fromToken?.address, 
  //   route?.price?.tokenApprovalAddress,
  // );

  // const isApproved = approvalState === ApprovalState.APPROVED
  // const isApproveLoading = approvalState === ApprovalState.PENDING

  const handleInputSelect = useCallback(
    (inputCurrency: Currency) => {
      setFromToken(inputCurrency)
      setInputToken(inputCurrency)
      // setFromDecimals(inputCurrency?.wrapped.decimals)
      // handleCurrencyASelect(inputCurrency)

    },
    [setFromToken]
  )

  const handleOutputSelect = useCallback(
    (outputCurrency: Currency) => {
      setToToken(outputCurrency)
      setOutputToken(outputCurrency)
      setToDecimals(outputCurrency?.wrapped.decimals)
      // handleCurrencyBSelect(outputCurrency)
    },
    [setToToken]
  )

  const handleTypeInput = useCallback(
    (value: string) => {
      setAmount(Number(value))
    },
    [setAmount]
  )

  return (
    <DoubleGlowShadowV2>
      <NextSeo title={`Meta | SoulSwap`} />
      <div className={`grid p-1 mt-8 space-y-2 rounded-2xl bg-dark-1000`}>
        <SwapDropdown
          // inputCurrency={currencyA}
          // outputCurrency={currencyB}
        />
        <div className={`my-12`} />
        <div className="flex flex-col gap-3 space-y-3">
          <CrossSwapAssetPanel
            spendFromWallet={true}
            chainId={chainId}
            header={(props) => (
              <CrossSwapAssetPanel.Header
                {...props}
                label={
                  `Swap from:`
                }
              />
            )}
            currency={fromToken}
            value={amount.toString()}
            onChange={handleTypeInput}
            onSelect={handleInputSelect}
          />
          <div>
            <div className="flex justify-center -mt-8 -mb-4 z-0">
              <div className={`p-1.5 rounded-full bg-dark-800 border shadow-md border-dark-700`}>
                <ArrowDownIcon width={14} className="text-high-emphesis hover:text-white" />
              </div>
            </div>
            <CrossSwapAssetPanel
              spendFromWallet={true}
              chainId={toChain}
              header={(props) => (
                <CrossSwapAssetPanel.Header
                  {...props}
                  label={
                    `Swap to:`
                  }
                />
              )}
              currency={
                toToken
              }
              // value={(routes[0]?.price.amountReturned / (10 ** (outputToken?.wrapped.decimals)))?.toString() || '0'}
              onChange={() => { }}
              onSelect={handleOutputSelect}
            />
          </div>
        </div>
        <Button variant="outlined"
          color={'blue'}
          onClick={handleSwap}
        >
          <Typography size={14} className="font-bold text-white">
            {`Swap Me`}
          </Typography>
        </Button>
        <div>
        </div>
        {/* {route && account && (
          <Button
            variant={'filled'}
            color={getChainColorCode(chainId)}
            isLoading={swapMutation.isLoading || isApproveLoading}
            loadingText="Preparing Transaction"
            colorScheme={'messenger'}
            onClick={() => {
              if (approve) approve();

              // if (+amount > +balance?.data?.formatted) return;
              if (isApproved || fromToken.isNative) handleSwap();

            }}
          >
            {(isApproved || fromToken.isNative) ? 'Swap' : 'Approve'}
          </Button>
        )} */}
      </div>
    </DoubleGlowShadowV2>
  )
}

export default CrosschainSwap
// Aggregator.Guard = NetworkGuard(Feature.AGGREGATE)
