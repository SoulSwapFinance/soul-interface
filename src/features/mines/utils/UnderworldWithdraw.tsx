import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount } from 'sdk'
import AssetInput from 'components/AssetInput'
import { Button } from 'components/Button'
import { HeadlessUiModal } from 'components/Modal'
import Typography from 'components/Typography'
import Web3Connect from 'components/Web3Connect'
import { UnderworldCooker } from 'entities'
import { tryParseAmount } from 'functions'
import { minimum, ZERO } from 'functions/math'
import { useCurrency } from 'hooks/Tokens'
import useUnderworldApproveCallback, { CoffinApprovalState } from 'hooks/useUnderworldApproveCallback'
import { useActiveWeb3React } from 'services/web3'
import React, { useCallback, useState } from 'react'

// @ts-ignore TYPE NEEDS FIXING
const UnderworldWithdraw = ({ pair, header }) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const [useCoffin, setUseCoffin] = useState<boolean>(false)
  const assetToken = useCurrency(pair?.asset?.address) || undefined
  const [withdrawValue, setWithdrawValue] = useState('')
  const [underworldApprovalState, approveUnderworldFallback, underworldPermit, onApproveUnderworld, onCook] = useUnderworldApproveCallback()
  const amountAvailable = minimum(pair?.maxAssetAvailable ?? ZERO, pair?.currentUserAssetAmount.value ?? ZERO)
  const available =
    assetToken && amountAvailable && CurrencyAmount.fromRawAmount(assetToken, amountAvailable.toString())
  const parsedWithdrawValue = tryParseAmount(withdrawValue, assetToken)

  const onWithdraw = useCallback(
    async (cooker: UnderworldCooker) => {
      const maxFraction = minimum(pair.userAssetFraction, pair.maxAssetAvailableFraction)
      const fraction = BigNumber.from(parsedWithdrawValue?.quotient.toString()).mulDiv(
        pair.currentTotalAsset.base,
        pair.currentAllAssets.value
      )
      cooker.removeAsset(minimum(fraction, maxFraction), useCoffin)
      return `${i18n._(t`Withdraw`)} ${pair.asset.tokenInfo.symbol}`
    },
    [
      i18n,
      pair?.asset.tokenInfo.symbol,
      pair?.currentAllAssets.value,
      pair?.currentTotalAsset.base,
      pair?.maxAssetAvailableFraction,
      pair?.userAssetFraction,
      parsedWithdrawValue?.quotient,
      useCoffin,
    ]
  )

  const error = !parsedWithdrawValue
    ? 'Enter Amount'
    : available?.lessThan(parsedWithdrawValue)
    ? 'Insufficient Balance'
    : undefined

  const isValid = !error

  return (
    <>
      <HeadlessUiModal.BorderedContent className="flex flex-col bg-dark-1000/40">
        {header}
        <div>
          <AssetInput
            title={''}
            value={withdrawValue}
            currency={assetToken}
            onChange={(val) => setWithdrawValue(val || '')}
            headerRight={
              <AssetInput.WalletSwitch
                onChange={() => setUseCoffin(!useCoffin)}
                checked={useCoffin}
                id="switch-spend-from-wallet-a"
              />
            }
            spendFromWallet={useCoffin}
            id="add-liquidity-input-tokenb"
          />
        </div>
      </HeadlessUiModal.BorderedContent>

      {approveUnderworldFallback && (
        <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 border !border-red/40 bg-dark-1000/40">
          <Typography variant="sm">
            {i18n._(
              t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click again and the fallback method will be used`
            )}
          </Typography>
        </HeadlessUiModal.BorderedContent>
      )}

      {!amountAvailable?.eq(0) && (
        <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 border !border-blue/40 bg-dark-1000/40">
          <Typography variant="sm">
            {i18n._(t`If your asset is staked, you cannot withdraw your lent tokens. You must unstake first.`)}
          </Typography>
        </HeadlessUiModal.BorderedContent>
      )}

      {!account ? (
        <Web3Connect />
      ) : isValid &&
        !underworldPermit &&
        (underworldApprovalState === CoffinApprovalState.NOT_APPROVED ||
          underworldApprovalState === CoffinApprovalState.PENDING) ? (
        <Button
        className="w-full"
        loading={underworldApprovalState === CoffinApprovalState.PENDING}
          onClick={onApproveUnderworld}
          disabled={underworldApprovalState !== CoffinApprovalState.NOT_APPROVED}
        >
          {i18n._(t`Approve Underworld`)}
        </Button>
      ) : (
        <Button
        className="w-full"
        color={!isValid && !!parsedWithdrawValue ? 'red' : 'blue'}
          onClick={() => onCook(pair, onWithdraw)}
          disabled={!isValid}
        >
          {error || i18n._(t`Confirm Withdraw`)}
        </Button>
      )}
    </>
  )
}

export default UnderworldWithdraw