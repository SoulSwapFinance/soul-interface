import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Dots from 'components/Dots'
import { HeadlessUiModal } from 'components/Modal'
import Typography from 'components/Typography'
import { MineModalView } from 'features/mines/enum'
import MineListItemDetails from 'features/mines/MineListItemDetails'
import { usePositions } from 'features/mines/hooks'
import { selectMines, setMinesModalOpen, setMinesModalState, setMineModalView } from 'features/mines/minesSlice'
import { TABLE_TR_TH_CLASSNAME, TABLE_WRAPPER_DIV_CLASSNAME } from 'features/trident/constants'
import { classNames } from 'functions'
import { useInfiniteScroll } from 'hooks/useInfiniteScroll'
import useSortableData from 'hooks/useSortableData'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import React, { FC, useCallback, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import MineListItem from './MineListItem'
import { useActiveWeb3React } from 'services/web3'

const SortIcon: FC<{ id?: string; direction?: 'ascending' | 'descending'; active: boolean }> = ({
  id,
  active,
  direction,
}) => {
  if (!id || !direction || !active) return <></>
  if (direction === 'ascending') return <ChevronUpIcon width={12} height={12} />
  if (direction === 'descending') return <ChevronDownIcon width={12} height={12} />
  return <></>
}

const MineList = ({ farms, term }) => {
  const { items, requestSort, sortConfig } = useSortableData(farms, { key: 'tvl', direction: 'descending' })
  const positions = usePositions()
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const [numDisplayed, setNumDisplayed] = useInfiniteScroll(items)
  const [selectedFarm, setSelectedFarm] = useState<any>()
  const dispatch = useAppDispatch()
  const { open } = useAppSelector(selectMines)

  const handleDismiss = useCallback(() => {
    setSelectedFarm(undefined)
    dispatch(setMineModalView(undefined))
  }, [dispatch])

  const positionIds = positions.map((el) => el.id)

  return items ? (
    <>
      <div className={classNames(TABLE_WRAPPER_DIV_CLASSNAME)}>
        <div className="grid grid-cols-3 sm:grid-cols-3 min-w-[340px]">
        {/* <div className="grid grid-cols-4"> */}
          <div
            className={classNames('flex gap-1 sm:justify-start sm:items-center cursor-pointer', TABLE_TR_TH_CLASSNAME(0, 4))}
            onClick={() => requestSort('pair.token0.symbol')}
          >
            <Typography variant="sm" weight={700}>
            {i18n._(t`Farms`)}
            </Typography>
            {/* <SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'symbol'} /> */}
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-center', TABLE_TR_TH_CLASSNAME(1, 4))}
            onClick={() => requestSort('allocPoint')}
            >
            <Typography variant="sm" weight={700}>
              {i18n._(t`TVL`)}
            </Typography>
            {/* <SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'tvl'} /> */}
          </div>
          <div className={classNames("hidden", TABLE_TR_TH_CLASSNAME(2, 4))}
            onClick={() => requestSort('allocPoint')}
            >
            <Typography variant="sm" weight={700}>
              {i18n._(t`Rewards`)}
            </Typography>
          </div>
          <div
            className={classNames('flex gap-1 items-center cursor-pointer justify-end', TABLE_TR_TH_CLASSNAME(3, 4))}
            onClick={() => requestSort('allocPoint')}
          >
            <Typography variant="sm" weight={700}>
              {i18n._(t`APR`)}
            </Typography>
            {/* <SortIcon id={sortConfig.key} direction={sortConfig.direction} active={sortConfig.key === 'roiPerYear'} /> */}
          </div>
        </div>
        {/* <div className="divide-y divide-dark-900 min-w-[768px]"> */}
        <div className="divide-y divide-dark-900 min-w-[340px]">
          <InfiniteScroll
            dataLength={numDisplayed}
            next={() => setNumDisplayed(numDisplayed + 5)}
            hasMore={true}
            loader={null}
          >
            {items.slice(0, numDisplayed).map((farm, index) => (
              <MineListItem
                key={index}
                farm={farm}
                onClick={() => {
                  setSelectedFarm(farm)
                  dispatch(
                    setMinesModalState({
                      view: farm.id === "0" 
                      || positionIds.includes(farm.id) 
                      || farm.pair.type === "underworld"
                        ? MineModalView.Position 
                        : MineModalView.Liquidity,
                      open: true,
                    })
                  )
                }}
              />
            ))}
          </InfiniteScroll>
        </div>
      </div>
      <HeadlessUiModal.Controlled
        isOpen={open}
        chainId={chainId}
        onDismiss={() => dispatch(setMinesModalOpen(false))}
        afterLeave={handleDismiss}
      >
        {selectedFarm && (
          <MineListItemDetails farm={selectedFarm} onDismiss={() => dispatch(setMinesModalOpen(false))} />
        )}
      </HeadlessUiModal.Controlled>
    </>
  ) : (
    <div className="w-full py-6 text-center">{term ? <span>No Results.</span> : <Dots>Loading</Dots>}</div>
  )
}

export default MineList
