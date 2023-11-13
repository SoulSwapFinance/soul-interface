import React, { useCallback, useState } from 'react'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
// import { getAllChains, swap } from 'features/aggregator/router'
import { ChainId, Token, NATIVE } from 'sdk'
import { ArrowDownIcon } from '@heroicons/react/24/solid'

import Typography from 'components/Typography'
import Image from 'next/image'
import { useActiveWeb3React } from "services/web3"
import DoubleGlowShadowV2 from "components/DoubleGlowShadowV2"
import { RouteData, Squid, TokenData } from "@0xsquid/sdk"
import { Button } from "components/Button"
import CrossChainAssetPanel from 'features/trident/swap/CrossChainAssetPanel'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
import Head from 'next/head'
import { getChainColor, getChainInfo } from 'constants/chains'
import { getInputList, getOutputList } from 'features/crosschain/getTokenList'
// import { formatNumber } from 'functions'
import { CustomBanner } from 'components/Banner'
import LimitHeader from 'features/limit/LimitHeader'
import { RPC } from 'connectors'

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

export type Chains = {
    chainId: string | number
    name: string;
    logoURI: string;
}

const Crosschain = ({ }) => {
    const { account, chainId } = useActiveWeb3React()

    const provider = chainId && account
        ? new ethers.providers.Web3Provider(window.ethereum) 
        : new ethers.providers.JsonRpcProvider(RPC[ChainId.FANTOM])
    const signer = provider.getSigner()
    
    const NATIVE_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

    const chains: Chains[] = [
        {
            "chainId": 250,
            "name": "Fantom",
            "logoURI": "https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/chains/fantom.svg",
        },
        {
            "chainId": 43114,
            "name": "Avalanche",
            "logoURI": "https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/chains/avalanche.svg"

        },
        {
            "chainId": 1,
            "name": "Ethereum",
            "logoURI": "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/eth.svg"
        },
        {
            "chainId": 137,
            "name": "Polygon",
            "logoURI": "https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/chains/polygon.svg"
        },
        {
            "chainId": 42161,
            "name": "Arbitrum",
            "logoURI": "https://assets.coingecko.com/coins/images/16547/standard/photo_2023-03-29_21.47.00.jpeg?1696516109"
        },
        {
            "chainId": 56,
            "name": "Binance",
            "logoURI": "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/bnb.svg"
        },
        {
            "chainId": 8453,
            "name": "Base",
            "logoURI": "https://exchange.soulswap.finance/images/networks/base.svg"
        }
    ] 

    // const getTokensForChain = (chainId, isFrom) => {
    //     return isFrom ? (
    //             chainId == 43114 ? getFromAssets(43114) : getFromAssets(250)
    //         ) : !isFrom ? 
    //             chainId == 43114 ? getToAssets(43114) : getToAssets(250)
    //         // : chainId == ChainId.ETHEREUM ? ethTokens
    //         : getToAssets(250)
    // }

    // const chainIndex = (chainId) => {
    //     return chainId == 43114 ? 1 : 0
    //     // chainId == ChainId.ETHEREUM ? 2 : 0
    // }

    const CHAIN_TO_CHAIN_ID = {
        [chains[0].chainId]: ChainId.FANTOM,
        [chains[1].chainId]: ChainId.AVALANCHE,
        [chains[2].chainId]: ChainId.ETHEREUM,
        [chains[3].chainId]: ChainId.MATIC,
        [chains[4].chainId]: ChainId.ARBITRUM,
        [chains[5].chainId]: ChainId.BSC,
        [chains[6].chainId]: ChainId.BASE,
    }
    
    const CHAIN_ID_TO_CHAIN = {
        [ChainId.FANTOM]: chains[0],
        [ChainId.AVALANCHE]: chains[1],
        [ChainId.ETHEREUM]: chains[2],
        [ChainId.MATIC]: chains[3],
        [ChainId.ARBITRUM]: chains[4],
        [ChainId.BSC]: chains[5],
        [ChainId.BASE]: chains[6],
    }

    const DEFAULT_FROM_CHAIN_MAP = {
        [ChainId.FANTOM]: chains[0],
        [ChainId.AVALANCHE]: chains[1],
        [ChainId.ETHEREUM]: chains[2],
        [ChainId.MATIC]: chains[3],
        [ChainId.ARBITRUM]: chains[4],
        [ChainId.BSC]: chains[5],
        [ChainId.BASE]: chains[6],
    }
    
    const DEFAULT_TO_CHAIN_MAP = {
        [ChainId.FANTOM]: chains[1],    // ftm to avax
        [ChainId.AVALANCHE]: chains[0], // avax to ftm
        [ChainId.ETHEREUM]: chains[0],  // eth to ftm
        [ChainId.MATIC]: chains[0],     // matic to ftm
        [ChainId.ARBITRUM]: chains[2],  // arbitrum to eth
        [ChainId.BSC]: chains[2],       // bsc to eth
        [ChainId.BASE]: chains[2],      // base to eth
    }

    const [fromChain, setFromChain] = useState(DEFAULT_FROM_CHAIN_MAP[chainId])
    const [toChain, setToChain] = useState(DEFAULT_TO_CHAIN_MAP[chainId])
    const [showToChains, setShowToChains] = useState(false)
    // const [showFromChains, setShowFromChains] = useState(false)

    // const fromTokens: TokenData[] = 
    // const toTokens: TokenData[] = getTokensForChain(toChain)
    // const [fromAssetList, setFromAssetList] = useState<TokenData[]>(getTokensForChain(fromChain?.chainId, true))
    const [fromAssetList, setFromAssetList] = useState<TokenData[]>(getInputList(fromChain?.chainId, toChain?.chainId))
    const [toAssetList, setToAssetList] = useState<TokenData[]>(getOutputList(fromChain?.chainId, toChain?.chainId))
    // const [toAssetList, setToAssetList] = useState<TokenData[]>(getTokensForChain(toChain?.chainId, false))
    const [fromAsset, setFromAsset] = useState(fromAssetList[0])
    const [fromToken, setFromToken] = useState<Token>(
        new Token(
            CHAIN_TO_CHAIN_ID[fromChain?.chainId],
            fromAsset?.address,
            fromAsset?.decimals,
            fromAsset?.symbol,
            fromAsset?.name
        )
    )
    const [toAsset, setToAsset] = useState(toAssetList[0])
    const [toToken, setToToken] = useState<Token>(
        new Token(
            CHAIN_TO_CHAIN_ID[toChain?.chainId],
            toAsset.address,
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
    const [fromAmount, setFromAmount] = useState('');
    const [inputAmount, setInputAmount] = useState('');
    // const _balance = useTokenBalance(chainId, account, fromAsset)
    // const balance = _balance ? _balance.toSignificant(18) : '0'
    const [showFromTokens, setShowFromTokens] = useState(false)
    const [showToTokens, setShowToTokens] = useState(false)
    const [outputAmount, setOutputAmount] = useState('')
    // const buttonColor = (chainId) => {
    //     return chainId == 43114 ? '#E84142'  // avaxRed
    //         : chainId == 1 ? '#627EEA' // ethBlue
    //             : '#1969FF' // ftmBlue
    // }

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
            fromAmount: fromAmountWithDecimals(_fromAmount ?? '0'), // "10000000",
            // todo: assumes Fantom || Avalanche
            toChain: toChain.chainId,
            // todo: assumes Fantom || Avalanche
            toToken: toAsset.address,
            slippage: 1,
        }

        const { route } = await squid.getRoute(params)

        // console.log('inputAmount: %s', route.estimate.fromAmount)
        // console.log('outputAmount: %s', route.estimate.toAmount)

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
            fromAmount: fromAmountWithDecimals(_fromAmount ?? '0'), // "10000000",
            // todo: assumes Fantom || Avalanche
            toChain: toChain.chainId,
            // todo: assumes Fantom || Avalanche
            toToken: toAsset.address,
            slippage: 1,
        }

        const { route } = await squid.getRoute(params)

        // console.log('inputAmount: %s', route.estimate.fromAmount)
        // console.log('outputAmount: %s', route.estimate.toAmount)

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
    const toggleShowChains = (isFrom) => {
        !isFrom && setShowToChains(!showToTokens)
    }

    const toggleShowTokens = (isFrom) => {
        isFrom ? setShowFromTokens(!showFromTokens) : setShowToTokens(!showToTokens)
    }

    const handleSetFromAsset = useCallback((token, amount) => {
        setFromAsset(token)
        setFromToken(
            token.address == NATIVE_ADDRESS ? NATIVE[fromChain?.chainId]
             : new Token(
                    CHAIN_TO_CHAIN_ID[fromChain?.chainId],
                    token.address,
                    token.decimals,
                    token.symbol,
                    token.name
        ))
        setInputAmount(amount ?? '0')
    }, [setFromAsset, setFromToken, setInputAmount])
    
    const handleSetToAsset = useCallback((token) => {
        setToAsset(token)
        setToToken(
            token.address == NATIVE_ADDRESS ?
                NATIVE[toChain.chainId] :
                new Token(
                    CHAIN_TO_CHAIN_ID[toChain.chainId],
                    token.address,
                    token.decimals,
                    token.symbol,
                    token.name
                ))
        // setInputAmount(amount)
    }, [setToAsset, setToToken])

    const handleSetToChain = useCallback((chain) => {
        setFromChain(CHAIN_ID_TO_CHAIN[chainId])
        setToChain(chain)

        setToAssetList(getOutputList(fromChain?.chainId, chain.chainId))
        handleSetToAsset(getOutputList(fromChain?.chainId, chain.chainId)[0])
        // setToAsset(toAssetList[0])
        // setToToken(NATIVE[chain.chainId])
        setShowToChains(false)
    }, [setToChain, setToAssetList, setToAsset, setToToken, setShowToChains])

    // shows: Chains
    const ChainSelector = ({ isFrom }) => {
        return (
            <div 
                // className={`bg-dark-900`}
            >
                    <div
                        className={`flex justify-center bg-dark-900 mb-4 border-2 border-[${getChainColor(isFrom ? fromChain.chainId : toChain.chainId)}] rounded-xl
                            ${isFrom ? `` : `hover:bg-dark-800`}
                        `}
                        onClick={() => toggleShowChains(isFrom)}
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
                {showToChains && !isFrom &&
                    <HeadlessUIModal.Controlled
                        // isCustom={true}
                        chainId={CHAIN_TO_CHAIN_ID[toChain?.chainId]}
                        isOpen={showToChains}
                        onDismiss={() => toggleShowChains(isFrom)}
                    >
                        {chains.map((chain, i) => {
                            return (
                                <div
                                    key={i}
                                    className={`flex mt-2 mx-24 mb-2 justify-center items-center align-center gap-24
                                    bg-dark-900 hover:bg-dark-800 p-3 rounded-xl border-2 border-[${getChainColor(Number(chain.chainId))}]
                                    ${[fromChain.chainId, toChain.chainId].includes(chain.chainId) ? 'hidden' : 'visible'}
                                    `}
                                    onClick={() => {
                                        handleSetToChain(chain)

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
                }
            </div>
        )
    }

    // shows: Tokens for a given chain.
    const TokenSelector = ({ isFrom }) => {

        return (
            <div>
                {(!showFromTokens || !showToTokens) &&
                    <div
                        className={`ml-2 flex flex-cols-2 gap-8 sm:gap-24 border-2 border-[${getChainColor(isFrom ? fromChain.chainId : toChain.chainId)}] rounded-xl
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
                                'ml-4 max-w-[36px] max-h-[36px] mt-2 sm:mt-3'
                            }
                        />
                        <Typography
                            className={'flex items-center font-bold text-white justify-center text-lg sm:text-xl'}
                        >
                            {`${isFrom ? fromAsset.symbol : toAsset.symbol}`}
                        </Typography>
                    </div>
                    // </Button>
                }
                {showFromTokens && isFrom &&
                <HeadlessUIModal.Controlled
                    chainId={CHAIN_TO_CHAIN_ID[fromChain?.chainId]}
                    isOpen={showFromTokens}
                    onDismiss={() => toggleShowTokens(isFrom)}
                >
                    <div
                        className={'grid grid-cols-2 sm:grid-cols-1 gap-1.5'} 
                    >
                        {fromAssetList.map((token, i) => {
                            return (
                                <div
                                    key={i}
                                    className={`grid grid-cols-2 mt-2 sm:mx-24 mb-2 justify-center items-center align-center gap-6 sm:gap-24
                                    bg-dark-900 hover:bg-dark-800 p-1 sm:p-3 rounded-xl border-2 border-[${getChainColor(fromChain.chainId)}]
                                    ${token.symbol == fromAsset.symbol ? 'hidden' : 'visible'}
                                    overflow-y:auto
                                `}
                                    onClick={() => {
                                        handleSetFromAsset(token, inputAmount)

                                        toggleShowTokens(isFrom)
                                    }}
                                >
                                    <Image
                                        height={32}
                                        width={32}
                                        src={token.logoURI}
                                        alt={'token logo'}
                                        className={'flex ml-12 justify-center items-center'}
                                    />
                                        {/* <Typography
                                            className={'font-bold text-white text-sm sm:text-lg'}
                                        >
                                            {`${token.name}`}
                                        </Typography> */}
                                        <Typography
                                            className={'font-bold text-white text-sm sm:text-lg mr-4'}
                                        >
                                            {token.symbol}
                                        </Typography>
                                </div>
                            )
                        }
                        )}
                    </div>
                        </HeadlessUIModal.Controlled>
                }
               
                {showToTokens && !isFrom &&
                    <HeadlessUIModal.Controlled
                        // isCustom={true}
                        chainId={CHAIN_TO_CHAIN_ID[toChain?.chainId]}
                        isOpen={showToTokens}
                        onDismiss={() => toggleShowTokens(isFrom)}
                    >
                        <div
                            className={'grid grid-cols-2 sm:grid-cols-1 gap-1.5'} 
                        >
                        {toAssetList.map((token, i) => {
                            return (
                                <div
                                    key={i}
                                    className={`grid grid-cols-2 mt-2 sm:mx-24 mb-2 justify-center items-center align-center gap-6 sm:gap-24
                                    bg-dark-900 hover:bg-dark-800 p-1 sm:p-3 rounded-xl border-2 border-[${getChainColor(toChain.chainId)}]
                                    ${token.symbol == toAsset.symbol ? 'hidden' : 'visible'}
                                    overflow-y:auto
                                `}
                                    onClick={() => {
                                        handleSetToAsset(token)
                                        toggleShowTokens(isFrom)
                                    }}
                                >
                                    <Image
                                        height={32}
                                        width={32}
                                        src={token.logoURI}
                                        alt={'token logo'}
                                        className={'flex ml-12 justify-center items-center'}
                                    />
                                        {/* <Typography
                                            className={'font-bold text-white text-sm sm:text-lg'}
                                        >
                                            {`${token.name}`}
                                        </Typography> */}
                                        <Typography
                                            className={'font-bold text-white text-sm sm:text-lg mr-4'}
                                        >
                                            {token.symbol}
                                        </Typography>
                                </div>

                            )
                        }
                        )}
                        </div>
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
            if(!value) return
            await setFromAmount(value ?? '0')
            if(value && Number(value) > 0.000001 ) await getRoute(value ?? '0')
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
                <meta name="description" content="Swap crosschain on SoulSwap." />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content="https://soulswap.finance/images/soulswap-cover.png" />
                <meta name="twitter:site" content="@SoulSwapFinance" />
                <meta id="og:image" property="og:image" content="https://soulswap.finance/images/soulswap-cover.png" />
                <meta id="og:image:type" property="og:image:type" content="image/png" />
                <meta id="og:image:type" property="og:image:type" content="630" />
                <meta id="og:image:width" property="og:image:width" content="1200" />
                <meta id="og:description" property="og:description" content="Swap crosschain on SoulSwap." />
            </Head>
            <div className={`grid p-1 mt-8 space-y-2 rounded-2xl bg-dark-1000`}>
                {/* <SwapDropdown /> */}
                {/* <div className={`my-12`} /> */}
        <CustomBanner
            external={true}
            chains={[ChainId.FANTOM, ChainId.AVALANCHE]}
            link={'https://links.soulswap.finance'}
            text={'View Ecosystem ↗'}
            textColor={'white'}
            color={'ftmBlue'}
            className={`animate-pulse border-4 border-dark-800 rounded-2xl`}
        />
            <LimitHeader 
                inputCurrency={undefined} 
                outputCurrency={undefined}  
            />
            <div className={'py-1'} />
                <div className="flex flex-col gap-3 space-y-2 bg-dark-1000 p-2 rounded-2xl">
                    <div
                        className="grid grid-cols-2 mt-2"
                    >
                        <ChainSelector isFrom={true} />
                        <TokenSelector isFrom={true} />
                        {/* <InputAmount isFrom={true} /> */}
                    </div>
                    <div
                        className={!account ? 'hidden' : `grid`}
                    >
                        <div className={'mt-2 bg-dark-900 rounded-2xl p-2 border-2 border-dark-800'}>
                        <CrossChainAssetPanel
                            spendFromWallet={true}
                            network={fromChain.chainId}
                            currency={fromAsset.address == NATIVE_ADDRESS ?
                                NATIVE[chainId] : fromToken
                            }
                            value={fromAmount.toString() ?? '0'}
                            onChange={handleTypeInput}
                            showSelect={false}
                            hideBalance={[ChainId.ETHEREUM, ChainId.FANTOM, ChainId.AVALANCHE].includes(chainId ?? ChainId.FANTOM) ? false : true}
                        // onSelect={handleInputSelect}
                        />
                    {`~$${route?.estimate.fromAmountUSD?.toString() ?? 0}`}
                        </div>
                    {/* </div> */}
                    {/* <div
                        className={`flex justify-end w-[98%] text-sm max-h-[1px] p-1 mb-4`}    
                    > */}
                    {/* </div> */}
                    </div>
                    <div className="flex justify-center -mt-8 -mb-4 z-0">
                        <div className={`p-1.5 rounded-full bg-dark-800 -mt-2 -mb-2 border shadow-md border-dark-700`}>
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
                        className={!account ? 'hidden' : `grid`}
                    >
                        <div className={'mt-2 bg-dark-900 rounded-2xl p-2 border-2 border-dark-800'}>
                        <CrossChainAssetPanel
                            spendFromWallet={true}
                            network={toChain.chainId}
                            currency={toAsset.address == NATIVE_ADDRESS ?
                                NATIVE[toChain.chainId] : toToken
                            }
                            value={outputAmount.toString() ?? '1'}
                            onChange={() => { }}
                            showSelect={false}
                            hideBalance={true}
                        // onSelect={handleOutputSelect}
                        />
                        {`~$${route?.estimate.toAmountUSD?.toString() ?? 0}`}
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
                        color={!account ? 'avaxRed' : 'ftmBlue'}
                        onClick={() => handleSwap(fromAmount)}
                        className={'mt-8'}
                        disabled={!account}
                    >
                        <Typography size={14} className="font-bold text-white">
                            {/* {insufficientFunds ? 'Insufficient Funds' : `Swap for ${toAsset.symbol} on ${getChainInfo(toChain, "NAME")}`} */}
                            {!account ? `Connect Wallet` 
                                : `Swap for ${toAsset.symbol} on ${getChainInfo(Number(toChain.chainId), "NAME")}`}
                        </Typography>
                    </Button>
                </div>
                </div>
                <div>
                </div>
            </div>
        </DoubleGlowShadowV2>
    )
}

export default Crosschain
Crosschain.Guard = NetworkGuard(Feature.XSWAP)
