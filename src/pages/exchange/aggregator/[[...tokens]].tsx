import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
// import { groupBy, mapValues, merge, uniqBy } from 'lodash'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
// import { useFeeData } from 'wagmi'
import styled from 'styled-components'
import Route from 'components/SwapRoute'
import { getAllChains, swap } from 'features/aggregator/router'
// import { Input, TokenInput } from 'features/aggregator/components/TokenInput'
// import { CrossIcon } from 'features/aggregator/components/Icons'
import Loader from 'features/aggregator/components/Loader'
import { ApprovalState, useTokenApprove } from 'hooks/useTokenApprove'
import useGetRoutes from 'features/aggregator/queries/useGetRoutes'
import useGetPrice from 'features/aggregator/queries/useGetPrice'
import { useActiveWeb3React } from 'services/web3'
import { getExplorerLink } from 'functions/explorer'
import { ChainId, Currency, CurrencyAmount, DAI, DAI_ADDRESS, NATIVE, NATIVE_ADDRESS, SOUL, SOUL_ADDRESS, Token, USDC, USDC_ADDRESS, WNATIVE, WNATIVE_ADDRESS } from 'sdk'
import { addTransaction } from 'state/transactions/actions'
import useTokenBalance from 'hooks/useTokenBalance'
import { Button } from 'components/Button'
import { getChainColorCode } from 'constants/chains'
// import listedTokens from 'features/aggregator/tokenList.json'
import { e10 } from 'functions/math'
import SwapAssetPanel from 'features/trident/swap/SwapAssetPanel'
import { ArrowDownIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'
// import CurrencyInputPanel from 'components/CurrencyInputPanel'
// import Web3 from 'web3'
import { useGasPrice } from 'hooks/useAPI'
import { SwapLayoutCard } from 'layouts/SwapLayout'
// import SwapHeader from 'features/swap/SwapHeader'
import Container from 'components/Container'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums/Feature'
import { useRouter } from "next/router"
import { useCurrency } from "hooks/Tokens"
import { currencyId } from 'functions/currency/currencyId'
import SwapDropdown from 'features/swap/SwapDropdown'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import { classNames } from 'functions/styling'
// import { Toggle } from 'components/Toggle'
import { featureEnabled } from 'functions/feature'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'

/*
Integrated:
- paraswap
- 0x
- 1inch
- cowswap
- kyberswap
- firebird (https://docs.firebird.finance/developer/api-specification)
- https://openocean.finance/
- airswap
- https://app.unidex.exchange/trading
- https://twitter.com/odosprotocol
- yieldyak
- https://defi.krystal.app/

- rook
- https://rubic.exchange/ - aggregates aggregators
- https://twitter.com/RangoExchange - api key requested, bridge aggregator, aggregates aggregators on same chain
- thorswap - aggregates aggregators that we already have
- lifi
- https://twitter.com/ChainHopDEX - only has 1inch
- https://twitter.com/MayanFinance

no api:
- https://twitter.com/HeraAggregator (no api)
- slingshot (no api)
- orion protocol
- autofarm.network/swap/
- https://swapr.eth.limo/#/swap?chainId=1 - aggregates aggregators + swapr

non evm:
- jupiter (solana)
- openocean (solana)
- https://twitter.com/prism_ag (solana)
- coinhall (terra)
- https://twitter.com/tfm_com (terra)
*/

const Body = styled.div<{ showRoutes: boolean }>`
	display: grid;
	grid-row-gap: 12px;
	padding-bottom: 4px;

	min-width: 30rem;
	// max-width: 46rem;

	padding: 8px;
	border-radius: 16px;
	text-align: left;
	transition: all 0.66s ease-out;
	animation: ${(props) =>
		props.showRoutes === true ? 'slide-left 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both' : 'none'};

	@keyframes slide-left {
		0% {
			transform: translateX(180px);
		}
		100% {
			transform: translateX(0);
		}
	}
`;

// const Wrapper = styled.div`
// 	width: 100%;
// 	text-align: center;
// 	display: grid;
// 	grid-row-gap: 36px;
// 	margin: 10px auto 40px;

// 	h1 {
// 		font-weight: 500;
// 	}
// `;

// const Balance = styled.div`
// 	text-align: right;
// 	padding-right: 4px;
// 	// text-decoration: underline;
// 	margin-top: 12px;
// 	cursor: pointer;
// `;

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

// const FormHeader = styled.div`
// 	font-weight: bold;
// 	font-size: 16px;
// 	margin-bottom: 4px;
// 	padding-left: 4px;
// `

const SwapWrapper = styled.div`
	width: 100%;
	display: flex;
	& > button {
		width: 100%;
		margin-right: 4px;
	}
`

export const InputFooter = styled.div`
	display: flex;
	margin-top: 1.25rem;
	justify-content: space-between;
`

export const chains = getAllChains()

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

	const DEFAULT_CURRENCY_B = [ChainId.FANTOM].includes(chainId) ? SOUL_ADDRESS[chainId] : USDC_ADDRESS[chainId]
	const [currencyIdA, currencyIdB] = (tokens as string[]) || [NATIVE[chainId].symbol, DEFAULT_CURRENCY_B]
	const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]

	const [fromToken, setFromToken] = useState<Currency>(currencyA)
	const [toToken, setToToken] = useState<Currency>(currencyB)
	const [inputToken, setInputToken] = useState<Currency>(currencyA)
	const [outputToken, setOutputToken] = useState<Currency>(currencyB)

	// const [fromDecimals, setFromDecimals] = useState(inputToken?.wrapped.decimals)
	const [toDecimals, setToDecimals] = useState(outputToken?.wrapped.decimals)

	const [useSwap, setUseSwap] = useState(false)
	const [showRoutes, setShowRoutes] = useState(true)

	const handleUseSwap = useCallback(
		() => {
			// setShowHeader(false)
			router.push(`/exchange/swap/${currencyIdA}/${currencyIdB}`)
		}, [useSwap]
	)

	// const [fromAddress, setFromAddress] = useState(fromToken?.isNative ? NATIVE_ADDRESS : fromToken?.wrapped.address)
	// const [toAddress, setToAddress] = useState(toToken?.isNative ? NATIVE_ADDRESS : toToken?.wrapped.address)
	// const [tokenToApprove, setTokenToApprove] = useState<Currency>()

	const [slippage, setSlippage] = useState('1')
	const [amount, setAmount] = useState('10');
	const [txModalOpen, setTxModalOpen] = useState(false);
	const [txUrl, setTxUrl] = useState('');

	const gasPrice = useGasPrice()?.gasPrice.fast

	const amountWithDecimals = new BigNumber(amount)
		.times(10 ** (fromToken?.wrapped.decimals || 18))
		.toFixed(0);

	const balance =
		useTokenBalance(
			chainId,
			// fromToken?.isNative ? NATIVE_ADDRESS : 
			fromToken?.wrapped.address,
			// addressOrName: address,
			// watch: true
		);

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

			setTxUrl(`${explorerUrl}/tx/${data?.hash}`);
		},
		onError: (err: { reason: string; code: string }) => {
			if (err.code !== 'ACTION_REJECTED') {
				console.log('Transaction Rejected: %s', err.reason)
			}
		}
	});

	const handleSwap = () => {
		swapMutation.mutate({
			chain: selectedChain.value,
			from: fromToken?.isNative ? NATIVE_ADDRESS : fromToken?.wrapped.address,
			to: toToken?.isNative ? NATIVE_ADDRESS : toToken?.wrapped.address,
			amount: amountWithDecimals,
			signer,
			slippage,
			adapter: route.name,
			rawQuote: route?.price?.rawQuote,
			tokens: { fromToken, toToken }
		});
	};

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

	// const cleanState = () => {
	// 	setFromToken(null);
	// 	setToToken(null);
	// 	setRoute(null);
	// 	setTxUrl('');
	// };

	const tokenA = new Token(chainId, fromToken?.isNative ? NATIVE_ADDRESS : fromToken?.wrapped.address || WNATIVE_ADDRESS[chainId], fromToken?.wrapped.decimals || 18)

	const [approvalState, approve] = useTokenApprove(
		CurrencyAmount.fromRawAmount(tokenA, amountWithDecimals),
		// fromToken?.address, 
		route?.price?.tokenApprovalAddress,
	);

	const isApproved = approvalState === ApprovalState.APPROVED
	const isApproveLoading = approvalState === ApprovalState.PENDING

	// const onMaxClick = () => {
	// 	if (balance) setAmount((balance.value?.div(e10(fromToken.decimals || 18))).toString());
	// };

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
			// if ([ChainId.AVALANCHE].includes(chainId) && currencyB.wrapped.address == SOUL_ADDRESS[chainId]) { newCurrencyIdB = currencyId(USDC[chainId]) }
			if (currencyIdA === newCurrencyIdB) {
				if (currencyIdB) {
					router.push(`/exchange/aggregator/${currencyIdB}/${newCurrencyIdB}`)
				} else {
					router.push(`/exchange/aggregator/${newCurrencyIdB}`)
				}
			} else {
				router.push(`/exchange/aggregator/${currencyIdA ? currencyIdA : NATIVE[chainId].symbol}/${newCurrencyIdB}`)
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
			setAmount(value)
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
		<Container id="cross-page" maxWidth="2xl" className="space-y-4">
			<DoubleGlowShadowV2>
				{/* <div className={"grid grid-cols-1 gap-2"}> */}
				<SwapLayoutCard>
					<div className="p-0 px-2 mt-0 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}>
						{/* {showHeader && */}
						<SwapDropdown
							inputCurrency={currencyA}
							outputCurrency={currencyB}
						// allowedSlippage={allowedSlippage}
						/>
						{/* } */}
						{/* <Container  */}
						{/* // showRoutes={inputToken && outputToken} */}
						{/* > */}
						{/* <FormHeader>Select Tokens</FormHeader> */}
						{/* <TokenSelectDiv onClick={() => setShowTokenSelect(true)}> */}
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
								value={amount}
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
										// 	&& toToken.wrapped.address === SOUL_ADDRESS[chainId]
										// 	? USDC[chainId]
										// 	: toToken
									}
									value={(routes[0]?.price.amountReturned / (10 ** (outputToken?.wrapped.decimals)))?.toString() || '0'}
									onChange={() => { }}
									onSelect={handleOutputSelect}
								/>
							</div>
						</div>

						<div>
							{/* <FormHeader>From Amount</FormHeader> */}
							{/* <TokenInput setAmount={setAmount} amount={amount} onMaxClick={onMaxClick} /> */}
							{/* <InputFooter className="bg-dark-1000 p-2 m-1 rounded rounded-xl">
								<div className="font-bold p-2" style={{ marginTop: 4, marginLeft: 4 }}>
									<Input
										value={slippage}
										type="number"
										style={{
											width: 48,
											height: 30,
											display: 'inline',
											appearance: 'textfield'
										}}
										onChange={(val) => {
											if (+val.target.value < 50) setSlippage(val.target.value);
										}}
									/>{' % Slippage'}
								</div>
								<div className="flex mt-2 font-bold p-2">
									{fromTokenPrice > 0 && (
										<>
											${(+fromTokenPrice * +amount).toLocaleString(undefined, {
												maximumFractionDigits: 3
											}) + ' Value'}
											{/* Value: $ */}
							{/* </> */}
							{/* )} */}
							{/* </div> */}
							{/* {balance &&
								<Balance onClick={onMaxClick}>
									{
									// fromToken?.isNative
										// ? `Balance: ${(balance.value?.div(e10(18))).toString()} ${fromToken?.symbol}`
									`Balance: ${(balance.value?.div(e10(fromToken?.wrapped.decimals ?? 18))).toString()} ${fromToken?.symbol}`}
								</Balance>
							}
							</InputFooter> */}
						</div>
						{/* <SwapWrapper> */}
						{route && account && (
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
						)}
						{/* route && account && !isApproved && ['Matcha/0x', '1inch'].includes(route?.name) ? (
							<Button
								variant={'filled'}
								color={getChainColorCode(chainId)}
								colorScheme={'messenger'}
								loadingText="Preparing Transaction"
								isLoading={isApproveLoading}
								onClick={() => {
									if (approve) handleApprove();
								}}
							>
								{'Approve Infinite'}
							</Button>
						) : null */}
						{/* </SwapWrapper> */}
						{/* </Container> */}
						{/* </SwapLayoutCard> */}

						{inputToken && outputToken && (
							/* <SwapLayoutCard> */
							// <Container>
							// 	<div className={`m-2 border border-dark-800 hover:border-${getChainColorCode(chainId)} border-2 rounded rounded-xl`}>
							<Routes>
								<div className={`flex flex-col justify-center p-2 -ml-4 -mr-2 sm:-mr-4 border border-dark-800 hover:border-${getChainColorCode(chainId)} border-1 rounded rounded-xl`}>
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
							// 	</div>
							// </Container>
							/* </SwapLayoutCard> */
						)}
					</div>
					<div className={classNames(featureEnabled(Feature.AGGREGATE, chainId) ? "m-1 flex justify-between" : "hidden")}>
						<Button variant="outlined"
							color={'blue'}
							onClick={handleUseSwap}
						>
							<div className={`flex text-sm font-bold text-${'blue'} justify-left`}>
								<ArrowLeftIcon className={'mt-1 mr-1'} width="1em" height="1em" />
								{i18n._(t`Return to Swap`)}
							</div>
						</Button>
						{/* <div className={classNames(`flex flex-cols-2 gap-3 text-white justify-end`)}>
							<Toggle
								id="toggle-button"
								optionA="Routes"
								optionB="Routes"
								isActive={showRoutes}
								toggle={
									useSwap
										? () => {
											setShowRoutes(false)
										}
										: () => {
											setShowRoutes(true)
										}
								}
							/>
						</div> */}
						{/* <div className={classNames(`flex flex-cols-2 gap-3 text-white justify-end`)}>
							<Toggle
								id="toggle-button"
								optionA="Aggregator"
								optionB="Aggregator"
								isActive={useSwap}
								toggle={
									useSwap
										? () => {
											setUseSwap(false)
										}
										: () => {
											setUseSwap(true)
										}
								}
							/>
						</div> */}
					</div>
					{/* <FAQs /> */}
					{/* <TransactionModal open={txModalOpen} setOpen={setTxModalOpen} link={txUrl} /> */}
				</SwapLayoutCard>
			</DoubleGlowShadowV2>
		</Container>
	);
}

export default Aggregator
Aggregator.Guard = NetworkGuard(Feature.AGGREGATE)