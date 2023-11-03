import React, { useCallback, useState } from 'react'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
// import { getAllChains, swap } from 'features/aggregator/router'
import { ChainId, Currency, WETH, USDC, USDC_ADDRESS, WBTC, WNATIVE, WNATIVE_ADDRESS, AXL_USDC_ADDRESS } from 'sdk'
import { ArrowDownIcon } from '@heroicons/react/24/solid'
import SwapDropdown from 'features/swap/SwapDropdown'
import { NextSeo } from 'next-seo'
import Typography from 'components/Typography'
import Image from 'next/image'
import { useActiveWeb3React } from "services/web3";
import DoubleGlowShadowV2 from "components/DoubleGlowShadowV2";
import { RouteData, Squid, TokenData } from "@0xsquid/sdk";
import { Button } from "components/Button";
// import CrossChainAssetPanel from 'features/trident/swap/CrossChainAssetPanel'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
// import useGetPrice from 'features/aggregator/queries/useGetPrice'
// import { useRouter } from 'next/router'
// import { getChainInfo } from 'constants/chains'
// import { useTokenBalance } from 'state/wallet/hooks'
import Head from 'next/head'
// import {SquidWidget} from '@0xsquid/widget'
// import { useTokenBalance } from 'state/wallet/hooks'
// import { usePrice } from 'hooks'
// import getTokensForChain from '@0xsquid/sdk'
// import styled from 'styled-components'
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

const Crosschain = ({ }) => {
    const { account, chainId, library } = useActiveWeb3React();
    //   const router = useRouter()
    //   const id = router.query.id as string // router string
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    // const NATIVE_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    // const fromChain = ChainId.FANTOM
    // const toChain = ChainId.AVALANCHE
    // chainId == ChainId.ETHEREUM ? ChainId.FANTOM
    //   : (symbol == 'USDC' && chainId == ChainId.AVALANCHE) ? ChainId.FANTOM
    //   : (symbol == 'USDC' && chainId == ChainId.FANTOM) ? ChainId.AVALANCHE
    //   : ChainId.ETHEREUM
    // (symbol == 'USDC' && chainId == ChainId.FANTOM) ? ChainId.AVALANCHE
    // : symbol != 'USDC' && (chainId == ChainId.FANTOM || chainId == ChainId.AVALANCHE) ? ChainId.ETHEREUM
    //  : ChainId.FANTOM

    type Chains = {
        chainId: string | number
        name: string;
        logoURI: string;
    };

    const chains: Chains[] = [
        {
            "chainId": 250,
            "name": "Fantom Opera",
            "logoURI": "https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/chains/fantom.svg",
        },
        {
            "chainId": 43114,
            "name": "Avalanche Network",
            "logoURI": "https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/chains/avalanche.svg"

        },
        {
            "chainId": 1,
            "name": "Ethereum Mainnet",
            "logoURI": "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/eth.svg"

        }
    ]

    const ftmTokens: TokenData[] = [
        {
            "chainId": 250,
            "address": WNATIVE[250].address,
            "name": WNATIVE[250].name,
            "symbol": WNATIVE[250].symbol,
            "decimals": WNATIVE[250].decimals,
            "logoURI": "https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/chains/fantom.svg",
            "coingeckoId": 'fantom',
        },
        {
            "chainId": 250,
            "address": AXL_USDC_ADDRESS[250],
            "name": 'Axelar USDC',
            "symbol": 'axlUSDC',
            "decimals": 6,
            "logoURI": "https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/assets/usdc.svg",
            "coingeckoId": 'usdc',
        }
    ]

    const avaxTokens: TokenData[] = [
        {
            "chainId": 43114,
            "address": USDC_ADDRESS[43114],
            "name": 'USD Coin',
            "symbol": 'USDC',
            "decimals": 6,
            "logoURI": "https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/assets/usdc.svg",
            "coingeckoId": 'usdc',
        },
        {
            "chainId": 43114,
            "address": WNATIVE_ADDRESS[43114],
            "name": 'Wrapped Avalanche',
            "symbol": 'WAVAX',
            "decimals": 18,
            "logoURI": "https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/chains/avalanche.svg",
            "coingeckoId": 'avalanche-2',
        }
    ]

    // const ethTokens: TokenData[] = [
    //     {
    //         "chainId": 1,
    //         "address": USDC_ADDRESS[1],
    //         "name": 'USD Coin',
    //         "symbol": 'USDC',
    //         "decimals": 6,
    //         "logoURI": "https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/assets/usdc.svg",
    //         "coingeckoId": 'usdc',
    //     },
    //     {
    //         "chainId": 1,
    //         "address": WNATIVE_ADDRESS[1],
    //         "name": 'Wrapped Ether',
    //         "symbol": 'WETH',
    //         "decimals": 18,
    //         "logoURI": "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/eth.svg",
    //         "coingeckoId": 'ethereum',
    //     }
    // ]

    // // Source
    // const fromChain = chains.find((c) => c.chainId === (swapRoute === null || swapRoute === void 0 ? void 0 : swapRoute.fromChainId));

    // const fromToken = fromTokens.find((t) => t.address === (swapRoute === null || swapRoute === void 0 ? void 0 : swapRoute.fromTokenAddress));
    // // Destination
    // const toChain = chains.find((c) => c.chainId === (swapRoute === null || swapRoute === void 0 ? void 0 : swapRoute.toChainId));
    // const toTokensForChain = (0, configService_1.getTokensForChain)((_b = squid === null || squid === void 0 ? void 0 : squid.tokens) !== null && _b !== void 0 ? _b : [], toChainId);
    // const toToken = toTokensForChain.find((t) => t.address === (swapRoute === null || swapRoute === void 0 ? void 0 : swapRoute.toTokenAddress));
    // const toTokens = (0, configService_1.filterTokensForDestination)(toTokensForChain, toChain, fromToken);
    // const tokenItems = (0, react_1.useMemo)(() => ({
    //     from: fromTokens,
    //     to: toTokens,
    // }), [fromTokens, toTokens]);
    // const updatedDestinationAddress = swapRoute === null || swapRoute === void 0 ? void 0 : swapRoute.destinationAddress;
    // const { connectedAddress: destinationUserAddress } = (0, useMultiChain_1.useMultiChain)(toChain, toToken);

    const getTokensForChain = (chainId) => {
        return chainId == ChainId.AVALANCHE ? avaxTokens
            // : chainId == ChainId.ETHEREUM ? ethTokens
                : ftmTokens ?? ftmTokens
    }

    const chainIndex = (chainId) => {
        return chainId == ChainId.AVALANCHE ? 1 : 0
            // chainId == ChainId.ETHEREUM ? 2 : 0
    }

    const fromChain = [ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? chains[chainIndex(chainId)] : chains[0]
    const [toChain, setToChain] = useState(chainId == 43114 ? chains[0] : chains[1])
    const [showToChains, setShowToChains] = useState(false)
    // const [showFromChains, setShowFromChains] = useState(false)

    // const fromTokens: TokenData[] = 
    // const toTokens: TokenData[] = getTokensForChain(toChain)
    const [fromAssetList, setFromAssetList] = useState<TokenData[]> (getTokensForChain(fromChain.chainId))
    const [toAssetList, setToAssetList] = useState<TokenData[]> (getTokensForChain(toChain.chainId))
    const [fromAsset, setFromAsset] = useState(fromAssetList[chainIndex(fromChain?.chainId)])
    const [toAsset, setToAsset] = useState(toAssetList[chainIndex(toChain?.chainId)])
    // const [fromTokenData, setFromTokenData] = useState<TokenData[]>(fromTokens)
    // const [tokenData, setTokenData] = useState<TokenData[]>(fromTokens)
    // const [route, setRoute] = useState<RouteData>(null)
    // const nativePrice = usePrice(WNATIVE_ADDRESS[chainId ?? ChainId.FANTOM])
    // √
    const [fromAmount, setFromAmount] = useState('1');
    const [toAmount, setToAmount] = useState('1');
    // const _balance = useTokenBalance(chainId, account, fromAsset)
    // const balance = _balance ? _balance.toSignificant(18) : '0'
    const [showFromTokens, setShowFromTokens] = useState(false)
    const [showToTokens, setShowToTokens] = useState(false)

    const buttonColor = (chainId) => {
        return chainId == 43114 ? '#E84142'  // avaxRed
            : chainId == 1 ? '#627EEA' // ethBlue
                : '#1969FF' // ftmBlue
    }

    // const config = {
    //     companyName: "Test Widget",
    //     integratorId: "example-swap-widget",
    //     slippage: 3,
    //     slippageOption: "auto",
    //     instantExec: true,
    //     infiniteApproval: false,
    //     apiUrl: "https://dev.api.0xsquid.com",
    //   };

    // const { fromPrice, toPrice, config, squid } = useSquidStore();
    // const { swapRoute } = useSwapRoutePersistStore();
    // const { tokenPrices } = usePrices();
    // const { chains, supportedDestinationChains, supportedSourceChains } = useSquidChains();
    // // chain ID will use the swapRoute one (the user choice)
    // // Or the config one (if defined)
    // const fromChainId = (swapRoute === null || swapRoute === void 0 ? void 0 : swapRoute.fromChainId) ||
    //     (chains.find((c) => c.chainId === config.initialFromChainId) &&
    //         config.initialFromChainId);
    // const toChainId = (swapRoute === null || swapRoute === void 0 ? void 0 : swapRoute.toChainId) ||
    //     (chains.find((c) => c.chainId === config.initialToChainId) &&
    //         config.initialToChainId);
    // // Source
    // // const fromChain = chains.find((c) => c.chainId === (swapRoute === null || swapRoute === void 0 ? void 0 : swapRoute.fromChainId));
    // const fromTokens = getTokensForChain((_a = squid === null || squid === void 0 ? void 0 : squid.tokens) !== null && _a !== void 0 ? _a : [], fromChainId);
    // const fromToken = fromTokens.find((t) => t.address === (swapRoute === null || swapRoute === void 0 ? void 0 : swapRoute.fromTokenAddress));
    // // Destination
    // // const toChain = chains.find((c) => c.chainId === (swapRoute === null || swapRoute === void 0 ? void 0 : swapRoute.toChainId));
    // const toTokensForChain = getTokensForChain((_b = squid === null || squid === void 0 ? void 0 : squid.tokens) !== null && _b !== void 0 ? _b : [], toChainId);
    // const toToken = toTokensForChain.find((t) => t.address === (swapRoute === null || swapRoute === void 0 ? void 0 : swapRoute.toTokenAddress));
    // const toTokens = filterTokensForDestination(toTokensForChain, toChain, fromToken);

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
            fromToken: fromAsset.address,
            fromAmount: fromAmountWithDecimals, // "10000000",
            // todo: assumes Fantom || Avalanche
            toChain: toChain.chainId,
            // todo: assumes Fantom || Avalanche
            toToken: toAsset.address,
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

    // TOGGLES //
    // const toggleShowChains = (chain) => {
    //     setToChain(chain)
    // }

    const toggleShowTokens = (isFrom) => {
        isFrom ? setShowFromTokens(!showFromTokens) : setShowToTokens(!showToTokens)
    }

    // shows: Chains
    const ChainSelector = ({ isFrom }) => {
        return (
            <div>
                {!showToChains &&
                    // <Button
                    //     onClick={() => toggleShowChains(isFrom)}
                    //     variant={'filled'}
                    //     color={buttonColor(isFrom ? fromChain.chainId : toChain.chainId)}
                    // >
                    // ${isFrom ? `bg-dark-900` : `bg-dark-900 hover:bg-dark-800`}
                    <div
                        className={`flex justify-center border-4 border-[${buttonColor(isFrom ? fromChain.chainId : toChain.chainId)}] rounded-xl
                            bg-dark-900
                        `}
                        // onClick={() => toggleShowChains(toChain)}
                        style={{
                            // padding: 4,
                            height: '100%',
                        }}
                    >
                        <Typography
                            weight={600}
                            className={'font-bold text-white mt-4 text-xl'}
                        >
                            {`${isFrom ? fromChain.name : toChain.name}`}
                        </Typography>
                    </div>
                    // </Button>
                }
                {/* {showToChains && !isFrom &&
                    <HeadlessUIModal.Controlled
                        // isCustom={true}
                        chainId={chainId}
                        isOpen={showToChains}
                        onDismiss={() => toggleShowChains(toChain)}
                    >
                        {chains.map((chain) => {
                            return (
                                <div
                                    className={`flex mt-2 mx-24 mb-2 justify-center items-center align-center gap-24
                                    bg-dark-900 hover:bg-dark-800 p-3 rounded-xl border-2 border-[${buttonColor(chain.chainId)}]
                                    ${chain.chainId == fromChain.chainId ? 'hidden' : 'visible'}
                                    `}
                                    onClick={() => {
                                        toggleShowChains(chain)
                                        // setToAssetList(getTokensForChain(chain.chainId))
                                    }}
                                >
                                    <div>
                                        <Typography
                                            className={'font-bold text-white text-xl'}
                                        >
                                            {`${chain.name}`}
                                        </Typography>
                                    </div>
                                </div>
                            )
                        }
                        )}
                    </HeadlessUIModal.Controlled>
                } */}
            </div>
        )
    }

    // shows: Tokens for a given chain.
    const TokenSelector = ({ isFrom }) => {

        return (
            <div>
                {(!showFromTokens || !showToTokens) &&
                    // <Button
                    //     onClick={() => isFrom ? setShowFromTokens(true) : setShowToTokens(true)}
                    //     // variant={'filled'}
                    //     // color={buttonColor(isFrom ? fromChain.chainId : toChain.chainId)}
                    // >
                    <div
                        className={`ml-2 flex flex-cols-2 gap-6 sm:gap-24 border-4 border-[${buttonColor(isFrom ? fromChain.chainId : toChain.chainId)}] rounded-xl
                            bg-dark-900 hover:bg-dark-800
                        `}
                        style={{
                            // padding: 4,
                            height: '100%'
                        }}
                        onClick={() => toggleShowTokens(isFrom)}
                    >
                        <Image
                            height={36}
                            width={36}
                            src={isFrom ? fromAsset.logoURI : toAsset.logoURI}
                            alt={'token logo'}
                            className={
                                'ml-4 mt-2 mb-2'
                            }
                        />
                        <Typography
                            weight={600}
                            className={'flex items-center font-bold text-white justify-center text-xl'}
                        >
                            {`${isFrom ? fromAsset.symbol : toAsset.symbol}`}
                        </Typography>
                    </div>
                    // </Button>
                }
                {showFromTokens && isFrom &&
                    <div>
                        {fromAssetList.map((token) => {
                            return (
                                <div
                                    className={'grid grid-cols-2 mt-2 mb-2 justify-center items-center align-center gap-24'}
                                >
                                    <div
                                        onClick={() => {
                                            setFromAsset(token)
                                            toggleShowTokens(isFrom)
                                        }}
                                    >
                                        <Image
                                            height={24}
                                            width={24}
                                            src={token.logoURI}
                                            alt={'token logo'}
                                        />
                                    </div>
                                    <div>
                                        <Typography
                                            size={12}
                                            className={'font-bold text-white'}
                                        >
                                            {`${token.name} (${token.symbol})`}
                                        </Typography>
                                    </div>
                                </div>
                            )
                        }
                        )}
                    </div>
                }
                {showToTokens &&
                    <div>
                        {toAssetList.map((token) => {
                            return (
                                <div
                                    className={'grid grid-cols-2 mt-2 mb-2 justify-center items-center align-center gap-24'}
                                >
                                    <div
                                        onClick={() => {
                                            setToAsset(token)
                                            toggleShowTokens(isFrom)
                                        }}
                                    >
                                        <Image
                                            height={24}
                                            width={24}
                                            src={token.logoURI}
                                            alt={'token logo'}
                                        />
                                    </div>
                                    <div>
                                        <Typography
                                            size={12}
                                            className={'font-bold text-white'}
                                        >
                                            {`${token.name} (${token.symbol})`}
                                        </Typography>
                                    </div>
                                </div>
                            )
                        }
                        )}
                    </div>
                }
            </div>
        )
    }

    const fromAmountWithDecimals = new BigNumber(fromAmount.toString())
        .times(10 ** (fromAsset.decimals ?? 18))
        .toString()

    // const toAmountWithDecimals = new BigNumber(toAmount.toString())
    //     .times(10 ** (toAsset.isNative ? 18 : toAsset?.wrapped.decimals ?? 18))
    //     .toString()

    const handleTypeInput = useCallback(
        async (value: string) => {
            setFromAmount(value)
        },
        [setFromAmount]
    )

    // generateRoute()

    // const generateTokenData = () => {
    //     console.log(tokenData.values())
    //     // let fromData = TokenData.fromChainData(fromAsset)
    // }

    // const insufficientFunds = Number(fromAmount) > Number(balance)

    return (
        <DoubleGlowShadowV2>
            <Head>
                <title>CrossChain | SoulSwap</title>
                {/* <meta name="description" content="SoulSwap is an AMM exchange, part of Soul Protocol, which offers a full suite of DeFi tools." /> */}
                <meta name="description" content="Swap crosschain via the Squid Router on SoulSwap." />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content="https://soulswap.finance/images/soulswap-cover.png" />
                <meta name="twitter:site" content="@SoulSwapFinance" />
                <meta id="og:image" property="og:image" content="https://soulswap.finance/images/soulswap-cover.png" />
                <meta id="og:image:type" property="og:image:type" content="image/png" />
                <meta id="og:image:type" property="og:image:type" content="630" />
                <meta id="og:image:width" property="og:image:width" content="1200" />
                <meta id="og:description" property="og:description" content="Swap crosschain via the Squid Router on SoulSwap." />
            </Head>
            <div className={`grid p-1 mt-8 space-y-2 rounded-2xl bg-dark-1000`}>
                <SwapDropdown />
                {/* <div className={`my-12`} /> */}
                <div className="flex flex-col gap-3 space-y-3">
                    <div
                        className="grid grid-cols-2"
                    >
                        <ChainSelector isFrom={true} />
                        <TokenSelector isFrom={true} />
                    </div>
                    {/* <CrossChainAssetPanel
                        spendFromWallet={true}
                        network={fromChain}
                        header={(props) => (
                            <CrossChainAssetPanel.Header
                                {...props}
                                label={
                                    `Swap from:`
                                }
                            />
                        )}
                        currency={fromAsset}
                        value={fromAmount.toString() ?? '1'}
                        onChange={handleTypeInput}
                        showSelect={false}
                    // onSelect={handleInputSelect}
                    /> */}

                    <div className="flex justify-center -mt-8 -mb-4 z-0">
                        <div className={`p-1.5 rounded-full bg-dark-800 border shadow-md border-dark-700`}>
                            <ArrowDownIcon width={14} className="text-high-emphesis hover:text-white" />
                        </div>
                    </div>
                    <div
                        className="grid grid-cols-2"
                    >
                        <ChainSelector isFrom={false} />
                        <TokenSelector isFrom={false} />
                    </div>

                    {/* <CrossChainAssetPanel
                            spendFromWallet={true}
                            network={toChain}
                            header={(props) => (
                                <CrossChainAssetPanel.Header
                                    {...props}
                                    label={
                                        `Swap to:`
                                    }
                                />
                            )}
                            currency={toAsset}
                            value={toAmount.toString() ?? '1'}
                            onChange={() => { }}
                            showSelect={false}
                        // showBalance={false}
                        // onSelect={handleOutputSelect}
                        /> */}
                </div>
                <div
                    className={`flex flex-col gap-3 mt-8 mb-4 w-full`}
                >
                    <Button variant="filled"
                        color={'gradientPurple'}
                    // onClick={generateTokenData}
                    >
                        <Typography size={14} className="font-bold text-white">
                            {`Submit`}
                        </Typography>
                    </Button>
                </div>
                {/* <div
                    className={`flex flex-col gap-3 mt-8 mb-4 w-full`}
                >
                    <Button variant="outlined"
                        color={insufficientFunds ? 'red' : 'blue'}
                        onClick={handleSwap}
                        disabled={insufficientFunds}
                    >
                        <Typography size={14} className="font-bold text-white">
                            {insufficientFunds ? 'Insufficient Funds' : `Swap for ${toAsset.symbol} on ${getChainInfo(toChain, "NAME")}`}
                        </Typography>
                    </Button>
                </div> */}
                <div>
                </div>

            </div>
        </DoubleGlowShadowV2>
    )
}

export default Crosschain
Crosschain.Guard = NetworkGuard(Feature.XSWAP)
