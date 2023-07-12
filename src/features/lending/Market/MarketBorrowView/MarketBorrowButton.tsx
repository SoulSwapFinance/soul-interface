import { Signature } from '@ethersproject/bytes'
import { CurrencyAmount, JSBI, UNDERWORLD_ADDRESS, Percent, ZERO } from 'sdk'
import { Button } from 'components/Button'
import Typography from 'components/Typography'
import { Warning, Warnings } from 'entities/Warnings'
import {
  BorrowExecutePayload,
  MarketBorrowReviewModal,
  MarketView,
  useMarket,
} from 'features/lending/Market'
import TridentApproveGate from 'features/trident/TridentApproveGate'
import { useCoffinBoxContract } from 'hooks'
import { useCoffinOrWalletBalance } from 'hooks/useCoffinOrWalletBalance'
import { useActiveWeb3React } from 'services/web3'
import React, { FC, ReactNode, useState } from 'react'

export interface MarketBorrowButtonProps extends Omit<BorrowExecutePayload, 'permit' | 'trade'> {
  view: MarketView
  priceImpact?: Percent
  nextMaxBorrowMinimum: JSBI
  nextMaxBorrowSafe: JSBI
  nextMaxBorrowPossible: JSBI
}

export const MarketBorrowButton: FC<MarketBorrowButtonProps> = ({
  receiveInWallet,
  leveraged,
  borrowAmount,
  spendFromWallet,
  collateralAmount,
  view,
  priceImpact,
  nextMaxBorrowMinimum,
  nextMaxBorrowSafe,
  nextMaxBorrowPossible,
}) => {
  const { account } = useActiveWeb3React()
  const { market } = useMarket()
  const { chainId } = useActiveWeb3React()
  const balance = useCoffinOrWalletBalance(
    chainId,
    account ?? undefined,
    market.collateral.token,
    spendFromWallet
  )
  const [permit, setPermit] = useState<Signature>()
  const [permitError, setPermitError] = useState<boolean>()
  const coffinboxContract = useCoffinBoxContract()
  const masterContractAddress = chainId ? UNDERWORLD_ADDRESS[chainId] : undefined
  const [open, setOpen] = useState(false)

  const totalAvailableToBorrow = borrowAmount
    ? CurrencyAmount.fromRawAmount(borrowAmount.currency, market.totalAssetAmount)
    : undefined

  const error = !account
    ? `Connect Wallet`
    : !collateralAmount?.greaterThan(ZERO) && !borrowAmount?.greaterThan(ZERO)
    ? `Enter an amount`
    : !balance
    ? `Loading balance`
    : collateralAmount?.greaterThan(balance)
    ? `Insufficient balance`
    : totalAvailableToBorrow && borrowAmount && borrowAmount.greaterThan(totalAvailableToBorrow)
    ? `Not enough ${borrowAmount.currency.symbol} available`
    : ''

  const buttonText = error
    ? error
    : borrowAmount?.greaterThan(ZERO) && collateralAmount?.greaterThan(ZERO)
    ? `Deposit and Borrow`
    : borrowAmount?.greaterThan(ZERO)
    ? `Borrow Asset`
    : collateralAmount?.greaterThan(ZERO)
    ? `Deposit Collateral`
    : ''

  const borrowWarnings = new Warnings()
    .add(
      JSBI.lessThan(nextMaxBorrowMinimum, market.currentUserBorrowAmount),
      'You have surpassed your borrow limit and may be liquidated at any moment. Repay now or add collateral!',
      true,
      new Warning(
        JSBI.lessThan(nextMaxBorrowSafe, ZERO),
        'You have surpassed your borrow limit and assets are at a high risk of liquidation.',
        true,
        new Warning(
          JSBI.greaterThan(
            borrowAmount?.quotient || ZERO,
            JSBI.subtract(nextMaxBorrowMinimum, market.currentUserBorrowAmount)
          ),
          "You don't have enough collateral to borrow this amount.",
          true,
          new Warning(
            JSBI.greaterThan(borrowAmount?.quotient || ZERO, nextMaxBorrowSafe),
            'You will surpass your borrow limit and assets will be at a high risk of liquidation.',
            false
          )
        )
      )
    )
    .add(
      JSBI.lessThan(market.maxAssetAvailable, borrowAmount?.quotient || ZERO),
      'Not enough liquidity in this pair.',
      true
    )

  return (
    <>
      {borrowWarnings.reduce<ReactNode[]>((acc, cur, index) => {
        if (cur)
          acc.push(
            <Typography
              variant="sm"
              className="p-4 text-center border rounded border-yellow/40 text-yellow"
              key={index}
            >
              {cur.message}
            </Typography>
          )
        return acc
      }, [])}
      {permitError && (
        <Typography variant="sm" className="p-4 text-center border rounded border-yellow/40 text-yellow">
          {`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click 'Approve CoffinBox' again for approving using the fallback method`}
        </Typography>
      )}
      <TridentApproveGate
        //   chainId={chainId}
        // spendFromWallet={spendFromWallet}
        inputAmounts={[collateralAmount]}
        tokenApproveOn={coffinboxContract?.address}
        masterContractAddress={masterContractAddress}
        withPermit={true}
        permit={permit}
        onPermit={setPermit}
        onPermitError={() => setPermitError(true)}
      >
        {({ approved, loading }) => {
          const disabled = !!error || !approved || loading || borrowWarnings.some((warning) => warning.breaking)
          return (
            <Button
              loading={loading}
              color={borrowAmount?.equalTo(ZERO) ? 'blue' : 'gradient'}
              disabled={disabled}
              onClick={() => setOpen(true)}
              className="rounded-2xl md:rounded"
            >
              {buttonText}
            </Button>
          )
        }}
      </TridentApproveGate>
      <MarketBorrowReviewModal
        open={open}
        permit={permit}
        onDismiss={() => setOpen(false)}
        spendFromWallet={spendFromWallet}
        receiveInWallet={receiveInWallet}
        leveraged={leveraged}
        collateralAmount={collateralAmount}
        borrowAmount={borrowAmount}
        view={view}
        priceImpact={priceImpact}
      />
    </>
  )
}