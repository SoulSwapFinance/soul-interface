import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { HeadlessUiModal } from 'components/Modal'
import QuestionHelper from 'components/QuestionHelper'
import ToggleButtonGroup from 'components/ToggleButton'
import { selectMines, setMineModalView } from 'features/mines/minesSlice'
import { classNames } from 'functions'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react'

import { MineModalView, PairType } from './enum'
import InformationDisclosure from './components/InformationDisclosure'
import InvestmentDetails from './components/InvestmentDetails'
import ManageBar from './utils/ManageBar'
// import ManageKashiPair from './ManageKashiPair'
import ManageSwapPair from './utils/ManageSwapPair'

const COLUMN_CONTAINER = 'flex flex-col flex-grow gap-4'

interface MineListItemDetailsModal {
  content: ReactNode
  setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>
}

const Context = createContext<MineListItemDetailsModal | undefined>(undefined)

// @ts-ignore TYPE NEEDS FIXING
const MineListItemDetails = ({ farm, onDismiss }) => {
  const { i18n } = useLingui()
  const { view } = useAppSelector(selectMines)
  const dispatch = useAppDispatch()
  const [content, setContent] = useState<ReactNode>()

  return (
    <Context.Provider value={useMemo(() => ({ content, setContent }), [content, setContent])}>
      <div className={classNames('')}>
        <div className={classNames(COLUMN_CONTAINER, content ? '' : 'hidden')}>{content}</div>
        <div className={classNames(COLUMN_CONTAINER, content ? 'hidden' : '')}>
          <HeadlessUiModal.Header
            header={
              <div className="flex gap-0.5 items-center">
                {view === MineModalView.Liquidity
                  ? i18n._(t`Manage Liquidity`)
                  : view === MineModalView.Position
                    ? i18n._(t`Position and Rewards`)
                    : i18n._(t`Manage Position`)}
                <QuestionHelper className="!bg-dark-800 !shadow-xl p-2" text={<InformationDisclosure farm={farm} />} />
              </div>
            }
            onClose={onDismiss}
          />
          <ToggleButtonGroup
            size="sm"
            value={view}
            onChange={(view: MineModalView) => dispatch(setMineModalView(view))}
            variant="filled"
          >

            {farm.pair.token1 && (
              <ToggleButtonGroup.Button value={MineModalView.Liquidity}>
                {farm.pair.type === PairType.KASHI ? i18n._(t`Lending`) : i18n._(t`Liquidity`)}
              </ToggleButtonGroup.Button>
            )}
            <ToggleButtonGroup.Button value={MineModalView.Staking}>{i18n._(t`Staking`)}</ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button value={MineModalView.Position}>{i18n._(t`Rewards`)}</ToggleButtonGroup.Button>
          </ToggleButtonGroup>

          {/*Dont unmount following components to make modal more react faster*/}
          <div className={classNames(COLUMN_CONTAINER, view === MineModalView.Position ? 'block' : 'hidden')}>
            <InvestmentDetails farm={farm} />
          </div>
          {farm.pair.token1 &&
            <div className={classNames(COLUMN_CONTAINER, view === MineModalView.Liquidity ? 'block' : 'hidden')}>
              <ManageSwapPair farm={farm} />
            </div>
          }
          {/* <div className={classNames(COLUMN_CONTAINER, view === MineModalView.Liquidity ? 'block' : 'hidden')}>
            {farm.pair.type === PairType.KASHI ? <ManageKashiPair farm={farm} /> : <ManageSwapPair farm={farm} />}
          </div> */}
          <div className={classNames(COLUMN_CONTAINER, view === MineModalView.Staking ? 'block' : 'hidden')}>
            <ManageBar farm={farm} />
          </div>
        </div>
      </div>
    </Context.Provider>
  )
}

export const useMineListItemDetailsModal = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Farm List Item Details Context')
  }

  return context
}

export default MineListItemDetails