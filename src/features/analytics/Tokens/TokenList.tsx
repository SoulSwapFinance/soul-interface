import { CurrencyLogo } from 'components/CurrencyLogo'
// import LineGraph from 'components/LineGraph'
import Table, { Column } from 'components/Table'
import { formatNumber, formatPercent } from 'functions'
import { useCurrency } from 'hooks/Tokens'
import React from 'react'
// import { useActiveWeb3React } from 'services/web3'
import LineGraph from 'components/LineGraph'

import ColoredNumber from '../ColoredNumber'
import { useActiveWeb3React } from 'services/web3'
import { ChainId, LZ_USDC_ADDRESS, MULTI_AVAX_ADDRESS, MULTI_BNB_ADDRESS, MULTI_DAI_ADDRESS, MULTI_USDC_ADDRESS, MULTI_WBTC_ADDRESS, MULTI_WETH_ADDRESS } from 'sdk'

type TokenListColumnType = 'name' | 'price' | 'liquidity' | 'volumeChange' | 'lastWeekGraph' // priceChange
type SomeTokenListColumnType = 'name' | 'price' | 'liquidity' | 'lastWeekGraph'

interface Token {
  token: {
    id: string
    symbol: string
  }
  liquidity: number
  volume1d: number
  volume1w: number
  price: number
  change1d: number
  change1w: number
}

interface TokenListProps {
  tokens: Token[]
  enabledColumns?: TokenListColumnType[]
  someEnabledColumns?: TokenListColumnType[]
}

interface TokenListNameProps {
  token: {
    id: string
    symbol: string
  }
}

function TokenListName({ token }: TokenListNameProps): JSX.Element {
  const { chainId } = useActiveWeb3React()
  const currency = useCurrency(token.id)
  let tokenSymbol = token?.symbol.startsWith('axl') 
    ? (token?.symbol).slice(3,) 
      : token?.symbol == 'FUCKMULTI' ? 'FMULTI' 
        : token?.symbol
        
  const tokenAddress = token?.id.toLowerCase()

if(chainId == ChainId.FANTOM) {
  token?.id == MULTI_BNB_ADDRESS[ChainId.FANTOM].toLowerCase() 
    ? tokenSymbol = 'mBNB'
      : token?.id == MULTI_WETH_ADDRESS[ChainId.FANTOM].toLowerCase() 
      ? tokenSymbol = 'mWETH'
        : token?.id == MULTI_WBTC_ADDRESS[ChainId.FANTOM].toLowerCase() 
        ? tokenSymbol = 'mWBTC'
          : token?.id == MULTI_DAI_ADDRESS[ChainId.FANTOM].toLowerCase() 
          ? tokenSymbol = 'mDAI'
            : token?.id == MULTI_USDC_ADDRESS[ChainId.FANTOM].toLowerCase() 
            ? tokenSymbol = 'mUSDC'
              : token?.id == MULTI_AVAX_ADDRESS[ChainId.FANTOM].toLowerCase() 
              ? tokenSymbol = 'mAVAX'
                : token?.id == LZ_USDC_ADDRESS[ChainId.FANTOM].toLowerCase() 
                ? tokenSymbol = 'lzUSDC'
    : tokenSymbol
}

  return (
    <>
      <div className="flex items-center">
        <CurrencyLogo className="rounded-full" currency={currency} size={40} />
        <div className="ml-4 text-lg font-bold text-high-emphesis">{tokenSymbol}</div>
      </div>
    </>
  )
}

export default function TokenList({
  tokens,
  enabledColumns = Object.keys(TokenListColumns) as TokenListColumnType[],
  someEnabledColumns = Object.keys(SomeTokenListColumns) as SomeTokenListColumnType[],
}: TokenListProps): JSX.Element {
  const columns = React.useMemo<Column[]>(() => enabledColumns.map((col) => TokenListColumns[col]), [enabledColumns])
  const someColumns = React.useMemo<Column[]>(() => someEnabledColumns.map((col) => SomeTokenListColumns[col]), [someEnabledColumns])
  const {chainId} = useActiveWeb3React()

  return (
    <>
      {tokens && (
        <Table<Token>
          columns={
            chainId == ChainId.FANTOM ? columns : someColumns
          }
          data={tokens}
          defaultSortBy={{ id: 'liquidity', desc: true }}
          link={{ href: '/analytics/tokens/', id: 'tokenAddress' }}
        />
      )}
    </>
  )
}

const TokenListColumns: Record<TokenListColumnType, Column> = {

  name: {
    Header: 'Name',
    accessor: 'token',
    Cell: (props) => <TokenListName token={props.value} />,
    disableSortBy: true,
    align: 'left',
  },
  price: {
    Header: 'Price',
    accessor: 'price',
    Cell: (props) => formatNumber(props.value, true, undefined),
    align: 'right',
  },
  liquidity: {
    Header: 'Liquidity',
    accessor: 'liquidity',
    Cell: (props) => formatNumber(props.value, true, false),
    align: 'right',
  },
  // priceChange: {
  //   Header: '% Change',
  //   accessor: (row) => (
  //     <div>
  //       <ColoredNumber className="font-medium" number={row.change1d} percent={true} />
  //       <div className="font-normal">
  //         {row.change1w > 0 && '+'}
  //         {formatPercent(row.change1w)}
  //       </div>
  //     </div>
  //   ),
  //   align: 'right',
  //   sortType: (a, b) => a.original.change1d - b.original.change1d,
  // },
  volumeChange: {
    Header: 'Volume',
    accessor: (row) => (
      <div>
        <div className="font-medium text-high-emphesis">{formatNumber(row.volume1d, true, false)}</div>
        <div className="font-normal text-primary">{formatNumber(row.volume1w, true, false)}</div>
      </div>
    ),
    align: 'right',
  },
  lastWeekGraph: {
    Header: 'Last Week',
    accessor: 'graph',
    Cell: (props) => (
      <div className="flex justify-end w-full h-full py-2 pr-2">
        { props.row.original.volume1d >= 0 ?
        <div className="w-32 h-10">
          <LineGraph data={props.value} stroke={{ solid: props.row.original.change1w >= 0 ? '#00ff4f' : '#ff3838' }} />
        </div>
          : undefined
        }
      </div>
    ),
    disableSortBy: true,
    align: 'right',
  },
}

const SomeTokenListColumns: Record<SomeTokenListColumnType, Column> = {

  name: {
    Header: 'Name',
    accessor: 'token',
    Cell: (props) => <TokenListName token={props.value} />,
    disableSortBy: true,
    align: 'left',
  },
  price: {
    Header: 'Price',
    accessor: 'price',
    Cell: (props) => formatNumber(props.value, true, undefined),
    align: 'right',
  },
  liquidity: {
    Header: 'Liquidity',
    accessor: 'liquidity',
    Cell: (props) => formatNumber(props.value, true, false),
    align: 'right',
  },
  lastWeekGraph: {
    Header: 'Last Week',
    accessor: 'graph',
    Cell: (props) => (
      <div className="flex justify-end w-full h-full py-2 pr-2">
        { props.row.original.volume1d >= 0 ?
        <div className="w-32 h-10">
          <LineGraph data={props.value} stroke={{ solid: props.row.original.change1w >= 0 ? '#00ff4f' : '#ff3838' }} />
        </div>
          : undefined
        }
      </div>
    ),
    disableSortBy: true,
    align: 'right',
  },
}