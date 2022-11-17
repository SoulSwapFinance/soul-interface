import React, { lazy, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { BigNumber } from "@ethersproject/bignumber";
import { useTokenContract } from 'hooks/useContract'
import qs from 'qs'
import Typography from 'components/Typography'
import { useActiveWeb3React } from 'services/web3'
import Web3 from 'web3'
import { ChainId, Currency, NATIVE, OPEN_OCEAN_EXCHANGE_ADDRESS, SOUL, Token, USDC, WNATIVE } from 'sdk';
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
import { unitToWei } from 'utils/account/conversion'
import useSendTransaction from 'hooks/useSendTransaction'
import { useTokenInfo } from 'hooks/useAPI'
import useFantomERC20 from 'hooks/useFantomERC20'
import useFantomNative from 'hooks/useFantomNative';
import useApiData from 'hooks/useApiData';
import useCoingeckoApi, { COINGECKO_BASEURL, COINGECKO_METHODS } from 'hooks/useCoinGeckoAPI';
import { OPENOCEAN_BASEURL, OPENOCEAN_METHODS } from 'hooks/useOpenOceanAPI';
import NetworkGuard from 'guards/Network';
import { Feature } from 'enums/Feature';
import ERC20ABI from 'constants/abis/bridge/erc20.json'
import { Button } from 'components/Button';

// const  = lazy(() => import('components/LiveChart'))

export default function OpenV1() {
  const { account, chainId } = useActiveWeb3React()

  const [inputAmount, setInputAmount] = useState('0')
  const [outputAmount, setOutputAmount] = useState('0')
  const { independentField, typedValue, recipient } = useSwapState()
  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const [minReceived, setMinReceived] = useState(null);
  // const [priceImpact, setPriceImpact] = useState(null);

  const [swapQuote, setSwapQuote] = useState('')

  const [fromToken, setFromToken] = useState(NATIVE[chainId])
  const [toToken, setToToken] = useState(SOUL[chainId])
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  const fromTokenDecimals = Number(useTokenInfo(fromToken?.wrapped.address).tokenInfo.decimals)
  const { getAllowance, approve } = useFantomERC20();
  const [allowance, setAllowance] = useState(BigNumber.from(0));
  const { sendTx } = useFantomNative();
  const [updated, setUpdated] = useState(false)

  // const handleSwapInOut = () => {
  //   setInputAmount("1");
  //   setOutputAmount("");
  //   setEstimatedGas(null);
  //   setMinReceived(null);
  //   // setPriceImpact(null);
  //   setFromToken(toToken);
  //   setToToken(fromToken);
  // };

  useEffect(() => {
    setOutputAmount("");
    setMinReceived(null);
    // setPriceImpact(null);
    if (inputAmount === "") {
      setEstimatedGas(null);
    }
  }, [inputAmount]);

  const { v2Trade, parsedAmount, currencies, inputError: swapInputError, allowedSlippage, to } = useDerivedSwapInfo()
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)

  async function getQuote(fromTokenAddress, toTokenAddress, inputAmount) {
    console.log("Getting Quote");

    const chainName = chainId == ChainId.AVALANCHE ? 'avax' : chainId == ChainId.ETHEREUM ? 'eth' : 'fantom'
    let amount = inputAmount / 10 ** fromToken.wrapped.decimals
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
  const { getPrice } = useCoingeckoApi();
  const [swapRoute, setSwapRoute] = useState(null);
  const [refetchTimer, setRefetchTimer] = useState(0);
  // const [outTokenAmount, setOutTokenAmount] = useState("");
  const [estimatedGas, setEstimatedGas] = useState(null);

  const { apiData } = useApiData();
  const OOQuoteData =
    apiData[OPENOCEAN_BASEURL + OPENOCEAN_METHODS.GET_QUOTE]?.response?.data
      ?.data;
  const OOSwapQuoteData =
    apiData[OPENOCEAN_BASEURL + OPENOCEAN_METHODS.GET_SWAP_QUOTE]?.response
      ?.data?.data;
  // const tokenPriceData =
  //   apiData[COINGECKO_BASEURL + COINGECKO_METHODS.GET_PRICE]?.response?.data;

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

  // HANDLES - OUTPUT //
  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      setToToken(outputCurrency)
    },
    [onCurrencySelection]
  )

  const handleTypeInput = useCallback(
    async (value: string) => {
      onUserInput(Field.INPUT, value)
      setInputAmount(value)
      await handleOutputSelect
      await getQuote(fromToken.wrapped.address, toToken.wrapped.address, Number(value) * 10 ** fromToken.wrapped.decimals)
    },
    [onUserInput]
  )

  useEffect(() => {
    if (OOQuoteData && toToken?.decimals && parseFloat(outputAmount) > 0) {
      if (
        parseFloat(inputAmount).toFixed(4) ===
        parseFloat(OOQuoteData.inAmount).toFixed(4)
      ) {
        setOutputAmount(OOQuoteData.outAmount);
        // getQuote(fromToken.wrapped.address, toToken.wrapped.address, Number(inputAmount))
        setSwapRoute(OOQuoteData.path);
      }
    }
  }, [OOQuoteData]);

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

  const hasAllowance = (value: BigNumber) => {
    if (fromToken && fromToken.decimals) {
      if (fromToken.isNative) {
        // ?.address === "0x0000000000000000000000000000000000000000") {
        if (isApproveCompleted) {
          resetApproveTx();
        }
        return true;
      }
      return Number(value) >= Number(inputAmount) * 10 ** fromTokenDecimals
    }
    return false;
  };

  const {
    sendTx: handleApprove,
    isPending: isApprovePending,
    isCompleted: isApproveCompleted,
    reset: resetApproveTx,
  } = useSendTransaction(() =>
    approve(
      fromToken?.address,
      OPEN_OCEAN_EXCHANGE_ADDRESS[chainId],
      unitToWei(inputAmount, fromToken?.decimals).toString()
    )
  )

  const {
    sendTx: handleSwap,
    isPending: isSwapPending,
    isCompleted: isSwapCompleted,
    reset: resetSwapTx,
  } = useSendTransaction(() =>
    sendTx(
      OOSwapQuoteData.to,
      Math.floor(OOSwapQuoteData.estimatedGas * 1.5),
      +OOSwapQuoteData.gasPrice * 2,
      OOSwapQuoteData.data,
      OOSwapQuoteData.inToken.address ===
        "0x0000000000000000000000000000000000000000"
        ? OOSwapQuoteData.value
        : null
    )
  );

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
            onChange={()=>{}}
            // onChange={handleTypeOutput}
            onSelect={handleOutputSelect}
            priceImpact={priceImpact}
            priceImpactCss={priceImpactCss}
          />

          {/* {Boolean(trade) && (
            <SwapDetails
              inputCurrency={currencies[Field.INPUT]}
              outputCurrency={currencies[Field.OUTPUT]}
              trade={trade}
              recipient={recipient ?? undefined}
            />
          )} */}

          {/* <div className={'grid grid-cols-1 justify-between'}>
            <Typography>  </Typography>
            <Typography>  fromAddress: {fromToken.isNative ? '0x' : fromToken.wrapped.address} </Typography>
            <Typography>  inputAmount:  </Typography>

            <Typography>  To:  </Typography>
            <Typography>  toAddress: {toToken.wrapped.address} </Typography>
            <Typography>  outputAmount:  </Typography>
          </div> */}
          <div className="flex justify-between">
            <Typography className="text-white" fontFamily={'medium'}>
            Input Amount
            </Typography>
            <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
            {inputAmount} {fromToken.symbol}
            </Typography>
          </div>
          <div className="flex justify-between">
            <Typography className="text-white" fontFamily={'medium'}>
             Expected Output
            </Typography>
            <Typography className={'text-white'} weight={600} fontFamily={'semi-bold'}>
            { outputAmount && updated ?  
              `${outputAmount} ${toToken.symbol}`
              : <Button
                size="xs"
                onClick={
                  async () => {
                  await getQuote(fromToken.wrapped.address, toToken.wrapped.address, Number(inputAmount) * 10 ** fromToken.decimals)
                  await setUpdated(true)
                  }
                }
                >
                {`Click to Refresh`}
                </Button>
              //  console.log('outputAmount:%s', Number(outputAmount))

          }
            </Typography>
          </div>
          {hasAllowance(allowance) ? (
            <Button
              variant="filled"
              color={getChainColorCode(chainId)}
              onClick={handleSwap}
              disabled={isSwapPending || isSwapCompleted} // || !minReceived}
            >
              {isSwapPending
                ? "Swapping..."
                : isSwapCompleted
                  ? "Swap successful"
                  // : !minReceived
                  //   ? "Fetching best price..."
                  : "Swap"
              }
            </Button>
          ) : (
            <Button
              variant="filled"
              color={getChainColorCode(chainId)}
              onClick={handleApprove}
              disabled={isApproveCompleted || isApprovePending}
            >
              {isApprovePending
                ? "Approving..."
                : isApproveCompleted
                  ? "Approved!"
                  : "Approve"}
            </Button>
          )}

          {/* <Button
            variant={'bordered'}
            primaryColor={'blue'}
            size={'xs'}
            // color={"white"}
            onClick={async () => {
              await getQuote(fromToken.wrapped.address, toToken.wrapped.address, Number(inputAmount) * 10 ** fromToken.decimals)
              //  console.log('outputAmount:%s', Number(outputAmount))
            }
            }
          >
            <Typography className={'text-white'}>
              Refresh Quote
            </Typography>
          </Button> */}
        </div>
      </DoubleGlowShadowV2>
    </Container>
  )
}

OpenV1.Guard = NetworkGuard(Feature.AGGREGATE)