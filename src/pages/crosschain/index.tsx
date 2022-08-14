// import './App.css';
import { useEffect, useMemo, useRef, useState } from "react"
import { ethers } from 'ethers'
import {
  EvmTransaction,
  MetaResponse,
  RangoClient,
  TransactionStatus,
  QuoteResponse,
  StatusResponse,
  Asset,
  SwapResponse
} from "rango-sdk-basic"
import { FANTOM, AVALANCHE, BINANCE, Chain, CHAINS, ETHEREUM, POLYGON, MOONRIVER, Token } from "features/cross/chains";

import { checkApprovalSync, prepareEvmTransaction, sleep } from "features/crosschain/utils";
import BigNumber from "bignumber.js";
import React from 'react';
import Container from "components/Container";
import DoubleGlowShadowV2 from "components/DoubleGlowShadowV2";
import HeaderNew from "features/trade/HeaderNew";
import { SwapLayoutCard } from "layouts/SwapLayout";
import Modal from "components/DefaultModal";
import InputCurrencyBox from "pages/bridge/components/InputCurrencyBox";
import Image from 'next/image'
import NetworkModal from "modals/NetworkModal";
import { useNetworkModalToggle } from "state/application/hooks";
import { useActiveWeb3React } from "services/web3";
import { Button } from "components/Button";
import { classNames } from "functions/styling";
import { formatNumber } from "functions/format";
import Typography from "components/Typography";
import CurrencyLogo, { getCurrencyLogoUrls } from "components/CurrencyLogo/CurrencyLogo";
import Logo from "components/Logo";
import { useCurrency } from "hooks/Tokens";
import { BLOCKCHAIN_NAME } from "rubik-sdk";
import { loadERC20Contract } from "utils/wallet";
import { AddressZero } from "@ethersproject/constants";
import { chain } from "lodash";
import { OverlayButton } from "components";
import Row from "components/Row";
import { AutoColumn } from "components/Column";
import { ArrowDownIcon, ArrowRightIcon } from "@heroicons/react/solid";
import ModalHeader from "components/Modal/Header";

declare let window: any

const CHAIN_BY_ID = new Map([
  [FANTOM.chainId, BLOCKCHAIN_NAME.FANTOM],
  [MOONRIVER.chainId, BLOCKCHAIN_NAME.MOONRIVER],
  [POLYGON.chainId, BLOCKCHAIN_NAME.POLYGON],
  [AVALANCHE.chainId, BLOCKCHAIN_NAME.AVALANCHE],
  [ETHEREUM.chainId, BLOCKCHAIN_NAME.ETHEREUM],
  [BINANCE.chainId, BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN],
])

function getChainColor(chain: Chain) {
  // let name = CHAIN_BY_ID.get(chain.chainId)
  // console.log('chainColor', chain?.color)
  return chain?.color
}

function getChainLogo(chain: Chain) {
  return chain?.logo
}

export default function CrossChain() {
  const RANGO_API_KEY = 'c09ed7c9-4866-4f57-8e50-068418f8f95e' // put your RANGO-API-KEY here
  const rangoClient = useMemo(() => new RangoClient(RANGO_API_KEY), [])
  const { account, chainId } = useActiveWeb3React()
  const [tokensMeta, setTokenMeta] = useState<MetaResponse | null>()
  const [inputAmount, setInputAmount] = useState<string>("0.01")
  const [quote, setQuote] = useState<QuoteResponse | null>()
  const [txStatus, setTxStatus] = useState<StatusResponse | null>(null)
  const [loadingMeta, setLoadingMeta] = useState<boolean>(true)
  const [loadingSwap, setLoadingSwap] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [showSelectFrom, setShowSelectFrom] = useState(false)
  const [showSelectTo, setShowSelectTo] = useState(false)
  const [toToken, setToToken] = useState<Token>()
  const [fromToken, setFromToken] = useState<Token>()
  const [sourceChain, setSourceChain] = useState<Chain>(FANTOM)
  const [destinationChain, setDestinationChain] = useState<Chain>(AVALANCHE)
  const [fromBalance, setFromBalance] = useState('')
  const amountRef = useRef<HTMLInputElement>(null)
  const [showConfirmation, setShowConfirmation] = useState<"hide" | "show" | "poor">("hide")
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const toggleNetworkModal = useNetworkModalToggle()

  useEffect(() => {
    setLoadingMeta(true)
    // Meta provides all blockchains, tokens and swappers information supported by Rango
    rangoClient.meta().then((meta) => {
      setTokenMeta(meta)
      setLoadingMeta(false)
    })
  }, [rangoClient])

  // 1inch sample: POLYGON.USDT -> POLYGON.MATIC
  // const sourceChainId = 137
  // const sourceToken = tokensMeta?.tokens.find(t => t.blockchain === "POLYGON" && t.address === '0xc2132d05d31c914a87c6611c10748aeb04b58e8f')
  // const destinationToken = tokensMeta?.tokens.find(t => t.blockchain === "POLYGON" && t.address === null)

  // 1inch sample: BSC.BAKE -> BSC.BNB
  // const sourceChainId = 56
  // const sourceToken = tokensMeta?.tokens.find(t => t.blockchain === "BSC" && t.address === "0xe02df9e3e622debdd69fb838bb799e3f168902c5")
  // const destinationToken = tokensMeta?.tokens.find(t => t.blockchain === "BSC" && t.address === '0x55d398326f99059ff775485246999027b3197955')

  // anyswap sample: POLYGON.USDT to BSC.USDT
  // const sourceChainId = 137
  // const sourceToken = tokensMeta?.tokens.find(t => t.blockchain === "POLYGON" && t.address === '0xc2132d05d31c914a87c6611c10748aeb04b58e8f')
  // const destinationToken = tokensMeta?.tokens.find(t => t.blockchain === "BSC" && t.address === '0x55d398326f99059ff775485246999027b3197955')

  // aggregator sample 1: BSC.BNB to FTM.USDT
  // const sourceChainId = 56
  // const sourceToken = tokensMeta?.tokens.find(t => t.blockchain === "BSC" && t.address === null)
  // const destinationToken = tokensMeta?.tokens.find(t => t.blockchain === "FANTOM" && t.address === '0x049d68029688eabf473097a2fc38ef61633a3c7a')

  // aggregator sample 2: BSC.BNB to FTM.FTM
  // const sourceChainId = 56
  // const sourceToken = tokensMeta?.tokens.find(t => t.blockchain === "BSC" && t.address === null)
  // const destinationToken = tokensMeta?.tokens.find(t => t.blockchain === "FANTOM" && t.address === null)

  // aggregator sample 3: POLYGON.USDC to BSC.USDC
  // const sourceChainId = 137
  // const sourceToken = tokensMeta?.tokens.find(t => t.blockchain === "POLYGON" && t.address === '0x2791bca1f2de4661ed88a30c99a7a9449aa84174')
  // const destinationToken = tokensMeta?.tokens.find(t => t.blockchain === "BSC" && t.address === '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d')

  // aggregator sample 4: BSC.BNB to FTM.FTM
  let sourceChainId = 250
  let sourceToken = tokensMeta?.tokens.find(t => t.blockchain === CHAIN_BY_ID.get(sourceChain.chainId) && t.address === (fromToken?.isNative ? null : fromToken?.address))
  let destinationToken = tokensMeta?.tokens.find(t => t.blockchain === CHAIN_BY_ID.get(destinationChain.chainId) && t.address === (toToken?.isNative ? null : toToken?.address))
  const wrongNetwork = sourceChain?.chainId != chainId ? true : false
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  console.log('sTokenChain:%s', CHAIN_BY_ID.get(sourceChain.chainId))
  const getBalance = async (address: string, provider: any) => {
    if (address === AddressZero || !address) {
      let fromBalance = provider.getBalance(account)
      return fromBalance
    }
    await setFromBalance(fromBalance)
    const contract = await loadERC20Contract(address, provider)
    return contract.balanceOf(account)
  };

  const getUserWallet = async () => {
    await provider.send('eth_requestAccounts', [])
    return await provider.getSigner().getAddress()
  }

  const swap = async () => {
    setError("")
    setQuote(null)
    setTxStatus(null)
    let userAddress = ''
    try {
      userAddress = await getUserWallet()
      console.log({ userAddress })
    } catch (err) {
      setError('Error connecting to MetMask. Please check Metamask and try again.')
      return
    }

    if (!(window.ethereum).isConnected()) {
      setError('Error connecting to MetMask. Please check Metamask and try again.')
      return
    }

    if (window.ethereum.chainId && parseInt(window.ethereum.chainId) !== sourceChain?.chainId) {
      setError(`Change meta mask network to '${sourceChain?.name}'.`)
      return
    }

    if (!userAddress) {
      setError(`Could not get wallet address.`)
      return
    }
    if (!inputAmount) {
      setError(`Set input amount`)
      return
    }
    if (!sourceToken || !destinationToken)
      return

    setLoadingSwap(true)
    const from: Asset = { blockchain: sourceToken?.blockchain, symbol: sourceToken?.symbol, address: sourceToken?.address }
    const to: Asset = { blockchain: destinationToken?.blockchain, symbol: destinationToken?.symbol, address: destinationToken?.address }
    const amount: string = (new BigNumber(inputAmount)).shiftedBy(sourceToken?.decimals).toString()

    // const amount: string = (new BigNumber(inputAmount)).shiftedBy(fromToken?.decimals).toString()

    const quoteResponse = await rangoClient.quote({
      amount,
      from,
      to,
      // swappers: ['cBridge v2.0', 'OneInchPolygon'],
      messagingProtocols: ['axelar', 'cbridge'],
      // sourceContract: "0x123...",
      // destinationContract: "0x123...",
      // imMessage: "0x"
    })
    setQuote(quoteResponse)
    console.log({ quoteResponse })

    if (!quoteResponse || !quoteResponse?.route || quoteResponse.resultType !== "OK") {
      setError(`Invalid quote response: ${quoteResponse.resultType}, please try again.`)
      setLoadingSwap(false)
      return
    }
    else {
      await executeRoute(from, to, userAddress, amount)
    }
  }

  const executeRoute = async (from: Asset, to: Asset, fromAddress: string, inputAmount: string) => {
    const provider = await new ethers.providers.Web3Provider(window.ethereum as any)
    const signer = provider.getSigner()
    if (!from || !to)
      return

    let swapResponse: SwapResponse | null = null
    try {
      console.log({
        from,
        to,
        amount: inputAmount,
        fromAddress: fromAddress,
        toAddress: fromAddress,
        disableEstimate: false,
        referrerAddress: null,
        referrerFee: null,
        slippage: '1.0',
        // swappers: ['cBridge v2.0', 'OneInchPolygon'],
        messagingProtocols: ['axelar', 'cbridge'],
      })
      swapResponse = await rangoClient.swap({
        from,
        to,
        amount: inputAmount,
        fromAddress: fromAddress,
        toAddress: fromAddress,
        disableEstimate: false,
        referrerAddress: null,
        referrerFee: null,
        slippage: '1.0',
        // swappers: ['cBridge v2.0', 'OneInchPolygon'],
        messagingProtocols: ['axelar', 'cbridge'],
        // sourceContract: "0x123...",
        // destinationContract: "0x123...",
        // imMessage: "0x"
      })
      console.log({ swapResponse })

      if (!!swapResponse.error || swapResponse.resultType === "NO_ROUTE" || swapResponse.resultType === "INPUT_LIMIT_ISSUE") {
        setError(`Error swapping, error message: ${swapResponse.error}, result type: ${swapResponse.resultType}`)
        setLoadingSwap(false)
        return
      }

      const evmTransaction = swapResponse.tx as EvmTransaction
      console.log({ evmTransaction })

      // if approve data is not null, it means approve needed, otherwise it's already approved.
      if (!!evmTransaction.approveData) {
        // try to approve
        const finalTx = prepareEvmTransaction(evmTransaction, true)
        console.log("approve tx", { finalTx })
        const txHash = (await signer.sendTransaction(finalTx)).hash
        await checkApprovalSync(swapResponse.requestId, txHash, rangoClient)
        console.log("transaction approved successfully")
      }
      const finalTx = prepareEvmTransaction(evmTransaction, false)
      const txHash = (await signer.sendTransaction(finalTx)).hash
      const txStatus = await checkTransactionStatusSync(swapResponse.requestId, txHash, rangoClient)
      console.log("transaction finished", { txStatus })
      console.log("bridged data?", txStatus.bridgeData)
      setLoadingSwap(false)
    } catch (e) {
      const rawMessage = JSON.stringify(e).substring(0, 90) + '...'
      setLoadingSwap(false)
      setError(rawMessage)
      // report transaction failure to server if something went wrong in client for signing and sending the transaction
      if (!!swapResponse) {
        await rangoClient.reportFailure({
          data: { message: rawMessage },
          eventType: 'TX_FAIL',
          requestId: swapResponse.requestId,
        })
      }
    }
  }

  const checkTransactionStatusSync = async (requestId: string, txHash: string, rangoClient: RangoClient) => {
    while (true) {
      const txStatus = await rangoClient.status({
        requestId: requestId,
        txId: txHash,
      }).catch((error: any) => {
        console.log(error)
      })
      if (!!txStatus) {
        setTxStatus(txStatus)
        console.log({ txStatus })
        console.log(txStatus.bridgeData?.destTokenPrice, txStatus.bridgeData?.srcTokenPrice)
        if (!!txStatus.status && [TransactionStatus.FAILED, TransactionStatus.SUCCESS].includes(txStatus.status)) {
          return txStatus
        }
      }
      await sleep(3000)
    }
  }

  interface FromComponentProps {
    fromTokenLogo: string
    fromTokenSymbol: string
  }

  interface ToComponentProps {
    toTokenLogo: string
    toTokenSymbol: string
  }

  const FromComponent: React.FC<FromComponentProps> = ({ fromTokenSymbol, fromTokenLogo }) => {
    fromTokenSymbol = sourceToken ? sourceToken?.symbol : 'FTM'
    return (
      <div
        className="grid grid-cols-1 rounded bg-dark-1000 border border-4 w-full"
        style={{ borderColor: getChainColor(sourceChain) }}
      >
        {wrongNetwork &&
          <div
            className="grid grid-cols-2 items-center border-4 rounded border-dark-1000 bg-dark-1000 hover:bg-dark-900 whitespace-nowrap text-md justify-center font-bold cursor-pointer select-none pointer-events-auto"
            onClick={() => toggleNetworkModal()}
          >
            <div
              className="hidden lg:flex lg:rounded lg:rounded-2xl lg:m-2 lg:text-center lg:text-lg lg:justify-center lg:p-3 lg:border"
              style={{ borderColor: getChainColor(sourceChain) }}
            >
              Switch to {(sourceChain?.name, true)} Network
            </div>
            <div
              className="lg:hidden flex rounded rounded-2xl m-1 text-center text-lg justify-center p-2 border"
              style={{ borderColor: getChainColor(sourceChain) }}
            >
              Switch Network
            </div>
            <Image
              src={sourceChain?.logo}
              alt="Switch Network"
              className="flex align-center justify-center"
              style={{ backgroundColor: getChainColor(sourceChain) }}
              width="42" height="42"
            />
            <NetworkModal />
            {/* {NETWORK_LABEL[chainId]} */}
          </div>
        }
        <div
          className={"flex w-full border border-4"}
          style={{ borderColor: getChainColor(sourceChain) }}
        />
        <Image
          className="flex align-center justify-center"
          width="36" height="36"
          style={{ backgroundColor: getChainColor(sourceChain) }}
          src={getChainLogo(sourceChain)}
          alt={sourceChain?.name}
          onClick={() => setShowSelectFrom(true)}
        >
        </Image>
        <div
          className={"flex w-full border border-4"}
          style={{ borderColor: getChainColor(sourceChain) }}
        />
        <Button
          className="grid grid-cols-2 bg-dark-2000 max-h-[86px] w-full justify-between"
          onClick={() => setShowSelectFrom(true)}
          variant={'outlined'}
          color={'black'}
        >
          <div className="">
            <Image className="block object-fit:contain object-position:center items-center"
              src={fromTokenLogo}
              width="48" height="48"
              alt={fromTokenSymbol}
            />
          </div>
          {/* {console.log('fromToken:%s', fromTokenLogo)} */}
          <div className="flex justify-center mt-2 font-bold text-2xl">
            {fromTokenSymbol}
          </div>
        </Button>
        <div
          className={"flex w-full border border-2"}
          style={{ borderColor: getChainColor(sourceChain) }}
        />
        <div className="grid grid-cols-1">

          <div className={`flex flex-col p-3 w-full space-y-1 bg-dark-1000`}
          >
            <div className="flex justify-center">
              <Typography className={classNames('text-lg font-bold', 'text-white')} weight={600} fontFamily={'semi-bold'}>
                {!loadingSwap
                  ? `${formatNumber(Number(inputAmount), false, true)} ${fromTokenSymbol}`
                  : "0 ($0.00)"}
              </Typography>
              {/* (${formatNumber(inputAmount, true, true)})  */}
            </div>
          </div>
          <div
            className={"flex w-full border border-2"}
            style={{ borderColor: getChainColor(sourceChain) }}
          />
        </div>
        {showSelectFrom &&
          <div>
            <TokenSelect
              show={showSelectFrom}
              chain={sourceChain}
              token={fromToken}
              onClose={f => {
                setShowSelectFrom(false)
                if (!f) {
                  return;
                }
                setFromToken(f.token)
                setDestinationChain(f.chain)
                setInputAmount("")
                setFromBalance("")
                amountRef.current?.select()
              }}
            />
          </div>}
      </div>

    )
  }

  const ToComponent: React.FC<ToComponentProps> = ({ toTokenSymbol, toTokenLogo }) => {
    return (
      <div
        className="grid grid-cols-1 rounded bg-dark-1000 border border-4 w-full"
        style={{ borderColor: getChainColor(destinationChain) }}
      >

        <div
          className={"flex w-full border border-4"}
          style={{ borderColor: getChainColor(destinationChain) }}
        />
        <Image
          className="flex align-center justify-center"
          width="36" height="36"
          style={{ backgroundColor: getChainColor(destinationChain) }}
          src={getChainLogo(destinationChain)}
          alt={destinationChain?.name}
          onClick={() => setShowSelectTo(true)}
        >
        </Image>
        <div
          className={"flex w-full border border-4"}
          style={{ borderColor: getChainColor(destinationChain) }}
        />
        <Button
          className="grid grid-cols-2 bg-dark-2000 max-h-[86px] w-full justify-between"
          onClick={() => setShowSelectTo(true)}
          variant={'outlined'}
          color={'black'}
        >
          <div className="">
            <Image className="block object-fit:contain object-position:center items-center"
              src={toTokenLogo}
              width="48" height="48"
              alt={toTokenSymbol}
            />
          </div>
          {/* {console.log('fromToken:%s', toTokenLogo)} */}
          <div className="flex justify-center mt-2 font-bold text-2xl">
            {toTokenSymbol}
          </div>
        </Button>
        <div
          className={"flex w-full border border-2"}
          style={{ borderColor: getChainColor(destinationChain) }}
        />
        <div className="grid grid-cols-1">

          <div className={`flex flex-col p-3 w-full space-y-1 bg-dark-1000`}
          >
            <div className="flex justify-center">
              <Typography className={classNames('text-lg font-bold', 'text-white')} weight={600} fontFamily={'semi-bold'}>
                {quote
                  ? `${formatNumber(Number(quote?.route?.outputAmount), false, true)} ${toTokenSymbol}`
                  : "0 ($0.00)"}
              </Typography>
              {/* (${formatNumber(inputAmount, true, true)})  */}
            </div>
          </div>
          <div
            className={"flex w-full border border-2"}
            style={{ borderColor: getChainColor(destinationChain) }}
          />
        </div>

        {showSelectTo &&
          <div>
            <TokenSelect
              show={showSelectTo}
              chain={destinationChain}
              token={toToken}
              onClose={t => {
                setShowSelectTo(false)
                if (!t) {
                  return;
                }
                setDestinationChain(t.chain)
                setToToken(t.token)
              }}
            />
          </div>}

      </div>
    )
  }

  const Quote: React.FC = ({ }) => {
    return (
      <tbody>
        {quote && (
          <React.Fragment>
            <tr>
              <td>expected output</td>
              <td>{new BigNumber(quote?.route?.outputAmount || "0").shiftedBy(-(destinationToken?.decimals || 0)).toString()} {destinationToken?.symbol}</td>
            </tr>
            <tr>
              <td>time estimate</td>
              <td>{quote.route?.estimatedTimeInSeconds}s</td>
            </tr>
          </React.Fragment>
        )}
        {txStatus && (
          <React.Fragment>
            <tr>
              <td>status</td>
              <td>{txStatus.status || TransactionStatus.RUNNING}</td>
            </tr>
            <tr>
              <td>output</td>
              <td>{new BigNumber(txStatus.output?.amount || "0").shiftedBy(-(destinationToken?.decimals || 0)).toString() || '?'} {txStatus.output?.receivedToken?.symbol || ""}  {txStatus.output?.type || ""}</td>
            </tr>
            <tr>
              <td>error?</td>
              <td>{txStatus.error || '-'}</td>
            </tr>
            {txStatus.explorerUrl?.map((item, id) => (
              <tr key={id}>
                <td>explorer url [{id}]</td>
                <td>
                  <a href={item.url}>{item.description || "Tx Hash"}</a>
                </td>
              </tr>
            ))}
            {!!txStatus.bridgeData && (
              <React.Fragment>
                <tr>
                  <td>srcChainId</td>
                  <td>{txStatus.bridgeData.srcChainId}</td>
                </tr>
                <tr>
                  <td>destChainId</td>
                  <td>{txStatus.bridgeData.destChainId}</td>
                </tr>
                <tr>
                  <td>srcToken</td>
                  <td>{txStatus.bridgeData.srcToken}</td>
                </tr>
                <tr>
                  <td>destToken</td>
                  <td>{txStatus.bridgeData.destToken}</td>
                </tr>
                <tr>
                  <td>srcTokenAmt</td>
                  <td>{txStatus.bridgeData.srcTokenAmt}</td>
                </tr>
                <tr>
                  <td>destTokenAmt</td>
                  <td>{txStatus.bridgeData.destTokenAmt}</td>
                </tr>
                <tr>
                  <td>srcTxHash</td>
                  <td>{txStatus.bridgeData.srcTxHash}</td>
                </tr>
                <tr>
                  <td>destTxHash</td>
                  <td>{txStatus.bridgeData.destTxHash}</td>
                </tr>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </tbody>
    )
  }

  return (
    <Container id="cross-page" maxWidth="2xl" className="space-y-4">
      <DoubleGlowShadowV2>
        <div className="p-4 mt-4 space-y-4 rounded bg-dark-1000" style={{ zIndex: 1 }}>
          <div className="px-2">
            <HeaderNew />
          </div>
          <SwapLayoutCard>
            {/* {loadingMeta && (<div className="loading" />)} */}
            {/* {!loadingMeta && (<img src={sourceToken?.image} alt="USDT" height="50px" />)} */}
            <div>
              <FromComponent fromTokenLogo={fromToken?.logo} fromTokenSymbol={fromToken?.symbol} />
              <InputCurrencyBox
                // disabled={!fromTokenLogo}
                value={inputAmount}
                setValue={async (inputAmount) => await setInputAmount(inputAmount)}
                // max={async () => setAmount(ethers.utils.formatUnits(await getBalance(), decimals))}
                variant="new"
              />
              <div className="flex w-full text-sm justify-end font-bold">
                <Button
                  onClick={
                    async () =>
                      setInputAmount(ethers.utils.formatUnits(
                        await getBalance(
                          // native || token
                          fromToken?.isNative
                            ? AddressZero
                            : fromToken?.address, provider),
                        // decimals
                        fromToken?.decimals))
                  }
                >
                  MAX
                  {/* : {
                    fromBalance
                    ? formatNumber(Number(fromBalance), false, true)
                  : '0'} */}
                </Button>
              </div>
            </div>
            <Row style={{ justifyContent: "center", alignItems: "center" }}>
              {/* <div style={{ height: "1px", width: "100%" }} /> */}
              <OverlayButton
                style={{ padding: 0 }}
              >
                <AutoColumn justify="space-between" className="py-0 -my-12">
                  <div className="flex justify-center z-0">
                    <div
                      role="button"
                      className="p-2.5 rounded-full bg-dark-1000 border border-2 shadow-md"
                      style={{ borderColor: sourceChain?.color }}
                    >
                      <ArrowDownIcon
                        width={24}
                        className="text-high-emphesis hover:text-white"
                        style={{ color: destinationChain?.color }}
                      />
                    </div>
                  </div>
                </AutoColumn>
              </OverlayButton>
              <div style={{ height: "1px", width: "1000%" }} />
            </Row>
            <ToComponent toTokenLogo={destinationToken?.image} toTokenSymbol={destinationToken?.symbol} />

            <div
              className="flex p-2 justify-center gap-6 text-lg text-center bg-dark-1000 font-bold"
              style={{ color: sourceChain.color }}
            >
              {formatNumber(inputAmount, false, true)} {destinationToken?.symbol}
              {/* ({formatNumber(fromUsd, true, true)}) */}
              <div
                className="flex"
                style={{ color: 'white' }}
              >

                <ArrowRightIcon className="m-2 border border-2 rounded" height="21px" />

              </div>

              <div
                className="flex"
                style={{ color: destinationChain?.color }}
              >
                {new BigNumber(quote?.route?.outputAmount || 0).shiftedBy(-(destinationToken?.decimals || 0)).toString()} {destinationToken?.symbol}
                {/* ({formatNumber(toUsd, true, true)}) */}
              </div>
            </div>

            <div
              className="rounded border border-2"
              style={{ borderColor: destinationChain?.color, backgroundColor: destinationChain?.color }}

            >

              <Button
                className="h-[60px]"
                variant="bordered"
                color="black"
                onClick={
                  async () => {
                    await
                      setShowConfirmationModal(true)
                  }
                }
                style={{ opacity: quote ? 1 : 0.5, cursor: quote ? "pointer" : "not-allowed" }}
                disabled={loadingMeta || loadingSwap}
              >
                {"Confirm Swap"}
                {/* {sourceChain.chainId === destinationChain?.chainId ? "Swap" : "Swap Crosschain"} */}
              </Button>
            </div>
            {/* <button id="swap" onClick={swap} disabled={loadingMeta || loadingSwap}>swap</button> */}

            {setShowConfirmationModal &&
              <Modal isOpen={showConfirmationModal} onDismiss={
                () => setShowConfirmationModal(false)}>
                <div className="space-y-4">
                  <ModalHeader header={`Are you sure?`}
                    onClose={() => setShowConfirmationModal(false)}
                  />
                  <Typography variant="lg">
                    Crosschain Swaps are currently in beta, so use at your own risk.
                    <br /><br />
                    We are committed to open source and we leverage the Rubic SDK (our partners).
                  </Typography>
                  <Typography variant="sm" className="font-medium">
                    Found Bugs?
                    <a href="https://discord.com/invite/soulswap">
                      {' '} Click Here
                    </a>
                  </Typography>
                  <Button
                    variant="bordered"
                    color="black"
                    height="2.5rem"
                    onClick={
                      async () => {
                        setShowConfirmation("show")
                        try {
                          await swap
                        } catch (e) {
                          if (e) {
                            setShowConfirmation("poor")
                          } else {
                            console.error(e)
                            setShowConfirmation("hide")
                          }
                        }
                      }}
                    style={{ borderColor: destinationChain?.color, backgroundColor: destinationChain?.color }}

                  >
                    I UNDERSTAND THESE TERMS
                  </Button>
                </div>
              </Modal>
            }
            
            <div className="flex"
              style={{ flexDirection: "column", justifyContent: "space-around", alignItems: "center" }}
            >
              <div className="flex"
                style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}
              >
                {quote && <div className='green-text'>
                  {quote.route?.swapper && (<img src={quote.route?.swapper?.logo} alt="swapper logo" width={50} />)} <br />
                  {quote.route?.swapper?.title}
                </div>}
                <br />
                {quote && (
                  <div>
                    <table className='border-collapse border'>
                      <Quote />
                    </table>
                  </div>
                )}
                {!!error && (<div className="error-message">{error}</div>)}
              </div>
              <br />
              <button id="swap" onClick={swap} disabled={loadingMeta || loadingSwap}>swap</button>
            </div>

            {/* {loadingMeta && (<div className="loading" />)} */}
            {/* {!loadingMeta && (<img src={destinationToken?.image} alt="Matic" height="50px" />)} */}
            <div className="">from (chain-token): {sourceChain?.name}-{sourceToken?.symbol}</div>
            <div className="">to (chain-token): {destinationChain?.name}-{destinationToken?.symbol}</div>
            <div className="">fromAmount: {quote?.route?.outputAmount}</div>

          </SwapLayoutCard>
        </div>
      </DoubleGlowShadowV2>
    </Container>
  )
}


interface TokenSelectProps {
  show: boolean;
  chain: Chain;
  token: Token
  onClose: (selection?: { token: Token; chain: Chain }) => void;
}
const TokenSelect: React.FC<TokenSelectProps> = ({ show, onClose, chain, token }) => {
  const [filter, setFilter] = useState("")
  const [destinationChainId, setSelectedChainId] = useState(chain.chainId)
  const [sourceToken, setSourceToken] = useState<Asset>()
  const [destinationToken, setDestinationToken] = useState<Asset>()
  const destinationChain = useMemo(() => CHAINS.find(c => c.chainId === destinationChainId), [destinationChainId, CHAINS])
  const input = useRef<HTMLInputElement>(null)
  const tokensList = useRef<HTMLDivElement>(null)
  const normalizedFilter = filter.trim().toLowerCase()
  const filteredTokens = destinationChain.tokens.filter(({ name, symbol, address }) => {
    const isNameMatch = name.toLowerCase().includes(normalizedFilter)
    const isSymbolMatch = symbol.toLowerCase().includes(normalizedFilter)
    const isAddressMatch = address.startsWith(normalizedFilter) || address.startsWith("0x" + normalizedFilter)
    return isNameMatch || isSymbolMatch || isAddressMatch;
  })
  const [isShowingChainSelect, showChainSelect] = useState(false)

  useEffect(() => {
    if (!show) {
      return;
    }

    input.current?.focus()

    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    };
    window.addEventListener("keydown", escape)
    return () => {
      window.removeEventListener("keydown", escape)
    };
  }, [show])

  useEffect(() => {
    if (!show) {
      setTimeout(() => {
        setFilter("")
        setSelectedChainId(chain.chainId)
        setSourceToken(sourceToken)
        setDestinationToken(destinationToken)
        showChainSelect(false)
        tokensList.current?.scrollTo({ top: 0 })
      }, 100)
    }
  }, [show])

  return (
    <div className={'absolute top-20 left-0 w-[100vw] h-[0vh] z-[1000] opacity'
    } style={{ opacity: show ? 1 : 0, pointerEvents: show ? "unset" : "none" }}>
      <div className="absolute top-0 left-0 w-[100%] h-[100%]" onClick={() => onClose()} />
      <div className={classNames(show ? "absolute left-[15%] bottom-[10%] top-[50%] max-w-[28ch]" : 'hidden')}
        style={{ transform: `translate(-50%, calc(-50% + ${show ? 0 : 30}px))` }}
      >
        <div
          className={classNames(isShowingChainSelect ? "w-full h-full top-0 left-0 z-10 bg-dark-1100" : "hidden")}
        >

          {/* CHAIN SELECTION */}
          <Modal
            isOpen={isShowingChainSelect}
            onDismiss={() => onClose()}
            isCustom={true}
          >
            <div className="flex justify-center">
              {CHAINS.map((chain, i) => (
                <Button
                  key={chain.chainId}
                  onClick={() => {
                    setSelectedChainId(chain.chainId)
                    tokensList.current?.scrollTo({ top: 0 })
                    showChainSelect(false)
                    setFilter("")
                  }}
                  variant="bordered"
                  color="black"
                  className={classNames(chain.chainId === destinationChainId && `border border-2 border-white`, "flex border border-transparent hover:border-white align-center w-[100%]")}
                  style={{ backgroundColor: chain.color }}
                >
                  <div className={classNames('grid justify-center')}>
                    <Image src={chain.logo} width={'42'} height="42" alt={chain.name + ' logo'} />
                  </div>
                </Button>
              ))}
            </div>
          </Modal>
        </div>

        {/* TOKEN + CHAIN MODAL */}
        <div
          className="flex flex-cols border-radius-[8px] w-[100%] h-[100%] bg-dark-1100"
          style={{
            transform: isShowingChainSelect ? "translateY(50px)" : "",
            opacity: isShowingChainSelect ? 0 : 1,
            pointerEvents: show ? "all" : "none",
          }}
        >
          <Modal
            isOpen={true}
            isCustom={true}
            onDismiss={() => onClose()}
            borderColor={destinationChain?.color}
          >
            <div className="bg-dark-900 rounded padding-[10px]">
              <Button
                className="flex p-[10px] w-[100%] gap-[8px] align-center items-center"
                variant="bordered"
                color="black"
                style={{ backgroundColor: destinationChain?.color }}
                onClick={() => showChainSelect(true)}
              >
                <div className="grid grid-cols-1 w-[33%]">
                  <Image
                    src={destinationChain?.logo}
                    width="36" height="36"
                    alt={destinationChain?.name + ' logo'}
                    className={"w-full justify-center"}
                  />
                </div>
                <div style={{ flexGrow: 1, fontSize: "24px", textAlign: "center" }}>{destinationChain?.name}</div>
              </Button>

              {/* SEARCH BAR */}
              {/* <form
                onSubmit={e => {
                  e.preventDefault()
                  onClose({ token: filteredTokens[0], chain: selectedChain })
                }}
              >
                <Input
                  ref={input}
                  className="w-[100%] border border-unset border-radius-[4px] text-black mb-2"
                  placeholder={`Search ${destinationChain?.name} tokens`}
                  value={filter}
                  onChange={e => setFilter(e.currentTarget.value)}
                />
              </form> */}
              <div className="w-[100%] my-6" />


              {/* SELECT TOKEN LIST */}
              {/* {filter && */}
              <div className="grid grid-cols-4 bg-dark-1100 w-full" ref={tokensList}>
                {filteredTokens.map(token => (
                  <div className="flex border border-2 m-0.5 
                    border-dark-1000 p-1
                    rounded rounded-3xl bg-black font-bold 
                    text-center justify-center"
                    key={token.address} onClick={() => onClose({ token, chain: destinationChain })}>
                    <Image src={token.logo} width="56" height="56" alt={token.name + ' logo'} />
                  </div>
                ))}
              </div>
              {/* } */}
            </div>
          </Modal>
        </div>
      </div>
    </div>
  )
}