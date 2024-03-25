import { ChainId } from 'sdk'

interface PriceInformation {
  token: string
  amount: string | null
}

// defaults
const API_NAME = 'Coingecko'
const API_BASE_URL = 'https://api.coingecko.com/api'
const API_VERSION = 'v3'
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
}

function _getApiBaseUrl(chainId: ChainId): string {
  const baseUrl = API_BASE_URL

  if (!baseUrl) {
    throw new Error(`Unsupported Network. The ${API_NAME} API is not deployed in the Network ${chainId}`)
  } else {
    return baseUrl + '/' + API_VERSION
  }
}

const COINGECKO_ASSET_PLATFORM: { [chainId in ChainId]: string | null } = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.TELOS]: 'telos',
  [ChainId.BSC]: 'binance',
  [ChainId.FANTOM]: 'fantom',
  [ChainId.AVALANCHE]: 'avalanche',
  [ChainId.MATIC]: 'polygon',
  [ChainId.ARBITRUM]: 'arbitrum',
  [ChainId.BLAST]: 'blast', // todo: verify
  [ChainId.MOONRIVER]: 'moonriver',
  [ChainId.BASE]: 'base',
}

const COINGECKO_NATIVE_CURRENCY: Record<number, string> = {
    [ChainId.ETHEREUM]: 'ethereum',
    [ChainId.TELOS]: 'telos',
    [ChainId.BSC]: 'binance',
    [ChainId.FANTOM]: 'fantom',
    [ChainId.AVALANCHE]: 'avalanche',
    [ChainId.MATIC]: 'polygon',
    [ChainId.ARBITRUM]: 'arbitrum',
    [ChainId.BLAST]: 'ethereum', 
    [ChainId.MOONRIVER]: 'moonriver',
}

function _fetch(chainId: ChainId, url: string, method: 'GET' | 'POST' | 'DELETE', data?: any): Promise<Response> {
  const baseUrl = _getApiBaseUrl(chainId)
  return fetch(baseUrl + url, {
    headers: DEFAULT_HEADERS,
    method,
    body: data !== undefined ? JSON.stringify(data) : data,
  })
}

function _get(chainId: ChainId, url: string): Promise<Response> {
  return _fetch(chainId, url, 'GET')
}

export interface CoinGeckoUsdPriceTokenParams {
  chainId: ChainId
  tokenAddress?: string
}

export interface CoinGeckoUsdPriceCurrencyParams {
  chainId: ChainId
}

interface CoinGeckoUsdQuote {
  [address: string]: {
    usd: number
  }
}

export async function getUSDPriceTokenQuote(params: CoinGeckoUsdPriceTokenParams): Promise<CoinGeckoUsdQuote | null> {
  const { chainId, tokenAddress } = params

  const assetPlatform = COINGECKO_ASSET_PLATFORM[chainId ?? ChainId.FANTOM]
  if (!assetPlatform) {
    // unsupported asset network
    return null
  }

  const response = await _get(
    chainId,
    `/simple/token_price/${assetPlatform}?contract_addresses=${tokenAddress}&vs_currencies=usd`
  ).catch(error => {
    console.error(`Error getting ${API_NAME} USD price quote:`, error)
    throw new Error(error)
  })

  return response.json()
}

export async function getUSDPriceCurrencyQuote(
  params: CoinGeckoUsdPriceCurrencyParams
): Promise<CoinGeckoUsdQuote | null> {
  const { chainId } = params

  const nativeCurrency = COINGECKO_NATIVE_CURRENCY[chainId ?? ChainId.FANTOM]
  if (!nativeCurrency) {
    // unsupported currency network
    return null
  }

  const response = await _get(chainId, `/simple/price?ids=${nativeCurrency}&vs_currencies=usd`).catch(error => {
    console.error(`Error getting ${API_NAME} USD price quote:`, error)
    throw new Error(error)
  })

  return response.json()
}

export function toPriceInformation(priceRaw: CoinGeckoUsdQuote | null): PriceInformation | null {
  // returns: first key/value pair in the return object.
  const token = priceRaw ? Object.keys(priceRaw)[0] : null

  if (!token || !priceRaw?.[token].usd) {
    return null
  }

  const { usd } = priceRaw[token]
  return { amount: usd.toString(), token }
}