import React, { useCallback, useState } from 'react'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
// import { getAllChains, swap } from 'features/aggregator/router'
import { ChainId, Currency, WETH, USDC, USDC_ADDRESS, WBTC, WNATIVE, WNATIVE_ADDRESS, AXL_USDC_ADDRESS, Token, NATIVE } from 'sdk'
import { ArrowDownIcon } from '@heroicons/react/24/solid'
import SwapDropdown from 'features/swap/SwapDropdown'
import { NextSeo } from 'next-seo'
import Typography from 'components/Typography'
import Image from 'next/image'
import { useActiveWeb3React } from "services/web3";
import DoubleGlowShadowV2 from "components/DoubleGlowShadowV2";
import { RouteData, Squid, TokenData } from "@0xsquid/sdk";
import { Button } from "components/Button";
import CrossChainAssetPanel from 'features/trident/swap/CrossChainAssetPanel'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
// import useGetPrice from 'features/aggregator/queries/useGetPrice'
// import { useRouter } from 'next/router'
// import { getChainInfo } from 'constants/chains'
// import { useTokenBalance } from 'state/wallet/hooks'
import Head from 'next/head'
import { getChainInfo } from 'constants/chains'


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
//   console.log(route.estimate.inutAmount);

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
//   console.log(route.estimate.inutAmount);
// }

const Crosschain = ({ }) => {
    const { account, chainId, library } = useActiveWeb3React();
    //   const router = useRouter()
    //   const id = router.query.id as string // router string
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const NATIVE_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
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
        // {
        //     "chainId": 1,
        //     "name": "Ethereum Mainnet",
        //     "logoURI": "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/eth.svg"

        // }
    ]

    const ftmTokens: TokenData[] = [
        {
            "chainId": 250,
            "address": NATIVE_ADDRESS,
            "name": 'Fantom',
            "symbol": 'FTM',
            "decimals": 18,
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
            "address": NATIVE_ADDRESS,
            "name": 'Avalanche',
            "symbol": 'AVAX',
            "decimals": 18,
            "logoURI": "https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/chains/avalanche.svg",
            "coingeckoId": 'avalanche-2',
        },
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

    const getTokensForChain = (chainId) => {
        return chainId == 43114 ? avaxTokens
            // : chainId == ChainId.ETHEREUM ? ethTokens
            : ftmTokens ?? ftmTokens
    }

    const chainIndex = (chainId) => {
        return chainId == 43114 ? 1 : 0
        // chainId == ChainId.ETHEREUM ? 2 : 0
    }

    const fromChain = chainId == 43114 ? chains[1] : chains[0]
    const toChain = chainId == 43114 ? chains[0] : chains[1]
    // const [toChain, setToChain] = useState(chainId == 43114 ? chains[0] : chains[1])
    const [showToChains, setShowToChains] = useState(false)
    // const [showFromChains, setShowFromChains] = useState(false)

    // const fromTokens: TokenData[] = 
    // const toTokens: TokenData[] = getTokensForChain(toChain)
    const [fromAssetList, setFromAssetList] = useState<TokenData[]>(getTokensForChain(fromChain?.chainId))
    const [toAssetList, setToAssetList] = useState<TokenData[]>(getTokensForChain(toChain?.chainId))
    const [fromAsset, setFromAsset] = useState(fromAssetList[0])
    const [fromToken, setFromToken] = useState<Token>(new Token(
        fromChain.chainId == 43114
            ? ChainId.AVALANCHE
            : ChainId.FANTOM, 
        fromAsset?.address,
        fromAsset?.decimals,
        fromAsset?.symbol,
        fromAsset?.name
    )
    )
    const [toAsset, setToAsset] = useState(toAssetList[0])
    const [toToken, setToToken] = useState<Token>(new Token(
        toChain.chainId == 43114
            ? ChainId.AVALANCHE
            : ChainId.FANTOM, toAsset.address,
        toAsset.decimals,
        toAsset.symbol,
        toAsset.name
    )
    )
    // const [fromTokenData, setFromTokenData] = useState<TokenData[]>(fromTokens)
    // const [tokenData, setTokenData] = useState<TokenData[]>(fromTokens)
    const [route, setRoute] = useState<RouteData>(null)
    // const nativePrice = usePrice(WNATIVE_ADDRESS[chainId ?? ChainId.FANTOM])
    // √
    const [fromAmount, setFromAmount] = useState('1');
    const [inputAmount, setInputAmount] = useState('1');
    // const _balance = useTokenBalance(chainId, account, fromAsset)
    // const balance = _balance ? _balance.toSignificant(18) : '0'
    const [showFromTokens, setShowFromTokens] = useState(false)
    const [showToTokens, setShowToTokens] = useState(false)
    const [outputAmount, setOutputAmount] = useState('0')
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

    // const handleLoad = async () => {
    //     (async () => {
    //         // instantiate the SDK
    //         const squid = new Squid({
    //             baseUrl: "https://api.0xsquid.com",
    //             integratorId: "soulswap-___"
    //         });

    //         squid.setConfig({
    //             baseUrl: "https://api.0xsquid.com",
    //             integratorId: "soulswap-___"
    //         });

    //         // init the SDK
    //         await squid.init();
    //         console.log("Squid inited");
    //     })();
    // }

    // instantiate the SDK
    const squid = new Squid({
        baseUrl: "https://api.0xsquid.com",
        integratorId: "soulswap-___"
    });

    // [√] SQUID ROUTE //
    const getRoute = async (_fromAmount) => {

        await squid.init();

        const params = {
            toAddress: account, // signer.address,
            // todo: assumes fromChain is current chain
            fromChain: chainId,
            fromToken: fromAsset.address,
            fromAmount: fromAmountWithDecimals(_fromAmount), // "10000000",
            // todo: assumes Fantom || Avalanche
            toChain: toChain.chainId,
            // todo: assumes Fantom || Avalanche
            toToken: toAsset.address,
            slippage: 1,
        }

        const { route } = await squid.getRoute(params)

        console.log('inputAmount: %s', route.estimate.fromAmount)
        console.log('outputAmount: %s', route.estimate.toAmount)
    
        await setOutputAmount(
            new BigNumber(route.estimate?.toAmount.toString() ?? '1')
                .div(10 ** (toAsset.address == NATIVE_ADDRESS ? 18 : toAsset?.decimals ?? 18))
                .toString()
        )

        setRoute(route)

    }

    const handleSwap = async (_fromAmount) => {

        await squid.init();

        const params = {
            toAddress: account, // signer.address,
            // todo: assumes fromChain is current chain
            fromChain: chainId,
            fromToken: fromAsset.address,
            fromAmount: fromAmountWithDecimals(_fromAmount), // "10000000",
            // todo: assumes Fantom || Avalanche
            toChain: toChain.chainId,
            // todo: assumes Fantom || Avalanche
            toToken: toAsset.address,
            slippage: 1,
        }

        const { route } = await squid.getRoute(params)

        console.log('inputAmount: %s', route.estimate.fromAmount)
        console.log('outputAmount: %s', route.estimate.toAmount)

        await setOutputAmount(
            new BigNumber(route.estimate?.toAmount.toString() ?? '1')
                .div(10 ** (toAsset.address == NATIVE_ADDRESS ? 18 : toAsset?.decimals ?? 18))
                .toString()
        )

        await setRoute(route)

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
    
    const handleSetFromAsset = useCallback((token, amount) => {
        setFromAsset(token)
        setFromToken(
            token.address == NATIVE_ADDRESS ?
            NATIVE[fromChain.chainId] :
            new Token(
            fromChain.chainId == 43114
                ? ChainId.AVALANCHE
                : ChainId.FANTOM,
            token.address,
            token.decimals,
            token.symbol,
            token.name
        ))
        setInputAmount(amount)
    }, [setFromAsset, setFromToken, setInputAmount])

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
                            bg-dark-900 mb-4
                        `}
                        // onClick={() => toggleShowChains(toChain)}
                        style={{
                            // padding: -2,
                            height: '100%',
                        }}
                    >
                        <Typography
                            weight={600}
                            className={'font-bold text-white mt-4 text-lg sm:text-xl'}
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
                        className={`ml-2 flex flex-cols-2 gap-12 sm:gap-24 border-4 border-[${buttonColor(isFrom ? fromChain.chainId : toChain.chainId)}] rounded-xl
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
                                'ml-4'
                            }
                        />
                        <Typography
                            weight={600}
                            className={'flex items-center font-bold text-white justify-center text-lg sm:text-xl'}
                        >
                            {`${isFrom ? fromAsset.symbol : toAsset.symbol}`}
                        </Typography>
                    </div>
                    // </Button>
                }
                {showFromTokens && isFrom &&
                    <HeadlessUIModal.Controlled
                        // isCustom={true}
                        chainId={chainId}
                        isOpen={showFromTokens}
                        onDismiss={() => toggleShowTokens(isFrom)}
                    >
                        {fromAssetList.map((token) => {
                            return (
                                <div
                                    className={`flex mt-2 sm:mx-24 mb-2 justify-center items-center align-center gap-12 sm:gap-24
                                    bg-dark-900 hover:bg-dark-800 p-1 sm:p-3 rounded-xl border-2 border-[${buttonColor(fromChain.chainId)}]
                                    ${token.symbol == fromAsset.symbol ? 'hidden' : 'visible'}
                                `}
                                    onClick={() => {
                                        handleSetFromAsset(token, inputAmount)
                                        
                                        toggleShowTokens(isFrom)
                                    }}
                                >
                                    <Image
                                        height={36}
                                        width={36}
                                        src={token.logoURI}
                                        alt={'token logo'}
                                    />
                                    <div>
                                        <Typography
                                            className={'font-bold text-white text-lg'}
                                        >
                                            {`${token.name} (${token.symbol})`}
                                        </Typography>
                                    </div>
                                </div>
                            )
                        }
                        )}
                    </HeadlessUIModal.Controlled>
                }
                {showToTokens && !isFrom &&
                    <HeadlessUIModal.Controlled
                        // isCustom={true}
                        chainId={chainId}
                        isOpen={showToTokens}
                        onDismiss={() => toggleShowTokens(isFrom)}
                    >
                        {toAssetList.map((token) => {
                            return (
                                <div
                                    className={`flex mt-2 sm:mx-24 mb-2 justify-center items-center align-center gap-12 sm:gap-24
                                    bg-dark-900 hover:bg-dark-800 p-1 sm:p-3 rounded-xl border-2 border-[${buttonColor(toChain.chainId)}]
                                    ${token.symbol == toAsset.symbol ? 'hidden' : 'visible'}
                                `}
                                    onClick={() => {
                                        setToAsset(token)
                                        setToToken(
                                            token.address == NATIVE_ADDRESS ?
                                            NATIVE[toChain.chainId] :
                                            new Token(
                                            toChain.chainId == 43114
                                                ? ChainId.AVALANCHE
                                                : ChainId.FANTOM,
                                            token.address,
                                            token.decimals,
                                            token.symbol,
                                            token.name
                                        ))
                                        toggleShowTokens(isFrom)
                                    }}
                                >

                                    <Image
                                        height={36}
                                        width={36}
                                        src={token.logoURI}
                                        alt={'token logo'}
                                    />
                                    <div>
                                        <Typography
                                            className={'font-bold text-white text-lg'}
                                        >
                                            {`${token.name} (${token.symbol})`}
                                        </Typography>
                                    </div>
                                </div>
                            )
                        }
                        )}
                    </HeadlessUIModal.Controlled>
                }
            </div>
        )
    }

    // const InputAmount = ({ isFrom }) => {
    //     return (
    //         <div
    //             className={`flex flex-col gap-3 mt-8 mb-4 w-full`}
    //         >
    //             <div
    //                 className={`flex flex-col gap-3 mt-8 mb-4 w-full`}
    //             >
    //                 <input
    //                     className={`flex flex-col gap-3 mt-8 mb-4 w-full`}
    //                     type="number"
    //                     placeholder="1"
    //                     value={isFrom ? fromAmount : inutAmount}
    //                     onChange={(e) => setFromAmount(e.target.value)}
    //                 />
    //             </div>
    //         </div>
    //     )
    // }

    const fromAmountWithDecimals = (_fromAmount) => {
        return new BigNumber(_fromAmount.toString())
            .times(10 ** (fromAsset.address == NATIVE_ADDRESS ? 18 : fromAsset.decimals ?? 18))
            .toString()
    }

    // const fromAmountWithDecimals = new BigNumber(inputAmount.toString())
    //     .times(10 ** (fromAsset.address == NATIVE_ADDRESS ? 18 
    //             : fromAsset?.decimals 
    //             ?? 18)
    //     )
    //     .toString()

    const handleTypeInput = useCallback(
        async (value: string) => {
            await setFromAmount(value)
            await getRoute(value)
        },
        [setFromAmount, getRoute]
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
                <div className="flex flex-col gap-3 space-y-1">
                    <div
                        className="grid grid-cols-2"
                    >
                        <ChainSelector isFrom={true} />
                        <TokenSelector isFrom={true} />
                        {/* <InputAmount isFrom={true} /> */}
                    </div>
                    <div
                        className={`border-4 p-2 border-[${buttonColor(fromChain.chainId)}] rounded-xl`}
                    >
                        <CrossChainAssetPanel
                            spendFromWallet={true}
                            network={fromChain.chainId}
                            currency={fromAsset.address == NATIVE_ADDRESS ?
                                NATIVE[chainId] : fromToken
                            }
                            value={fromAmount.toString() ?? '1'}
                            onChange={handleTypeInput}
                            showSelect={false}
                        // onSelect={handleInputSelect}
                        />
                    </div>

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

                    <div
                        className={`border-4 p-2 border-[${buttonColor(toChain.chainId)}] rounded-xl`}
                    >
                        <CrossChainAssetPanel
                            spendFromWallet={true}
                            network={toChain.chainId}
                            currency={toAsset.address == NATIVE_ADDRESS ?
                                NATIVE[toChain.chainId] : toToken
                            }
                            value={outputAmount.toString() ?? '1'}
                            onChange={() => { }}
                            showSelect={false}
                        // showBalance={false}
                        // onSelect={handleOutputSelect}
                        />
                    </div>
                </div>
                {/* <div
                    className={`flex flex-col gap-3 mt-8 mb-4 w-full`}
                >
                    <Button variant="filled"
                        color={'gradientPurple'}
                    // onClick={generateTokenData}
                    >
                        <Typography size={14} className="font-bold text-white">
                            {`Swap Crosschain`}
                        </Typography>
                    </Button>
                </div> */}
                <div
                    className={`flex flex-col mb-4 p-1 w-full`}
                >
                    <Button variant="outlined"
                        color={'blue'}
                        onClick={() => handleSwap(fromAmount)}
                        className={'mt-8'}
                    // disabled={insufficientFunds}
                    >
                        <Typography size={14} className="font-bold text-white">
                            {/* {insufficientFunds ? 'Insufficient Funds' : `Swap for ${toAsset.symbol} on ${getChainInfo(toChain, "NAME")}`} */}
                            {`Swap for ${toAsset.symbol} on ${getChainInfo(Number(toChain.chainId), "NAME")}`}
                        </Typography>
                    </Button>
                </div>
                <div>
                </div>

            </div>
        </DoubleGlowShadowV2>
    )
}

export default Crosschain
Crosschain.Guard = NetworkGuard(Feature.XSWAP)
