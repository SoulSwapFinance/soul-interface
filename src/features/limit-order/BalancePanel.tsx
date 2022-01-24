import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'components/Typography'
import { maxAmountSpend } from 'functions'
import { useBentoOrWalletBalances } from 'hooks/useBentoOrWalletBalance'
import { useActiveWeb3React } from 'services/web3'
import { useAppDispatch } from 'state/hooks'
import { setFromBentoBalance } from 'state/limit-order/actions'
import useLimitOrderDerivedCurrencies, { useLimitOrderActionHandlers } from 'state/limit-order/hooks'
import { Field } from 'state/swap/actions'
import React, { FC, useCallback } from 'react'

const BalancePanel: FC = () => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { inputCurrency } = useLimitOrderDerivedCurrencies()
  const { onUserInput } = useLimitOrderActionHandlers()
  const [walletBalance, bentoBalance] = useBentoOrWalletBalances(
    account ?? undefined,
    [inputCurrency, inputCurrency],
    [true, false]
  )
  const maxAmountInput = maxAmountSpend(walletBalance)
  const dispatch = useAppDispatch()

  const handleMaxInput = useCallback(
    (bento) => {
      if (bento) {
        bentoBalance && onUserInput(Field.INPUT, bentoBalance.toExact())
        dispatch(setFromBentoBalance(true))
      } else {
        maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
        dispatch(setFromBentoBalance(false))
      }
    },
    [bentoBalance, dispatch, maxAmountInput, onUserInput]
  )

  return (
    <div className="grid grid-cols-2 px-5 py-1 rounded-b bg-dark-700">
      <div className="flex gap-2">
        <Typography variant="sm" weight={700}>
          {i18n._(t`In Coffin:`)}
        </Typography>
        <Typography variant="sm" className="text-secondary" onClick={() => handleMaxInput(true)}>
          {bentoBalance?.toSignificant(6, { groupSeparator: ',' })} {bentoBalance?.currency.symbol}
        </Typography>
      </div>
      <div className="flex gap-2">
        <Typography variant="sm" weight={700}>
          {i18n._(t`In Wallet:`)}
        </Typography>
        <Typography variant="sm" className="text-secondary" onClick={() => handleMaxInput(false)}>
          {walletBalance?.toSignificant(6, { groupSeparator: ',' })} {walletBalance?.currency.symbol}
        </Typography>
      </div>
    </div>
  )
}

export default BalancePanel