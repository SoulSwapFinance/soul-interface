import { UI_DECIMALS_DISPLAYED_DEFAULT_PRECISION } from "constants/index";
import { ChainId } from "sdk";
import { useActiveWeb3React } from "services/web3";

export const getWethTokenFromTokensMetaDataByNetworkId = (tokensMetaData) => {
	const tokenMetaData = tokensMetaData.find((t) => t.symbol === "weth");
	if (!tokenMetaData) {
		throw new Error("WETH Token MetaData not found");
	}
	const { chainId } = useActiveWeb3React()
	return {
		address: tokenMetaData.addresses[chainId],
		symbol: tokenMetaData.symbol,
		decimals: tokenMetaData.decimals,
		name: tokenMetaData.name,
		primaryColor: tokenMetaData.primaryColor,
		icon: tokenMetaData.icon,
		displayDecimals:
			tokenMetaData.displayDecimals !== undefined
				? Number(tokenMetaData.displayDecimals)
				: UI_DECIMALS_DISPLAYED_DEFAULT_PRECISION,
		id: tokenMetaData.id || undefined,
		c_id: tokenMetaData.c_id || undefined,
		minAmount: tokenMetaData.minAmount || 0,
		maxAmount: tokenMetaData.maxAmount || undefined,
		precision:
			tokenMetaData.precision !== undefined ? tokenMetaData.precision : UI_DECIMALS_DISPLAYED_DEFAULT_PRECISION,
		website: tokenMetaData.website || undefined,
		description: tokenMetaData.description || undefined,
		verisafe_sticker: undefined,
		listed: true,
		isStableCoin: tokenMetaData.isStableCoin ? true : false,
	};
};

export const mapTokensMetaDataToTokenByNetworkId = (tokensMetaData) => {
	const { chainId } = useActiveWeb3React()

	return tokensMetaData
		.filter((tokenMetaData) => tokenMetaData.addresses[chainId])
		.map((tokenMetaData) => {
			let address = tokenMetaData.addresses[chainId];
			if (chainId === ChainId.ETHEREUM) {
				if (tokenMetaData.mainnetAddress) {
					address = tokenMetaData.mainnetAddress;
				}
			}
			return {
				address,
				symbol: tokenMetaData.symbol,
				decimals: tokenMetaData.decimals,
				name: tokenMetaData.name,
				primaryColor: tokenMetaData.primaryColor,
				icon: tokenMetaData.icon,
				displayDecimals:
					tokenMetaData.displayDecimals !== undefined
						? Number(tokenMetaData.displayDecimals)
						: UI_DECIMALS_DISPLAYED_DEFAULT_PRECISION,
				id: tokenMetaData.id || undefined,
				c_id: tokenMetaData.c_id || undefined,
				minAmount: tokenMetaData.minAmount || 0,
				maxAmount: tokenMetaData.maxAmount || undefined,
				precision:
					tokenMetaData.precision !== undefined
						? tokenMetaData.precision
						: UI_DECIMALS_DISPLAYED_DEFAULT_PRECISION,
				website: tokenMetaData.website || undefined,
				description: tokenMetaData.description || undefined,
				verisafe_sticker: tokenMetaData.verisafe_sticker || undefined,
				listed: true,
				isStableCoin: tokenMetaData.isStableCoin ? true : false,
			};
		});
};

export const mapTokensMetaDataFromForm = (tokensMetaData) => {
	return tokensMetaData
		.filter((tokenMetaData) => tokenMetaData.mainnetAddress)
		.map((tokenMetaData) => {
			return {
				address: tokenMetaData.mainnetAddress || "",
				symbol: tokenMetaData.symbol,
				decimals: Number(tokenMetaData.decimals),
				name: tokenMetaData.name,
				primaryColor: tokenMetaData.primaryColor,
				icon: tokenMetaData.icon,
				displayDecimals:
					tokenMetaData.displayDecimals !== undefined
						? Number(tokenMetaData.displayDecimals)
						: UI_DECIMALS_DISPLAYED_DEFAULT_PRECISION,
				id: tokenMetaData.id || undefined,
				c_id: tokenMetaData.c_id || undefined,
				minAmount: Number(tokenMetaData.minAmount) || 0,
				maxAmount: Number(tokenMetaData.maxAmount) || undefined,
				precision:
					tokenMetaData.precision !== undefined
						? Number(tokenMetaData.precision)
						: UI_DECIMALS_DISPLAYED_DEFAULT_PRECISION,
				website: tokenMetaData.website || undefined,
				description: tokenMetaData.description || undefined,
				verisafe_sticker: tokenMetaData.verisafe_sticker || undefined,
				listed: true,
				isStableCoin: tokenMetaData.isStableCoin ? true : false,
			};
		});
};
