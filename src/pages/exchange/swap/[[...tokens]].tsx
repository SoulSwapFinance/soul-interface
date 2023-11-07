import ReactGA from 'react-ga'
import Image from 'next/image'
// import { CreditCardIcon } from '@heroicons/react/24/solid'
import ArrowRoundedSquare from 'assets/svg/icons/ArrowRoundedSquare.svg'
import { ChainId, Currency, JSBI, NATIVE, SOUL_ADDRESS, Token, Trade as V2Trade, TradeType, USDC_ADDRESS, WNATIVE, WNATIVE_ADDRESS } from 'sdk'
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
// import { useActiveWeb3React } from 'services/web3'
import { Field } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import { useUserOpenMev, useUserSingleHopOnly } from 'state/user/hooks'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getChainColor, getChainColorCode, getChainLogoURL } from 'constants/chains'
import { classNames } from 'functions/styling'
// import NavLink from 'components/NavLink'
import { featureEnabled } from 'functions/feature'
import { Feature } from 'enums/Feature'
import { useRouter } from 'next/router'
import SwapDropdown from 'features/swap/SwapDropdown'
import TokenChart from 'pages/analytics/tokens/embedded/[id]'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import { currencyId } from 'functions'
// import { NextSeo } from 'next-seo'
import { CustomBanner } from 'components/Banner'
// import ChevronDoubleDownIcon from '@heroicons/react/24/solid'
// import Link from 'next/link'
// import ChevronDoubleUp from 'assets/svg/icons/ChevronDoubleUp.svg'
import LimitHeader from 'features/limit/LimitHeader'
import { useWeb3React } from '@web3-react/core'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
// import { useWalletModalToggle } from 'state/application/hooks'
// import { NetworkContextName } from 'constants/index'
// import { name } from 'sdk/types'
import Head from 'next/head'
// import ToggleButton from 'components/ToggleButton'
import NavLink from 'components/NavLink'
import Settings from 'components/Settings'
import NetworkGuard from 'guards/Network'
// import { NetworkContextName } from 'constants/index'
// import Modal from 'components/DefaultModal'
// import ModalHeader from 'components/Modal/Header'
// import HeadlessUIModal from 'components/Modal/HeadlessUIModal'

// import { FollowBanner } from 'components/Banner'

const Exchange = () => {
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { active, account, chainId } = useWeb3React()
  // const contextNetwork = useWeb3React(NetworkContextName)
  // NOTE: this sets "showConnect" when account is not active.
  // const [ showConnect, setShowConnect ] = useState(true)
  const defaultTokens = useAllTokens()
  const { independentField, typedValue, recipient } = useSwapState()
  const { v2Trade, parsedAmount, currencies, inputError: swapInputError, allowedSlippage, to } = useDerivedSwapInfo()
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  // const [buyWithFiat, setBuyWithFiat] = useState(false)

  const [switched, setSwitched] = useState(false)

  // const DEFAULT_CURRENCY_A = NATIVE[chainId ?? ChainId.FANTOM].symbol
  // const DEFAULT_CURRENCY_B = [ChainId.ETHEREUM, ChainId.FANTOM, ChainId.AVALANCHE].includes(chainId ?? ChainId.FANTOM) ? SOUL_ADDRESS[chainId ?? ChainId.FANTOM] : USDC_ADDRESS[chainId ?? ChainId.FANTOM]
  const router = useRouter()
  // const tokens = router.query.tokens
  // const [currencyIdA, currencyIdB] = (tokens as string[]) || [DEFAULT_CURRENCY_A, DEFAULT_CURRENCY_B]
  const showNotice = router?.asPath == ('/swap')
  // const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  const [showConnect, setShowConnect] = useState(showNotice)
  // const contextNetwork = useWeb3React(NetworkContextName)
  // const toggleWalletModal = useWalletModalToggle()

  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c?.isToken ?? false) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  const inputWrapped = currencies[Field.INPUT] == WNATIVE[chainId ?? ChainId.FANTOM]
  const inputNative = currencies[Field.INPUT] == NATIVE[chainId ?? ChainId.FANTOM]
  const outputWrapped = currencies[Field.OUTPUT] == WNATIVE[chainId ?? ChainId.FANTOM]
  const outputNative = currencies[Field.OUTPUT] == NATIVE[chainId ?? ChainId.FANTOM]

  const isWrapped =
    // ONE IS NATIVE
    (inputNative || outputNative)
    &&
    // ANOTHER IS WRAPPED_NATIVE
    (inputWrapped || outputWrapped)

  const inputCurrency = inputNative ? WNATIVE[chainId ?? ChainId.FANTOM] : currencies[Field.INPUT]
  const outputCurrency = outputNative ? WNATIVE[chainId ?? ChainId.FANTOM] : currencies[Field.OUTPUT]
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

  const handleConnect = () => {
    // toggleWalletModal
    setShowConnect(false)

  }

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
  // && !(priceImpactSeverity > 4)

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
    (input: Currency, output: Currency) => {
      router.push(`/exchange/aggregator/${input ? currencyId(input) : NATIVE[chainId ?? ChainId.FANTOM].symbol}/${output ? currencyId(output) : USDC_ADDRESS[chainId ?? ChainId.FANTOM]}`)
    }, []
  )

  // // `/exchange/aggregator/${input ? currencyId(input) : NATIVE[chainId ?? ChainId.FANTOM].symbol}/${output ? currencyId(output) : USDC_ADDRESS[chainId ?? ChainId.FANTOM]}`
  // const handlePool = useCallback(
  //   (input: Currency, output: Currency) => {
  //     router.push(
  //       `/add/${input ? currencyId(input) : NATIVE[chainId ?? ChainId.FANTOM].symbol}/${output ? currencyId(output) : USDC_ADDRESS[chainId ?? ChainId.FANTOM]}`
  //       )
  //   }, []
  // )

  const handleCrossSwap = useCallback(() => {
    // (input: Currency, output: Currency) => {
    router.push(`/exchange/crosschain`)
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

  return (
    <div>
      {/* <NextSeo 
        title={`Swap | SoulSwap`}
        defaultTitle='SoulSwap'
        description='SoulSwap is a decentralized exchange, part of Soul Protocol, which offers a full suite of DeFi tools.'
        twitter={{
          handle: '@soulswapfinance',
          site: '@soulswapfinance',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          
          // ={'https://soulswap.finance/images/soulswap.png'}
        ]}
        /> */}
      <Head>
        <title>Swap | SoulSwap</title>
        <meta name="description" content="SoulSwap is an AMM exchange, part of Soul Protocol, which offers a full suite of DeFi tools." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://soulswap.finance/images/soulswap-cover.png" />
        <meta name="twitter:site" content="@SoulSwapFinance" />
        <meta property="og:image" content="https://soulswap.finance/images/soulswap-cover.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:description" content="SoulSwap is an AMM exchange, part of Soul Protocol, which offers a full suite of DeFi tools." />
      </Head>
      {account && chainId &&
        <ConfirmSwapModal
          isOpen={showConfirm}
          trade={trade}
          originalTrade={tradeToConfirm}
          onAcceptChanges={handleAcceptChanges}
          attemptingTxn={attemptingTxn}
          txHash={txHash}
          recipient={recipient}
          toChain={chainId ?? ChainId.FANTOM}
          allowedSlippage={allowedSlippage}
          onConfirm={handleSwap}
          swapErrorMessage={swapErrorMessage}
          onDismiss={handleConfirmDismiss}
        />
      }
      {account && chainId &&
        <TokenWarningModal
          isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
          tokens={importTokensNotInDefault}
          onConfirm={handleConfirmTokenWarning}
        />
      }
      {/* {![ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId ?? ChainId.FANTOM) &&
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
        </div>} */}

      {/* {[ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId ?? ChainId.FANTOM) && */}
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
          {/* <div className={`my-2 border-2 border-[${getChainColor(chainId ?? ChainId.FANTOM)}]`} /> */}
          <>
            {/* <div className={`my-12`} /> */}
            {/* <SwapDropdown
              inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]}
            /> */}
            <CustomBanner
              external={true}
              chains={[ChainId.FANTOM, ChainId.AVALANCHE]}
              link={'https://links.soulswap.finance'}
              text={'View Ecosystem ↗'}
              textColor={'white'}
              color={'ftmBlue'}
              className={`animate-pulse border-4 border-dark-800 rounded-2xl`}
            />
            <LimitHeader
              inputCurrency={currencies[Field.INPUT]}
              outputCurrency={currencies[Field.OUTPUT]}
            />
            <div className={`my-12`} />
            <div className={"flex w-[86%] sm:w-full text-white justify-center border-2 border-ftmBlue hover:border-purple rounded-2xl"}>
              <NavLink
                legacyBehavior={true}
                // href={``}
                href={`/exchange/add${inputCurrency 
                    ? inputCurrency.wrapped.address == WNATIVE_ADDRESS[chainId ?? ChainId.FANTOM]
                   ? `/${NATIVE[chainId ?? ChainId.FANTOM].symbol}` : `/${currencyId(inputCurrency)}` : `/${NATIVE[chainId ?? ChainId.FANTOM].symbol}`}${outputCurrency ? `/${currencyId(outputCurrency)}` 
                : ([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `/${SOUL_ADDRESS[chainId ?? ChainId.FANTOM]}` : `/${USDC_ADDRESS[chainId ?? ChainId.FANTOM]}`)}`}
                // href="/pool"
                className={'mt-4'}
              >
                <Button
                  variant={'bordered'}
                  color={`black`}
                  primaryColor={'black'}
                  size={'sm'}
                  className={`w-full rounded-2xl bg-dark-900 hover:bg-dark-800`}
                >
                  <div className={`text-white flex justify-center items-center font-medium text-center cursor-pointer text-base hover:text-high-emphesis`}>
                    {`View Position`}
                  </div>
                </Button>
              </NavLink>
              </div>
            <div
            className={
              classNames(`absolute top-32 right-5`,
              `sm:right-1.5 sm:top-64 sm:mt-12 sm:mb-1 sm:gap-8`,
              `mr-1 justify-end rounded`)
            }>
              <Settings />
            </div>
            {/* <div className={
        classNames(`flex sm:absolute`,
        `sm:right-0.5 sm:top-48 sm:mt-6 sm:mb-1 sm:gap-8`,
        `mr-1 justify-end rounded`
          )
      }>
        { <Settings /> }
      </div> */}
            <div className={`my-12`} />
            {/* <div className={`my-2 border-2 border-[${getChainColor(chainId ?? ChainId.FANTOM)}]`} /> */}
            {/* {useSwap && */}

            {chainId &&
              <SwapAssetPanel
                spendFromWallet={true}
                chainId={chainId ?? ChainId.FANTOM}
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
            }
            {/* } */}
          </>
          {/* } */}
          {chainId && // useSwap &&
            <div className={`flex -mt-4 -mb-4 z-0 justify-center`}>
              <Button
                size={'xs'}
                // className={classNames(`mx-[42%] rounded-2xl bg-dark-1000 border-2 border-[${getChainColor(chainId ?? ChainId.FANTOM)}]`}
                className={classNames(`-mb-4 -mt-4 rounded-2xl bg-dark-1000 border-2 border-[${getChainColor(chainId ?? ChainId.FANTOM)}]`)}
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
            </div>
          }
          {/* TO ASSET PANEL */}
          {/* {useSwap && */}
          {chainId &&
            <SwapAssetPanel
              spendFromWallet={true}
              chainId={chainId ?? ChainId.FANTOM}
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
          }
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
          {/* {featureEnabled(Feature.XSWAP, chainId) &&
          <Button
            className={`flex w-full justify-center`}
            variant={'filled'}
            color={'blue'}
            size={'xs'}
            onClick={handleCrossSwap}
          >
            <div
              className={`h-[18px] max-h-[18px] text-white text-sm`}
            >
              {'Cross-Chain'}
            </div>
          </Button>
          } */}
          {/* {featureEnabled(Feature.LIQUIDITY, chainId) &&
          <Button
            className={`flex w-full justify-center`}
            variant={'filled'}
            color={'blue'}
            size={'xs'}
            onClick={handlePool}
          >
            <div
              className={`h-[18px] max-h-[18px] text-white text-sm`}
            >
              {'+/- Liquidity'}
            </div>
          </Button>
          } */}

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
                  {`Connect Wallet`}
                </Button>
              ) : showWrap // && useSwap 
                ? (
                  <Button
                    color={`${getChainColorCode(chainId ?? ChainId.FANTOM)}`}
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
                            color={`gradientPurple`}
                            loading={approvalState === ApprovalState.PENDING}
                            onClick={handleApprove}
                            disabled={approvalState !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                            className="rounded-2xl w-full md:rounded"
                          >
                            {`Approve ${currencies[Field.INPUT]?.symbol}`}
                          </Button>
                        )}
                      {approvalState === ApprovalState.APPROVED
                        // && useSwap 
                        &&
                        (
                          <Button
                            color={isValid && priceImpactSeverity > 2 ? 'red' : `gradientPurple`
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
                              // || (priceImpactSeverity > 4)
                            }
                            className="rounded-2xl w-full md:rounded"
                          >
                            {priceImpactSeverity > 4
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
                      color={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'red' : `gradientPurple`}
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
                      disabled={!isValid || (priceImpactSeverity > 4) || !!swapCallbackError}
                      className={classNames(isValid && priceImpactSeverity > 4 ? 'hidden' : "rounded-2xl w-full md:rounded")}
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
            priceImpactSeverity >= 4 && isValid &&
            <Button
              color={`gradientPurple`}
              onClick={() => handleAggregatorSwap(currencies[Field.INPUT], currencies[Field.OUTPUT])}
              id="use-aggregator-button"
              // disabled={}
              className="rounded-2xl w-full md:rounded"
            >
              {'Use Aggregator'}
            </Button>
          }
          {swapIsUnsupported ? <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} show={false} /> : null}
          <div className={classNames("m-1 flex justify-between")}>
            <div className={classNames(
              `flex flex-cols-2 gap-3 text-white justify-end`
            )}>
            </div>
          </div>
          {/* <div className={`flex flex-cols-${showChart ? `hidden` : `1`}`}> */}
          {account && chainId &&
            // useSwap && 
            <div className={`w-full flex flex-col order-last sm:mb-0 lg:mt-0 p-0 rounded-lg bg-light-glass`}>
              {!isWrapped && featureEnabled(Feature.ANALYTICS, chainId) &&
                <TokenChart
                  outputCurrency={outputCurrency}
                />
              }
            </div>
          }
        </div>
        {
          showConnect && chainId &&
          <HeadlessUIModal.Controlled
            chainId={chainId ?? ChainId.FANTOM}
            isOpen={showConnect}
            onDismiss={
              () => setShowConnect(false)}
          >
            <div className="space-y-4">
              {/* <ModalHeader header={`FYI: Early Withdrawal Fee`} onClose={() => setShowConnect(false)} /> */}
              <Typography variant="sm">
                <div className="text-xl mt-4 mb-4 text-center border p-1.5 border-purple rounded-2xl">
                  {`Our Terms and Conditions`}
                </div>
                <div className="grid grid-cols-2 mt-6 text-center text-purple gap-3 justify-center">
                  <a href={"https://docs.soulswap.finance/faq/user-agreement"}
                    target="_blank"
                    rel={'noreferrer noopener'}
                    className={'border rounded-2xl p-2 bg-dark-900 m-2 border-dark-800 hover:border-purple'}
                  >
                    <i><b> {`User Agreement`}</b></i>
                  </a>
                  <a
                    href={"https://docs.soulswap.finance/faq/privacy-policy"}
                    target="_blank"
                    rel={'noreferrer noopener'}
                    className={'border rounded-2xl p-2 bg-dark-900 m-2 border-dark-800 hover:border-purple'}
                  >
                    <i><b> {`Privacy Policy`}</b></i>
                  </a>
                </div>
              </Typography>
              <Button
                height="2.5rem"
                color="purple"
                onClick={handleConnect}
              >
                {`Agree and Continue`}
              </Button>
            </div>
          </HeadlessUIModal.Controlled>
        }
      </DoubleGlowShadowV2>
    </div>
  )
}

Exchange.Layout = SwapLayout('swap-page')
export default Exchange
Exchange.Guard = NetworkGuard(Feature.AMM)
