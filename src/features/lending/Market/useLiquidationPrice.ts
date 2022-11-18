import { Currency, CurrencyAmount, Price, Trade as LegacyTrade, TradeType, ZERO } from 'sdk'
import { LTV } from 'features/lending/constants'
import { useMarket } from 'features/lending/Market'
import { unwrappedToken } from 'functions'
import { useUSDCPrice } from 'hooks'
import { useAppSelector } from 'state/hooks'
import { selectSlippage } from 'state/slippage/slippageSlice'

interface Payload {
  borrowAmount?: CurrencyAmount<Currency>
  collateralAmount?: CurrencyAmount<Currency>
  trade?: LegacyTrade<Currency, Currency, TradeType.EXACT_INPUT> | null
  invert: boolean
  reduce: boolean
}

type UseLiquidationPrice = (x: Payload) => string

export const useLiquidationPrice: UseLiquidationPrice = ({ borrowAmount, collateralAmount, invert, trade, reduce }) => {
  const { market } = useMarket()
  const currentCollateralAmount = CurrencyAmount.fromRawAmount(
    unwrappedToken(market.collateral.token),
    market.userCollateralAmount
  )
  const currentBorrowedAmount = CurrencyAmount.fromRawAmount(
    unwrappedToken(market.asset.token),
    market.currentUserBorrowAmount
  )
  const collateralAssetPrice = useUSDCPrice(market.collateral.token)

  const allowedSlippage = useAppSelector(selectSlippage)

  try {
    const extraCollateral =
      collateralAmount && trade
        ? collateralAmount[reduce ? 'subtract' : 'add'](trade.minimumAmountOut(allowedSlippage))
        : collateralAmount

    const totalCollateral = extraCollateral
      ? currentCollateralAmount[reduce ? 'subtract' : 'add'](extraCollateral)
      : currentCollateralAmount
    const totalBorrowed = borrowAmount
      ? currentBorrowedAmount[reduce ? 'subtract' : 'add'](borrowAmount)
      : currentBorrowedAmount

    if (totalBorrowed.equalTo(ZERO)) return 'None'

    const liquidationPrice =
      totalBorrowed && totalCollateral && totalBorrowed.greaterThan(ZERO)
        ? new Price({ baseAmount: totalBorrowed, quoteAmount: totalCollateral.multiply(LTV) })
        : undefined

    const liqPriceNumber = Number(liquidationPrice?.invert().toSignificant(6))
    const assetPriceNumber = Number(collateralAssetPrice?.toSignificant(6))

    if (liqPriceNumber > assetPriceNumber || Number(liquidationPrice?.invert().toSignificant(6)) < 0) {
      return 'Instant liquidation'
    } else if (!liqPriceNumber) {
      return 'None'
    }

    return invert
      ? `1 ${totalBorrowed?.currency.symbol} = ${liquidationPrice?.toSignificant(6)} ${
          totalCollateral?.currency.symbol
        }`
      : `1 ${totalCollateral?.currency.symbol} = ${liquidationPrice?.invert().toSignificant(6)} ${
          totalBorrowed?.currency.symbol
        }`
  } catch (e) {
    console.log(e)
    return 'Instant liquidation'
  }
}