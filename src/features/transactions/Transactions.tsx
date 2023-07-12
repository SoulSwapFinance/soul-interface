import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid'
import { useLegacyTransactions } from 'services/graph/hooks/transactions/legacy'
import React, { FC } from 'react'
import { useFlexLayout, usePagination, useSortBy, useTable } from 'react-table'
import { TablePageToggler } from './TablePageToggler'
import { TransactionFetcherState } from './types'
import { useTableConfig } from './useTableConfig'

import {
  TABLE_TABLE_CLASSNAME,
  TABLE_TBODY_TD_CLASSNAME,
  TABLE_TBODY_TR_CLASSNAME,
  TABLE_TR_TH_CLASSNAME,
  TABLE_WRAPPER_DIV_CLASSNAME,
} from 'features/trident/constants'

export const LegacyTransactions: FC<{ pairs: string[] }> = ({ pairs }) => {
  const { transactions, error, loading } = useLegacyTransactions(pairs)
  return <_Transactions transactions={transactions} error={error} loading={loading} />
}

const _Transactions: FC<TransactionFetcherState> = ({ transactions, error, loading }) => {
  const { config } = useTableConfig(transactions)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    gotoPage,
    canPreviousPage,
    canNextPage,
    prepareRow,
    state: { pageIndex, pageSize },
  } = useTable(config, useSortBy, usePagination, useFlexLayout)

  return (
    <div className="flex flex-col gap-3">

      <div className={TABLE_WRAPPER_DIV_CLASSNAME}>
        <table {...getTableProps()} className={TABLE_TABLE_CLASSNAME}>
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column, i) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={i}
                    className={TABLE_TR_TH_CLASSNAME(i, headerGroup.headers.length)}
                  >
                    {column.render('Header')}
                    <span className="inline-block ml-1 align-middle">
                      {column.isSorted ? (
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
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} key={i} className={TABLE_TBODY_TR_CLASSNAME}>
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