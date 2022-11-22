import { useQueries, UseQueryOptions } from '@tanstack/react-query';
import { adapters } from 'features/aggregator/router';

interface IGetListRoutesProps {
	chain: string;
	from?: string;
	to?: string;
	amount?: string;
	extra?: any;
}

interface IRoute {
	price: { amountReturned: any; estimatedGas: any; tokenApprovalAddress: any; logo: string } | null;
	name: string;
	airdrop: boolean;
	fromAmount: string;
}

interface IGetAdapterRouteProps extends IGetListRoutesProps {
	adapter: any;
}

async function getAdapterRoutes({ adapter, chain, from, to, amount, extra = {} }: IGetAdapterRouteProps) {
	if (!chain || !from || !to || !amount) {
		return { price: null, name: adapter.name, airdrop: !adapter.token, fromAmount: amount };
	}

	try {
		const price = await adapter.getQuote(chain, from, to, amount, {
			...extra
		});

		const res: IRoute = {
			price,
			name: adapter.name,
			airdrop: !adapter.token,
			fromAmount: amount
		};

		return res;
	} catch (e) {
		console.error(e);
		return {
			price: null,
			name: adapter.name,
			airdrop: !adapter.token,
			fromAmount: amount
		};
	}
}

export default function useGetRoutes({ chain, from, to, amount, extra = {} }: IGetListRoutesProps) {
	const res = useQueries({
		queries: adapters
        // @ts-ignore TODO
        .filter((adap) => adap.chainToId[chain] !== undefined)
        .map<UseQueryOptions<IRoute>>((adapter) => {
            return {
                    // @ts-ignore TODO
					queryKey: ['routes', adapter.name, chain, from, to, amount, JSON.stringify(extra)],
					queryFn: () => getAdapterRoutes({ adapter, chain, from, to, amount, extra }),
					refetchInterval: 20_000
				};
			})
	});

	return {
		isLoading: res.filter((r) => r.status === 'success').length >= 1 ? false : true,
		data: res?.filter((r) => r.status === 'success' && !!r.data && r.data.price).map((r) => r.data) ?? []
	};
}