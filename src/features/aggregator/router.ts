import * as matcha from './adapters/0x'
import * as inch from './adapters/1inch'
import * as kyberswap from './adapters/kyberswap'
import * as openocean from './adapters/openocean'
import * as paraswap from './adapters/paraswap'
import * as firebird from './adapters/firebird'
import * as lifi from './adapters/lifi'
import * as rango from './adapters/rango'

import { capitalizeFirstLetter } from './utils'
import { allChains } from './chains'
import { chainNamesReplaced, chainsMap } from './constants'

export const adapters = [matcha, openocean, inch, kyberswap, paraswap, firebird, lifi, rango]

// const adaptersMap = adapters.reduce((acc, adapter) => ({ ...acc, [adapter.name]: adapter }), {}) as Record<
// 	string,
// 	typeof inch
// >

export const inifiniteApprovalAllowed = [matcha.name, inch.name, kyberswap.name, paraswap.name] // cowswap.name

const adaptersMap = adapters.reduce((acc, adapter) => ({ ...acc, [adapter.name]: adapter }), {})


export const adaptersWithApiKeys = {
	[matcha.name]: true,
	[rango.name]: true
	// [hashflow.name]: true
}

export function getAllChains() {
	const chains = new Set<string>()
	for (const adapter of adapters) {
		Object.keys(adapter.chainToId).forEach((chain) => chains.add(chain))
	}
	const chainsArr = Array.from(chains)

	const chainsOptions = chainsArr.map((c) => ({
		value: c,
		label: chainNamesReplaced[c] ?? capitalizeFirstLetter(c),
		chainId: chainsMap[c],
		logoURI: allChains.find(({ id }) => id === chainsMap[c])?.iconUrl
	}))

	return chainsOptions
}

export async function swap({ chain, from, to, amount, signer, slippage = '1', adapter, rawQuote, tokens }) {
	const aggregator = adaptersMap[adapter]

	try {
		const res = await aggregator.swap({
			chain,
			from,
			to,
			amount,
			signer,
			slippage,
			rawQuote,
			tokens
		})
		return res
	} catch (e) {
		throw e
	}
}