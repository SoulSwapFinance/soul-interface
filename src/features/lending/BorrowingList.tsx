import SortIcon from 'components/SortIcon'
import Typography from 'components/Typography'
import { TABLE_TR_TH_CLASSNAME, TABLE_WRAPPER_DIV_CLASSNAME } from 'features/trident/constants'
import { classNames } from 'functions/styling'
import { useSortableData } from 'hooks'
import { useInfiniteScroll } from 'hooks/useInfiniteScroll'
import { useRouter } from 'next/router'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useLendingMediumRiskBorrowingPositions } from './hooks'
import LendingBorrowingListItem from './BorrowingListItem'

export const LendingBorrowingList = () => {
  const router = useRouter()
  const account = router.query.account as string
  const positions = useLendingMediumRiskBorrowingPositions(account)
  const { items, requestSort, sortConfig } = useSortableData(positions, {
    key: 'currentInterestPerYear',
    direction: 'descending',
  })
  const [numDisplayed, setNumDisplayed] = useInfiniteScroll(items)
  return (
    <div className="flex flex-col w-full gap-3">
      <div className={classNames(TABLE_WRAPPER_DIV_CLASSNAME)}>
        <div className="grid grid-cols-6 min-w-[768px]">
          <div className={classNames('flex gap-1 items-center cursor-pointer', TABLE_TR_TH_CLASSNAME(0, 6))}>
            <Typography variant="sm" weight={700}>
              {`Asset / Collateral`}
            </Typography>
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(1, 6))}
          >
            <Typography variant="sm" weight={700}>
              {`Collateralized`}
            </Typography>
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(2, 6))}
          >
            <Typography variant="sm" weight={700}>
              {`Liquidation Price`}
            </Typography>
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(3, 6))}
          >
            <Typography variant="sm" weight={700}>
              {`Borrowed`}
            </Typography>
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(4, 6))}
            onClick={() => requestSort('health')}
          >
            <Typography variant="sm" weight={700}>
              {`Health`}
            </Typography>
            <SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'health'} />
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(5, 6))}
            onClick={() => requestSort('currentInterestPerYear')}
          >
            <Typography variant="sm" weight={700}>
              {`Borrow APR`}
            </Typography>
            <SortIcon
              id={sortConfig.key}
              direction={sortConfig.direction}
              active={sortConfig.key === 'currentInterestPerYear'}
            />
          </div>
        </div>
        <InfiniteScroll
          dataLength={numDisplayed}
          next={() => setNumDisplayed(numDisplayed + 5)}
          hasMore={true}
          loader={null}
        >
          {items.slice(0, numDisplayed).map((market, index) => (
            <LendingBorrowingListItem market={market} key={index} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  )
}