import React, { lazy, SetStateAction, useCallback, useMemo, useState } from 'react'
import { BigNumber } from 'bignumber.js'
import { useTokenContract } from 'hooks/useContract'
import qs from 'qs'
import Typography from 'components/Typography'
import { useActiveWeb3React } from 'services/web3'
import Web3 from 'web3'
import { ChainId, Currency, NATIVE, Token, WNATIVE } from 'sdk';
// import TradingView from 'components/TradingViewChart'
// import LiveChart from 'components/LiveChart'
// import LineChart from 'components/LiveChart/LineChart'
// import LineGraph from 'components/Dashboard/LineGraph'
// import TokenList from 'features/analytics/Tokens/TokenList'
import SwapAssetPanel from 'features/trident/swap/SwapAssetPanel'
import { classNames } from 'functions/styling'
import { SwapLayoutCard } from 'layouts/SwapLayout'
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

// const  = lazy(() => import('components/LiveChart'))

export default function Aggregate() {
    const { account, chainId } = useActiveWeb3React()
    
    const [ inputAmount, setInputAmount ] = useState(0)
    const [ outputAmount, setOutputAmount ] = useState(0)
    const { independentField, typedValue, recipient } = useSwapState()
    const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()

    const [ inputLogo, setInputLogo ] = useState(0)
    const [ outputLogo, setOutputLogo ] = useState(0)
    
    const [ from, setFrom ] = useState(WNATIVE[chainId])
    const [ toToken, setToToken ] = useState(WNATIVE[chainId])

let currentSelectSide;
let currentTrade: {
    from: {
        address,
        logoURI
    },
    to: { 
        address,
        logoURI
    
    },

};
let tokens;

async function init() {
    await listAvailableTokens();
}

const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)


const { v2Trade, parsedAmount, currencies, inputError: swapInputError, allowedSlippage, to } = useDerivedSwapInfo()
const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)

async function listAvailableTokens(){
    console.log("initializing");
    let response = await fetch('https://tokens.coingecko.com/uniswap/all.json');
    let tokenListJSON = await response.json();
    console.log("listing available tokens: ", tokenListJSON);
    tokens = tokenListJSON.tokens;
    console.log("tokens: ", tokens);

    // create token list for modal
    let parent = document.getElementById("token_list");
    for (const i in tokens){
        // token row in the modal token list
        let div = document.createElement("div");
        div.className = "token_row";
        let html = `
        <img class="token_list_img" src="${tokens[i].logoURI}">
          <span class="token_list_text">${tokens[i].symbol}</span>
          `;
        div.innerHTML = html;
        div.onclick = () => {
            selectToken(tokens[i]);
        };
        parent.appendChild(div);
    };
}

async function selectToken(token){
    closeModal();
    currentTrade[currentSelectSide] = token;
    console.log("currentTrade: ", currentTrade);
    renderInterface();
}

function renderInterface(){
    if (from) {
        console.log(from)
        setFrom(from)
        setInputLogo(currentTrade.from.logoURI)
        // document.getElementById("from_token_text").innerHTML = currentTrade.from.symbol;
    }
    if (to) {
        console.log(to)
        setOutputLogo(currentTrade.to.logoURI)
        // document.getElementById("to_token_text").innerHTML = currentTrade.to.symbol;
    }
}

// async function connect() {
//     if (typeof window.ethereum !== "undefined") {
//         try {
//             console.log("connecting");
//             await window.ethereum.request({ method: "eth_requestAccounts" });
//         } catch (error) {
//             console.log(error);
//         }
//         document.getElementById("login_button").innerHTML = "Connected";
//         // const accounts = await ethereum.request({ method: "eth_accounts" });
//         document.getElementById("swap_button").disabled = false;
//     } else {
//         document.getElementById("login_button").innerHTML = "Please install MetaMask";
//     }
// }

function openModal(side){
    currentSelectSide = side;
    // document.getElementById("token_modal").style.display = "block";
}

function closeModal(){
    // document.getElementById("token_modal").style.display = "none";
}

async function getPrice(){
    console.log("Getting Price");
  
    if (!from || !to || !inputAmount) return;
    let amount = inputAmount * 10 ** from.decimals;
  
    const params = {
        sellToken: from.address,
        buyToken: Field.OUTPUT,
        sellAmount: amount,
    }
  
    // Fetch the swap price.
    const response = await fetch(`https://api.0x.org/swap/v1/price?${qs.stringify(params)}`);
    
    let swapPriceJSON = await response.json();
    console.log("Price: ", swapPriceJSON);
    
   setOutputAmount(swapPriceJSON.buyAmount / (10 ** toToken.decimals))
    // document.getElementById("gas_estimate").innerHTML = swapPriceJSON.estimatedGas;
}

async function getQuote(account){
    console.log("Getting Quote");
  
    if (!from || !to || !inputAmount) return;
    let amount = Number(inputAmount * 10 ** from.wrapped.decimals);
  
    const params = {
        sellToken: from.address,
        buyToken: toToken.address,
        sellAmount: amount,
        takerAddress: account,
    }
  
    // Fetch the swap quote.
    const response = await fetch(`https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`);
    
    let swapQuoteJSON = await response.json();
    console.log("Quote: ", swapQuoteJSON);
    
    setOutputAmount(swapQuoteJSON.buyAmount / (10 ** toToken.decimals))
    // document.getElementById("gas_estimate").innerHTML = swapQuoteJSON.estimatedGas;
  
    return swapQuoteJSON;
}

async function trySwap(){
    const erc20abi= [{ "inputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint256", "name": "max_supply", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }]
    console.log("trying swap");
  
    // Only work if MetaMask is connect
    // Connecting to Ethereum: Metamask
    const web3 = new Web3(Web3.givenProvider);
  
    // The address, if any, of the most recently used account that the caller is permitted to access
    // let accounts = await ethereum.request({ method: "eth_accounts" });
    let takerAddress = account;
    console.log("takerAddress: ", takerAddress);
  
    const swapQuoteJSON = await getQuote(takerAddress);
  
    // Set Token Allowance
    // Set up approval amount
    const fromTokenAddress = from.address;
    const maxApproval = new BigNumber(2).pow(256).minus(1);
    console.log("approval amount: ", maxApproval);
    const ERC20TokenContract = useTokenContract(fromTokenAddress)
    console.log("setup ERC20TokenContract: ", ERC20TokenContract);
  
    // Grant the allowance target an allowance to spend our tokens.
    const tx = await ERC20TokenContract.methods.approve(
        swapQuoteJSON.allowanceTarget,
        maxApproval,
    )
    .send({ from: takerAddress })
    .then(tx => {
        console.log("tx: ", tx)
    });

    // Perform the swap
    const receipt = await web3.eth.sendTransaction(swapQuoteJSON);
    // console.log("receipt: ", receipt);
}  
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

const fiatValueInput = useUSDCValue(parsedAmounts[Field.INPUT])
const fiatValueOutput = useUSDCValue(parsedAmounts[Field.OUTPUT])
const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput)

const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

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
// init();

// document.getElementById("login_button").onclick = connect;
// document.getElementById("from_token_select").onclick = () => {
    // openModal("from");
// };
// document.getElementById("to_token_select").onclick = () => {
//     openModal("to");
// };
// document.getElementById("modal_close").onclick = closeModal;
// document.getElementById("from_amount").onblur = getPrice;
// document.getElementById("swap_button").onclick = trySwap;

return (
    <div>
            <SwapHeader inputCurrency={currencies[Field.INPUT]} outputCurrency={currencies[Field.OUTPUT]} />
          <SwapAssetPanel
            spendFromWallet={true}
            chainId={chainId}
            header={(props) => (
              <SwapAssetPanel.Header
                {...props}
                label={'SwapFrom'}
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
            className={classNames(`p-1.5 rounded-full bg-dark-800 border shadow-md border-dark-700 hover:border-${getChainColorCode(chainId)}`)}
            onClick={() => {
            //   setApprovalSubmitted(false) // reset 2 step UI for approvals
            //   onSwitchTokens()
            }}
          >
            { <ArrowDownIcon width={14} className="text-high-emphesis hover:text-white" /> }
          </div>
        </div>

        /* TO ASSET PANEL */
          <SwapAssetPanel
            spendFromWallet={true}
            chainId={chainId}
            header={(props) => (
              <SwapAssetPanel.Header
                {...props}
                label={'Swap to:'}
              />
            )}
            currency={currencies[Field.OUTPUT]}
            value={formattedAmounts[Field.OUTPUT]}
            onChange={handleTypeOutput}
            onSelect={handleOutputSelect}
            priceImpact={priceImpact}
            priceImpactCss={priceImpactCss}
          />
        {/* {isExpertMode && <RecipientField recipient={recipient} action={setRecipient} />} */}
        {Boolean(trade) && (
          <SwapDetails
            inputCurrency={currencies[Field.INPUT]}
            outputCurrency={currencies[Field.OUTPUT]}
            trade={trade}
            recipient={recipient ?? undefined}
          />
          )}
        {/* {trade && routeNotFound && userHasSpecifiedInputOutput && (
          <Typography variant="xs" className="text-center py-2">
            {`Insufficient liquidity for this trade.`}{' '}
            {singleHopOnly && `Try enabling multi-hop trades`}
          </Typography>
        )} */}
        
        <div className={'grid grid-cols-1 justify-between'}>
        <Typography>  From: {from.symbol} </Typography>
        <Typography>  fromAddress: {from.wrapped.address} </Typography>
        <Typography>  inputAmount: {inputAmount} </Typography>

        <Typography>  To: {toToken.symbol} </Typography>
        <Typography>  toAddress: {toToken.wrapped.address} </Typography>
        <Typography>  outputAmount: {outputAmount} </Typography>
        </div>
        </div>
)
}