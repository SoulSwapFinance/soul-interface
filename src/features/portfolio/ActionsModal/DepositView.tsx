import { ArrowDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ZERO } from 'sdk'
import AssetInput from 'components/AssetInput'
import { Button } from 'components/Button'
import { CoffinboxIcon } from 'components/Icon'
import HeadlessUiModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import { useBalancesSelectedCurrency } from 'features/portfolio/useBalancesDerivedState'
import TridentApproveGate from 'features/trident/TridentApproveGate'
import { tryParseAmount } from 'functions'
import { useCoffinBox, useCoffinBoxContract } from 'hooks'
import { useActiveWeb3React } from 'services/web3'
import { useCoffinBalanceV2 } from 'state/coffinbox/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import React, { FC, useCallback, useState } from 'react'

interface DepositViewProps {
  onBack(): void
  onClose(): void
}

const DepositView: FC<DepositViewProps> = ({ onClose, onBack }) => {
  const { account } = useActiveWeb3React()
  const currency = useBalancesSelectedCurrency()
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const walletBalance = useCurrencyBalance(account ?? undefined, currency)
  const { data: coffinBalance } = useCoffinBalanceV2(currency ? currency.wrapped.address : undefined)
  const { deposit } = useCoffinBox()
  const [value, setValue] = useState<string>()
  const { i18n } = useLingui()
  const coffinboxContract = useCoffinBoxContract()

  const valueCA = currency ? tryParseAmount(value, currency) : undefined
  let valuePlusBalance = valueCA?.wrapped
  if (valuePlusBalance && coffinBalance) valuePlusBalance = valuePlusBalance.add(coffinBalance)

  const execute = useCallback(async () => {
    if (!currency || !value) return

    try {
      setAttemptingTxn(true)
      await deposit(currency.wrapped.address, value.toBigNumber(currency?.decimals))
    } finally {
      setAttemptingTxn(false)
      onClose()
    }
  }, [currency, deposit, onClose, value])

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : !valueCA?.greaterThan(ZERO)
    ? i18n._(t`Enter an amount`)
    : !walletBalance
    ? i18n._(t`Loading balance`)
    : valueCA?.greaterThan(walletBalance)
    ? i18n._(t`Insufficient ${valueCA.currency.symbol} balance`)
    : ''

  return (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header header={i18n._(t`Deposit to CoffinBox`)} onClose={onClose} onBack={onBack} />
      <AssetInput
        title={''}
        currency={currency}
        onChange={(val) => setValue(val)}
        value={value}
        spendFromWallet={true}
      />
      <div className="flex justify-center -mt-6 -mb-6 z-10">
        <div className="p-1.5 rounded-full bg-dark-800 border border-dark-800 shadow-md border-dark-700">
          <ArrowDownIcon width={14} className="text-high-emphesis" />
        </div>
      </div>
      <HeadlessUiModal.BorderedContent className="bg-dark-900 flex gap-3 px-3">
        <div className="border border-dark-700 rounded-full w-[48px] h-[48px] flex items-center justify-center shadow-md">
          <CoffinboxIcon width={20} height={20} />
        </div>
        <div className="flex flex-col gap-1">
          <Typography variant="h3" className={value ? 'text-high-emphesis' : 'text-secondary'} weight={700}>
            {(valuePlusBalance || coffinBalance)?.toSignificant(6)}
          </Typography>
          <Typography variant="xxs" className="text-secondary">
            {i18n._(t`Total in CoffinBox`)}
          </Typography>
        </div>
      </HeadlessUiModal.BorderedContent>
      <TridentApproveGate inputAmounts={[valueCA]} tokenApproveOn={coffinboxContract?.address}>
        {({ approved, loading }) => {
          const disabled = !!error || !approved || loading || attemptingTxn
          const buttonText = error ? error : i18n._(t`Confirm Deposit`)

          return (
            <Button loading={attemptingTxn || loading} color="blue" disabled={disabled} onClick={execute}>
              <Typography variant="sm" weight={700} className={!error ? 'text-high-emphesis' : 'text-low-emphasis'}>
                {buttonText}
              </Typography>
            </Button>
          )
        }}
      </TridentApproveGate>
    </div>
  )
}

export default DepositView
