import React, { useEffect, useState } from 'react';
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
import { CurrencyAmount, NATIVE, NATIVE_ADDRESS, Token, USDC, USDC_ADDRESS, WNATIVE, WNATIVE_ADDRESS } from 'sdk';
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
import { getChainInfo } from 'constants/chains';
import listedTokens from 'features/aggregator/tokenList.json'
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
	grid-row-gap: 16px;
	padding-bottom: 4px;

	min-width: 30rem;
	max-width: 46rem;

	box-shadow: ${({ theme }) =>
		theme.mode === 'dark'
			? '10px 0px 50px 10px rgba(26, 26, 26, 0.9);'
			: '10px 0px 50px 10px rgba(211, 211, 211, 0.9);;'};
	padding: 16px;
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

const oneInchChains = {
	ethereum: 1,
	bsc: 56,
	polygon: 137,
	optimism: 10,
	arbitrum: 42161,
	avax: 43114,
	gnosis: 100,
	fantom: 250,
	klaytn: 8217
};

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
	min-width: 360px;
	max-height: 444px;
	min-width: 26rem;
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
const BodyWrapper = styled.div`
	display: flex;
	gap: 16px;
	margin: 0 auto;
`;

const TokenSelect = styled.div`
	display: grid;
	grid-column-gap: 8px;
	margin-top: 16px;
	margin-bottom: 8px;
	grid-template-columns: 5fr 1fr 5fr;
`;

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
	const tokenList = getTokenList()
	const [selectedChain, setSelectedChain] = useState(startChain(chainId));
	const [fromToken, setFromToken] = useState(WNATIVE[chainId]);
	const [fromDecimals, setFromDecimals] = useState(18)
	const [fromAddress, setFromAddress] = useState(WNATIVE_ADDRESS[chainId])
	const [toAddress, setToAddress] = useState(USDC_ADDRESS[chainId])
	const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(fromToken)
	const [toToken, setToToken] = useState(USDC[chainId]);
	// const toast = useToast();

	const [slippage, setSlippage] = useState('1');

	// const addRecentTransaction = addTransaction();

	// const { switchNetworkAsync } = useSwitchNetwork();
	const networkSelector = CurrencyInputWithNetworkSelector

	const [amount, setAmount] = useState('10');
	const [txModalOpen, setTxModalOpen] = useState(false);
	const [txUrl, setTxUrl] = useState('');

	const amountWithDecimals = new BigNumber(amount)
		.times(10 ** (fromDecimals || 18))
		.toFixed(0);

	const balance =
	useTokenBalance(
		chainId,
		fromToken?.isNative ? NATIVE_ADDRESS : fromAddress,
		// addressOrName: address,
		// watch: true
	);

	const currentChainId = chainId;

	// const isValidSelectedChain = chains.find(
	// 	({ value }) => selectedChain.value === value && chainsMap[value] === currentChainId
	// );

    /**
     * Approves AutoStakeContract to move lpTokens
     */
	 const handleApprove = async () => {
        if (!account) {
            // alert('Connect Wallet')
        } else {
            try {
                const tx = await erc20Approve(route.adapters.addressToApprove)
                // await tx?.wait().then(await fetchApproval())
            } catch (e) {
                // alert(e.message)
                console.log(e)
                return
            }
        }
    }

	async function switchNetworkAsync(cid) {
		setSelectedChain(chains.find(({ value }) => chainsMap[value] === cid.id));
	}

	const chainName = (id) => {
		let name = getChainInfo(id, "NAME").toLowerCase()
		return name
	}

	// useEffect(() => {
	// 	if (!isValidSelectedChain)
	// 		setSelectedChain(chains.find(({ value }) => chainsMap[value] === currentChainId) ?? chains[0]);
	// }, [isValidSelectedChain, currentChainId]);

	// useEffect(() => {
	// 	const nativeToken = tokenList[chainsMap[chainName(chainId)]]?.[0] || {};
	// 	setFromToken({
	// 		...nativeToken,
	// 		value: nativeToken.address,
	// 		label: nativeToken.symbol
	// 	});
	// 	setFromDecimals(18)
	// 	// setFromAddress(NATIVE_ADDRESS[chainId])
	// }, [selectedChain, tokenList]);

	// TODO
	// const { data: gasPriceData } = useFeeData({
	// 	chainId: chainsMap[selectedChain.value]
	// });

	const tokensInChain = tokenList[chainsMap['fantom']]?.map((token) => ({
		...token,
		value: token.address,
		label: token.symbol
	}));

	const setTokens = (tokens) => {
		setFromToken(tokens.token0);
		setToToken(tokens.token1);
		setFromDecimals(fromToken.decimals)
		setFromAddress(fromToken?.address)
	};

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
			tokens: { toToken: Token; fromToken: Token };
		}) => swap(params),
		onSuccess: (data, variables) => {
			addTransaction({
				chainId: chainId,
				hash: data?.hash,
				from: account,
				summary: `Swap transaction using ${variables.adapter} is sent.`
			});
			const explorerUrl =  getExplorerLink(chainId, data, "transaction") // chain.blockExplorers.default.url;
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
			from: fromAddress,
			to: toAddress,
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
		from: fromAddress,
		to: toAddress,
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
		toToken: toToken?.address,
		fromToken: fromToken?.address
	});

	const { gasTokenPrice = 0, toTokenPrice = 0, fromTokenPrice = 0 } = tokenPrices || {};

	const cleanState = () => {
		setFromToken(null);
		setToToken(null);
		setRoute(null);
		setTxUrl('');
	};

	const tokenA = new Token(chainId, fromAddress, fromDecimals)

	const [approvalState, approve] = useTokenApprove(
		CurrencyAmount.fromRawAmount(tokenA, amountWithDecimals),
		// fromToken?.address, 
		route?.price?.tokenApprovalAddress, 
	);


	const isApproved = approvalState === ApprovalState.APPROVED
	const isApproveLoading = approvalState === ApprovalState.PENDING

	const onMaxClick = () => {
		if (balance) setAmount((balance.value).toString());
	};

	const onChainChange = (newChain) => {
		if (switchNetworkAsync === undefined) {
			cleanState();
			setSelectedChain(newChain);
		} else {
			switchNetworkAsync(chainsMap[newChain.value]).then((chain) => {
				cleanState();
				setSelectedChain(chains.find(({ value }) => chainsMap[value] === chainId));
			});
		}
	};

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
			<div>Aggregator</div>

			<Head>
				This product is still WIP and not ready for public release yet. Please expect things to break and if you find
				anything broken please let us know in the{' '}
				<a style={{ textDecoration: 'underline' }} href="http://discord.gg/SoulSwap">
					soulswap discord
				</a>
			</Head>

			<Container>
				<Body showRoutes={fromToken && toToken}>
					<div>
						<FormHeader>Chain</FormHeader>
						<MultiSelect options={chains} value={selectedChain} 
						onChange={onChainChange}
						 />
					</div>

					<SelectWrapper>
						<FormHeader>Select Tokens</FormHeader>
						<TokenSelect>
							<MultiSelect
								options={tokensInChain}
								value={fromToken}
								onChange={setFromToken}
								filterOption={createFilter({ ignoreAccents: false })}
							/>
							<div>
								<ArrowRight
									width={24}
									height={24}
									display="block"
									style={{
										marginTop: 8,
										marginLeft: 8,
										cursor: 'pointer'
									}}
									onClick={() => {
										setFromToken(toToken);
										setToToken(fromToken);
									}}
								/>
							</div>
							<MultiSelect
								options={tokensInChain}
								value={toToken}
								onChange={setToToken}
								filterOption={createFilter({ ignoreAccents: false })}
							/>
						</TokenSelect>
						<div style={{ textAlign: 'center', margin: ' 8px 16px' }}>
							<Head>OR</Head>
						</div>
						<Search tokens={tokensInChain} setTokens={setTokens} />
					</SelectWrapper>

					<div>
						<FormHeader>Amount In</FormHeader>
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
							{balance ? (
								<Balance onClick={onMaxClick}>
									Balance:{' '}
									{/* {(+balance?.data?.formatted).toLocaleString(undefined, { */}
										{/* maximumFractionDigits: 3 */}
									{/* })} */}
								</Balance>
							) : null}
						</InputFooter>
					</div>
					<SwapWrapper>
						{route && account ? (
							<Button
								isLoading={swapMutation.isLoading || isApproveLoading}
								loadingText="Preparing transaction"
								colorScheme={'messenger'}
								onClick={() => {
									if (approve) approve();

									// if (+amount > +balance?.data?.formatted) return;
									if (isApproved) handleSwap();
								}}
							>
								{isApproved ? 'Swap' : 'Approve'}
							</Button>
						) : null}
						{route && account && !isApproved && ['Matcha/0x', '1inch', 'CowSwap'].includes(route?.name) ? (
							<Button
								colorScheme={'messenger'}
								loadingText="Preparing Transaction"
								isLoading={isApproveLoading}
								onClick={() => {
									if (approve) handleApprove();
								}}
							>
								{'Approve Infinite'}
							</Button>
						) : null}
					</SwapWrapper>
				</Body>

				{fromToken && toToken && (
					<Routes>
						<FormHeader>
							Routes
							<CloseBtn onClick={cleanState} />{' '}
						</FormHeader>

						{isLoading ? <Loader loaded={!isLoading} /> : null}

						{normalizedRoutes.map((r, i) => (
							<Route
								{...r}
								index={i}
								selected={route?.name === r.name}
								setRoute={() => setRoute(r.route)}
								toToken={toToken}
								amountFrom={amountWithDecimals}
								fromToken={fromToken}
								selectedChain={selectedChain.label}
								key={i}
							/>
						))}
					</Routes>
				)}
			</Container>

			{/* <FAQs /> */}
			{/* <TransactionModal open={txModalOpen} setOpen={setTxModalOpen} link={txUrl} /> */}
		</Wrapper>
	);
}

export default Aggregator