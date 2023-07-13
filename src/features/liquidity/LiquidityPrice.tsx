import { Currency, Percent, Price } from '../../sdk'

import { Field } from '../../state/mint/actions'
import { ONE_BIPS } from '../../constants'
import React from 'react'
import Typography from '../../components/Typography'
import { classNames } from '../../functions'
import { useTokenInfo } from 'hooks/useAPI'

export default function LiquidityPrice({
  currencies,
  price,
  noLiquidity,
  poolTokenPercentage,
  className,
}: {
  currencies: { [field in Field]?: Currency }
  price?: Price<Currency, Currency>
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  className?: string
}): JSX.Element {
  const TickerA = useTokenInfo(currencies[Field.CURRENCY_A].wrapped.address).tokenInfo.symbol 
  const TickerB = useTokenInfo(currencies[Field.CURRENCY_B].wrapped.address).tokenInfo.symbol 
  // console.log('tickerA:%s', TickerA)
  // console.log('tickerB:%s', TickerB)

  return (
    <div className={classNames('flex justify-between items-center rounded py-2 px-4 bg-dark-900', className)}>
      <div className="flex flex-col w-full text-secondary">
        <Typography variant="sm" className="select-none">
          {price?.toSignificant(6) ?? '-'} { TickerB } per { TickerA }
        </Typography>
        <Typography variant="sm" className="select-none">
          {price?.invert()?.toSignificant(6) ?? '-'} { TickerA } per { TickerB }
        </Typography>
      </div>

      <div className="flex flex-col w-full text-right text-secondary">
        <Typography variant="sm" className="select-none">
          {noLiquidity && price
            ? '100'
            : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
          %
        </Typography>
        <Typography variant="sm" className="select-none">
          {`Share of Pool`}
        </Typography>
      </div>
    </div>
  )
}
