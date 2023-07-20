import ReactGA from 'react-ga'
import Image from 'next/image'
import ArrowRoundedSquare from 'assets/svg/icons/ArrowRoundedSquare.svg'
import { ChainId, Currency, JSBI, NATIVE, SOUL_ADDRESS, Token, Trade as V2Trade, TradeType, USDC_ADDRESS, WNATIVE } from 'sdk'
import { Button } from 'components/Button'
import Typography from 'components/Typography'
import ConfirmSwapModal from 'features/swap/ConfirmSwapModal'
import SwapDetails from 'features/swap/SwapDetails'
import UnsupportedCurrencyFooter from 'features/swap/UnsupportedCurrencyFooter'
import SwapAssetPanel from 'features/trident/swap/SwapAssetPanel'
import ConfirmPriceImpactWithoutFee from 'functions/prices'
import { warningSeverity } from 'functions/prices'
import { computeFiatValuePriceImpact } from 'functions/trade'
import { useAllTokens, useCurrency } from 'hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import useIsArgentWallet from 'hooks/useIsArgentWallet'
import { useIsSwapUnsupported } from 'hooks/useIsSwapUnsupported'
import { useSwapCallback } from 'hooks/useSwapCallback'
import { useUSDCValue } from 'hooks/useUSDCPrice'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { SwapLayout } from 'layouts/SwapLayout'
import TokenWarningModal from 'modals/TokenWarningModal'
import { useActiveWeb3React } from 'services/web3'
import { Field } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import { useUserOpenMev, useUserSingleHopOnly } from 'state/user/hooks'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { getChainColor, getChainColorCode, getChainLogoURL } from 'constants/chains'
import { classNames } from 'functions/styling'
import NavLink from 'components/NavLink'
import { featureEnabled } from 'functions/feature'
import { Feature } from 'enums/Feature'
import { useRouter } from 'next/router'
import SwapDropdown from 'features/swap/SwapDropdown'
import TokenChart from 'pages/analytics/tokens/embedded/[id]'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import { currencyId } from 'functions'
import { NextSeo } from 'next-seo'

// import { FollowBanner } from 'components/Banner'

const Exchange = () => {
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { account, chainId } = useActiveWeb3React()
  const defaultTokens = useAllTokens()
  const { independentField, typedValue, recipient } = useSwapState()
  const { v2Trade, parsedAmount, currencies, inputError: swapInputError, allowedSlippage, to } = useDerivedSwapInfo()
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]

  const [switched, setSwitched] = useState(false)

  const DEFAULT_CURRENCY_A = NATIVE[chainId].symbol
  const DEFAULT_CURRENCY_B = [ChainId.ETHEREUM, ChainId.FANTOM, ChainId.AVALANCHE].includes(chainId) ? SOUL_ADDRESS[chainId] : USDC_ADDRESS[chainId]
  const router = useRouter()
  const tokens = router.query.tokens
  const [currencyIdA, currencyIdB] = (tokens as string[]) || [DEFAULT_CURRENCY_A, DEFAULT_CURRENCY_B]
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]

  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c?.isToken ?? false) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  const [showChart, setShowChart] = useState(true)
  const [showPortfolio, setShowPortfolio] = useState(false)
  const inputWrapped = currencies[Field.INPUT] == WNATIVE[chainId]
  const inputNative = currencies[Field.INPUT] == NATIVE[chainId]
  const outputWrapped = currencies[Field.OUTPUT] == WNATIVE[chainId]
  const outputNative = currencies[Field.OUTPUT] == NATIVE[chainId]

  const isWrapped =
    // ONE IS NATIVE
    (inputNative || outputNative)
    &&
    // ANOTHER IS WRAPPED_NATIVE
    (inputWrapped || outputWrapped)

  const inputCurrency = inputNative ? WNATIVE[chainId] : currencies[Field.INPUT]
  const outputCurrency = outputNative ? WNATIVE[chainId] : currencies[Field.OUTPUT]
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
  // const { address: recipientAddress } = useENSAddress(recipient ? recipient : account)

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
  // const WHITE = '#FFFFFF'

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
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const userHasSpecifiedInputOutput = Boolean(
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
    null,
    useOpenMev
  )

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return
    }
    if (priceImpact && !ConfirmPriceImpactWithoutFee(priceImpact)) {
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
          action: account,
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
            singleHopOnly ? 'SH' : 'MH',
          ].join('/'),
        })

        ReactGA.event({
          category: 'Routing',
          action: singleHopOnly ? 'Multihop Disabled' : 'Multihop Enabled',
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
      (approvalSubmitted && approvalState === ApprovalState.APPROVED)) 
      // && !(priceImpactSeverity > 3)

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
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
    },
    [onCurrencySelection]
  )

  const handleSwitchTokens = useCallback(
    (inputCurrency: Currency, outputCurrency: Currency) => {
      handleInputSelect(outputCurrency)
      handleOutputSelect(inputCurrency)
      switched && setSwitched(false)
    },
    [onCurrencySelection, setSwitched]
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

  // HANDLERS //
  // const handleLimitSwap = useCallback(
  //   () => {
  //     router.push(`/exchange/swap/limit/${currencyIdA}/${currencyIdB}`
  //   }, []
  // )

  const handleAggregatorSwap = useCallback(
    () => {
      router.push(`/exchange/aggregator/${inputCurrency ? currencyId(inputCurrency) : NATIVE[chainId].symbol}/${outputCurrency ? currencyId(outputCurrency) : USDC_ADDRESS[chainId]}`)
    }, []
  )

  // AGGREGATOR CONSTANTS [END] //

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

//   const UP_DOWN_ICON = <UpDownArrowIcon
//   fillPrimary={switched ? WHITE : getChainColor(chainId)}
//   fillSecondary={switched ? getChainColor(chainId) : WHITE}
//   className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-2xl w-7 h-7` : `hidden`}
// />

  return (
    <>
      <NextSeo title={`Swap | SoulSwap`} />
      <ConfirmSwapModal
        isOpen={showConfirm}
        trade={trade}
        originalTrade={tradeToConfirm}
        onAcceptChanges={handleAcceptChanges}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        recipient={recipient}
        toChain={chainId}
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
      {![ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) &&
        <div className="flex flex-col gap-3 mt-12 justify-center">
          <SwapDropdown inputCurrency={currencyA} outputCurrency={currencyB} />
            <NavLink href={"/aggregator"}>
            <Button
            variant="outlined"
            color={`purple`}
            size="lg"
          >
          <a className="block text-white p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span>{'SoulSwap Exchange'}</span>
            <br />
            <span>{'Click Here to use our Meta-Aggregator'}</span>
          </a>
              </Button>
            </NavLink>
        </div>}

      {[ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) &&
        <DoubleGlowShadowV2>
          
          <div className={`grid p-1 mt-4 space-y-2 rounded-2xl bg-dark-1000`}>
          {/* <FollowBanner /> */}

            {/* <SwapLayoutCard> */}
            {/* <div
              className={`flex m-6 border-4 p-4 border-dark-800 rounded-2xl`}
            >
              <Image src={SWAP_BANNER}
                height={180}
                width={720}
                alt={'swap banner'}
              />
          </div> */}
            {/* <div className="p-4 px-2 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}> */}
            {/* <div className={`my-2 border-2 border-[${getChainColor(chainId)}]`} /> */}
            <>
            {/* <div className={`my-12`} /> */}
            <SwapDropdown 
              inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]}
              />
            <div className={`my-12`} />
              {/* <div className={`my-2 border-2 border-[${getChainColor(chainId)}]`} /> */}
              {/* {useSwap && */}
              <SwapAssetPanel
                spendFromWallet={true}
                chainId={chainId}
                header={(props) => (
                  <SwapAssetPanel.Header
                    {...props}
                    label={
                      independentField === Field.OUTPUT && !showWrap
                        ? `Swap from:`
                        : `Swap from:`
                    }
                  />
                )}
                currency={currencies[Field.INPUT]}
                value={formattedAmounts[Field.INPUT]}
                onChange={handleTypeInput}
                onSelect={handleInputSelect}
              />
              {/* } */}
            </>
            {/* } */}
            {/* {useSwap && */}
            <div className="flex -mt-4 -mb-4 z-0 justify-center">
              <Button
                size={'xs'}
                // className={classNames(`mx-[42%] rounded-2xl bg-dark-1000 border-2 border-[${getChainColor(chainId)}]`}
                className={classNames(`-mb-4 -mt-4 rounded-2xl bg-dark-1000 border-2 border-[${getChainColor(chainId)}]`)}
                onClick={() =>
                  handleSwitchTokens(currencies?.INPUT, currencies?.OUTPUT)
                }
              >
                <Image
                  alt={"arrow rounded square"}
                  width={18}
                  height={18}
                  className={`rounded-xl`}
                  src={ArrowRoundedSquare}
                />
              </Button>
              {/* <Button
                size={'xs'}
                className={classNames(`rounded-xl bg-dark-1000 border-2 border-[${getChainColor(chainId)}]`}
                // onClick={handleLimitSwap}
              >
                <Image
                  alt={"Chevron Up Down Icon"}
                  width={18}
                  height={18}
                  className={`rounded-xl`}
                  src={ChevronUpDown}
                />
              </Button> */}
            </div>
            {/* } */}
            {/* TO ASSET PANEL */}
            {/* {useSwap && */}
            <SwapAssetPanel
              spendFromWallet={true}
              chainId={chainId}
              header={(props) => (
                <SwapAssetPanel.Header
                  {...props}
                  label={independentField === Field.INPUT && !showWrap ? `Swap to:` : `Swap to:`}
                />
              )}
              currency={currencies[Field.OUTPUT]}
              value={formattedAmounts[Field.OUTPUT]}
              onChange={handleTypeOutput}
              onSelect={
                handleOutputSelect
              }
              priceImpact={priceImpact}
              priceImpactCss={priceImpactCss}
            />
            {/* } */}
            {Boolean(trade) && // useSwap &&
              (
                <SwapDetails
                  inputCurrency={currencies[Field.INPUT]}
                  outputCurrency={currencies[Field.OUTPUT]}
                  trade={trade}
                  recipient={recipient ?? undefined}
                />
              )}
            {trade && routeNotFound && userHasSpecifiedInputOutput // && useSwap 
              &&
              (
                <Typography variant="xs" className="text-center py-2">
                  {`Insufficient liquidity for this trade.`}{' '}
                  {singleHopOnly && `Try enabling multi-hop trades`}
                </Typography>
              )}

            {swapIsUnsupported // && useSwap
              ? (
                <Button
                  color="red"
                  disabled
                  className="rounded-2xl w-full md:rounded">
                  {`Unsupported Asset`}
                </Button>
              ) : !account // && useSwap 
                ? (
                  // <Web3Connect color="purple" variant="filled" className="rounded-2xl md:rounded" />
                  <Button 
                  size="lg" color="avaxRed" className="w-full" 
                  disabled
                >
                  { `Connect Wallet` }
                </Button>
                ) : showWrap // && useSwap 
                  ? (
                    <Button
                      color={`${getChainColorCode(chainId)}`}
                      disabled={Boolean(wrapInputError)}
                      onClick={onWrap}
                      className="rounded-2xl w-full md:rounded"
                    >
                      {wrapInputError ??
                        (wrapType === WrapType.WRAP
                          ? `Wrap`
                          : wrapType === WrapType.UNWRAP
                            ? `Unwrap`
                            : null)}
                    </Button>
                  ) : showApproveFlow // && useSwap
                    ? (
                      <div>
                        {approvalState !== ApprovalState.APPROVED &&
                          (
                            <Button
                              color={`${getChainColorCode(chainId)}`}
                              loading={approvalState === ApprovalState.PENDING}
                              onClick={handleApprove}
                              disabled={approvalState !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                              className="rounded-2xl w-full md:rounded"
                            >
                              { `Approve ${currencies[Field.INPUT]?.symbol}` }
                            </Button>
                          )}
                        {approvalState === ApprovalState.APPROVED
                          // && useSwap 
                          &&
                          (
                            <Button
                              color={isValid && priceImpactSeverity > 2 ? 'red' : `${getChainColorCode(chainId)}`
                              }
                              onClick={() => {
                                setSwapState({
                                  tradeToConfirm: trade,
                                  attemptingTxn: false,
                                  swapErrorMessage: undefined,
                                  showConfirm: true,
                                  txHash: undefined,
                                })
                              }
                              }
                              id="swap-button"
                              disabled={
                                !isValid || approvalState !== ApprovalState.APPROVED 
                                // || (priceImpactSeverity > 3)
                              }
                              className="rounded-2xl w-full md:rounded"
                            >
                              {priceImpactSeverity > 3
                                ? `Price Impact High`
                                : priceImpactSeverity > 2
                                  ? `Swap Anyway`
                                  : `Swap`}
                            </Button>
                          )}
                      </div>
                    ) : (
                      // useSwap &&
                      <Button
                        color={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'red' : `${getChainColorCode(chainId)}`}
                        onClick={() => {
                          setSwapState({
                            tradeToConfirm: trade,
                            attemptingTxn: false,
                            swapErrorMessage: undefined,
                            showConfirm: true,
                            txHash: undefined,
                          })
                        }
                        }
                        id="swap-button"
                        disabled={!isValid || (priceImpactSeverity > 3) || !!swapCallbackError}
                        className={classNames(isValid && priceImpactSeverity > 2 ? 'hidden' : "rounded-2xl w-full md:rounded")}
                      >
                        {swapInputError
                          ? swapInputError
                          : priceImpactSeverity > 2
                            ? `Swap Anyway`
                            : `Swap`}
                      </Button>
                    )}
            {
              // useSwap && 
              priceImpactSeverity >= 3 && isValid &&
              <Button
                color={`${getChainColorCode(chainId)}`}
                onClick={handleAggregatorSwap}
                id="use-aggregator-button"
                // disabled={}
                className="rounded-2xl w-full md:rounded"
              >
                {'Use Aggregator'}
              </Button>
            }
            {swapIsUnsupported ? <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} show={false} /> : null}
            <div className={classNames(featureEnabled(Feature.AGGREGATE, chainId) ? "m-1 flex justify-between" : "hidden")}>
              <div className={classNames(
                `flex flex-cols-2 gap-3 text-white justify-end`
              )}>

              </div>
            </div>
            {/* <div className={`flex flex-cols-${showChart ? `hidden` : `1`}`}> */}
              {showChart && !showPortfolio &&
                // useSwap && 
                [ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) &&
                // <div className={`xl:max-w-7xl mt-0 w-full lg:grid-cols-1 order-last space-y-0 lg:space-x-4 lg:space-y-0 bg-dark-900`}>
                  <div className={`w-full flex flex-col order-last sm:mb-0 lg:mt-0 p-0 rounded-lg bg-light-glass`}>
                    {/* <Analytics inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]} /> */}
                  {featureEnabled(Feature.ANALYTICS, chainId) &&
                    !isWrapped && 
                    <TokenChart
                      outputCurrency={outputCurrency}
                    />
                    // <Pair
                    //   // isWrapped={isWrapped}
                    //   inputCurrency={inputCurrency}
                    //   outputCurrency={outputCurrency}
                    // />
                  }
                  </div>
                // </div>
              }
            {/* {(!showChart && !showChart) &&
            <SocialWidget />
          } */}
          {/* </div> */}
          </div>
        </DoubleGlowShadowV2>
      }
    </>
  )
}

Exchange.Layout = SwapLayout('swap-page')
export default Exchange