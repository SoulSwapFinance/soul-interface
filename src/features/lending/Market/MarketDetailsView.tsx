import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { ArrowSmallRightIcon } from '@heroicons/react/24/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Fraction, JSBI, Percent, TradeType } from 'sdk'
import { Trade as LegacyTrade } from 'sdk'
import QuestionHelper from 'components/QuestionHelper'
import Tooltip from 'components/Tooltip'
import Typography from 'components/Typography'
import { MarketView, useMarket, useLiquidationPrice } from 'features/lending/Market'
import { classNames, formatPercent, unwrappedToken } from 'functions'
import { useCoffinStrategies } from 'services/graph'
import { useActiveWeb3React } from 'services/web3'
import { useAppSelector } from 'state/hooks'
import { selectSlippage } from 'state/slippage/slippageSlice'
import React, { FC, Fragment, useState } from 'react'

interface MarketDetailsView {
  collateralAmount?: CurrencyAmount<Currency>
  borrowAmount?: CurrencyAmount<Currency>
  priceImpact?: Percent
  multiplier?: Fraction
  view: MarketView
  trade?: LegacyTrade<Currency, Currency, TradeType.EXACT_INPUT> | null
}

export const MarketDetailsContentView: FC<MarketDetailsView> = ({
  trade,
  priceImpact,
  collateralAmount,
  borrowAmount,
  multiplier,
  view,
}) => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { market } = useMarket()
  const strategies = useCoffinStrategies({
    chainId,
    variables: { where: { token: market.collateral.token.address.toLowerCase() } },
  })
  const strategy = strategies?.[0]
  const allowedSlippage = useAppSelector(selectSlippage)

  const currentUserBorrowAmount = CurrencyAmount.fromRawAmount(
    unwrappedToken(market.asset.token),
    market.currentUserBorrowAmount
  )

  const userCollateralAmount = CurrencyAmount.fromRawAmount(
    unwrappedToken(market.collateral.token),
    market.userCollateralAmount
  )

  const extraCollateral =
    view === MarketView.BORROW && multiplier && trade
      ? trade.minimumAmountOut(allowedSlippage)
      : CurrencyAmount.fromRawAmount(unwrappedToken(market.collateral.token), JSBI.BigInt(0))

  const nextCollateralAmount = collateralAmount
    ? userCollateralAmount[view === MarketView.BORROW ? 'add' : 'subtract'](collateralAmount.add(extraCollateral))
    : CurrencyAmount.fromRawAmount(market.collateral.token, market.userCollateralAmount)

  const nextBorrowAmount = borrowAmount
    ? currentUserBorrowAmount[view === MarketView.BORROW ? 'add' : 'subtract'](borrowAmount)
    : CurrencyAmount.fromRawAmount(market.asset.token, market.currentUserBorrowAmount)

  return (
    <div className="flex flex-col divide-y divide-dark-850">
      <div className="flex flex-col gap-1 pb-2">
        {(collateralAmount || borrowAmount) && (
          <div className="flex justify-between gap-4">
            <Typography variant="xs">{`Position Health`}</Typography>
            <div className="flex gap-1">
              <Typography variant="xs" className="text-right text-secondary">
                {new Percent(market.health, 1e18).toSignificant(6)}%
              </Typography>
              <ArrowSmallRightIcon width={14} className="text-secondary" />
              <Typography variant="xs" className="text-right">
                {new Percent(
                  market.simulatedHealth(nextBorrowAmount?.quotient, nextCollateralAmount?.quotient),
                  1e18
                ).toSignificant(6)}
                %
              </Typography>
            </div>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <Typography variant="xs">{`APR (annualized)`}</Typography>
          <Typography variant="xs" className="text-right">
            {new Percent(market.currentInterestPerYear, 1e18).toFixed(2)}%
          </Typography>
        </div>

        <div className="flex justify-between gap-4">
          <Typography variant="xs">{`Loan to Value (LTV)`}</Typography>
          <Typography variant="xs" className="text-right">
            75%
          </Typography>
        </div>
        {priceImpact && (
          <div className="flex justify-between gap-4">
            <Typography variant="xs">{`Price Impact`}</Typography>
            <Typography variant="xs" className="text-right">
              {priceImpact.toSignificant(2)}%
            </Typography>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <Typography variant="xs" className="flex items-center">
            {`CoffinBox strategy`}
            <QuestionHelper
              text={
                <div>
                  <Typography variant="xs">
                    CoffinBox strategies can create yield for your liquidity while it is not lent out.
                  </Typography>
                </div>
              }
            />
          </Typography>
          {strategy ? (
            <Tooltip
              text={
                <div className="flex flex-col">
                  <div className="flex justify-between gap-4">
                    <Typography variant="xs">{`Strategy APY`}</Typography>
                    <Typography variant="xs" className="text-right">
                      {formatPercent(strategy.apy)}
                    </Typography>
                  </div>
                  {/* <div className="flex justify-between gap-4">
                    <Typography variant="xs">{`Current Percentage`}</Typography>
                    <Typography variant="xs" className="text-right">
                      {formatPercent(strategy.utilization)}
                    </Typography>
                  </div> */}
                  <div className="flex justify-between gap-4">
                    <Typography variant="xs">{`Target Percentage`}</Typography>
                    <Typography variant="xs" className="text-right">
                      {formatPercent(strategy.targetPercentage)}
                    </Typography>
                  </div>
                </div>
              }
            >
              <Typography variant="xs" className={classNames(strategy ? 'text-blue' : '', 'text-right')}>
                {strategy ? `Active` : `None`}{' '}
              </Typography>
            </Tooltip>
          ) : (
            <Typography variant="xs" className={classNames(strategy ? 'text-blue' : '', 'text-right')}>
              {strategy ? `Active` : `None`}{' '}
            </Typography>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1 pt-2">
        {collateralAmount && (
          <div className="flex justify-between gap-4">
            <Typography variant="xs" className="text-secondary">
              {`Total collateral`}
            </Typography>
            <div className="flex gap-1">
              <Typography variant="xs" className="text-right text-secondary">
                {userCollateralAmount.toSignificant(6)} {market.collateral.token.symbol}
              </Typography>
              <ArrowSmallRightIcon width={14} className="text-secondary" />
              <Typography variant="xs" className="text-right">
                {nextCollateralAmount?.toSignificant(6)} {market.collateral.token.symbol}
              </Typography>
            </div>
          </div>
        )}
        {borrowAmount && (
          <div className="flex justify-between gap-4">
            <Typography variant="xs" className="text-secondary">
              {`Total borrowed`}
            </Typography>
            <div className="flex gap-1">
              <Typography variant="xs" className="text-right text-secondary">
                {currentUserBorrowAmount?.toSignificant(6)} {market.asset.token.symbol}
              </Typography>
              <ArrowSmallRightIcon width={14} className="text-secondary" />
              <Typography variant="xs" className="text-right">
                {nextBorrowAmount?.toSignificant(6)} {market.asset.token.symbol}
              </Typography>
            </div>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <Typography variant="xs" className="text-secondary">
            {`Oracle`}
          </Typography>
          <Typography variant="xs" className="text-right text-secondary">
            {market.oracle.name}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export const MarketDetailsView: FC<MarketDetailsView> = ({
  priceImpact,
  collateralAmount,
  borrowAmount,
  multiplier,
  view,
  trade,
}) => {
  const [invert, setInvert] = useState(false)

  const liquidationPrice = useLiquidationPrice({
    invert,
    borrowAmount,
    collateralAmount,
    trade,
    reduce: view === MarketView.REPAY,
  })

  return (
    <Disclosure as="div">
      {({ open }) => (
        <div
          className={classNames(
            open ? 'bg-dark-900' : '',
            'shadow-inner flex flex-col gap-2 py-2 rounded px-2 border border-dark-700 transition hover:border-dark-700'
          )}
        >
          <div className="flex items-center justify-between gap-2 pl-1">
            <div className="flex items-center gap-3">
              <Typography variant="xs" weight={700} className="flex gap-2 -ml-1">
                <QuestionHelper
                  text={
                    <div className="flex flex-col gap-2">
                      <Typography variant="xs" className="text-white">
                        {`When the value of your collateral becomes less than the asset you borrow, your position gets liquidated.`}
                      </Typography>
                      <Typography variant="xs" className="italic">
                        {`When a non-leveraged positions gets liquidated, you lose the collateral but you can keep the borrowed assets`}
                      </Typography>
                    </div>
                  }
                />
                {view === MarketView.BORROW ? `Liquidation Price` : `New Liquidation Price`}
              </Typography>
              {liquidationPrice && (
                <Typography
                  onClick={() => setInvert((prev) => !prev)}
                  variant="xs"
                  weight={700}
                  className="py-1 rounded-full cursor-pointer hover:text-high-emphesis"
                >
                  {liquidationPrice}
                </Typography>
              )}
            </div>

            <Disclosure.Button as={Fragment}>
              <div className="flex items-center justify-end flex-grow p-1 rounded cursor-pointer">
                <ChevronDownIcon
                  width={20}
                  className={classNames(open ? 'transform rotate-180' : '', 'transition hover:text-white')}
                />
              </div>
            </Disclosure.Button>
          </div>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            unmount={false}
          >
            <Disclosure.Panel static className="px-1 pt-2">
              <MarketDetailsContentView
                trade={trade}
                priceImpact={priceImpact}
                collateralAmount={collateralAmount}
                multiplier={multiplier}
                borrowAmount={borrowAmount}
                view={view}
              />
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}