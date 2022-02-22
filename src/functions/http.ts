export const makeHttpRequest = async function (
  url: string,
  options: {
    [x: string]: string
  } = {
    cache: 'no-cache',
  }
) {
  try {
    const response = await fetch(url, options)
    if (response.ok) {
      return await response.json()
    } else {
      throw new Error(response.statusText)
    }
  } catch (err) {
    console.error(`Error fetching ${url}: `, err)
    return null
  }
}
