import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { LoadingSpinner } from 'components/LoadingSpinner'
import {
  TABLE_TABLE_CLASSNAME,
  TABLE_TBODY_TD_CLASSNAME,
  TABLE_TBODY_TR_CLASSNAME,
  TABLE_TR_TH_CLASSNAME,
  TABLE_WRAPPER_DIV_CLASSNAME,
} from 'features/trident/constants'
import { useLegacyTransactions } from 'services/graph/hooks/transactions/legacy'
// import { useTridentTransactions } from 'services/graph/hooks/transactions/trident'
import React, { FC } from 'react'
// @ts-ignore TYPE NEEDS FIXING
import { useFlexLayout, usePagination, useSortBy, useTable } from 'react-table'

import Typography from '../../components/Typography'
import { TablePageToggler } from './TablePageToggler'
import { TransactionFetcherState } from './types'
import { useTableConfig } from './useTableConfig'

export const LegacyTransactions: FC<{ pairs: string[] }> = ({ pairs }) => {
  const { transactions, error, loading } = useLegacyTransactions(pairs)
  return <_Transactions transactions={transactions} error={error} loading={loading} />
}

// export const TridentTransactions: FC<{ poolAddress?: string }> = ({ poolAddress }) => {
//   const { transactions, error, loading } = useTridentTransactions(poolAddress)
//   return <_Transactions transactions={transactions} error={error} loading={loading} />
// }

const _Transactions: FC<TransactionFetcherState> = ({ transactions, error, loading }) => {
  const { i18n } = useLingui()
  const { config } = useTableConfig(transactions)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // @ts-ignore TYPE NEEDS FIXING
    page,
    // @ts-ignore TYPE NEEDS FIXING
    gotoPage,
    // @ts-ignore TYPE NEEDS FIXING
    canPreviousPage,
    // @ts-ignore TYPE NEEDS FIXING
    canNextPage,
    prepareRow,
    // @ts-ignore TYPE NEEDS FIXING
    state: { pageIndex, pageSize },
    // @ts-ignore TYPE NEEDS FIXING
  } = useTable(config, useSortBy, usePagination, useFlexLayout)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Typography variant="h3" className="text-high-emphesis" weight={700}>
          {i18n._(t`Transactions`)}
        </Typography>
        <LoadingSpinner active={loading} />
        {error && <span className="-ml-2 text-sm italic text-red">{i18n._(t`⚠️ Loading Error`)}</span>}
      </div>

      <div className={TABLE_WRAPPER_DIV_CLASSNAME}>
        <table {...getTableProps()} className={TABLE_TABLE_CLASSNAME}>
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column, i) => (
                  <th
                    // @ts-ignore TYPE NEEDS FIXING
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={i}
                    className={TABLE_TR_TH_CLASSNAME(i, headerGroup.headers.length)}
                  >
                    {column.render('Header')}
                    <span className="inline-block ml-1 align-middle">
                      {/*@ts-ignore TYPE NEEDS FIXING*/}
                      {column.isSorted ? (
                        // @ts-ignore TYPE NEEDS FIXING
                        column.isSortedDesc ? (
                          <ArrowDownIcon width={12} />
                        ) : (
                          <ArrowUpIcon width={12} />
                        )
                      ) : (
                        ''
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {/*@ts-ignore TYPE NEEDS FIXING*/}
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} key={i} className={TABLE_TBODY_TR_CLASSNAME}>
                  {/*@ts-ignore TYPE NEEDS FIXING*/}
                  {row.cells.map((cell, i) => {
                    return (
                      <td key={i} {...cell.getCellProps()} className={TABLE_TBODY_TD_CLASSNAME(i, row.cells.length)}>
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <TablePageToggler
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={transactions ? transactions.length : 0}
        gotoPage={gotoPage}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        loading={loading}
      />
    </div>
  )
}