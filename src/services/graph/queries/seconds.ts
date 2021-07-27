// todo update all

import gql from 'graphql-tag'

const secondFieldsQuery = gql`
  fragment blockFields on Block {
    id
    number
    timestamp
  }
`

export const secondQuery = gql`
  query blockQuery($start: Int!, $end: Int!) {
    blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: { timestamp_gt: $start, timestamp_lt: $end }) {
      ...blockFields
    }
  }
  ${secondFieldsQuery}
`

export const secondsQuery = gql`
  query blocksQuery($first: Int! = 1000, $skip: Int! = 0, $start: Int!, $end: Int!) {
    blocks(
      first: $first
      skip: $skip
      orderBy: number
      orderDirection: desc
      where: { timestamp_gt: $start, timestamp_lt: $end }
    ) {
      ...blockFields
    }
  }
  ${secondFieldsQuery}
`
