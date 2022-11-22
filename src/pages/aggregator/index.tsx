import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { groupBy, mapValues, merge, uniqBy } from 'lodash';
// import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { ArrowRight } from 'react-feather';
import styled from 'styled-components';
import { createFilter } from 'react-select';
// import {
// 	Modal,
// 	ModalBody,
// 	ModalCloseButton,
// 	ModalContent,
// 	ModalHeader,
// 	ModalOverlay,
// 	// Image,
// 	Link,
// 	ModalFooter,
// 	Heading,
// 	useToast,
// 	Button
// } from '@chakra-ui/react';
// import { ExternalLinkIcon } from '@chakra-ui/icons';
// import FAQs from 'components/FAQs';
import Route from 'components/SwapRoute';
import { getAllChains, swap } from 'features/aggregator/router';
import { Input, TokenInput } from 'features/aggregator/components/TokenInput';
import MultiSelect from 'features/aggregator/components/MultiSelect';
import { CrossIcon } from 'features/aggregator/components/Icons';
import Loader from 'features/aggregator/components/Loader';
import Search from 'features/aggregator/components/Search';
import { ApprovalState, useTokenApprove } from 'hooks/useTokenApprove';
import useGetRoutes from 'features/aggregator/queries/useGetRoutes';
import useGetPrice from 'features/aggregator/queries/useGetPrice';
import { nativeTokens } from 'features/aggregator/natives';
import { chainsMap } from 'features/aggregator/constants';
import { TYPE } from 'theme';
import Head from 'next/head';
import { useActiveWeb3React } from 'services/web3';
import { getExplorerLink } from 'functions/explorer';
import { Currency, CurrencyAmount, DAI, DAI_ADDRESS, NATIVE, NATIVE_ADDRESS, Token, USDC, USDC_ADDRESS, WNATIVE, WNATIVE_ADDRESS } from 'sdk';
import { addTransaction } from 'state/transactions/actions';
import useTokenBalance from 'hooks/useTokenBalance';
import useApprove from 'hooks/useApprove';
import Modal from 'components/DefaultModal';
import ModalContent from 'components/Modal/Content';
// import ModalHeader from 'components/Modal/Header';
import ExternalLink from 'components/ExternalLink';
import { Button } from 'components/Button';
import { useToast } from 'react-toastify';
import { CurrencyInputWithNetworkSelector } from 'components/CrossSwap/CurrencyInputWithNetworkSelector';
import Container from 'components/Container';
import { getChainColorCode, getChainInfo } from 'constants/chains';
import listedTokens from 'features/aggregator/tokenList.json'
import { e10 } from 'functions/math';
// import AssetInput from 'components/AssetInput';
// import TokenSelect from 'features/cross/components/TokenSelect';
import { CHAINS } from 'features/cross/chains';
import SwapAssetPanel from 'features/trident/swap/SwapAssetPanel';
import { ArrowDownIcon, PlusIcon } from '@heroicons/react/solid';
import CurrencyInputPanel from 'components/CurrencyInputPanel';
import { BNB } from 'constants/tokens';

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

	box-shadow: ${({ theme }) =>
		theme.mode === 'dark'
			? '10px 0px 50px 10px rgba(26, 26, 26, 0.9);'
			: '10px 0px 50px 10px rgba(211, 211, 211, 0.9);;'};
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

const Wrapper = styled.div`
	width: 100%;
	text-align: center;
	display: grid;
	grid-row-gap: 36px;
	margin: 10px auto 40px;

	h1 {
		font-weight: 500;
	}
`;

// const oneInchChains = {
// 	ethereum: 1,
// 	bsc: 56,
// 	polygon: 137,
// 	arbitrum: 42161,
// 	avax: 43114,
// 	fantom: 250,
// };

const Balance = styled.div`
	text-align: right;
	padding-right: 4px;
	text-decoration: underline;
	margin-top: 4px;
	cursor: pointer;
`;

const Routes = styled.div`
	padding: 16px;
	border-radius: 16px;
	text-align: left;
	overflow-y: scroll;
	max-height: 444px;
	min-width: 30rem;
	animation: tilt-in-fwd-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;

	box-shadow: ${({ theme }) =>
		theme.mode === 'dark'
			? '10px 0px 50px 10px rgba(26, 26, 26, 0.9);'
			: '10px 0px 50px 10px rgba(211, 211, 211, 0.9);'};

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
`;
// const BodyWrapper = styled.div`
// 	display: flex;
// 	gap: 16px;
// 	margin: 0 auto;
// `;

// const TokenSelectDiv = styled.div`
// 	display: grid;
// 	grid-column-gap: 8px;
// 	margin-top: 16px;
// 	margin-bottom: 8px;
// 	grid-template-columns: 5fr 1fr 5fr;
// `;

const CloseBtn = ({ onClick }) => {
	return (
		<Close onClick={onClick}>
			<CrossIcon />
		</Close>
	);
};

// interface Token {
// 	address: string;
// 	logoURI: string;
// 	symbol: string;
// 	decimals: string;
// 	name: string;
// 	chainId: number;
// }

async function getTokenList() {
	const tokenList = listedTokens
	// const uniList = await fetch('https://tokens.uniswap.org/').then((r) => r.json());
	// const sushiList = await fetch('https://token-list.sushi.com/').then((r) => r.json());
	// const oneInch = await Promise.all(
	// 	Object.values(oneInchChains).map(async (chainId) =>
	// 		fetch(`https://tokens.1inch.io/v1.1/${chainId}`).then((r) => r.json())
	// 	)
	// );
	// const lifiList = await fetch('https://li.quest/v1/tokens').then((r) => r.json());

	// const oneInchList = Object.values(oneInchChains)
	// 	.map((chainId, i) =>
	// 		Object?.values(tokenList[i]).map((token: { address: string }) => ({
	// 			...token,
	// 			chainId
	// 		}))
	// 	)
	// 	.flat();

	const tokensByChain = mapValues(
		merge(
			groupBy([
				// ...oneInchList, 
				// ...sushiList.tokens, 
				...tokenList.tokens["250"]], 'chainId')
			// ...nativeTokens], 'chainId'),
			// lifiList.tokens
		),
		(val) => uniqBy(val, (token: Token) => token.address
			// .toLowerCase()
		)
	);

	return {
		props: {
			tokenlist: tokenList.tokens["250"],
		},
		revalidate: 5 * 600 // 5 minutes
	};
}

// const TransactionModal = ({ open, setOpen, link }) => {
// 	return (
// 		<Modal 
// 			// closeOnOverlayClick={true} 
// 			isOpen={open} 
// 			onDismiss={() => setOpen(false)}
// 			>
// 			{/* <ModalOverlay /> */}
// 			<ModalContent>
// 				{/* <ModalHeader textAlign={'center'}>Transaction submitted</ModalHeader> */}
// 				{/* <ModalCloseButton /> */}
// 				{/* <ModalBody pb={6}> */}
// 					{/* <Image src={txImg.src} alt="" /> */}
// 				{/* </ModalBody> */}
// 				{/* <ModalFooter justifyContent={'center'}> */}
// 					<ExternalLink href={link}>
// 						View in explorer 
// 						{/* <ExternalLinkIcon mx="2px" /> */}
// 					</ExternalLink>
// 				{/* </ModalFooter> */}
// 			</ModalContent>
// 		</Modal>
// 	);
// };

const FormHeader = styled.div`
	font-weight: bold;
	font-size: 16px;
	margin-bottom: 4px;
	padding-left: 4px;
`;

const SelectWrapper = styled.div`
	border: ${({ theme }) => (theme.mode === 'dark' ? '2px solid #373944;' : '2px solid #c6cae0;')};
	border-radius: 16px;
	padding: 8px;
	padding-bottom: 16px;
`;

const Close = styled.span`
	position: absolute;
	right: 16px;
	cursor: pointer;
`;

const SwapWrapper = styled.div`
	width: 100%;
	display: flex;
	& > button {
		width: 100%;
		margin-right: 4px;
	}
`;

const InputFooter = styled.div`
	display: flex;
	justify-content: space-between;
`;

const chains = getAllChains();

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

	const [fromToken, setFromToken] = useState<Currency>()
	const [toToken, setToToken] = useState<Currency>(DAI[chainId])
	const [inputToken, setInputToken] = useState<Currency>()
	const [outputToken, setOutputToken] = useState<Currency>()
	const [fromDecimals, setFromDecimals] = useState(inputToken?.wrapped.decimals)
	const [toDecimals, setToDecimals] = useState(outputToken?.wrapped.decimals)

	const [fromAddress, setFromAddress] = useState(fromToken?.isNative ? NATIVE_ADDRESS : fromToken?.wrapped.address)
	const [toAddress, setToAddress] =  useState(toToken?.isNative ? NATIVE_ADDRESS : toToken?.wrapped.address)
	const [tokenToApprove, setTokenToApprove] = useState<Currency>()

	const [slippage, setSlippage] = useState('1')
	const [amount, setAmount] = useState('10');
	const [txModalOpen, setTxModalOpen] = useState(false);
	const [txUrl, setTxUrl] = useState('');

	const amountWithDecimals = new BigNumber(amount)
		.times(10 ** (fromToken?.wrapped.decimals || 18))
		.toFixed(0);

	const balance =
		useTokenBalance(
			chainId,
			fromToken?.isNative ? NATIVE_ADDRESS : fromToken?.wrapped.address,
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
				console.log('Something went wrong, oh no!')
			}
			// useToast(
			// 	// title: 'Something went wrong.',
			// 	// description: err.reason,
			// 	// status: 'error',
			// 	// duration: 9000,
			// 	// isClosable: true,
			// 	// position: 'top'
			// );
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
			// TODO
			// gasPriceData,
			userAddress: account,
			amount,
			fromToken,
			toToken,
			slippage
		}
	});

	const { data: tokenPrices } = useGetPrice({
		chain: selectedChain.value,
		toToken: toToken?.isNative ? NATIVE_ADDRESS : toToken?.wrapped.address,
		fromToken: fromToken?.isNative ? NATIVE_ADDRESS : fromToken?.wrapped.address
	});

	const { gasTokenPrice = 0, toTokenPrice = 0, fromTokenPrice = 0 } = tokenPrices || {};

	const cleanState = () => {
		setFromToken(null);
		setToToken(null);
		setRoute(null);
		setTxUrl('');
	};

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
			// const gasUsd = (gasTokenPrice * +route.price.estimatedGas * +gasPriceData?.formatted?.gasPrice) / 1e18 || 0;
			const gasUsd = gasTokenPrice // TEMP FIX
			const amount = +route.price.amountReturned / 10 ** +toToken?.decimals;
			const amountUsd = (amount * toTokenPrice).toFixed(2);
			const netOut = +amountUsd - gasUsd;

			return { route, gasUsd, amountUsd, amount, netOut, ...route };
		})
		.filter(({ fromAmount, amount: toAmount }) => Number(toAmount) && amountWithDecimals === fromAmount)
		.sort((a, b) => b.netOut - a.netOut);

	return (
		<Wrapper>
			<div className="mt-2" />

			<div className={"grid grid-cols-1 gap-4 m-12"}>
				<Body showRoutes={inputToken && outputToken}>
					<FormHeader>Select Tokens</FormHeader>
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
									role="button"
									className={`p-1.5 rounded-full bg-dark-800 border shadow-md border-dark-700 hover:border-${getChainColorCode(chainId)}`}
									onClick={() => {
										// setApprovalSubmitted(false) // reset 2 step UI for approvals
										// onSwitchTokens()
									}}
								>
									<ArrowDownIcon width={14} className="text-high-emphesis hover:text-white" />
									{/* <PlusIcon width={14} className="text-high-emphesis hover:text-white" /> */}
								</div>
							</div>

			  <CurrencyInputPanel
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
			   />
						</div>
					</div>

					<div>
						<FormHeader>From Amount</FormHeader>
						<TokenInput setAmount={setAmount} amount={amount} onMaxClick={onMaxClick} />
						<InputFooter>
							<div style={{ marginTop: 4, marginLeft: 4 }}>
								Slippage %{' '}
								<Input
									value={slippage}
									type="number"
									style={{
										width: 55,
										height: 30,
										display: 'inline',
										appearance: 'textfield'
									}}
									onChange={(val) => {
										if (+val.target.value < 50) setSlippage(val.target.value);
									}}
								/>{' '}
								{fromTokenPrice ? (
									<>
										Value: $
										{(+fromTokenPrice * +amount).toLocaleString(undefined, {
											maximumFractionDigits: 3
										})}
									</>
								) : null}
							</div>
							{balance &&
								<Balance onClick={onMaxClick}>
									{fromToken?.isNative
										? `Balance: ${(balance.value?.div(e10(18))).toString()} ${fromToken?.symbol}`
										: `Balance: ${(balance.value?.div(e10(fromToken?.decimals ?? 18))).toString()} ${fromToken?.symbol}`}
								</Balance>
							}
						</InputFooter>
					</div>
					<SwapWrapper>
						{route && account && (
							<Button
								variant={'filled'}
								color={getChainColorCode(chainId)}
								isLoading={swapMutation.isLoading || isApproveLoading}
								loadingText="Preparing transaction"
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
				</Body>

				{inputToken && outputToken && (
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
				)}
			</div>

			{/* <FAQs /> */}
			{/* <TransactionModal open={txModalOpen} setOpen={setTxModalOpen} link={txUrl} /> */}
		</Wrapper>
	);
}

export default Aggregator