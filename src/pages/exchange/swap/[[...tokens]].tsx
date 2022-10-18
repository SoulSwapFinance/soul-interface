import { ArrowDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, Currency, JSBI, Token, Trade as V2Trade, TradeType } from 'sdk'
import { Button } from 'components/Button'
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
import { AVAX, CHAIN_BY_ID, FTM, NATIVE_ADDRESS, rubicConfiguration } from 'utils/rubic/configuration'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import { useUserOpenMev, useUserSingleHopOnly } from 'state/user/hooks' // useCrossChainModeManager
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactGA from 'react-ga'
import Chart from 'components/Chart'
import { FANTOM, AVALANCHE, BINANCE, Chain, CHAINS, ETHEREUM, POLYGON, MOONRIVER, Token as CrossToken } from "features/cross/chains";
import SDK, {
  // BLOCKCHAIN_NAME,
  // Configuration,
  InstantTrade,
  // WalletProvider,
  // InsufficientFundsError,
  InsufficientLiquidityError
} from "rubic-sdk";
import { Toggle } from 'components/Toggle'
import SocialWidget from 'components/Social'
import { getChainColorCode } from 'constants/chains'
import { classNames } from 'functions/styling'
// import { TwitterBanner } from 'components/Banner'
import NavLink from 'components/NavLink'
import { WrappedCrossChainTrade } from 'rubic-sdk/lib/features/cross-chain/providers/common/models/wrapped-cross-chain-trade'
import { sleep } from 'features/crosschain/utils'
import { getLastExchange } from 'utils/rubic/hooks'
import Analytics from 'components/Analytics'

const Swap = () => {
  const { i18n } = useLingui()
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { account, chainId } = useActiveWeb3React()
  const defaultTokens = useAllTokens()
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
  const [showData, setShowData] = useState(false)

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
      ? parsedAmounts[independentField]?.toExact() ?? ''
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
              // : account
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
    // recipientAddress,
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

  /// CROSSCHAIN FUNCTIONALITY ///

  const lastExchange = useMemo(() => {
    return getLastExchange() ?? { from: { chain: FANTOM, token: FTM }, to: { chain: AVALANCHE, token: AVAX } };
  }, []);
  
  const [crossFrom, setCrossFrom] = useState<CrossToken>(lastExchange.from.token);
  const [crossTo, setCrossTo] = useState<CrossToken>(lastExchange.to?.token);
  const [fromChain, setFromChain] = useState<Chain>(lastExchange.from.chain);
  const [toChain, setToChain] = useState<Chain>(lastExchange.to?.chain);
  const [fromUsd, setFromUsd] = useState<string>('0');
  const [toUsd, setToUsd] = useState<string>('0');
  const [outputAmount, setOutputAmount] = useState<string>();
  const [amount, setAmount] = useState("");
  const [fromBalance, setBalance] = useState("");
  const [crossTrade, setCrossTrade] = useState<InstantTrade | WrappedCrossChainTrade>(undefined);
  const [canBuy, setCanBuy] = useState(true);
  const [loading, setLoading] = useState(false);
  const [configuration, setConfiguration] = useState(rubicConfiguration);
  const [rubic, setRubic] = useState<SDK>(null);

  useEffect(() => {
    if (!rubic) {
      return;
    }

    let disposed = false;
    async function run() {
      // avoids pinging CG and RPCs on keystrokes.
      await sleep(300 / 1000);

      if (disposed) {
        return;
      }

      try {
        const tradeRequest =
          fromChain?.chainId === toChain?.chainId
            ? rubic.instantTrades.calculateTrade(
              {
                address: crossFrom.isNative ? NATIVE_ADDRESS : crossFrom.address,
                blockchain: CHAIN_BY_ID.get(fromChain?.chainId),
              },
              amount,
              crossTo?.isNative ? NATIVE_ADDRESS : crossTo?.address,
            )
              .then((trades: InstantTrade[]): InstantTrade => trades[0])
            : rubic.crossChain.calculateTrade(
              // (1) fromToken
              {
                address: crossFrom.isNative ? NATIVE_ADDRESS : crossFrom.address,
                blockchain: CHAIN_BY_ID.get(fromChain?.chainId),
              },
              // (2) fromAmount
              amount,
              // (3) toToken
              {
                address: crossTo?.isNative ? NATIVE_ADDRESS : crossTo?.address,
                blockchain: CHAIN_BY_ID.get(toChain.chainId),
              },
              // (4) options (optional)
            )
              .then((trades: WrappedCrossChainTrade[]): WrappedCrossChainTrade => trades[0])

        const newTrade = await tradeRequest;
        const [newFromUsd, newToUsd] = await Promise.all([
          // the USD value of (from) being _sold_.
          crossFrom.isNative
            ? rubic.cryptoPriceApi.getNativeCoinPrice(CHAIN_BY_ID.get(fromChain?.chainId))
            : rubic.cryptoPriceApi.getErc20TokenPrice({
              address: crossFrom.address,
              blockchain: CHAIN_BY_ID.get(fromChain?.chainId),
            }),

          // the USD value of (to) being _bought_.
          crossTo?.isNative
            ? rubic.cryptoPriceApi.getNativeCoinPrice(CHAIN_BY_ID.get(toChain?.chainId))
            : rubic.cryptoPriceApi.getErc20TokenPrice({
              address: crossTo?.address,
              blockchain: CHAIN_BY_ID.get(toChain?.chainId),
            }),
        ])
        if (disposed) {
          return;
        }

        if (newTrade instanceof InstantTrade) {
          setCrossTrade(newTrade);
          setFromUsd((Number(newFromUsd) * Number(newTrade.from.tokenAmount)).toString())
          setToUsd((Number(newToUsd) * Number((newTrade.to?.tokenAmount))).toString())
        } else {
          const test = newTrade
          setCrossTrade(test);
          setFromUsd((Number(newFromUsd) * Number(test.trade.from?.tokenAmount)).toString())
          setToUsd((Number(newToUsd) * Number((test.trade.to?.tokenAmount))).toString())
          setOutputAmount(Number(test.trade.to?.tokenAmount).toString())
          // console.log('outputAmount:%s', outputAmount)
        }

        setLoading(false)

      } catch (e) {
        if (disposed) {
          return;
        }
        setLoading(false);
        if (e instanceof InsufficientLiquidityError) {
          setCanBuy(false);
        } else {
          console.warn(e);
        }
      }
    }
    setCrossTrade(undefined);
    setFromUsd(undefined);
    setToUsd(undefined);
    setCanBuy(true);

    const isTradingSameToken = fromChain?.chainId === toChain?.chainId && crossFrom.id === crossTo?.id;
    if (amount && parseFloat(amount) > 0 && !isTradingSameToken) {
      setLoading(true);
      run();
      return () => {
        disposed = true;
      };
    } else {
      setLoading(false);
    }
  }, [crossFrom, fromChain, to, toChain, amount, rubic]);

  return (
    <>
      {/* <TwitterBanner chainId={chainId} /> */}
      <ConfirmSwapModal
        isOpen={showConfirm}
        trade={trade}
        originalTrade={tradeToConfirm}
        onAcceptChanges={handleAcceptChanges}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        recipient={recipient}
        toChain={toChain.chainId}
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
        {![ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) &&
        <div className="flex flex-col gap-3 mt-12 justify-center">
          {/* <div className="flex mb-4 items-center justify-center"> */}
          <SwapHeader inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]} />
          <Button variant="filled" color={getChainColorCode(chainId)} size="lg">
          <NavLink href={'/cross'}>
                <a className="block text-white p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                Go to Crosschain Swaps <span> ↗</span>
                </a>
          </NavLink>
          </Button>
    </div> }

        { [ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) &&
          <SwapLayoutCard>
            <SwapHeader inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]} />
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
          
        <div className={ classNames("flex justify-center -mt-6 -mb-6 z-0") }>
          <div
            role="button"
            className={classNames( `p-1.5 rounded-full bg-dark-800 border shadow-md border-dark-700 hover:border-${getChainColorCode(chainId)}` )}
            onClick={() => {
              setApprovalSubmitted(false) // reset 2 step UI for approvals
              onSwitchTokens()
            }}
          >
            { <ArrowDownIcon width={14} className="text-high-emphesis hover:text-white" /> }
          </div>
        </div>

        {/* TO ASSET PANEL */}
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
        {Boolean(trade) && (
          <SwapDetails
            inputCurrency={currencies[Field.INPUT]}
            outputCurrency={currencies[Field.OUTPUT]}
            trade={trade}
            recipient={recipient ?? undefined}
          />
        )}
        {trade && routeNotFound && userHasSpecifiedInputOutput && (
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
        ) : showApproveFlow ? (
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
            {approvalState === ApprovalState.APPROVED && (
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
        ) : (
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
        {swapIsUnsupported ? <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} show={false} /> : null}
        {/* </div> */}
        <div className="flex border-dark-900 mt-3 mb-0 gap-1 items-center justify-center">
                <Button 
                  variant="filled" 
                  color={ chainId == ChainId.AVALANCHE ? "avaxGradient" : "gradientPurpleBlue"}
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
                  color={ chainId == ChainId.AVALANCHE ? "avaxGradient" : "gradientBluePurple"}
                  size="lg"
                >
                <NavLink href={"/cross"}>
                        <a className="block text-white p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                        <span>Swap Crosschain</span>
                        </a>
                  </NavLink>
                </Button>
              </div>
        <div className={classNames(chainId == ChainId.FANTOM ? "flex justify-between" 
          : chainId == ChainId.AVALANCHE ? "flex justify-end" : "hidden" )}>
        <div className={classNames(`flex flex-cols-2 gap-3 text-white justify-end`)}>
          <Toggle
            id="toggle-button"
            optionA="Data"
            optionB="Data"
            isActive={showData}
            toggle={
              showData
                ? () => {
                  setShowData(false)
                }
                : () => {
                  setShowData(true)
                }
            }
          />
        </div>
        <div className={classNames(chainId == ChainId.FANTOM ? `flex flex-cols-2 gap-3 text-white justify-end` : 'hidden')}>
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
          </div>
        { showChart && [ChainId.FANTOM].includes(chainId) &&
          <div className={`xl:max-w-7xl mt-0 w-full lg:grid-cols-1 order-last space-y-0 lg:space-x-4 lg:space-y-0 bg-dark-900`}>
            <div className={`w-full flex flex-col order-last sm:mb-0 lg:mt-0 p-0 rounded rounded-lg bg-light-glass`}>
              <Chart inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]} />
            </div>
          </div>
        }
        { showData && [ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) &&
          <div className={`xl:max-w-7xl mt-0 w-full lg:grid-cols-1 order-last space-y-0 lg:space-x-4 lg:space-y-0 bg-dark-900`}>
            <div className={`w-full flex flex-col order-last sm:mb-0 lg:mt-0 p-0 rounded rounded-lg bg-light-glass`}>
              <Analytics inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]} />
            </div>
          </div>
        }
      {(!showChart && !showData) &&
           <SocialWidget />
        }
        </SwapLayoutCard>
        }
    </>
  )
}

Swap.Layout = SwapLayout('swap-page')
export default Swap