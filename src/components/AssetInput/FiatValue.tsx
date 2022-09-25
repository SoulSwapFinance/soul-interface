import React from 'react'
import { Currency, CurrencyAmount } from 'sdk'

export function FiatValue({ fiatValue }: {
  fiatValue: CurrencyAmount<Currency> | null | undefined
}) {
  return (
    <div className="flex justify-end space-x-1 text-xs font-medium text-right text-secondary">
      {fiatValue ? (
        <>
          ≈$ <div className="cursor-pointer">{fiatValue?.toSignificant(6, { groupSeparator: ',' })}</div>
        </>
      ) : (
        ''
      )}
    </div>
  )
}
