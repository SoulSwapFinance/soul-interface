import React from 'react';
import styled from 'styled-components';
import Tooltip from 'components/Tooltip';
import { useTokenApprove } from 'hooks/useTokenApprove';
import { GasIcon } from 'components/Icons/GasIcon';
// import { Head } from 'next/document';
import Image from 'next/image';
import Badge from 'components/Badge';
import { Currency, CurrencyAmount, NATIVE, NATIVE_ADDRESS, Token } from 'sdk';
import { useActiveWeb3React } from 'services/web3';
import { useTokenInfo } from 'hooks/useAPI';
import Logo from 'components/Logo';
import { CurrencyLogo } from 'components/CurrencyLogo';

// interface IToken {
// 	address: string
// 	logoURI: string
// 	symbol: string
// 	decimals: string
// }

interface IPrice {
	amountReturned: string
	estimatedGas: string
	tokenApprovalAddress: string
	logo: string
}

interface IRoute {
	name: string
	price: IPrice
	toToken: Currency
	fromToken: Currency
	selectedChain: string
	setRoute: () => void
	selected: boolean
	index: number
	gasUsd: number
	amountUsd: string
	airdrop: boolean
	amountFrom: string
}

const Route = ({
	name,
	price,
	toToken,
	setRoute,
	selected,
	index,
	gasUsd,
	amountUsd,
	airdrop,
	fromToken,
	amountFrom
}: IRoute) => {
	const { chainId } = useActiveWeb3React()
	const tokenA = new Token(chainId, fromToken.wrapped.address, Number(fromToken.wrapped.decimals))
	const isApproved = useTokenApprove(
		CurrencyAmount.fromRawAmount(tokenA, amountFrom),
		price?.tokenApprovalAddress as `0x${string}`,
	);

	if (!price.amountReturned) return null;

	const amount = +price.amountReturned / 10 ** +toToken?.wrapped.decimals;
	const tokenURI = (tokenAddress) => {
		let URI = useTokenInfo(tokenAddress).tokenInfo.image
		return URI
	}

	return (
		<RouteWrapper onClick={setRoute} selected={selected} best={index === 0}>
			<RouteRow>
				{/* <div className="grid grid-cols-3 bg-dark-1000 p-1 rounded rounded-xl"> */}
				<CurrencyLogo
					currency={toToken}
					size={'36px'}
					// src= {tokenURI(toToken.wrapped.address)}
					// height={'42px'}
					// width={'42px'}
					// alt=""
					// style={{ marginRight: 0, marginTop: 1, marginBottom: 1 }}
				/>
				{/* </div> */}
				<div className="ml-4 justify-center text-black mt-2 text-md font-bold">
					{amount.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}{` ${toToken.symbol} `}
				{/* </div> */}
				{/* <div> */}
					{Number.isFinite(+amountUsd)
						&& `($${Number(amountUsd).toLocaleString(undefined, {
							minimumFractionDigits: 3,
							maximumFractionDigits: 3
						})})`
					}
				</div>
				<div style={{ marginLeft: 'auto', display: 'flex', color: 'black' }}>
					<div className="flex flex-cols-2 gap-2">
						${gasUsd.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
					<GasIcon className={'w-[1rem]'} />{' '}
					</div>
				</div>
			</RouteRow>

			<RouteRow className={'italic text-md'} style={{color: 'black'}}>
				{/* {toToken?.symbol}  */}
				via {name}
				{/* {airdrop && (
					<Tooltip
						text={`May airdrop someday.`}
					>
						<span style={{ marginLeft: 4 }}>🪂</span>
					</Tooltip>
				)} */}
				{/* {isApproved && (
					<Tooltip
						text="Aggregator Approved."
					>
						<span style={{ marginLeft: 4 }}>🔓</span>
					</Tooltip>
				)} */}
				{index === 0 ? (
					<div style={{ marginLeft: 'auto', display: 'flex' }}>
						{' '}
						<Badge color="green" value={'Best'}
						// colorScheme="green"
						/>
						{/* Best Route */}
						{/* </Badge> */}
					</div>
				) : null}
			</RouteRow>
		</RouteWrapper>
	)
}

const RouteWrapper = styled.div<{ selected: boolean; best: boolean }>`
	display: grid;
	grid-row-gap: 8px;
	margin-top: 16px;

	background-color: ${({ theme, selected }) =>
		theme.mode === 'dark' ? (selected ? ' #161616;' : '#2d3039;') : selected ? ' #bec1c7;' : ' #dde3f3;'};
	border: ${({ theme }) => (theme.mode === 'dark' ? '1px solid #373944;' : '1px solid #c6cae0;')};
	padding: 8px;
	border-radius: 8px;
	cursor: pointer;

	animation: swing-in-left-fwd 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
	@keyframes swing-in-left-fwd {
		0% {
			transform: rotateX(100deg);
			transform-origin: left;
			opacity: 0;
		}
		100% {
			transform: rotateX(0);
			transform-origin: left;
			opacity: 1;
		}
	}

	&:hover {
		background-color: ${({ theme }) => (theme.mode === 'dark' ? '#161616;' : '#b7b7b7;;')};
	}
`;

const RouteRow = styled.div`
	display: flex;

	img {
		width: 24px;
		height: 24px;
		aspect-ratio: 1;
		border-radius: 50%;
		margin-right: 0;
	}
`;

export default Route;