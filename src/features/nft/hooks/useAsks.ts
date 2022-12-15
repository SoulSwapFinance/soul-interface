import { paths } from 'nfnt-client-sdk/dist/types/api'
import fetcher from 'features/nft/lib/fetcher'
import setParams from 'features/nft/lib/params'
import useSWR from 'swr'

const PROXY_API_BASE = '/api/reservoir'

type Asks = paths['/orders/asks/v2']['get']['responses']['200']['schema']

export default function useAsks(
  fallbackData: Asks | undefined,
  tokenKind: string | undefined,
  token: string | undefined
) {
  function getUrl() {
    if (!token) return undefined

    if (tokenKind !== 'erc1155') return undefined

    const pathname = `${PROXY_API_BASE}/orders/asks/v2`

    let query: paths['/orders/asks/v2']['get']['parameters']['query'] = {
      token,
      sortBy: 'price',
    }

    const href = setParams(pathname, query)

    return href
  }

  const href = getUrl()

  const asks = useSWR<Asks>(href, fetcher, {
    fallbackData,
  })

  return asks
}
