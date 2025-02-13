import React from 'react'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import Table from 'components/Table'
import { formatNumber, formatNumberScale, formatPercent } from 'functions'
import { aprToApy } from 'functions/convert/apyApr'
import { useCurrency } from 'hooks/Tokens'
import { useActiveWeb3React } from 'services/web3'
import { ChainId } from 'sdk'

interface PairListProps {
  pairs: {
    pair: {
      token0: {
        id: string
        symbol: string
      }
      token1: {
        id: string
        symbol: string
      }
      id: string
    }
    liquidity: number
    volume1d: number
    volume1w: number
  }[]
  type: 'all' | 'gainers' | 'losers'
}

interface PairListNameProps {
  pair: {
    token0: {
      id: string
      symbol: string
    }
    token1: {
      id: string
      symbol: string
    }
  }
}

function PairListName({ pair }: PairListNameProps): JSX.Element {
  const token0 = useCurrency(pair?.token0?.id)
  const token1 = useCurrency(pair?.token1?.id)

  const token0Symbol = pair?.token0?.symbol.startsWith('axl') ? (pair.token0.symbol).slice(3,) : pair?.token0?.symbol
  const token1Symbol = pair?.token1?.symbol.startsWith('axl') 
    ? (pair.token1.symbol).slice(3,) 
      : pair.token1.symbol == 'FUCKMULTI' || pair.token1.symbol == 'lz-fMULTI' || pair.token1.symbol == 'lzFMULTI' ? 'FMULTI' 
        : pair?.token1?.symbol

  return (
    <>
      <div className="flex items-center">
        <DoubleCurrencyLogo
          currency0={token0}
          currency1={token1}
          size={40}
        />
        <div className="flex flex-col ml-3 whitespace-nowrap">
          <div className="font-bold text-high-emphesis">
            {token0Symbol}-{token1Symbol}
          </div>
        </div>
      </div>
    </>
  )
}

const getApy = (volume, liquidity) => {
  const apy = aprToApy((((volume / 7) * 365 * 0.0025) / liquidity) * 100, 3650)
  if (apy > 1000) return '>10,000%'
  return formatPercent(apy)
}

const allColumns = [
  {
    Header: 'Pair',
    accessor: 'pair',
    Cell: (pairs) => <PairListName pair={pairs.value} />,
    align: 'left',
  },
  {
    Header: 'TVL',
    accessor: 'liquidity',
    Cell: (pairs) => formatNumberScale(pairs.value, true),
    align: 'right',
  },
  {
    Header: 'APY',
    accessor: (row) => <div className="text-high-emphesis">{getApy(row?.volume1w, row?.liquidity)}</div>,
    align: 'right',
    sortType: (a, b) => a.original.volume1w / a.original.liquidity - b.original.volume1w / b.original.liquidity
  },
  {
    Header: 'Volume',
    accessor: (row) => (
      <div>
        <div className="font-medium text-high-emphesis">{formatNumber(row?.volume1d, true, false)}</div>
        <div className="font-normal text-primary">{formatNumber(row?.volume1w, true, false)}</div>
      </div>
    ),
    align: 'right',
  },
  {
    Header: 'Fees',
    accessor: (row) => (
      <div>
        <div className="font-medium text-high-emphesis">{formatNumber(row.volume1d * 0.003, true, false)}</div>
        <div className="font-normal text-primary">{formatNumber(row.volume1w * 0.003, true, false)}</div>
      </div>
    ),
    align: 'right',
  },
]

const someColumns = [
  {
    Header: 'Pair',
    accessor: 'pair',
    Cell: (pairs) => <PairListName pair={pairs.value} />,
    align: 'left',
  },
  {
    Header: 'TVL',
    accessor: 'liquidity',
    Cell: (pairs) => formatNumberScale(pairs.value, true),
    align: 'right',
  },
  {
    Header: 'Volume',
    accessor: 'volume',
    Cell: (pairs) => formatNumberScale(pairs?.value, true),
    align: 'right',
  },
]

const gainersColumns = [
  {
    Header: 'Pair',
    accessor: 'pair',
    Cell: (props) => <PairListName pair={props.value} />,
    disableSortBy: true,
    align: 'left',
  },
  {
    Header: 'Liquidity',
    id: 'liquidity',
    accessor: (row) => (
      <div className="inline-flex flex-col">
        {/* <div className="font-medium text-high-emphesis">
          <ColoredNumber number={row.liquidityChangeNumber1d} scaleNumber={false} />
        </div> */}
        <div>{formatNumber(row.liquidityChangeNumber1w, true, false)}</div>
      </div>
    ),
    align: 'right',
    sortType: (a, b) => a.original.liquidityChangeNumber1d - b.original.liquidityChangeNumber1d,
  },
  {
    Header: '% Change',
    accessor: (row) => (
      <div className="inline-flex">
        <div>
          <div className="font-medium text-high-emphesis">{formatPercent(row.liquidityChangePercent1d)}</div>
          <div>{formatPercent(row.liquidityChangePercent1w)}</div>
        </div>
      </div>
    ),
    align: 'right',
    sortType: (a, b) => a.original.liquidityChangePercent1d - b.original.liquidityChangePercent1d,
  },
  {
    Header: 'Volume',
    accessor: (row) => (
      <div className="inline-flex flex-col">
        {/* <div className="font-medium text-high-emphesis">
          <ColoredNumber number={row?.volumeChangeNumber1d} scaleNumber={false} />
        </div> */}
        <div>{formatNumber(row?.volumeChangeNumber1w, true, false)}</div>
      </div>
    ),
    align: 'right',
    sortType: (a, b) => a.original.volumeChangeNumber1d - b.original.volumeChangeNumber1d,
  },
  {
    Header: ' % Change',
    accessor: (row) => (
      <div className="inline-flex">
        <div>
          <div className="font-medium text-high-emphesis">{formatPercent(row.volumeChangePercent1d)}</div>
          <div>{formatPercent(row.volumeChangePercent1w)}</div>
        </div>
      </div>
    ),
    align: 'right',
    sortType: (a, b) => a.original.volumeChangePercent1d - b.original.volumeChangePercent1d,
  },
]

export default function PairList({ pairs, type }: PairListProps): JSX.Element {
  const { chainId } = useActiveWeb3React()

  const defaultSortBy = React.useMemo(() => {
    switch (type) {
      case 'all':
        return { id: 'liquidity', desc: true, chainId: chainId }
      case 'gainers':
        return { id: 'liquidity', desc: true }
      case 'losers':
        return { id: 'liquidity', desc: false }
    }
  }, [type])

  const columns = React.useMemo(() => {
    switch (type) {
      case 'all':
        return chainId == ChainId.AVALANCHE ? someColumns : allColumns
      case 'gainers':
        return gainersColumns
      case 'losers':
        return gainersColumns
    }
  }, [type])

  return (
    <>
      {pairs && (
        <Table
          columns={columns}
          data={pairs}
          defaultSortBy={defaultSortBy}
          // link={{ href: '/analytics/pairs/', id: 'pair.id' }}
        />
      )}
    </>
  )
}