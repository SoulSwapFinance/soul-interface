import { ArrowDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, JSBI, Token, Trade as V2Trade, TradeType } from 'sdk'
import { Button } from 'components/Button'
import RecipientField from 'components/RecipientField'
import Typography from 'components/Typography'
import Web3Connect from 'components/Web3Connect'
import ConfirmSwapModal from 'features/swap/ConfirmSwapModal'
import SwapCallbackError from 'features/swap/SwapCallbackError'
import SwapDetails from 'features/swap/SwapDetails'
import UnsupportedCurrencyFooter from 'features/swap/UnsupportedCurrencyFooter'
import SwapHeader from 'features/swap/SwapHeader'
import SwapAssetPanel from 'features/trident/swap/SwapAssetPanel'
import confirmPriceImpactWithoutFee from 'functions/prices'
import { warningSeverity } from 'functions/prices'
import { computeFiatValuePriceImpact } from 'functions/trade'
import { useAllTokens, useCurrency } from 'hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import useENSAddress from 'hooks/useENSAddress'
import useIsArgentWallet from 'hooks/useIsArgentWallet'
import { useIsSwapUnsupported } from 'hooks/useIsSwapUnsupported'
import { useSwapCallback } from 'hooks/useSwapCallback'
import { useUSDCValue } from 'hooks/useUSDCPrice'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { SwapLayout, SwapLayoutCard } from 'layouts/SwapLayout'
import TokenWarningModal from 'modals/TokenWarningModal'
import { useActiveWeb3React } from 'services/web3'
import { Field, setRecipient } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import { useExpertModeManager, useCrossChainModeManager, useUserOpenMev, useUserSingleHopOnly } from 'state/user/hooks'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactGA from 'react-ga'
import Chart from 'components/Chart'
import Cross from 'pages/exchange/cross'
// import NavLink from 'components/NavLink'
// import ExternalLink from 'components/ExternalLink'
import { Toggle } from 'components/Toggle'
// import Image from 'next/image'
// import styled from 'styled-components'
import SocialWidget from 'components/Social'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { classNames } from 'functions/styling'
import CrossChainMode from 'components/CrossChainMode'

const Swap = () => {
  const { i18n } = useLingui()
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { account, chainId } = useActiveWeb3React()
  const defaultTokens = useAllTokens()
  const [isExpertMode] = useExpertModeManager()
  const [isCrossChainMode] = useCrossChainModeManager()
  const { independentField, typedValue, recipient } = useSwapState()
  const { v2Trade, parsedAmount, currencies, inputError: swapInputError, allowedSlippage, to } = useDerivedSwapInfo()
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]

  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c?.isToken ?? false) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  const [showChart, setShowChart] = useState(false)
  // const [expertMode, openExpertMode] = useState(false)
  // const [showCrossChain, setShowCrossChain] = useState(false)
  // const [showCrosschain, openCrossChainMode] = useState(false)
  // const toggle = toggleExpertMode()

  // dismiss warning if all imported tokens are in active lists
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens)
    })

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENSAddress(recipient)

  const trade = showWrap ? undefined : v2Trade

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
          [Field.INPUT]: parsedAmount,
          [Field.OUTPUT]: parsedAmount,
        }
        : {
          [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
          [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
        },
    [independentField, parsedAmount, showWrap, trade]
  )

  const fiatValueInput = useUSDCValue(parsedAmounts[Field.INPUT])
  const fiatValueOutput = useUSDCValue(parsedAmounts[Field.OUTPUT])
  const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput)
  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()

  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: V2Trade<Currency, Currency, TradeType> | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? /* @ts-ignore TYPE NEEDS FIXING */
      parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const userHasSpecifiedInputOutput = Boolean(
    /* @ts-ignore TYPE NEEDS FIXING */
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )

  const routeNotFound = !trade?.route

  // check whether the user has approved the router on the input token
  const [approvalState, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  const signatureData = undefined

  const handleApprove = useCallback(async () => {
    await approveCallback()
  }, [approveCallback])

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])

  const [useOpenMev] = useUserOpenMev()

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    to,
    signatureData,
    /* @ts-ignore TYPE NEEDS FIXING */
    null,
    useOpenMev
  )

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return
    }
    if (priceImpact && !confirmPriceImpactWithoutFee(priceImpact)) {
      return
    }
    setSwapState({
      attemptingTxn: true,
      tradeToConfirm,
      showConfirm,
      swapErrorMessage: undefined,
      txHash: undefined,
    })
    swapCallback()
      .then((hash) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: undefined,
          txHash: hash,
        })

        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
                ? 'Swap w/o Send + recipient'
                : 'Swap w/ Send',
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
            singleHopOnly ? 'SH' : 'MH',
          ].join('/'),
        })

        ReactGA.event({
          category: 'Routing',
          action: singleHopOnly ? 'Swap with multihop disabled' : 'Swap with multihop enabled',
        })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [
    swapCallback,
    priceImpact,
    tradeToConfirm,
    showConfirm,
    recipient,
    recipientAddress,
    account,
    trade?.inputAmount?.currency?.symbol,
    trade?.outputAmount?.currency?.symbol,
    singleHopOnly,
  ])

  // warnings on slippage
  // const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);
  const priceImpactSeverity = useMemo(() => {
    const executionPriceImpact = trade?.priceImpact
    return warningSeverity(
      executionPriceImpact && priceImpact
        ? executionPriceImpact.greaterThan(priceImpact)
          ? executionPriceImpact
          : priceImpact
        : executionPriceImpact ?? priceImpact
    )
  }, [priceImpact, trade])

  const isArgentWallet = useIsArgentWallet()

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !isArgentWallet &&
    !swapInputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED)) &&
      !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({
      showConfirm: false,
      tradeToConfirm,
      attemptingTxn,
      swapErrorMessage,
      txHash,
    })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade,
      swapErrorMessage,
      txHash,
      attemptingTxn,
      showConfirm,
    })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  )

  const swapIsUnsupported = useIsSwapUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const priceImpactCss = useMemo(() => {
    switch (priceImpactSeverity) {
      case 0:
      case 1:
      case 2:
      default:
        return 'text-low-emphesis'
      case 3:
        return 'text-yellow'
      case 4:
        return 'text-red'
    }
  }, [priceImpactSeverity])

  return (
    <>
      {/* <NewFeature /> */}
      <ConfirmSwapModal
        isOpen={showConfirm}
        trade={trade}
        originalTrade={tradeToConfirm}
        onAcceptChanges={handleAcceptChanges}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        recipient={recipient}
        allowedSlippage={allowedSlippage}
        onConfirm={handleSwap}
        swapErrorMessage={swapErrorMessage}
        onDismiss={handleConfirmDismiss}
      />
      <TokenWarningModal
        isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokens={importTokensNotInDefault}
        onConfirm={handleConfirmTokenWarning}
      />
  
      <SwapLayoutCard>
        <div className="flex flex-col gap-3 justify-center">
          <SwapHeader inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]} />
        </div>
        { isCrossChainMode &&
          <Cross />
        }
        { !isCrossChainMode &&
          <SwapAssetPanel
            spendFromWallet={true}
            chainId={chainId}
            header={(props) => (
              <SwapAssetPanel.Header
                {...props}
                label={
                  independentField === Field.OUTPUT && !showWrap ? i18n._(t`Swap from:`) : i18n._(t`Swap from:`)
                }
              />
            )}
            currency={currencies[Field.INPUT]}
            value={formattedAmounts[Field.INPUT]}
            onChange={handleTypeInput}
            onSelect={handleInputSelect}
          />
        }
        <div className={!isCrossChainMode && classNames("flex justify-center -mt-6 -mb-6 z-0")}>
          <div
            role="button"
            className={classNames(!isCrossChainMode && `p-1.5 rounded-full bg-dark-800 border shadow-md border-dark-700 hover:border-${getChainColorCode(chainId)}`)}
            onClick={() => {
              setApprovalSubmitted(false) // reset 2 step UI for approvals
              onSwitchTokens()
            }}
          >
            {!isCrossChainMode && <ArrowDownIcon width={14} className="text-high-emphesis hover:text-white" />}
          </div>
        </div>

        {/* TO ASSET PANEL */}
        {!isCrossChainMode &&
          <SwapAssetPanel
            spendFromWallet={true}
            chainId={chainId}
            header={(props) => (
              <SwapAssetPanel.Header
                {...props}
                label={independentField === Field.INPUT && !showWrap ? i18n._(t`Swap to:`) : i18n._(t`Swap to:`)}
              />
            )}
            currency={currencies[Field.OUTPUT]}
            value={formattedAmounts[Field.OUTPUT]}
            onChange={handleTypeOutput}
            onSelect={handleOutputSelect}
            priceImpact={priceImpact}
            priceImpactCss={priceImpactCss}
          />
        }
        {isExpertMode && <RecipientField recipient={recipient} action={setRecipient} />}
        {Boolean(trade) && !isCrossChainMode && (
          <SwapDetails
            inputCurrency={currencies[Field.INPUT]}
            outputCurrency={currencies[Field.OUTPUT]}
            trade={trade}
            recipient={recipient ?? undefined}
          />
        )}

        {trade && routeNotFound && userHasSpecifiedInputOutput && !isCrossChainMode && (
          <Typography variant="xs" className="text-center py-2">
            {i18n._(t`Insufficient liquidity for this trade.`)}{' '}
            {singleHopOnly && i18n._(t`Try enabling multi-hop trades`)}
          </Typography>
        )}

        {swapIsUnsupported ? (
          <Button 
          color="red" 
          disabled 
          className="rounded-2xl w-full md:rounded">
            {i18n._(t`Unsupported Asset`)}
          </Button>
        ) : !account ? (
          <Web3Connect color="purple" variant="filled" className="rounded-2xl md:rounded" />
        ) : showWrap ? (
          <Button
            color={`${getChainColorCode(chainId)}`}
            disabled={Boolean(wrapInputError)}
            onClick={onWrap}
            className="rounded-2xl w-full md:rounded"
          >
            {wrapInputError ??
              (wrapType === WrapType.WRAP
                ? i18n._(t`Wrap`)
                : wrapType === WrapType.UNWRAP
                  ? i18n._(t`Unwrap`)
                  : null)}
          </Button>
        ) : showApproveFlow && !isCrossChainMode ? (
          <div>
            {approvalState !== ApprovalState.APPROVED && (
              <Button
                color={`${getChainColorCode(chainId)}`}
                loading={approvalState === ApprovalState.PENDING}
                onClick={handleApprove}
                disabled={approvalState !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                className="rounded-2xl w-full md:rounded"
              >
                {i18n._(t`Approve ${currencies[Field.INPUT]?.symbol}`)}
              </Button>
            )}
            {approvalState === ApprovalState.APPROVED && !isCrossChainMode && (
              <Button
                color={isValid && priceImpactSeverity > 2 ? 'red' : `${getChainColorCode(chainId)}`
                }
                onClick={() => {
                  if (isExpertMode) {
                    handleSwap()
                  } else {
                    setSwapState({
                      tradeToConfirm: trade,
                      attemptingTxn: false,
                      swapErrorMessage: undefined,
                      showConfirm: true,
                      txHash: undefined,
                    })
                    }
                  }}
                id="swap-button"
                disabled={
                  !isValid || approvalState !== ApprovalState.APPROVED || (priceImpactSeverity > 3)
                }
                className="rounded-2xl w-full md:rounded"
              >
                  {priceImpactSeverity > 3 && !isExpertMode
                  ? i18n._(t`Price Impact High`)
                  : priceImpactSeverity > 2
                    ? i18n._(t`Swap Anyway`)
                    : i18n._(t`Swap`)}
              </Button>
            )}
          </div>
        ) : (!isCrossChainMode &&
          <Button
            color={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'red' : `${getChainColorCode(chainId)}`}
            onClick={() => {
              if (isExpertMode) {
                handleSwap()
              } else {
                setSwapState({
                  tradeToConfirm: trade,
                  attemptingTxn: false,
                  swapErrorMessage: undefined,
                  showConfirm: true,
                  txHash: undefined,
                })
              }
            }}
            id="swap-button"
            disabled={!isValid || (priceImpactSeverity > 3) || !!swapCallbackError}
            className="rounded-2xl w-full md:rounded"
          >
            {swapInputError
              ? swapInputError
              : priceImpactSeverity > 3
                ? i18n._(t`Price Impact Too High`)
                : priceImpactSeverity > 2
                  ? i18n._(t`Swap Anyway`)
                  : i18n._(t`Swap`)}
          </Button>
        )}
          {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
        {swapIsUnsupported ? <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} show={false} /> : null}
        {/* </div> */}
        {/* <div className="flex border-dark-900 mt-3 mb-0 gap-1 items-center justify-center">
                <Button variant="filled" color="gradientPurpleBlue" size="lg">
                  <NavLink href={"/portfolio"}>
                        <a className="block text-white p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                        <span>View Portfolio</span>
                        </a>
                  </NavLink>
                </Button>
                <Button variant="filled" color="gradientBluePurple" size="lg">
                  <ExternalLink href={'https://cross.soulswap.finance'}>
                        <a className="block text-white p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                        <span>Swap Crosschain</span>
                        </a>
                  </ExternalLink>
                </Button>
              </div> */}
        { <div className={classNames(`flex flex-cols-2 gap-3 text-white justify-end`)}>
          <Toggle
            id="toggle-button"
            optionA="Chart"
            optionB="Chart"
            isActive={showChart}
            toggle={
              showChart
                ? () => {
                  setShowChart(false)
                }
                : () => {
                  setShowChart(true)
                }
            }
          />
        </div>
        }
        {!showChart &&
          <>
            <div className="flex mt-3" /><SocialWidget />
          </>
        }
        {
        showChart && 
          !isCrossChainMode &&
            chainId==250 &&
          <div className={`xl:max-w-7xl mt-0 w-full lg:grid-cols-1 order-last space-y-0 lg:space-x-4 lg:space-y-0 bg-dark-900`}>
            <div className={`w-full flex flex-col order-last sm:mb-0 lg:mt-0 p-0 rounded rounded-lg bg-light-glass`}>
              <Chart inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]} />
            </div>
          </div>
        }
      </SwapLayoutCard>
    </>
  )
}

Swap.Layout = SwapLayout('swap-page')
export default Swap