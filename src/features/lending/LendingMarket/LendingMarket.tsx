import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import QuestionHelper from 'components/QuestionHelper'
import ToggleButtonGroup from 'components/ToggleButton'
import Typography from 'components/Typography'
import {
  LendingMarketBorrowView,
//   LendingMarketDepositView,
//   LendingMarketRepayView,
//   LendingMarketWithdrawView,
} from 'features/lending/LendingMarket'
import { SwapLayoutCard } from 'layouts/SwapLayout'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'

interface LendingMarketProps {}

export enum LendingMarketView {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  BORROW = 'borrow',
  REPAY = 'repay',
}

export const LendingMarket: FC<LendingMarketProps> = () => {
  const { i18n } = useLingui()
  const router = useRouter()

  const [view, setView] = useState((router.query.view as string) || LendingMarketView.BORROW)

  return (
    <SwapLayoutCard>
      <div className="flex flex-col w-full gap-4">
        <ToggleButtonGroup
          size="sm"
          value={view}
          onChange={setView}
          variant="filled"
          className="flex flex-grow bg-dark-800"
        >
          <ToggleButtonGroup.Button value={LendingMarketView.BORROW}>
            {i18n._(t`Borrow`)}
            <QuestionHelper
            //   gap={false}
              text={
                <div className="flex flex-col gap-2">
                  <Typography variant="xs">
                    {i18n._(t`Gain exposure to tokens without reducing your assets.`)}
                  </Typography>
                  <Typography variant="xs">
                    {i18n._(t`Leverage will enable you to take long or short positions.`)}
                  </Typography>
                </div>
              }
            />
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button value={LendingMarketView.REPAY}>{i18n._(t`Repay`)}</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button value={LendingMarketView.DEPOSIT}>
            {i18n._(t`Deposit`)}
            <QuestionHelper
            //   gap={false}
              text={
                <div className="flex flex-col gap-2">
                  <Typography variant="xs">
                    {i18n._(t`Have assets you want to earn additional interest on?`)}
                  </Typography>
                  <Typography variant="xs">
                    {i18n._(t`Lend them in isolated markets and earn interest from borrowers.`)}
                  </Typography>
                </div>
              }
            />
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button value={LendingMarketView.WITHDRAW}>{i18n._(t`Withdraw`)}</ToggleButtonGroup.Button>
        </ToggleButtonGroup>
        {view === LendingMarketView.BORROW && <LendingMarketBorrowView />}
        {/* {view === LendingMarketView.REPAY && <LendingMarketRepayView />}
        {view === LendingMarketView.DEPOSIT && <LendingMarketDepositView />}
        {view === LendingMarketView.WITHDRAW && <LendingMarketWithdrawView />} */}
      </div>
    </SwapLayoutCard>
  )
}