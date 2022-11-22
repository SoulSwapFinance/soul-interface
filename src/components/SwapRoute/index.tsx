import React from 'react';
import styled from 'styled-components';
import Tooltip from 'components/Tooltip';
import { useTokenApprove } from 'hooks/useTokenApprove';
import { GasIcon } from 'components/Icons/GasIcon';
// import { Head } from 'next/document';
import Image from 'next/image';
import Badge from 'components/Badge';
import { CurrencyAmount, Token } from 'sdk';
import { useActiveWeb3React } from 'services/web3';

interface IToken {
	address: string;
	logoURI: string;
	symbol: string;
	decimals: string;
}

interface IPrice {
	amountReturned: string;
	estimatedGas: string;
	tokenApprovalAddress: string;
	logo: string;
}

interface IRoute {
	name: string;
	price: IPrice;
	toToken: IToken;
	fromToken: IToken;
	selectedChain: string;
	setRoute: () => void;
	selected: boolean;
	index: number;
	gasUsd: number;
	amountUsd: string;
	airdrop: boolean;
	amountFrom: string;
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
	const tokenA = new Token(chainId, fromToken.address, Number(fromToken.decimals))
	const isApproved = useTokenApprove(
		CurrencyAmount.fromRawAmount(tokenA, amountFrom),
		price?.tokenApprovalAddress as `0x${string}`, 
	);

	if (!price.amountReturned) return null;

	const amount = +price.amountReturned / 10 ** +toToken?.decimals;

	return (
		<RouteWrapper onClick={setRoute} selected={selected} best={index === 0}>
			<RouteRow>
				<Image src={toToken?.logoURI} alt="" style={{ marginRight: 4 }} />
				<div>
					{amount.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}{' '}
					{Number.isFinite(+amountUsd)
						? `($${Number(amountUsd).toLocaleString(undefined, {
								minimumFractionDigits: 3,
								maximumFractionDigits: 3
						  })})`
						: null}
				</div>
				<div style={{ marginLeft: 'auto', display: 'flex' }}>
					{name === 'CowSwap' ? (
						<Tooltip text="Gas is taken from output amount">
							<GasIcon />{' '}
							<div style={{ marginLeft: 8 }}>
								${gasUsd.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
							</div>
						</Tooltip>
					) : (
						<>
							<GasIcon />{' '}
							<div style={{ marginLeft: 8 }}>
								${gasUsd.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
							</div>
						</>
					)}
				</div>
			</RouteRow>

			<RouteRow>
				{toToken.symbol} via {name}
				{airdrop ? (
					<Tooltip 
                    text="This project has no token and might airdrop one in the future"
                    >
						<span style={{ marginLeft: 4 }}>🪂</span>
					</Tooltip>
				) : null}
				{isApproved ? (
					<Tooltip 
                        text="Token is approved for this aggregator."
                    >
						<span style={{ marginLeft: 4 }}>🔓</span>
					</Tooltip>
				) : null}
				{index === 0 ? (
					<div style={{ marginLeft: 'auto', display: 'flex' }}>
						{' '}
						<Badge color="gray" value={'Best'}	
						// colorScheme="green"
						/>
							{/* Best Route */}
						{/* </Badge> */}
					</div>
				) : null}
			</RouteRow>
		</RouteWrapper>
	);
};

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