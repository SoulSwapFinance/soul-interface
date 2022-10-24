import React, { lazy, SetStateAction, useCallback, useMemo, useState } from 'react'
import { BigNumber } from 'bignumber.js'
import { useTokenContract } from 'hooks/useContract'
import qs from 'qs'
import Typography from 'components/Typography'
import { useActiveWeb3React } from 'services/web3'
import Web3 from 'web3'
import { ChainId, Currency, NATIVE, SOUL, Token, USDC, WNATIVE } from 'sdk';
// import TradingView from 'components/TradingViewChart'
// import LiveChart from 'components/LiveChart'
// import LineChart from 'components/LiveChart/LineChart'
// import LineGraph from 'components/Dashboard/LineGraph'
// import TokenList from 'features/analytics/Tokens/TokenList'
import SwapAssetPanel from 'features/trident/swap/SwapAssetPanel'
import { classNames } from 'functions/styling'
// import { SwapLayoutCard } from 'layouts/SwapLayout'
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { Field } from 'state/swap/actions'
import SwapHeader from 'features/swap/SwapHeader'
import { ArrowDownIcon } from '@heroicons/react/outline'
import SwapDetails from 'features/swap/SwapDetails'
import { getChainColorCode } from 'constants/chains'
import { useUSDCValue } from 'hooks/useUSDCPrice'
import { computeFiatValuePriceImpact } from 'functions/trade'
import { warningSeverity } from 'functions/prices'
import { SubmitButton } from 'features/summoner/Styles'
import { DoubleGlowShadowV2 } from 'components/DoubleGlow'
import Container from 'components/Container'

// const  = lazy(() => import('components/LiveChart'))

export default function Open() {
  const { account, chainId } = useActiveWeb3React()

  const [inputAmount, setInputAmount] = useState('1')
  const [outputAmount, setOutputAmount] = useState('0')
  const { independentField, typedValue, recipient } = useSwapState()
  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()
  
  const [swapQuote, setSwapQuote] = useState('')

  const [fromToken, setFromToken] = useState(NATIVE[chainId])
  const [toToken, setToToken] = useState(USDC[chainId])
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)


  const { v2Trade, parsedAmount, currencies, inputError: swapInputError, allowedSlippage, to } = useDerivedSwapInfo()
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)

  async function getQuote(fromTokenAddress, toTokenAddress, inputAmount) {
    console.log("Getting Quote");

    const chainName = chainId == ChainId.AVALANCHE ? 'avax' : chainId == ChainId.ETHEREUM ? 'eth' : 'fantom'
    let amount = inputAmount / 10**fromToken.wrapped.decimals
    if (!fromToken || !to || !inputAmount) return;

    // Fetch the swap quote.
    const response = await fetch(`https://open-api.openocean.finance/v3/${chainName}/quote?inTokenAddress=${fromTokenAddress}&outTokenAddress=${toTokenAddress}&amount=${amount}&gasPrice=5&slippage=100`);
    let swapQuoteJSON = await response.json();
    console.log("Quote: ", swapQuoteJSON);
    let outputAmount = await swapQuoteJSON.data?.outAmount / (10 ** toToken.decimals)
    console.log('output:%s', await outputAmount)

    setOutputAmount(outputAmount.toString())
    setSwapQuote(swapQuoteJSON.toString())

    return swapQuoteJSON;
  }

  // getQuote(fromToken.address, toToken.address, inputAmount)

  // async function trySwap() {
  //   const erc20abi = [{ "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint256", "name": "max_supply", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }]
  //   console.log("trying swap");

  //   // Only work if MetaMask is connect
  //   // Connecting to Ethereum: Metamask
  //   const web3 = new Web3(Web3.givenProvider);

  //   // The address, if any, of the most recently used account that the caller is permitted to access
  //   // let accounts = await ethereum.request({ method: "eth_accounts" });
  //   let takerAddress = account;
  //   console.log("takerAddress: ", takerAddress);

  //   // const swapQuoteJSON = await getQuote(takerAddress);

  //   // Set Token Allowance
  //   // Set up approval amount
  //   const fromTokenAddress = fromToken.wrapped.address;
  //   const maxApproval = new BigNumber(2).pow(256).minus(1);
  //   console.log("approval amount: ", maxApproval);
  //   const ERC20TokenContract = useTokenContract(fromTokenAddress)
  //   console.log("setup ERC20TokenContract: ", ERC20TokenContract);

  //   // Grant the allowance target an allowance to spend our tokens.
  //   const tx = await ERC20TokenContract.methods.approve(
  //     // swapQuoteJSON.allowanceTarget,
  //     maxApproval,
  //   )
  //     .send({ from: takerAddress })
  //     .then(tx => {
  //       console.log("tx: ", tx)
  //     });

  //   // Perform the swap
  //   const receipt = await web3.eth.sendTransaction(swapQuoteJSON);
  //   // console.log("receipt: ", receipt);
  // }

  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE

  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
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

  // HANDLES - INPUT //
  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
      setFromToken(inputCurrency)
    },
    [onCurrencySelection]
    )
    
  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
      setInputAmount(value)
    },
    [onUserInput]
    )
      
  // HANDLES - OUTPUT //
  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      setToToken(outputCurrency)
    },
    [onCurrencySelection]
  )

  const fiatValueInput = useUSDCValue(parsedAmounts[Field.INPUT])
  const fiatValueOutput = useUSDCValue(parsedAmounts[Field.OUTPUT])
  const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput)

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
      setOutputAmount(value)
    },
    [onUserInput]
  )

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
    <Container id="open-page" maxWidth="2xl" className="space-y-4">
      <DoubleGlowShadowV2>
      <div className="p-4 mt-4 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}>          
        <div className="px-2">
    <SwapHeader inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]} />
    </div>      
      <SwapAssetPanel
        spendFromWallet={true}
        chainId={chainId}
        header={(props) => (
          <SwapAssetPanel.Header
            {...props}
            label={'Swap from:'}
          />
        )}
        currency={currencies[Field.INPUT]}
        value={formattedAmounts[Field.INPUT]}
        onChange={handleTypeInput}
        onSelect={handleInputSelect}
      />

      <div className={classNames("flex justify-center -mt-6 -mb-6 z-0")}>
        <div
          role="button"
          className={classNames(`p-1.5 rounded-full bg-dark-800 border shadow-md border-dark-700 hover:border-${getChainColorCode(chainId)}`)}
          onClick={() => {
              onSwitchTokens()
          }}
        >
          {<ArrowDownIcon width={14} className="text-high-emphesis hover:text-white" />}
        </div>
      </div>

      {/* TO ASSET PANEL */}
      <SwapAssetPanel
        spendFromWallet={true}
        chainId={chainId}
        header={(props) => (
          <SwapAssetPanel.Header
            {...props}
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

      <div className={'grid grid-cols-1 justify-between'}>
        <Typography>  From: {fromToken.symbol} </Typography>
        <Typography>  fromAddress: {fromToken.isNative ? '0x' : fromToken.wrapped.address} </Typography>
        <Typography>  inputAmount: {inputAmount} </Typography>

        <Typography>  To: {toToken.symbol} </Typography>
        <Typography>  toAddress: {toToken.wrapped.address} </Typography>
        <Typography>  outputAmount: {outputAmount} </Typography>
      </div>
      <SubmitButton
      onClick={async()=> 
        {
           await getQuote(fromToken.wrapped.address, toToken.wrapped.address, Number(inputAmount) * 10**fromToken.decimals)
          //  console.log('outputAmount:%s', Number(outputAmount))
        }
      }
      >
      </SubmitButton>
    </div>
    </DoubleGlowShadowV2>
    </Container>
  )
}