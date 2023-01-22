import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { AutoRow, RowBetween } from 'components/Row'
import { Button, ButtonError } from 'components/Button'
import { Currency, CurrencyAmount, Percent, WNATIVE, NATIVE, currencyEquals } from 'sdk'
import { ZERO_PERCENT } from '../../../constants'
import React, { useCallback, useState } from 'react'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'modals/TransactionConfirmationModal'
import { calculateGasMargin, calculateSlippageAmount } from 'functions/trade'
import { currencyId, halfAmountSpend, maxAmountSpend } from 'functions/currency'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from 'state/mint/hooks'
import { useUserSlippageToleranceWithDefault } from 'state/user/hooks'
import SwapDropdown from "features/swap/SwapDropdown"

import { AutoColumn } from 'components/Column'
import { BigNumber } from '@ethersproject/bignumber'
import { ConfirmAddModalBottom } from 'features/liquidity/ConfirmAddModalBottom'
import Dots from 'components/Dots'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import Container from 'components/Container'
// import CurrencyAssetInput from 'components/AssetInput'
// import CurrencyInputPanel from 'components/CurrencyInputPanel'
// import SwapHeader from 'features/swap/SwapHeader'
import { Field } from 'state/mint/actions'
import Head from 'next/head'
import LiquidityPrice from 'features/liquidity/LiquidityPrice'
import { MinimalPositionCard } from 'components/PositionCard'
import NavLink from 'components/NavLink'
import { PairState } from 'hooks/useV2Pairs'
// import { Plus } from 'react-feather'
import ReactGA from 'react-ga'
import { TransactionResponse } from '@ethersproject/providers'
import UnsupportedCurrencyFooter from 'features/swap/UnsupportedCurrencyFooter'
import Web3Connect from 'components/Web3Connect'
import { t } from '@lingui/macro'
import { useCurrency } from 'hooks/Tokens'
import { useIsSwapUnsupported } from 'hooks/useIsSwapUnsupported'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/router'
import { useRouterContract } from 'hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
// import { useWalletModalToggle } from 'state/application/hooks'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import { LiquidityHeader } from 'features/liquidity'
// import SwapBanner from 'components/SwapBanner'
import { useActiveWeb3React } from 'services/web3'
// import AssetInput from 'components/AssetInput'
import SwapAssetPanel from 'features/trident/swap/SwapAssetPanel'
import { ArrowDownIcon, PlusIcon } from '@heroicons/react/24/solid'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { SwapLayoutCard } from 'layouts/SwapLayout'
// import { SubmitButton } from 'features/summoner/Styles'
// import SoulLogo from 'components/SoulLogo'
import { VoteBanner } from 'components/Banner'

import Image from 'next/image'
import ADD_BANNER from 'assets/branding/add-liquidity-banner.png'

const DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)

export default function Add() {
  const { i18n } = useLingui()
  const { account, chainId, library } = useActiveWeb3React()
  const router = useRouter()
  const tokens = router.query.tokens
  const [currencyIdA, currencyIdB] = (tokens as string[]) || [undefined, undefined]

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const oneCurrencyIsWETH = Boolean(
    chainId &&
    ((currencyA && currencyEquals(currencyA, WNATIVE[chainId])) ||
      (currencyB && currencyEquals(currencyB, WNATIVE[chainId])))
  )

  // const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings

  // const [allowedSlippage] = useUserSlippageTolerance(); // custom from users

  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_ADD_V2_SLIPPAGE_TOLERANCE) // custom from users

  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {}
  )

  // get the max amounts user can add
  const halfAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: halfAmountSpend(currencyBalances[field]),
      }
    },
    {}
  )

  const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      }
    },
    {}
  )

  const routerContract = useRouterContract()

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], routerContract?.address)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], routerContract?.address)

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    if (!chainId || !library || !account || !routerContract) return

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts

    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0],
    }

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null
    if (currencyA.isNative || currencyB.isNative) {
      const tokenBIsETH = currencyB.isNative
      estimate = routerContract.estimateGas.addLiquidityETH
      method = routerContract.addLiquidityETH
      args = [
        (tokenBIsETH ? currencyA : currencyB)?.wrapped?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).quotient.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString(),
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).quotient.toString())
    } else {
      estimate = routerContract.estimateGas.addLiquidity
      method = routerContract.addLiquidity
      args = [
        currencyA?.wrapped?.address ?? '',
        currencyB?.wrapped?.address ?? '',
        parsedAmountA.quotient.toString(),
        parsedAmountB.quotient.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString(),
      ]
      value = null
    }

    setAttemptingTxn(true)
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) => {
        return method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: i18n._(
              t`Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${currencies[Field.CURRENCY_A]?.symbol
                } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`
            ),
          })

          setTxHash(response.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Add',
            label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/'),
          })
        })
      })
      .catch((error) => {
        //fallback
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: '1000000',
        })
          .then((response) => {
            setAttemptingTxn(false)

            addTransaction(response, {
              summary: i18n._(
                t`Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${currencies[Field.CURRENCY_A]?.symbol
                  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`
              ),
            })

            setTxHash(response.hash)

            ReactGA.event({
              category: 'Liquidity',
              action: 'Add',
              label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/'),
            })
          })
          .catch((e) => {
            setAttemptingTxn(false)

            // we only care if the error is something _other_ than the user rejected the tx
            if (e?.code !== 4001) {
              console.error(e)
            }
          })

        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

  const modalHeader = () => {
    return noLiquidity ? (
      <div className="pb-4">
        <div className="flex items-center justify-start gap-3">
          <div className="text-2xl font-bold text-high-emphesis">
            {currencies[Field.CURRENCY_A]?.symbol + '/' + currencies[Field.CURRENCY_B]?.symbol}
          </div>
          <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} size={48} />
        </div>
      </div>
    ) : (
      <div className="pb-4">
        <div className="flex items-center justify-start gap-3">
          <div className="text-xl font-bold md:text-3xl text-high-emphesis">{liquidityMinted?.toSignificant(6)}</div>
          <div className="grid grid-flow-col gap-2">
            <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} size={48} />
          </div>
        </div>
        <div className="text-lg font-medium md:text-2xl text-high-emphesis">
          {currencies[Field.CURRENCY_A]?.symbol}/{currencies[Field.CURRENCY_B]?.symbol}
          &nbsp;{i18n._(t`Pool Tokens`)}
        </div>
        <div className="pt-3 text-xs italic text-secondary">
          {i18n._(t`Output is estimated. If the price changes by more than ${allowedSlippage.toSignificant(
            4
          )}% your transaction
            will revert.`)}
        </div>
      </div>
    )
  }

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
      />
    )
  }

  const pendingText = i18n._(
    t`Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${currencies[Field.CURRENCY_A]?.symbol
      } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[Field.CURRENCY_B]?.symbol}`
  )

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA)
      if (newCurrencyIdA === currencyIdB) {
        router.push(`/exchange/add/${currencyIdB}/${currencyIdA}`)
      } else {
        router.push(`/exchange/add/${newCurrencyIdA}/${currencyIdB}`)
      }
    },
    [currencyIdB, router, currencyIdA]
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          router.push(`/exchange/add/${currencyIdB}/${newCurrencyIdB}`)
        } else {
          router.push(`/exchange/add/${newCurrencyIdB}`)
        }
      } else {
        router.push(`/exchange/add/${currencyIdA ? currencyIdA : NATIVE[chainId].symbol}/${newCurrencyIdB}`)
      }
    },
    [currencyIdA, router, currencyIdB]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  const addIsUnsupported = useIsSwapUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  return (
    <>
      <Head>
        <title>{i18n._(t`Add Liquidity`)} | Soul</title>
        <meta
          key="description"
          name="description"
          content="Add liquidity to the Soul AMM to enable gas optimised and low slippage trades across countless networks"
        />
      </Head>
      <Container id="add-liquidity-page" maxWidth="2xl" className="space-y-4 mt-4">
        <DoubleGlowShadowV2>
          <SwapLayoutCard>
            <VoteBanner />
            <div className={`w-full grid grid-cols-2 p-4 border border-2 rounded rounded-2xl border-purple`}>
          <div className={`flex justify-center bg-dark-800 mr-2 ml-2 rounded rounded-2xl w-5/6`}>
            <Image src={`/favicon.ico`}
              objectFit={`contain`}
              height={72}
              width={72}
              />
          </div>
            <Image src={ADD_BANNER}
              height={180}
              width={1080}
            />
            </div>
            <div className={`my-2 border border-2 border-[${getChainColor(chainId)}]`} />
            <SwapDropdown
              inputCurrency={currencies[Field.CURRENCY_A]}
              outputCurrency={currencies[Field.CURRENCY_B]}
            // allowedSlippage={allowedSlippage}
            />
            <div className={`my-2 border border-2 border-[${getChainColor(chainId)}]`} />

            <LiquidityHeader input={currencies[Field.CURRENCY_A]} output={currencies[Field.CURRENCY_B]} />
            <TransactionConfirmationModal
              isOpen={showConfirm}
              onDismiss={handleDismissConfirmation}
              attemptingTxn={attemptingTxn}
              hash={txHash}
              content={() => (
                <ConfirmationModalContent
                  title={noLiquidity ? i18n._(t`You are creating a pool`) : i18n._(t`Receive`)}
                  onDismiss={handleDismissConfirmation}
                  topContent={modalHeader}
                  bottomContent={modalBottom}
                />
              )}
              pendingText={pendingText}
            />
            <div className="flex flex-col gap-3 space-y-3">
              <SwapAssetPanel
                spendFromWallet={true}
                chainId={chainId}
                header={(props) => (
                  <SwapAssetPanel.Header
                    {...props}
                    label={
                      independentField === Field.CURRENCY_A ? i18n._(t`Swap from:`) : i18n._(t`Swap from:`)
                    }
                  />
                )}
                currency={currencies[Field.CURRENCY_A]}
                value={formattedAmounts[Field.CURRENCY_A]}
                onChange={onFieldAInput}
                onSelect={handleCurrencyASelect}
              />
              <div>
                <div className="flex justify-center -mt-8 -mb-4 z-0">
                  <div
                    role="button"
                    className={`p-1.5 rounded-full bg-dark-800 border shadow-md border-dark-700 hover:border-${getChainColorCode(chainId)}`}
                    onClick={() => {
                      // setApprovalSubmitted(false) // reset 2 step UI for approvals
                      // onSwitchTokens()
                    }}
                  >
                    {/* <ArrowDownIcon width={14} className="text-high-emphesis hover:text-white" /> */}
                    <PlusIcon width={14} className="text-high-emphesis hover:text-white" />
                  </div>
                </div>
                <SwapAssetPanel
                  spendFromWallet={true}
                  chainId={chainId}
                  header={(props) => (
                    <SwapAssetPanel.Header
                      {...props}
                      label={
                        independentField === Field.CURRENCY_B ? i18n._(t`Swap from:`) : i18n._(t`Swap from:`)
                      }
                    />
                  )}
                  currency={currencies[Field.CURRENCY_B]}
                  value={formattedAmounts[Field.CURRENCY_B]}
                  onChange={onFieldBInput}
                  onSelect={handleCurrencyBSelect}
                />
              </div>

              {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
                <div className="p-1 rounded bg-dark-800">
                  <LiquidityPrice
                    currencies={currencies}
                    price={price}
                    noLiquidity={noLiquidity}
                    poolTokenPercentage={poolTokenPercentage}
                    className="bg-dark-900"
                  />
                </div>
              )}

              {addIsUnsupported ? (
                <Button color="gradient" size="lg" disabled>
                  {i18n._(t`Unsupported Asset`)}
                </Button>
              ) : !account ? (
                <Web3Connect size="lg" color="gradient" className="w-full" />
              ) : !isValid ? (
                <Button size="lg" color="gray" className="w-full" disabled>
                  {i18n._(t`Enter Amount`)}
                </Button>
              ) : (
                (approvalA === ApprovalState.NOT_APPROVED ||
                  approvalA === ApprovalState.PENDING ||
                  approvalB === ApprovalState.NOT_APPROVED ||
                  approvalB === ApprovalState.PENDING ||
                  isValid) && (
                  <AutoColumn gap={'md'}>
                    {
                      <RowBetween>
                        {approvalA !== ApprovalState.APPROVED && (
                          <Button
                            color="gradient"
                            size="lg"
                            onClick={approveACallback}
                            disabled={approvalA === ApprovalState.PENDING}
                            style={{
                              width: approvalB !== ApprovalState.APPROVED ? '48%' : '100%',
                            }}
                          >
                            {approvalA === ApprovalState.PENDING ? (
                              <Dots>{i18n._(t`Approving`)}</Dots>
                            ) : (
                              i18n._(t`Approve ${currencies[Field.CURRENCY_A]?.symbol}`)
                            )}
                          </Button>
                        )}
                        {approvalB !== ApprovalState.APPROVED && (
                          <Button
                            color="gradient"
                            size="lg"
                            onClick={approveBCallback}
                            disabled={approvalB === ApprovalState.PENDING}
                            style={{
                              width: approvalA !== ApprovalState.APPROVED ? '48%' : '100%',
                            }}
                          >
                            {approvalB === ApprovalState.PENDING ? (
                              <Dots>{i18n._(t`Approving`)}</Dots>
                            ) : (
                              i18n._(t`Approve ${currencies[Field.CURRENCY_B]?.symbol}`)
                            )}
                          </Button>
                        )}
                      </RowBetween>
                    }

                    {approvalA === ApprovalState.APPROVED && approvalB === ApprovalState.APPROVED && (
                      <ButtonError
                        onClick={() => {
                          setShowConfirm(true)
                        }}
                        disabled={
                          !isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED
                        }
                        error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
                      >
                        {error ?? i18n._(t`Confirm Adding Liquidity`)}
                      </ButtonError>
                    )}
                  </AutoColumn>
                )
              )}
            </div>

            {!addIsUnsupported ? (
              pair && !noLiquidity && pairState !== PairState.INVALID ? (
                <MinimalPositionCard chainId={chainId} showUnwrapped={oneCurrencyIsWETH} pair={pair} />
              ) : null
            ) : (
              <UnsupportedCurrencyFooter
                show={addIsUnsupported}
                currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]}
              />
            )}
            {/* </div> */}
            <div className={"grid grid-cols-2 gap-2 text-white justify-center m-2"}>
              <NavLink href="/pool">
                <Button
                  variant={'filled'}
                  color={`${getChainColorCode(chainId)}`}
                  primaryColor={'black'}
                >
                  <a className={`text-white flex justify-center items-center space-x-2 font-medium text-center cursor-pointer text-base hover:text-high-emphesis`}>
                    <span>{i18n._(t`View Positions`)}</span>
                  </a>
                </Button>
              </NavLink>
              <NavLink href="/analytics">
                <Button
                  variant={'filled'}
                  color={`${getChainColorCode(chainId)}`}
                  primaryColor={'black'}
                >
                  <a className={`text-white flex justify-center items-center space-x-2 font-medium text-center cursor-pointer text-base hover:text-high-emphesis`}>
                    <span>{i18n._(t`View Analytics`)}</span>
                  </a>
                </Button>
              </NavLink>
            </div>
          </SwapLayoutCard>
        </DoubleGlowShadowV2>
      </Container>
    </>
  )
}
