import { paths } from 'nfnt-client-sdk/dist/types/api'
import setParams from '../params'
import { Dispatch } from 'react'

const PROXY_API_BASE = '/api/reservoir'

export async function getDetails(
  contract: string | undefined,
  token: string | undefined,
  setDetails: Dispatch<any>
) {
  let pathname = `${PROXY_API_BASE}/tokens/details/v4`

  let query: paths['/tokens/details/v4']['get']['parameters']['query'] = {
    tokens: [`${contract}:${token}`],
  }

  const href = setParams(pathname, query)

  const res = await fetch(href)

  const json =
    (await res.json()) as paths['/tokens/details/v4']['get']['responses']['200']['schema']

  setDetails(json)
}

export async function getCollection(
  collectionId: string | undefined,
  setCollection: Dispatch<any>
) {
  const pathname = `${PROXY_API_BASE}/collection/v2`

  let query: paths['/collection/v2']['get']['parameters']['query'] = {
    id: collectionId,
  }

  const href = setParams(pathname, query)

  const res = await fetch(href)

  const json =
    (await res.json()) as paths['/collection/v2']['get']['responses']['200']['schema']

  setCollection(json)
}
