import React, { useCallback, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import Route from 'components/SwapRoute'
import { getAllChains, swap } from 'features/aggregator/router'
import Loader from 'features/aggregator/components/Loader'
import { ApprovalState, useTokenApprove } from 'hooks/useTokenApprove'
import useGetRoutes from 'features/aggregator/queries/useGetRoutes'
import useGetPrice from 'features/aggregator/queries/useGetPrice'
import { useActiveWeb3React } from 'services/web3'
import { getExplorerLink } from 'functions/explorer'
import { ChainId, Currency, CurrencyAmount, NATIVE, NATIVE_ADDRESS, SOUL_ADDRESS, Token, USDC_ADDRESS, WNATIVE_ADDRESS } from 'sdk'
import { addTransaction } from 'state/transactions/actions'
import { Button } from 'components/Button'
import { getChainColorCode } from 'constants/chains'
import SwapAssetPanel from 'features/trident/swap/SwapAssetPanel'
import { ArrowDownIcon } from '@heroicons/react/24/solid'
import { useGasPrice } from 'hooks/useAPI'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums/Feature'
import { useRouter } from "next/router"
import { useCurrency } from "hooks/Tokens"
import { currencyId } from 'functions/currency/currencyId'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import { CustomBanner } from 'components/Banner'
import Head from 'next/head'
import LimitHeader from 'features/limit/LimitHeader'

export const Routes = styled.div`
	padding: 16px;
	border-radius: 16px;
	text-align: left;
	overflow-y: scroll;
	max-height: 360px;
	min-width: 23rem;
	animation: tilt-in-fwd-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;

	&::-webkit-scrollbar {
		display: none;
	}

	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */

	@keyframes tilt-in-fwd-in {
		0% {
			transform: rotateY(-20deg) rotateX(35deg) translate(-300px, -300px) skew(35deg, -10deg);
			opacity: 0;
		}
		100% {
			transform: rotateY(0) rotateX(0deg) translate(0, 0) skew(0deg, 0deg);
			opacity: 1;
		}
	}

	@keyframes tilt-in-fwd-out {
		0% {
			transform: rotateY(-20deg) rotateX(35deg) translate(-1000px, -1000px) skew(35deg, -10deg);
			opacity: 0;
		}
		100% {
			transform: rotateY(0) rotateX(0deg) translate(0, 0) skew(0deg, 0deg);
			opacity: 1;
		}
	}
`

export const InputFooter = styled.div`
	display: flex;
	margin-top: 1.25rem;
	justify-content: space-between;
`

export const chains = getAllChains()

// todo: add blast (?)
export const startChain = (id) => {
	let chain = chains[0] // ETH
	id == ChainId.BSC ? chain = chains[1]
		: id == ChainId.MATIC ? chain = chains[2]
			: id == ChainId.ARBITRUM ? chain = chains[3] // ARBITRUM
				: id == ChainId.AVALANCHE ? chain = chains[4]
					: id == ChainId.FANTOM ? chain = chains[5]
						: id == 1285 ? chain = chains[6] // MOONRIVER
							: chains[0] // ETH
	return chain
}

const Aggregator = ({ }) => {
	const { account, chainId, library } = useActiveWeb3React();
	const signer = library.getSigner()
	const [selectedChain, setSelectedChain] = useState(startChain(chainId))

	const router = useRouter()
	const tokens = router.query.tokens

	const DEFAULT_CURRENCY_B = [ChainId.FANTOM].includes(chainId) ? SOUL_ADDRESS[chainId ?? ChainId.FANTOM] : USDC_ADDRESS[chainId ?? ChainId.FANTOM]
	const [currencyIdA, currencyIdB] = (tokens as string[]) || [NATIVE[chainId ?? ChainId.FANTOM].symbol, DEFAULT_CURRENCY_B]
	const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]

	const [fromToken, setFromToken] = useState<Currency>(currencyA)
	const [toToken, setToToken] = useState<Currency>(currencyB)
	const [inputToken, setInputToken] = useState<Currency>(currencyA)
	const [outputToken, setOutputToken] = useState<Currency>(currencyB)

	// const [fromDecimals, setFromDecimals] = useState(inputToken?.wrapped.decimals)
	const [toDecimals, setToDecimals] = useState(outputToken?.wrapped.decimals)

	// const [useSwap, setUseSwap] = useState(false)
	// const [showRoutes, setShowRoutes] = useState(true)

	// const [fromAddress, setFromAddress] = useState(fromToken?.isNative ? NATIVE_ADDRESS : fromToken?.wrapped.address)
	// const [toAddress, setToAddress] = useState(toToken?.isNative ? NATIVE_ADDRESS : toToken?.wrapped.address)
	// const [tokenToApprove, setTokenToApprove] = useState<Currency>()

	const [slippage, setSlippage] = useState('1')
	const [amount, setAmount] = useState(10);
	const [txModalOpen, setTxModalOpen] = useState(false);
	const [txUrl, setTxUrl] = useState('');

	const gasPrice = useGasPrice()?.gasPrice.fast

	const amountWithDecimals = new BigNumber(amount.toString())
		.times(10 ** (fromToken?.wrapped.decimals || 18))
		.toFixed(0);

	const [route, setRoute] = useState(null);

	const swapMutation = useMutation({
		mutationFn: (params: {
			chain: string;
			from: string;
			to: string;
			amount: string;
			adapter: string;
			signer: ethers.Signer;
			slippage: string;
			rawQuote: any;
			tokens: { toToken: Currency; fromToken: Currency };
		}) => swap(params),
		onSuccess: (data, variables) => {
			addTransaction({
				chainId: chainId,
				hash: data?.hash,
				from: account,
				summary: `Swap transaction using ${variables.adapter} is sent.`
			});
			const explorerUrl = getExplorerLink(chainId, data, "transaction") // chain.blockExplorers.default.url;
			setTxModalOpen(true);

			setTxUrl(`${explorerUrl}/tx/${data?.hash}`)
		},
		onError: (err: { reason: string; code: string }) => {
			if (err.code !== 'ACTION_REJECTED') {
				console.log('Transaction Rejected: %s', err.reason)
			}
		}
	})

	const handleSwap = () => {
		swapMutation.mutate({
			chain: selectedChain.value,
			from: fromToken?.isNative ? NATIVE_ADDRESS : fromToken?.wrapped.address,
			to: toToken?.isNative ? NATIVE_ADDRESS : toToken?.wrapped.address,
			amount: amountWithDecimals,
			// @ts-ignore
			signer,
			slippage,
			adapter: route.name,
			rawQuote: route?.price?.rawQuote,
			tokens: { fromToken, toToken }
		})
	}

	const { data: routes = [], isLoading } = useGetRoutes({
		chain: selectedChain.value,
		from: fromToken?.isNative ? NATIVE_ADDRESS : fromToken?.wrapped.address,
		to: toToken?.isNative ? NATIVE_ADDRESS : toToken?.wrapped.address,
		amount: amountWithDecimals,
		extra: {
			gasPrice,
			userAddress: account,
			amount,
			fromToken,
			toToken,
			slippage
		}
	});

	const { data: tokenPrices } = useGetPrice({
		chain: selectedChain.value,
		toToken: toToken?.wrapped.address,
		fromToken: fromToken?.wrapped.address
	});

	const { gasTokenPrice = 0, toTokenPrice = 0, fromTokenPrice = 0 } = tokenPrices || {};
	const tokenA = new Token(chainId, fromToken?.isNative ? NATIVE_ADDRESS : fromToken?.wrapped.address || WNATIVE_ADDRESS[chainId ?? ChainId.FANTOM], fromToken?.wrapped.decimals || 18)

	const [approvalState, approve] = useTokenApprove(
		CurrencyAmount?.fromRawAmount(tokenA, amountWithDecimals),
		// fromToken?.address, 
		route?.price?.tokenApprovalAddress,
		// route?.price?.tokenApprovalAddress ?? fromToken?.wrapped.address, 
	);

	// const isApproved = approvalState === (fromToken.isNative ? true : ApprovalState.APPROVED)
	const isApproved = approvalState === ApprovalState.APPROVED
	const isApproveLoading = approvalState === ApprovalState.PENDING

	const handleCurrencyASelect = useCallback(
		(currencyA: Currency) => {
			const newCurrencyIdA = currencyId(currencyA)
			if (newCurrencyIdA === currencyIdB) {
				router.push(`/exchange/aggregator/${currencyIdB}/${currencyIdA}`)
			} else {
				router.push(`/exchange/aggregator/${newCurrencyIdA}/${currencyIdB}`)
			}
		},
		[currencyIdB, router, currencyIdA]
	)

	const handleCurrencyBSelect = useCallback(
		(currencyB: Currency) => {
			const newCurrencyIdB = currencyId(currencyB)
			// if ([ChainId.AVALANCHE].includes(chainId) && currencyB.wrapped.address == SOUL_ADDRESS[chainId ?? ChainId.FANTOM]) { newCurrencyIdB = currencyId(USDC[chainId ?? ChainId.FANTOM]) }
			if (currencyIdA === newCurrencyIdB) {
				if (currencyIdB) {
					router.push(`/exchange/aggregator/${currencyIdB}/${newCurrencyIdB}`)
				} else {
					router.push(`/exchange/aggregator/${newCurrencyIdB}`)
				}
			} else {
				router.push(`/exchange/aggregator/${currencyIdA ? currencyIdA : NATIVE[chainId ?? ChainId.FANTOM].symbol}/${newCurrencyIdB}`)
			}
		},
		[currencyIdA, router, currencyIdB]
	)

	const handleInputSelect = useCallback(
		(inputCurrency: Currency) => {
			setFromToken(inputCurrency)
			setInputToken(inputCurrency)
			// setFromDecimals(inputCurrency?.wrapped.decimals)
			handleCurrencyASelect(inputCurrency)

		},
		[setFromToken]
	)

	const handleOutputSelect = useCallback(
		(outputCurrency: Currency) => {
			setToToken(outputCurrency)
			setOutputToken(outputCurrency)
			setToDecimals(outputCurrency?.wrapped.decimals)
			handleCurrencyBSelect(outputCurrency)
		},
		[setToToken]
	)

	const handleTypeInput = useCallback(
		(value: string) => {
			setAmount(Number(value))
		},
		[setAmount]
	)

	const normalizedRoutes = [...(routes || [])]
		?.map((route) => {
			// TODO
			const gasUsd = (gasTokenPrice * +route.price.estimatedGas * +gasPrice) / 1e18 || 0;
			// const gasUsd = gasTokenPrice // TEMP FIX
			const amount = +route.price.amountReturned / 10 ** +toToken?.decimals;
			const amountUsd = (amount * toTokenPrice).toFixed(2);
			const netOut = +amountUsd - gasUsd;

			return { route, gasUsd, amountUsd, amount, netOut, ...route };
		})
		.filter(({ fromAmount, amount: toAmount }) => Number(toAmount) && amountWithDecimals === fromAmount)
		.sort((a, b) => b.netOut - a.netOut);

	return (
		<DoubleGlowShadowV2>
			<Head>
				<title>Meta | SoulSwap</title>
				{/* <meta name="description" content="SoulSwap is an AMM exchange, part of Soul Protocol, which offers a full suite of DeFi tools." /> */}
				<meta name="description" content="Find the best prices on the network by leveraging our novel Meta-Aggregator, which operates as the aggregator of aggregators." />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:image" content="https://soulswap.finance/images/soulswap-cover.png" />
				<meta name="twitter:site" content="@SoulSwapFinance" />
				<meta id="og:image" property="og:image" content="https://soulswap.finance/images/soulswap-cover.png" />
				<meta id="og:image:type" property="og:image:type" content="image/png" />
				<meta id="og:image:type" property="og:image:type" content="630" />
				<meta id="og:image:width" property="og:image:width" content="1200" />
				<meta id="og:description" property="og:description" content="Find the best prices on the network by leveraging our novel Meta-Aggregator, which operates as the aggregator of aggregators." />
			</Head>
			<div className={`grid p-1 mt-8 space-y-2 rounded-2xl bg-dark-1000`}>
				<CustomBanner
					external={true}
					chains={[ChainId.ETHEREUM, ChainId.FANTOM, ChainId.AVALANCHE]}
					link={'https://apps.apple.com/us/app/soulwallet-defi-portal/id6469735252'}
					text={'Download SoulWallet (iOS) ↗'}
					textColor={'white'}
					color={'ftmBlue'}
					className={`animate-pulse border-4 border-dark-800 rounded-2xl`}
				/>
				<LimitHeader
					inputCurrency={null}
					outputCurrency={null}
				/>
				<div className={`my-12`} />
				<div className="flex flex-col gap-3 space-y-3">
					<SwapAssetPanel
						spendFromWallet={true}
						chainId={chainId}
						header={(props) => (
							<SwapAssetPanel.Header
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
						<SwapAssetPanel
							showInput={false}
							spendFromWallet={true}
							chainId={chainId}
							header={(props) => (
								<SwapAssetPanel.Header
									{...props}
									label={
										`Swap to:`
									}
								/>
							)}
							currency={
								toToken
								// toToken
								// [ChainId.AVALANCHE].includes(chainId)
								// 	&& toToken.wrapped.address === SOUL_ADDRESS[chainId ?? ChainId.FANTOM]
								// 	? USDC[chainId ?? ChainId.FANTOM]
								// 	: toToken
							}
							// value={(routes[0]?.price.amountReturned / (10 ** (outputToken?.wrapped.decimals))).toString() ?? '1'}
							onChange={() => { }}
							onSelect={handleOutputSelect}
						/>
					</div>
				</div>
				<div>
				</div>
				{route && account && (
					<Button
						variant={'filled'}
						color={'ftmBlue'}
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
				)}
				{inputToken && outputToken && (
					<Routes>
						<div className={`flex flex-col justify-center p-2 -ml-4 -mr-2 sm:-mr-4 border border-dark-800 hover:border-${'ftmBlue'} border-1 rounded rounded-xl`}>
							{isLoading ? <Loader loaded={!isLoading} /> : null}
							{normalizedRoutes.map((r, i) => (
								<Route
									{...r}
									index={i}
									selected={route?.name === r.name}
									setRoute={() => setRoute(r.route)}
									toToken={outputToken}
									amountFrom={amountWithDecimals}
									fromToken={inputToken}
									selectedChain={selectedChain.label}
									key={i}
								/>
							))}
						</div>
					</Routes>
				)}
			</div>
		</DoubleGlowShadowV2>
	)
}

Aggregator.Guard = NetworkGuard(Feature.AGGREGATE)
export default Aggregator