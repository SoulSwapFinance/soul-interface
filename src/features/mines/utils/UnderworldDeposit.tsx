import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { COFFIN_BOX_ADDRESS, CurrencyAmount, WNATIVE } from 'sdk'
import AssetInput from 'components/AssetInput'
import { Button } from 'components/Button'
import { HeadlessUiModal } from 'components/Modal'
import Typography from 'components/Typography'
import Web3Connect from 'components/Web3Connect'
import { UnderworldCooker } from 'entities'
import { ZERO } from 'functions/math'
import { tryParseAmount } from 'functions/parse'
import { useCurrency } from 'hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useUnderworldApproveCallback, { CoffinApprovalState } from 'hooks/useUnderworldApproveCallback'
import { useActiveWeb3React } from 'services/web3'
import { useETHBalances } from 'state/wallet/hooks'
import React, { useCallback, useState } from 'react'

// @ts-ignore TYPE NEEDS FIXING
const UnderworldDeposit = ({ pair, header }) => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const [useCoffin, setUseCoffin] = useState<boolean>(false)
  const assetToken = useCurrency(pair?.asset.address) || undefined
  const [depositValue, setDepositValue] = useState('')
  const assetNative = WNATIVE[chainId || 250].address === pair?.asset.address
  // @ts-ignore TYPE NEEDS FIXING
  const ethBalance = useETHBalances(assetNative ? [account ?? undefined] : [])

  const balanceAmount = useCoffin
    ? pair?.asset.coffinBalance
    : assetNative
    ? account
      ? // @ts-ignore TYPE NEEDS FIXING
        BigNumber.from(ethBalance[account]?.quotient.toString() || 0)
      : undefined
    : pair?.asset.balance

  const balance =
    assetToken &&
    balanceAmount &&
    // @ts-ignore TYPE NEEDS FIXING
    CurrencyAmount.fromRawAmount(assetNative ? WNATIVE[chainId || 250] : assetToken, balanceAmount)

  const parsedDepositValue = tryParseAmount(depositValue, assetToken)
  const [underworldApprovalState, approveUnderworldFallback, underworldPermit, onApproveUnderworld, onCook] = useUnderworldApproveCallback()
  const [tokenApprovalState, onApproveToken] = useApproveCallback(
    parsedDepositValue,
    chainId ? COFFIN_BOX_ADDRESS[chainId] : undefined
  )

  const onDeposit = useCallback(
    async (cooker: UnderworldCooker) => {
      if (pair?.currentExchangeRate.isZero()) {
        cooker.updateExchangeRate(false, ZERO, ZERO)
      }
      // @ts-ignore TYPE NEEDS FIXING
      cooker.addAsset(BigNumber.from(parsedDepositValue?.quotient.toString()), useCoffin)
      return `${i18n._(t`Deposit`)} ${pair?.asset.tokenInfo.symbol}`
    },
    [i18n, pair?.asset.tokenInfo.symbol, pair?.currentExchangeRate, parsedDepositValue?.quotient, useCoffin]
  )

  const error = !parsedDepositValue
    ? 'Enter an amount'
    : balance?.lessThan(parsedDepositValue)
    ? 'Insufficient balance'
    : undefined

  const isValid = !error

  return (
    <>
      <HeadlessUiModal.BorderedContent className="flex flex-col bg-dark-1000/40">
        {header}
        <AssetInput
          title={''}
          value={depositValue}
          currency={assetToken}
          onChange={(val) => setDepositValue(val || '')}
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
      {!account ? (
        <Web3Connect />
      ) : isValid &&
        !underworldPermit &&
        (underworldApprovalState === CoffinApprovalState.NOT_APPROVED ||
          underworldApprovalState === CoffinApprovalState.PENDING) ? (
        <Button
          loading={underworldApprovalState === CoffinApprovalState.PENDING}
          onClick={onApproveUnderworld}
          disabled={underworldApprovalState !== CoffinApprovalState.NOT_APPROVED}
        >
          {i18n._(t`Approve Underworld`)}
        </Button>
      ) : isValid &&
        !useCoffin &&
        (tokenApprovalState === ApprovalState.NOT_APPROVED || tokenApprovalState === ApprovalState.PENDING) ? (
        <Button
          loading={tokenApprovalState === ApprovalState.PENDING}
          onClick={onApproveToken}
          disabled={tokenApprovalState !== ApprovalState.NOT_APPROVED}
        >
          {`${i18n._(t`Approve`)} ${assetToken?.symbol}`}
        </Button>
      ) : (
        <Button
          onClick={() => onCook(pair, onDeposit)}
          disabled={!isValid}
          color={!isValid && !!parsedDepositValue ? 'red' : 'blue'}
        >
          {error || i18n._(t`Confirm Deposit`)}
        </Button>
      )}
    </>
  )
}

export default UnderworldDeposit