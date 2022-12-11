import { TimePeriod, TrendingCollection } from '../../types'

const NFT_API_URL = "https://temp.api.uniswap.org/v1"

export const fetchTrendingCollections = async (payload: {
  volumeType: 'eth' | 'nft'
  timePeriod: TimePeriod
  size: number
}): Promise<TrendingCollection[]> => {
  if (!NFT_API_URL) return Promise.resolve([])
  const url = `${NFT_API_URL}/nft/collections/trending`
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await r.json()

  return data ?? []
}