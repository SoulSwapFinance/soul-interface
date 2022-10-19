import { ChainId } from "sdk";

export const EXPLORER_TRANSACTION_URL = {
	[ChainId.ETHEREUM]: "https://etherscan.io/tx/",
	[ChainId.AVALANCHE]: "https://snowtrace.io/tx/",
	[ChainId.FANTOM]: "https://ftmscan.com/tx/",
};

export const EXPLORER_URL = {
	[ChainId.ETHEREUM]: "https://etherscan.io/",
    [ChainId.AVALANCHE]: "https://snowtrace.io/",
	[ChainId.FANTOM]: "https://ftmscan.com/",
};
