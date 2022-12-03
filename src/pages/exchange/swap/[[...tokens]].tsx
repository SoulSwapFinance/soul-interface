import { ArrowDownIcon, ChevronDoubleUpIcon } from '@heroicons/react/solid'
import ChevronUpDown from 'assets/svg/icons/ChevronUpDown.svg'
import ArrowRoundedSquare from 'assets/svg/icons/ArrowRoundedSquare.svg'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, Currency, DAI, JSBI, NATIVE, NATIVE_ADDRESS, SOUL, SOUL_ADDRESS, Token, Trade as V2Trade, TradeType, USDC, USDC_ADDRESS, WBTC_ADDRESS, WNATIVE_ADDRESS } from 'sdk'
import { Button } from 'components/Button'
import Typography from 'components/Typography'
import Web3Connect from 'components/Web3Connect'
import ConfirmSwapModal from 'features/swap/ConfirmSwapModal'
import { useMutation } from '@tanstack/react-query'
import { getAllChains, swap } from 'features/aggregator/router'
import SwapDetails from 'features/swap/SwapDetails'
import UnsupportedCurrencyFooter from 'features/swap/UnsupportedCurrencyFooter'
import SwapHeader from 'features/swap/SwapHeader'
import SwapAssetPanel from 'features/trident/swap/SwapAssetPanel'
import ConfirmPriceImpactWithoutFee from 'functions/prices'
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
import { Field } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import { useUserOpenMev, useUserSingleHopOnly } from 'state/user/hooks' // useCrossChainModeManager
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactGA from 'react-ga'
import Image from 'next/image'
import { Toggle } from 'components/Toggle'
import SocialWidget from 'components/Social'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { classNames } from 'functions/styling'
// import { NewFeature } from 'components/Banner'
import NavLink from 'components/NavLink'
// import Analytics from 'components/Analytics'
import { featureEnabled } from 'functions/feature'
import { Feature } from 'enums/Feature'
// import { currencyId } from 'functions/currency'
import { useRouter } from 'next/router'
import Aggregator, { startChain } from './aggregator'
// import Container from 'components/Container'
// import Route from 'components/SwapRoute'
// import Loader from 'features/aggregator/components/Loader'
import { useGasPrice } from 'hooks/useAPI'
import BigNumber from 'bignumber.js'
import useGetPrice from 'features/aggregator/queries/useGetPrice'
// import useGetRoutes from 'features/aggregator/queries/useGetRoutes'
import { ethers } from 'ethers'
import { addTransaction } from 'state/transactions/actions'
import { getExplorerLink } from 'functions/explorer'
// import { SubmitButton } from 'features/summoner/Styles'
import SwapDropdown from 'features/swap/SwapDropdown'
import Pair from 'pages/analytics/pairs/[id]'
import Limits from './limit/[[...tokens]]'
import { currencyId } from 'functions/currency'
import { GelatoLimitOrdersHistoryPanel } from 'soulswap-limit-orders-react'

const Swap = () => {
  const { i18n } = useLingui()
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { account, chainId, library } = useActiveWeb3React()
  const defaultTokens = useAllTokens()
  const { independentField, typedValue, recipient } = useSwapState()
  const { v2Trade, parsedAmount, currencies, inputError: swapInputError, allowedSlippage, to } = useDerivedSwapInfo()
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const [useAggregator, setUseAggregator] = useState(false)
  const [useLimit, setUseLimit] = useState(false)
  const [showOrders, setShowOrders] = useState(false)
  const DEFAULT_CURRENCY_A = NATIVE[chainId].symbol
  const DEFAULT_CURRENCY_B = [ChainId.ETHEREUM, ChainId.FANTOM, ChainId.AVALANCHE].includes(chainId) ? SOUL_ADDRESS[chainId] : USDC_ADDRESS[chainId]
  const router = useRouter()
  const tokens = router.query.tokens
  const [currencyIdA, currencyIdB] = (tokens as string[]) || [DEFAULT_CURRENCY_A, DEFAULT_CURRENCY_B]
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA)
      if (newCurrencyIdA === currencyIdB) {
        router.push(`/exchange/swap?inputCurrency=${currencyIdB}&outputCurrency=${currencyIdA}`)
      } else {
        router.push(`/exchange/swap?inputCurrency=${newCurrencyIdA}&outputCurrency=${currencyIdB}`)
      }
    },
    [currencyIdB, router, currencyIdA]
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          router.push(`/exchange/swap?inputCurrency=${currencyIdB}&outputCurrency=${newCurrencyIdB}`)
        } else {
          router.push(`/exchange/swap?inputCurrency=${NATIVE[chainId].symbol}&outputCurrency=${newCurrencyIdB}`)
        }
      } else {
        router.push(`/exchange/swap?inputCurrency=${currencyIdA ? currencyIdA : NATIVE[chainId].symbol}&outputCurrency=${newCurrencyIdB}`)
      }
    },
    [currencyIdA, router, currencyIdB]
  )
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c?.isToken ?? false) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  const [showChart, setShowChart] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const useSwap = !useAggregator && !useLimit
  // const [showAggregator, setShowAggregator] = useState(false)

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
  const { address: recipientAddress } = useENSAddress(recipient ? recipient : account)

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
      (approvalSubmitted && approvalState === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3)

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
      // handleCurrencyASelect(inputCurrency)
      handleInputTokenSelect(inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      // handleCurrencyBSelect(outputCurrency)
      handleOutputTokenSelect(outputCurrency)
    },
    [onCurrencySelection]
  )

  const handleSwitchTokens = useCallback(
    (inputCurrency: Currency, outputCurrency: Currency) => {
      handleInputSelect(outputCurrency)
      handleOutputSelect(inputCurrency)
    },
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



  // AGGREGATOR CONSTANTS [START] //
  // const DEFAULT_OUTPUT = chainId == ChainId.AVALANCHE ? USDC[chainId] : DAI[chainId]
  const [selectedChain, setSelectedChain] = useState(startChain(chainId))
  const [fromToken, setFromToken] = useState<Currency>(currencyA)
  const [toToken, setToToken] = useState<Currency>(currencyB)

  const [inputAmount, setInputAmount] = useState('10')
  // const [slippage, setSlippage] = useState('1')
  // const [amount, setAmount] = useState('10');
  // const [txModalOpen, setTxModalOpen] = useState(false);
  // const [txUrl, setTxUrl] = useState('');
  const signer = library.getSigner()

  const gasPrice = useGasPrice()?.gasPrice.fast
  const amountWithDecimals = new BigNumber(inputAmount)
    .times(10 ** (fromToken?.wrapped.decimals || 18))
    .toFixed(0);

  const [route, setRoute] = useState(null);

  const handleInputTokenSelect = useCallback(
    (inputCurrency: Currency) => {
      setFromToken(inputCurrency)
      // setInputToken(inputCurrency)
    },
    [setFromToken]
  )

  const handleOutputTokenSelect = useCallback(
    (outputCurrency: Currency) => {
      setToToken(outputCurrency)
      // setOutputToken(outputCurrency)
    },
    [setToToken]
  )

  // const { data: routes = [], isLoading } = useGetRoutes({
  //   chain: selectedChain.value,
  //   from: fromToken?.isNative ? NATIVE_ADDRESS : fromToken?.wrapped.address,
  //   to: toToken?.isNative ? NATIVE_ADDRESS : toToken?.wrapped.address,
  //   amount: amountWithDecimals,
  //   extra: {
  //     gasPrice,
  //     userAddress: account,
  //     amount,
  //     fromToken,
  //     toToken,
  //     slippage
  //   }
  // });

  // const normalizedRoutes = [...(routes || [])]
  //   ?.map((route) => {
  //     const gasUsd = (gasTokenPrice * +route.price.estimatedGas * +gasPrice) / 1e18 || 0;
  //     const amount = +route.price.amountReturned / 10 ** +toToken?.decimals;
  //     const amountUsd = (amount * toTokenPrice).toFixed(2);
  //     const netOut = +amountUsd - gasUsd;

  //     return { route, gasUsd, amountUsd, amount, netOut, ...route };
  //   })
  //   .filter(({ fromAmount, amount: toAmount }) => Number(toAmount) && amountWithDecimals === fromAmount)
  //   .sort((a, b) => b.netOut - a.netOut);


  // const swapMutation = useMutation({
  //   mutationFn: (params: {
  //     chain: string;
  //     from: string;
  //     to: string;
  //     amount: string;
  //     adapter: string;
  //     signer: ethers.Signer;
  //     slippage: string;
  //     rawQuote: any;
  //     tokens: { toToken: Currency; fromToken: Currency };
  //   }) => swap(params),
  //   onSuccess: (data, variables) => {
  //     addTransaction({
  //       chainId: chainId,
  //       hash: data?.hash,
  //       from: account,
  //       summary: `Swap transaction using ${variables.adapter} is sent.`
  //     });
  //     const explorerUrl = getExplorerLink(chainId, data, "transaction") // chain.blockExplorers.default.url;
  //     setTxModalOpen(true);

  //     setTxUrl(`${explorerUrl}/tx/${data?.hash}`);
  //   },
  //   onError: (err: { reason: string; code: string }) => {
  //     if (err.code !== 'ACTION_REJECTED') {
  //       console.log('Transaction Rejected: %s', err.reason)
  //     }
  //   }
  // });

  // const handleAggregate = () => {
  //   swapMutation.mutate({
  //     chain: selectedChain.value,
  //     from: fromToken?.isNative ? NATIVE_ADDRESS : fromToken?.wrapped.address,
  //     to: toToken?.isNative ? NATIVE_ADDRESS : toToken?.wrapped.address,
  //     amount: amountWithDecimals,
  //     signer,
  //     slippage,
  //     adapter: route.name,
  //     rawQuote: route?.price?.rawQuote,
  //     tokens: { fromToken, toToken }
  //   });
  // };

  const handleLimitSwap = useCallback(
    () => {
      // setShowHeader(false)
      router.push(`/exchange/swap/limit/${currencyIdA}/${currencyIdB}`)
    }, [useSwap]
  )


  const { data: tokenPrices } = useGetPrice({
    chain: selectedChain.value,
    toToken: toToken?.wrapped.address,
    fromToken: fromToken?.wrapped.address
  });

  const { gasTokenPrice = 0, toTokenPrice = 0, fromTokenPrice = 0 } = tokenPrices || {};


  // AGGREGATOR CONSTANTS [END] //

  const handleTypeInput = useCallback(
    (value: string) => {
      // setInputAmount('11')
      onUserInput(Field.INPUT, value)
    },
    [onUserInput, setInputAmount]
  )

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  // const handleUseAggregator = useCallback(
  //   (using: boolean) => {
  //     using ? setUseAggregator(false) : setUseAggregator(true)
  //   },
  //   [setUseAggregator]
  // )

  return (
    <>
      {/* <NewFeature chainId={chainId} /> */}
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
          {/* <div className="flex mb-4 items-center justify-center"> */}
          <SwapHeader inputCurrency={currencyA} outputCurrency={currencyB} />
          <Button
            variant="filled"
            color={chainId == ChainId.AVALANCHE ? "avaxGradient" : "gradientBluePurple"}
            size="lg"
          >
            <NavLink href={"/cross"}>
              <a className="block text-white p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                <span>{'Swap Crosschain'}</span>
              </a>
            </NavLink>
          </Button>
        </div>}

      {[ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) &&
        <SwapLayoutCard>
          {!useLimit &&
            <><SwapDropdown inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]} />
              {useSwap &&
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
            </>
          }
          {useSwap &&
            <div className="flex -mt-6 -mb-6 z-0 justify-between">
              <Button
                size={'xs'}
                className={classNames(`mx-[42%] rounded rounded-xl bg-dark-1000 border border-[${getChainColor(chainId)}]`)}
                onClick={() =>
                  handleSwitchTokens(currencies?.INPUT, currencies?.OUTPUT)
                }                >
                <Image
                  alt={"arrow rounded square"}
                  width={'14px'}
                  height={'14px'}
                  className={`rounded rounded-xl`}
                  src={ArrowRoundedSquare}
                />
              </Button>
              <Button
                size={'xs'}
                className={classNames(`rounded rounded-xl bg-dark-1000 border border-[${getChainColor(chainId)}]`)}
                onClick={handleLimitSwap}
              >
                <Image
                  alt={"Chevron Up Down Icon"}
                  width={'14px'}
                  height={'14px'}
                  className={`rounded rounded-xl`}
                  src={ChevronUpDown}
                />
              </Button>
            </div>
          }

          {/* TO ASSET PANEL */}
          {useSwap &&
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
              onSelect={
                handleOutputSelect
              }
              priceImpact={priceImpact}
              priceImpactCss={priceImpactCss}
            />
          }
          {Boolean(trade) && useSwap &&
            (
              <SwapDetails
                inputCurrency={currencies[Field.INPUT]}
                outputCurrency={currencies[Field.OUTPUT]}
                trade={trade}
                recipient={recipient ?? undefined}
              />
            )}
          {trade && routeNotFound && userHasSpecifiedInputOutput && useSwap &&
            (
              <Typography variant="xs" className="text-center py-2">
                {i18n._(t`Insufficient liquidity for this trade.`)}{' '}
                {singleHopOnly && i18n._(t`Try enabling multi-hop trades`)}
              </Typography>
            )}

          {swapIsUnsupported && useSwap ? (
            <Button
              color="red"
              disabled
              className="rounded-2xl w-full md:rounded">
              {i18n._(t`Unsupported Asset`)}
            </Button>
          ) : !account && useSwap ? (
            <Web3Connect color="purple" variant="filled" className="rounded-2xl md:rounded" />
          ) : showWrap && useSwap ? (
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
          ) : showApproveFlow && useSwap ? (
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
                    {i18n._(t`Approve ${currencies[Field.INPUT]?.symbol}`)}
                  </Button>
                )}
              {approvalState === ApprovalState.APPROVED && useSwap &&
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
                      !isValid || approvalState !== ApprovalState.APPROVED || (priceImpactSeverity > 3)
                    }
                    className="rounded-2xl w-full md:rounded"
                  >
                    {priceImpactSeverity > 3
                      ? i18n._(t`Price Impact High`)
                      : priceImpactSeverity > 2
                        ? i18n._(t`Swap Anyway`)
                        : i18n._(t`Swap`)}
                  </Button>
                )}
            </div>
          ) : (useSwap &&
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
                    ? i18n._(t`Swap Anyway`)
                    : i18n._(t`Swap`)}
            </Button>
          )}

          {useSwap && priceImpactSeverity > 2 && isValid &&
            <Button
              color={ `${getChainColorCode(chainId)}` }
              onClick={() => { setUseAggregator(true) }
              }
              id="use-aggregator-button"
              // disabled={}
              className="rounded-2xl w-full md:rounded"
            >
              { 'Use Aggregator' }
            </Button>
          }
          {useAggregator && !useLimit &&
            <Aggregator />
          }
          {useLimit && !useAggregator &&
            <Limits />
          }
          {swapIsUnsupported ? <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} show={false} /> : null}
          {/* <div className="flex border-dark-900 mt-3 mb-0 gap-1 items-center justify-center">
            <Button
              variant="filled"
              color={chainId == ChainId.AVALANCHE ? "avaxGradient" : "gradientPurpleBlue"}
              size="lg"
            >
              <NavLink href={"/portfolio"}>
                <a className="block text-white p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                  <span>View Portfolio</span>
                </a>
              </NavLink>
            </Button>
            <Button
              variant="filled"
              color={chainId == ChainId.AVALANCHE ? "avaxGradient" : "gradientBluePurple"}
              size="lg"
            >
              <NavLink href={"/cross"}>
                <a className="block text-white p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                  <span>{'Swap Crosschain'}</span>
                </a>
              </NavLink>
            </Button>
          </div> */}
          <div className={classNames(featureEnabled(Feature.AGGREGATE, chainId) ? "m-1 flex justify-between" : "hidden")}>
            <div className={classNames(useSwap ? `flex flex-cols-2 gap-3 text-white justify-end` : 'hidden')}>
              <Toggle
                id="toggle-button"
                optionA="Analytics"
                optionB="Analytics"
                isActive={showAnalytics}
                toggle={
                  showAnalytics
                    ? () => {
                      setShowAnalytics(false)
                    }
                    : () => {
                      setShowAnalytics(true)
                    }
                }
              />
            </div>
            {/* <div className={classNames(!useAggregator ? `flex flex-cols-2 gap-3 text-white justify-end` : 'hidden')}> */}
            <div className={classNames(useLimit ? `flex flex-cols-2 gap-3 text-white justify-end` : 'hidden')}>
              <Toggle
                id="toggle-button"
                optionA="Limit"
                optionB="Limit"
                isActive={useLimit}
                toggle={
                  useLimit
                    ? () => {
                      setUseLimit(false)
                    }
                    : () => {
                      setUseLimit(true)
                    }
                }
              />
            </div>
            <div className={classNames(!useLimit && !useAggregator ? `flex flex-cols-2 gap-3 text-white justify-end` : 'hidden')}>
              <Toggle
                id="toggle-button"
                optionA="Aggregator"
                optionB="Aggregator"
                isActive={useAggregator}
                toggle={
                  useAggregator
                    ? () => {
                      setUseAggregator(false)
                    }
                    : () => {
                      setUseAggregator(true)
                    }
                }
              />
            </div>
          </div>
          {/* {inputToken && outputToken && (
					<SwapLayoutCard>
						<Container>
							<Routes>
							{isLoading ? <Loader loaded={!isLoading} /> : null}
							{normalizedRoutes.map((r, i) => (
								<Route
									{...r}
									index={i}
									selected={route?.name === r.name}
									setRoute={() => setRoute(r.route)}
									toToken={outputToken}
									amountFrom={amountWithDecimals}
									fromToken={inputToken}
									selectedChain={selectedChain.label}
									key={i}
								/>
							))}
							</Routes>
						</Container>
					</SwapLayoutCard>
				)} */}
          {/* {showChart && [ChainId.FANTOM].includes(chainId) &&
            <div className={`xl:max-w-7xl mt-0 w-full lg:grid-cols-1 order-last space-y-0 lg:space-x-4 lg:space-y-0 bg-dark-900`}>
              <div className={`w-full flex flex-col order-last sm:mb-0 lg:mt-0 p-0 rounded rounded-lg bg-light-glass`}>
                <Chart inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]} />
              </div>
            </div>
          } */}
          {/* {featureEnabled(Feature.AGGREGATE, chainId) && showAggregator &&
            <div className={`xl:max-w-7xl mt-0 w-full lg:grid-cols-1 order-last space-y-0 lg:space-x-4 lg:space-y-0 bg-dark-900`}>
              <div className={`w-full flex flex-col order-last sm:mb-0 lg:mt-0 p-0 rounded rounded-lg bg-light-glass`}>
                <Chart inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]} />
              </div>
            </div>
          } */}
          {showAnalytics && useSwap && [ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) &&
            <div className={`xl:max-w-7xl mt-0 w-full lg:grid-cols-1 order-last space-y-0 lg:space-x-4 lg:space-y-0 bg-dark-900`}>
              <div className={`w-full flex flex-col order-last sm:mb-0 lg:mt-0 p-0 rounded rounded-lg bg-light-glass`}>
                {/* <Analytics inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]} /> */}
                <Pair inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]} />
              </div>
            </div>
          }
          {(!showChart && !showAnalytics) &&
            <SocialWidget />
          }
        </SwapLayoutCard>
      }
      {
        <div className="grid grid-cols-1">
          <Image
            src='https://app.soulswap.finance/title-soul-halfs.png'
            height="400px" width="600px" alt="logo"
          />
        </div>
      }
    </>
  )
}

Swap.Layout = SwapLayout('swap-page')
export default Swap