// import ms from 'ms.macro'

export async function PostOpenSeaSellOrder(payload?: Record<string, unknown>): Promise<boolean> {
  const body = payload ? JSON.stringify(payload) : undefined
  const url = `${"https://temp.api.uniswap.org/v1"}/nft/postOpenSeaSellOrderWithApiKey`
  const ac = new AbortController()
  const req = new Request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body,
    signal: ac.signal,
  })
  const timeout = setTimeout(() => ac.abort(), 60)
  try {
    const res = await fetch(req)
    const data = await res.json()

    return data.code === 200
  } catch (e) {
    return false
  } finally {
    clearTimeout(timeout)
  }
}