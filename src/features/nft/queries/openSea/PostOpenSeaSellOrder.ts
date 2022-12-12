// import ms from 'ms.macro'

let SIXTY_SECONDS = 60 * 100 // ms`60 seconds`
let ONE_HUNDRED_EIGHTY_DAYS = 180 * 86_400 * 100 // ms`180 days`
let ONE_HOUR = 60 * 60 * 100 // ms`1 hour`

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
  const timeout = setTimeout(() => ac.abort(), SIXTY_SECONDS)
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