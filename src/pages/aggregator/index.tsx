import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { groupBy, mapValues, merge, uniqBy } from 'lodash'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
// import { useFeeData } from 'wagmi'
import styled from 'styled-components'
import Route from 'components/SwapRoute'
import { getAllChains, swap } from 'features/aggregator/router'
import { Input, TokenInput } from 'features/aggregator/components/TokenInput'
import { CrossIcon } from 'features/aggregator/components/Icons'
import Loader from 'features/aggregator/components/Loader'
import { ApprovalState, useTokenApprove } from 'hooks/useTokenApprove'
import useGetRoutes from 'features/aggregator/queries/useGetRoutes'
import useGetPrice from 'features/aggregator/queries/useGetPrice'
import { useActiveWeb3React } from 'services/web3'
import { getExplorerLink } from 'functions/explorer'
import { Currency, CurrencyAmount, DAI, DAI_ADDRESS, NATIVE, NATIVE_ADDRESS, Token, USDC, USDC_ADDRESS, WNATIVE, WNATIVE_ADDRESS } from 'sdk'
import { addTransaction } from 'state/transactions/actions'
import useTokenBalance from 'hooks/useTokenBalance'
import { Button } from 'components/Button'
import { getChainColorCode } from 'constants/chains'
import listedTokens from 'features/aggregator/tokenList.json'
import { e10 } from 'functions/math'
import SwapAssetPanel from 'features/trident/swap/SwapAssetPanel'
import { ArrowDownIcon } from '@heroicons/react/solid'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import Web3 from 'web3'
import { useGasPrice } from 'hooks/useAPI'
import { SwapLayoutCard } from 'layouts/SwapLayout'
import SwapHeader from 'features/swap/SwapHeader'
import Container from 'components/Container'
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

cant integrate:
- https://twitter.com/UniDexFinance - api broken (seems abandoned)
- https://bebop.xyz/ - not live
- VaporDex - not live
- https://twitter.com/hippolabs__ - not live
- dexguru - no api
- https://wowmax.exchange/alpha/ - still beta + no api
- https://twitter.com/RBXtoken - doesnt work
- https://www.bungee.exchange/ - couldnt use it
- wardenswap - no api + sdk is closed source
- https://twitter.com/DexibleApp - not an aggregator, only supports exotic orders like TWAP, segmented order, stop loss...
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

const Routes = styled.div`
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

const InputFooter = styled.div`
	display: flex;
	justify-content: space-between;
`

const chains = getAllChains()

const startChain = (id) => {
	let chain = chains[0] // ETH
	id == 56 ? chain = chains[1] // BSC
		: id == 137 ? chain = chains[2] // MATIC
			: id == 42161 ? chain = chains[3] // ARBITRUM
				: id == 43114 ? chain = chains[4] // AVALANCHE
					: id == 250 ? chain = chains[5] // FANTOM
						: id == 1285 ? chain = chains[6] // MOONRIVER
							: chains[0] // ETH
	return chain
}

const Aggregator = ({ }) => {
	const { account, chainId, library } = useActiveWeb3React();
	const signer = library.getSigner()
	const [selectedChain, setSelectedChain] = useState(startChain(chainId))

	const [fromToken, setFromToken] = useState<Currency>(NATIVE[chainId])
	const [toToken, setToToken] = useState<Currency>(DAI[chainId])
	const [inputToken, setInputToken] = useState<Currency>(NATIVE[chainId])
	const [outputToken, setOutputToken] = useState<Currency>(DAI[chainId])
	const [fromDecimals, setFromDecimals] = useState(inputToken?.wrapped.decimals)
	const [toDecimals, setToDecimals] = useState(outputToken?.wrapped.decimals)

	const [fromAddress, setFromAddress] = useState(fromToken?.isNative ? NATIVE_ADDRESS : fromToken?.wrapped.address)
	const [toAddress, setToAddress] = useState(toToken?.isNative ? NATIVE_ADDRESS : toToken?.wrapped.address)
	const [tokenToApprove, setTokenToApprove] = useState<Currency>()

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

	const onMaxClick = () => {
		if (balance) setAmount((balance.value?.div(e10(fromToken.decimals || 18))).toString());
	};

	const handleInputSelect = useCallback(
		(inputCurrency: Currency) => {
			setFromToken(inputCurrency)
			setInputToken(inputCurrency)
			setFromDecimals(inputCurrency?.wrapped.decimals)

		},
		[setFromToken]
	)

	const handleOutputSelect = useCallback(
		(outputCurrency: Currency) => {
			setToToken(outputCurrency)
			setOutputToken(outputCurrency)
			setToDecimals(outputCurrency?.wrapped.decimals)
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
		<Container>
			{/* <div className="mt-2" /> */}
			<div className={"grid grid-cols-1 gap-2 mt-4"}>
				<SwapLayoutCard>
					<SwapHeader />
					<Container 
					// showRoutes={inputToken && outputToken}
					>
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
									<div
										// role="button"
										className={`p-1.5 rounded-full bg-dark-800 border shadow-md border-dark-700`}
										onClick={() => {
											// setApprovalSubmitted(false) // reset 2 step UI for approvals
											// onSwitchTokens()
										}}
									>
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
								currency={toToken}
								value={(routes[0]?.price.amountReturned / (10**(outputToken?.wrapped.decimals)))?.toString() || '0'}
								onChange={() => {}}
								onSelect={handleOutputSelect}
							/>
								{/* <CurrencyInputPanel
									showCurrencySelect={true}
									currency={outputToken}
									hideInput={true}
									// onClick={() => setToToken(toToken)}
									onUserInput={handleTypeInput}
									onCurrencySelect={handleOutputSelect}
									// otherCurrency={currencyB}
									showCommonBases={false}
									id="output-currency"
									disableCurrencySelect={false}
									hideBalance={true}
									chainId={chainId}
								/> */}
							</div>
						</div>

						<div>
							{/* <FormHeader>From Amount</FormHeader> */}
							{/* <TokenInput setAmount={setAmount} amount={amount} onMaxClick={onMaxClick} /> */}
							<InputFooter>
								<div className="font-bold mb-4" style={{ marginTop: 4, marginLeft: 4 }}>
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
								<div className="flex mt-3 font-bold">
									{fromTokenPrice > 0 && (
										<>
											${(+fromTokenPrice * +amount).toLocaleString(undefined, {
												maximumFractionDigits: 3
											}) + ' Value'}
											{/* Value: $ */}
										</>
									)}
								</div>
								{/* {balance &&
								<Balance onClick={onMaxClick}>
									{
									// fromToken?.isNative
										// ? `Balance: ${(balance.value?.div(e10(18))).toString()} ${fromToken?.symbol}`
									`Balance: ${(balance.value?.div(e10(fromToken?.wrapped.decimals ?? 18))).toString()} ${fromToken?.symbol}`}
								</Balance>
							} */}
							</InputFooter>
						</div>
						<SwapWrapper>
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
						</SwapWrapper>
					</Container>
				</SwapLayoutCard>

				{inputToken && outputToken && (
					<SwapLayoutCard>
						<Container>
							<Routes>
							{/* <FormHeader>
							Routes
							<CloseBtn onClick={cleanState} />{' '}
						</FormHeader> */}
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
							</Routes>
						</Container>
					</SwapLayoutCard>
				)}
			</div>

			{/* <FAQs /> */}
			{/* <TransactionModal open={txModalOpen} setOpen={setTxModalOpen} link={txUrl} /> */}
		</Container>
	);
}

export default Aggregator