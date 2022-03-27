import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Trade, TradeType } from 'sdk'
// import { Button } from 'components/Button'
import Typography from 'components/Typography'
import useLimitOrderExecute, { DepositPayload } from './hooks/useLimitOrderExecute'
import TridentApproveGate from 'features/trident/TridentApproveGate'
import { useCoffinBoxContract } from 'hooks'
import { useActiveWeb3React } from 'services/web3'
import { useAppDispatch } from 'state/hooks'
import { setFromCoffinBalance, setLimitOrderCoffinPermit, setLimitOrderShowReview } from 'state/limit-order/actions'
import { useLimitOrderDerivedInputError, useLimitOrderState } from 'state/limit-order/hooks'
import React, { FC, useCallback, useState } from 'react'
import { STOP_LIMIT_ORDER_ADDRESS } from 'constants/addresses'
import { Button } from 'components/Button'

interface LimitOrderButton {
  trade?: Trade<Currency, Currency, TradeType>
  parsedAmounts: {
    inputAmount?: CurrencyAmount<Currency>
    outputAmount?: CurrencyAmount<Currency>
  }
}

const LimitOrderButton: FC<LimitOrderButton> = ({ trade, parsedAmounts }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { fromCoffinBalance, coffinPermit, attemptingTxn } = useLimitOrderState()
  const error = useLimitOrderDerivedInputError({ trade })
  const { deposit } = useLimitOrderExecute()
  const coffinboxContract = useCoffinBoxContract()
  const masterContractAddress = chainId && STOP_LIMIT_ORDER_ADDRESS[chainId]
  const [permitError, setPermitError] = useState(false)

  const _deposit = useCallback(
    async (payload: DepositPayload) => {
      const tx = await deposit(payload)
      if (tx?.hash) {
        dispatch(setFromCoffinBalance(true))
      }
    },
    [deposit, dispatch]
  )

  const handler = useCallback(async () => {
    if (!parsedAmounts?.inputAmount) return

    if (fromCoffinBalance) {
      dispatch(setLimitOrderShowReview(true))
    } else {
      await _deposit({
        inputAmount: parsedAmounts?.inputAmount,
        coffinPermit,
        fromCoffinBalance,
      })
    }
  }, [_deposit, coffinPermit, dispatch, fromCoffinBalance, parsedAmounts?.inputAmount])

  return (
    <>
      {permitError && (
        <Typography variant="sm" className="border border-yellow/40 text-yellow p-4 rounded text-center">
          {i18n._(
            t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click 'Approve CoffinBox' again for approving using the fallback method`
          )}
        </Typography>
      )}
      <TridentApproveGate
        inputAmounts={[trade?.inputAmount]}
        tokenApproveOn={coffinboxContract?.address}
        masterContractAddress={masterContractAddress}
        {...(fromCoffinBalance
          ? { withPermit: false }
          : {
              withPermit: true,
              permit: coffinPermit,
              onPermit: (permit) => dispatch(setLimitOrderCoffinPermit(permit)),
              onPermitError: () => setPermitError(true),
            })}
      >
        {({ approved, loading }) => {
          const disabled = !!error || !approved || loading || attemptingTxn
          return (
            <Button loading={loading || attemptingTxn} color="gradient" disabled={disabled} onClick={handler}>
              {error ? error : fromCoffinBalance ? i18n._(t`Review Limit Order`) : i18n._(t`Confirm Deposit`)}
            </Button>
          )
        }}
      </TridentApproveGate>
    </>
  )
}

export default LimitOrderButton