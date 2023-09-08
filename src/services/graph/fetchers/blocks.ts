import { addSeconds, getUnixTime, startOfHour, startOfMinute, startOfSecond, subDays, subHours } from 'date-fns'

import { ChainId } from '../../../sdk'
import { GRAPH_HOST } from '../constants'
import { blockQuery, blocksQuery, massBlocksQuery } from '../queries'
import { request } from 'graphql-request'

export const BLOCKS = {
  [ChainId.ETHEREUM]: 'blocklytics/ethereum-blocks',
  [ChainId.FANTOM]: 'matthewlilley/fantom-blocks',
  // [ChainId.XDAI]: 'matthewlilley/xdai-blocks',
  [ChainId.MATIC]: 'matthewlilley/polygon-blocks',
  // [ChainId.HARMONY]: 'sushiswap/harmony-blocks',
  [ChainId.AVALANCHE]: 'matthewlilley/avalanche-blocks',
  // [ChainId.CELO]: 'sushiswap/celo-blocks',
}


// @ts-ignore TYPE NEEDS FIXING
const fetcher = async (chainId = ChainId.FANTOM, query, variables = undefined) => {
  // @ts-ignore TYPE NEEDS FIXING
  return request(`${GRAPH_HOST[chainId ?? ChainId.FANTOM]}/subgraphs/name/${BLOCKS[chainId ?? ChainId.FANTOM]}`, query, variables)
}

// @ts-ignore TYPE NEEDS FIXING
export const getBlock = async (chainId = ChainId.FANTOM, variables) => {
  const { blocks } = await fetcher(chainId, blockQuery, variables)

  return { number: Number(blocks?.[0]?.number) }
}

// @ts-ignore TYPE NEEDS FIXING
export const getBlocks = async (chainId = ChainId.FANTOM, variables) => {
  const { blocks } = await fetcher(chainId, blocksQuery, variables)
  return blocks
}

// @ts-ignore TYPE NEEDS FIXING
export const getBlockDaysAgo = async (chainId = ChainId.ETHEREUM, days) => {
  const date = startOfSecond(startOfMinute(startOfHour(subDays(Date.now(), days))))
  const start = getUnixTime(date)
  const end = getUnixTime(addSeconds(date, 600))

  const { blocks } = await fetcher(chainId, blockQuery, {
    where: {
      timestamp_gt: start,
      timestamp_lt: end,
    },
  } as any)

  return { number: Number(blocks?.[0]?.number) }
}


// @ts-ignore TYPE NEEDS FIXING
export const getMassBlocks = async (chainId = ChainId.FANTOM, timestamps) => {
  const data = await fetcher(chainId, massBlocksQuery(timestamps))
  return Object.values(data).map((entry) => ({
    // @ts-ignore TYPE NEEDS FIXING
    number: Number(entry[0].number),
    // @ts-ignore TYPE NEEDS FIXING
    timestamp: Number(entry[0].timestamp),
  }))
}

// Grabs the last 1000 (a sample statistical) blocks and averages
// the time difference between them
export const getAverageBlockTime = async (chainId = ChainId.FANTOM) => {
  // console.log('getAverageBlockTime')
  const now = startOfHour(Date.now())
  const blocks = await getBlocks(chainId, {
    where: {
      timestamp_gt: getUnixTime(subHours(now, 6)),
      timestamp_lt: getUnixTime(now),
    },
  })

  const averageBlockTime = blocks?.reduce(
    // @ts-ignore TYPE NEEDS FIXING
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