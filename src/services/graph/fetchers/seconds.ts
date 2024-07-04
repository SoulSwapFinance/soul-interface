import { getUnixTime, startOfHour, subDays, subHours } from 'date-fns'

import { ChainId } from '../../../sdk'
import { GRAPH_HOST } from '../constants'
import { secondsQuery } from '../queries'
import { request } from 'graphql-request'

export const SECONDS = {
  [ChainId.ETHEREUM]: 'blocklytics/ethereum-blocks',
  [ChainId.FANTOM]: 'matthewlilley/fantom-blocks',
  [ChainId.MATIC]: 'matthewlilley/polygon-blocks',
  [ChainId.AVALANCHE]: 'matthewlilley/avalanche-blocks',
  // [ChainId.XDAI]: 'matthewlilley/xdai-blocks',
  // [ChainId.HARMONY]: 'sushiswap/harmony-blocks',
  // [ChainId.CELO]: 'sushiswap/celo-blocks',
}
export const timeFetcher = async (chainId = ChainId.FANTOM, query, variables) =>
  request(`${GRAPH_HOST[chainId ?? ChainId.FANTOM]}/subgraphs/name/${SECONDS[chainId ?? ChainId.FANTOM]}`, query, variables)
  // request(`${GRAPH_HOST[chainId ?? ChainId.FANTOM]}/query/3838/${SECONDS[chainId ?? ChainId.FANTOM]}/version/latest`, query, variables)

export const getSeconds = async (chainId = ChainId.FANTOM, start, end) => {
  const { seconds } = await timeFetcher(chainId, secondsQuery, {
    start,
    end,
  })
  return seconds
}

export const getOneDay = async (chainId = ChainId.FANTOM) => {
  const date = startOfHour(subDays(Date.now(), 1))
  const start = Math.floor(Number(date) / 1000)
  const end = Math.floor(Number(date) / 1000) + 600
  const { seconds } = await timeFetcher(chainId, secondsQuery, { start, end })
  return seconds?.[0]?.number
}

export const getOneWeek = async (chainId = ChainId.FANTOM) => {
  const date = startOfHour(subDays(Date.now(), 7))
  const start = Math.floor(Number(date) / 1000)
  const end = Math.floor(Number(date) / 1000) + 600
  const { seconds } = await timeFetcher(chainId, secondsQuery, { start, end })
  return seconds?.[0]?.number
}

export const getCustomDay = async (chainId = ChainId.FANTOM, days: number) => {
  const date = startOfHour(subDays(Date.now(), days))
  const start = Math.floor(Number(date) / 1000)
  const end = Math.floor(Number(date) / 1000) + 600
  const { seconds } = await request(`https://api.thegraph.com/subgraphs/name/${SECONDS[chainId ?? ChainId.FANTOM]}`, secondsQuery, {
  // const { seconds } = await request(`https://api.studio.thegraph.com/query/3838/${SECONDS[chainId ?? ChainId.FANTOM]}/version/latest`, secondsQuery, {
    start,
    end,
  })
  return seconds?.[0]?.number
}

// Grabs the last 1000 (a sample statistical) blocks and averages
// the time difference between them
export const getAverageBlock = async (chainId = ChainId.FANTOM) => {
  // console.log('getAverageBlockTime')
  const now = startOfHour(Date.now())
  const start = getUnixTime(subHours(now, 6))
  const end = getUnixTime(now)
  const blocks = await getSeconds(chainId, start, end)
  const averageBlockTime = blocks?.reduce(
    (previousValue, currentValue, currentIndex) => {
      if (previousValue.timestamp) {
        const difference = previousValue.timestamp - currentValue.timestamp

        previousValue.averageBlockTime = previousValue.averageBlockTime + difference
      }

      previousValue.timestamp = currentValue.timestamp

      if (currentIndex === blocks.length - 1) {
        return previousValue.averageBlockTime / blocks.length
      }

      return previousValue
    },
    { timestamp: null, averageBlockTime: 0 }
  )

  return averageBlockTime
}
