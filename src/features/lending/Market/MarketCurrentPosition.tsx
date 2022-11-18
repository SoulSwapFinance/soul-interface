import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, Percent } from '@sushiswap/core-sdk'
import GradientDot from 'components/GradientDot'
import QuestionHelper from 'components/QuestionHelper'
import Typography from 'components/Typography'
import { useMarket } from 'features/lending/Market/MarketContext'
import { classNames, unwrappedToken } from 'functions'
import React, { FC } from 'react'

interface MarketCurrentPosition {
  setCollateralAmount?(x: string): void
  setBorrowAmount?(x: string): void
}

export const MarketCurrentPosition: FC<MarketCurrentPosition> = ({
  setCollateralAmount,
  setBorrowAmount,
}) => {
  const { i18n } = useLingui()
  const { market } = useMarket()

  const currentCollateral = CurrencyAmount.fromRawAmount(
    unwrappedToken(market.collateral.token),
    market.userCollateralAmount
  )
  const currentBorrow = CurrencyAmount.fromRawAmount(unwrappedToken(market.asset.token), market.currentUserBorrowAmount)

  return (
    <div className="grid grid-cols-3 px-3">
      <div className="flex flex-col items-baseline">
        <Typography variant="xs" className="text-secondary">
          {i18n._(t`Collateralized`)}
        </Typography>
        <Typography
          weight={700}
          variant="sm"
          className={classNames(setCollateralAmount ? 'cursor-pointer' : '', 'text-high-emphesis')}
          onClick={() => setCollateralAmount && setCollateralAmount(currentCollateral.toExact())}
        >
          {currentCollateral.toSignificant(6)}
          <Typography weight={700} variant="xs" className="text-secondary" component="span">
            {' '}
            {market.collateral.token.symbol}
          </Typography>
        </Typography>
      </div>
      <div className="flex flex-col items-center">
        <Typography variant="xs" className="text-secondary">
          {i18n._(t`Borrowed`)}
        </Typography>
        <Typography
          weight={700}
          variant="sm"
          className={classNames(setBorrowAmount ? 'cursor-pointer' : '', 'text-high-emphesis')}
          onClick={() => setBorrowAmount && setBorrowAmount(currentBorrow.toExact())}
        >
          {currentBorrow.toSignificant(6)}
          <Typography weight={700} variant="xs" className="text-secondary" component="span">
            {' '}
            {market.asset.token.symbol}
          </Typography>
        </Typography>
      </div>
      <div className="flex flex-col items-end">
        <Typography variant="xs" className="text-right text-secondary">
          {i18n._(t`Health`)}
        </Typography>
        <Typography weight={700} variant="sm" className="flex items-center text-high-emphesis">
          {new Percent(market.health, 1e18).toSignificant(6)}%
          <div className="-ml-1">
            <QuestionHelper
              icon={<GradientDot percent={new Percent(market.health, 1e18).toSignificant(6)} />}
              text={
                <div className="flex flex-col gap-2">
                  <Typography variant="xs" className="text-white">
                    {i18n._(
                      t`Health of your position defined as your current borrowed amount divided by the max borrow amount given current collateral.`
                    )}
                  </Typography>
                  <Typography variant="xs" className="italic">
                    {i18n._(t`100% means you are at max borrow`)}
                  </Typography>
                </div>
              }
            />
          </div>
        </Typography>
      </div>
    </div>
  )
}