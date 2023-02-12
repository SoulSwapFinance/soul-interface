import React, { useEffect, useState } from "react";
import Row from "../../components/Row";
import { Button as ButtonComponent } from 'components/Button'
import Column, { AutoColumn } from "../../components/Column"
import styled from "styled-components"
import {
  chainToNetworkInfoMap,
  supportedChainsForBridge,
  transactionStatusMapping,
} from "../../utils/bridge"
// import DropDownButton from "../../components/DropDownButton"
import useBridgeApi from "../../hooks/useBridgeApi"
import useMultiChain from "../../hooks/useMultiChain"
import Modal from "components/Bridge/Modal"
// import ModalTitle from "components/Bridge/ModalTitle"
import ModalContent from "components/Bridge/ModalContent"
import Scrollbar from "components/Scrollbar"
import useModal from "../../hooks/useModal"
// import InputCurrencyBox from "components/Bridge/InputCurrencyBox"
import { AddressZero } from "@ethersproject/constants"
import {
  formatSimpleValue,
  unitToWei,
  // weiToUnit,
} from "../../utils/conversion"
import { formatAddress, loadERC20Contract } from "../../utils/wallet"
import useBridge from "../../hooks/useBridge"
import useSendTransaction from "../../hooks/useSendTransaction"
import useFantomERC20 from "../../hooks/useFantomERC20"
import DoubleGlowShadowV2 from "components/DoubleGlowShadowV2"
import { BigNumber } from "@ethersproject/bignumber"
import Loader from "../../components/Loader"
import FadeInOut from "../../components/AnimationFade"
// import { ContentBox, OverlayButton, Typo1, Typo2, Typo3 } from "components/index"
import { useActiveWeb3React } from "services/web3"
// import { ArrowDownIcon, ArrowRightIcon } from "@heroicons/react/24/solid"
import Image from 'next/image'
import Typography from "components/Typography"
// import Container from "components/Container"
// import SwapHeader from "features/swap/SwapHeader"
// import NavLink from "components/NavLink"
// import { NETWORK_ICON, NETWORK_LABEL } from "config/networks"
// import NetworkModal from "modals/NetworkModal"
// import { useNetworkModalToggle } from "state/application/hooks"
// import Web3Network from "components/Web3Network"
import { getChainColor, getChainColorCode } from "constants/chains"
import SwapDropdown from "features/swap/SwapDropdown"
// import { SwapLayoutCard } from "layouts/SwapLayout";
// import { classNames } from "functions/styling";
import { t } from "@lingui/macro";
import { i18n } from "@lingui/core";
import { DonateBanner } from "components/Banner";
import BRIDGE_BANNER from 'assets/branding/bridge-banner.png'
import BridgeTokenList from "features/bridge/BridgeTokenList";
import { ContentBox, OverlayButton, Typo1, Typo2 } from "components";
import TokenStats from "components/TokenStats";
import { ArrowDownIcon } from "@heroicons/react/24/solid";
import { classNames } from "functions/styling";

const ChainSelection: React.FC<any> = ({
  setTokenList,
  // connectToChain,
  bridgeToChain,
}) => {
  const { chainId, account, connector, deactivate, library } = useActiveWeb3React()

  // const [fromChain, setFromChain] = useState(chainId)
  const fromChain = chainId
  const [toChain, setToChain] = useState(chainId == 250 ? 43114 : 250)
  const { getBridgeTokens } = useBridgeApi()
  const { forceSwap, DEFAULT_PROVIDERS } = useMultiChain()

  const getBalance = async (address: string, provider: any) => {
    if (address === AddressZero || !address) {
      return provider.getBalance(account)
    }

    const contract = await loadERC20Contract(address, provider)
    return contract.balanceOf(account)
  }

  // useEffect(() => {
  //   connectToChain(fromChain)
  // }, [fromChain])

  useEffect(() => {
    bridgeToChain(toChain)
  }, [toChain])

  useEffect(() => {
    setTokenList(null)
    getBridgeTokens(toChain, fromChain)?.then((tokenList) => {
      if (tokenList?.length) {
        const tokenOrder = [
          "FTM", "WFTM", "SOUL", "USDC", "USDT", "fUSDT", "DAI", "BOO", "MIM", "ETH", "WETH", "BTC", "WBTC", "MATIC", "AVAX", "BNB",
        ];
        if (tokenList?.length && account) {
          const stickyTokens = tokenOrder
            .map((symbol) => {
              return tokenList.find(
                (token: any) =>
                  token.symbol.toLowerCase() === symbol.toLowerCase()
              )
            })
            .filter((item: any) => item)
          const restOfTokens = tokenList.filter(
            (token: any) => !stickyTokens.includes(token)
          )

          const allTokens = [...stickyTokens, ...restOfTokens];
          const fromProvider = DEFAULT_PROVIDERS[fromChain];
          const toProvider = DEFAULT_PROVIDERS[toChain];
          const tokensAndBalances = allTokens.map((token) => {
            return {
              ...token,
              balance: getBalance(
                token.isNative === "true" ? AddressZero : token.ContractAddress,
                fromProvider
              ),
              balanceTo: getBalance(
                token.isNativeTo === "true"
                  ? AddressZero
                  : token.ContractAddressTo,
                toProvider
              ),
            }
          })
          setTokenList(tokensAndBalances)
        }
      }
    })
  }, [fromChain, toChain, account])

  const handleSetToChain = (toChain: number) => {
    // if (chainId !== 250) {
    //   setFromChain(250)
    // }
    // if (chainId === fromChain) {
    //   setFromChain(chainId === 250 ? 1 : 250)
    // }
    setToChain(toChain)
    // V2 (BELOW)
    // setToChain(chainId == 250 ? 1 : chainId)

  }
  // const handleSwap = () => {
  //   const fromChainOld = fromChain;
  //   const toChainOld = toChain;

  //   // setFromChain(toChainOld)
  //   setToChain(fromChainOld)
  // }

  return (
    // <Column>
    <div className="grid grid-cols-2 gap-2 justify-center text-center sm:mx-2 lg:mx-4">

      <div className={`grid grid-cols-1 w-full justify-center text-center mt-3 mb-3 font-bold border border-[${getChainColor(fromChain)}] rounded rounded-2xl bg-dark-1000`}>
        {`Current Chain`}
        <div className={`flex w-full border border-2 border-[${getChainColor(fromChain)}] rounded rounded-2xl bg-dark-800`}>
          <NetworkSelector
            selected={chainId}
            selectable={false}
          />
        </div>
      </div>

      <div className={`grid grid-cols-1 w-full justify-center text-center mt-3 mb-3 font-bold border border-[${getChainColor(toChain)}] rounded rounded-2xl bg-dark-1000`}>
        {`Destination Chain`}
        <div className={`flex w-full border border-2 border-[${getChainColor(toChain)}] rounded rounded-2xl bg-dark-800`}>
          <NetworkSelector
            chains={
              supportedChainsForBridge.filter(
                // filters: out fromChain and toChain from selection list.
                (chainId) => chainId !== toChain && chainId != fromChain
              )}
            selected={toChain}
            selectChain={handleSetToChain}
            selectable={true}
          />
        </div>
      </div>
    </div>
  )
}

const NetworkSelector: React.FC<any> = ({ chains, selected, selectChain, selectable }) => {
  const [onPresentSelectNetworkModal] = useModal(
    <BridgeNetworkSelectModal chains={chains} selectChain={selectChain} selectable={selectable} />,
    "bridge-token-select-modal"
  )

  return (
    <OverlayButton
      style={{ padding: 0 }}
      className={`flex w-full justify-center text-center`}
      disabled={!chains || !chains.length}
      onClick={() => chains && chains.length && onPresentSelectNetworkModal()}
    >
      <div className={`grid ${selectable ? `hover:bg-dark-900` : ``} my-1 mx-2 p-1 border border-dark-800 border-2 ${selectable ? `hover:border-${getChainColorCode(selected)}` : ``} rounded rounded-2xl`}>
        <div className={`flex w-full p-1 justify-center rounded rounded-2xl ${selectable ? `hover:bg-dark-1000` : ``} bg-dark-800`}>
          {selected ? (
            <div className={`flex flex-cols-1 justify-center`}>
              <Image
                alt={`${chainToNetworkInfoMap[selected].name} network icon`}
                height={42}
                width={42}
                src={chainToNetworkInfoMap[selected].image}
              />
              <div className={`flex text-md sm:text-2xl p-2 sm:m-1 font-bold justify-center`}>{chainToNetworkInfoMap[selected].name}</div>
            </div>
          ) : chains && chains.length ? (
            <Typo1>{i18n._(t`Select Network`)}</Typo1>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </OverlayButton>
  )
}

const BridgeNetworkSelectModal: React.FC<any> = ({
  chains,
  selectChain,
  onDismiss
}) => {
  return (
    <Scrollbar className={`m-[12%] sm:max-w-[60%]`}>
      <div>
        <div className={`grid grid-cols-1 sm:p-3 bg-dark-1000 border-[${getChainColor(selectChain)}] items-center border border-4 rounded rounded-2xl`}>
          {chains &&
            chains.map((chains: any) => {
              return (
                <StyledOverlayButton
                  key={"network-select-" + chainToNetworkInfoMap[chains].name}
                  onClick={() => {
                    selectChain(chains)
                    onDismiss()
                  }}
                  style={{ padding: ".5rem" }}
                  className={`hover:border-avaxRed`}
                >
                  <div
                    className={`flex gap-8 justify-center`}
                  >
                    <Image
                      alt="network logo"
                      height={32}
                      width={32}
                      src={chainToNetworkInfoMap[chains].image}
                    />
                    <div
                      className={`font-bold text-lg lg:text-2xl mr-8 justify-center`}
                    >
                      {chainToNetworkInfoMap[chains].name}
                    </div>
                  </div>
                </StyledOverlayButton>
              )
            })}
        </div>
      </div>
    </Scrollbar>
  )
}

const Bridge: React.FC<any> = () => {

  type BridgeToken = {
    ContractAddress, name,
    symbol, symbolTo, logoUrl,
    Decimals, decimals, DecimalsTo,
    balance,
    MinimumSwap, MaximumSwap, MinimumSwapFee, MaximumSwapFee, SwapFeeRate,
    type,
    ContractAddressTo,
    router,

    DepositAddress, DepositAddressTo,
    BigValueThreshold,
    toChainId, fromChainId,
    needApprove,
    isNative, isNativeTo
  }

  const { chainId, account, connector, deactivate, library } = useActiveWeb3React()
  const { setToChain: connectToChain } = useMultiChain()
  const { bridgeStableMethod, bridgeNativeMethod, bridgeMethod } = useBridge()
  const { getTransactionStatus } = useBridgeApi()
  // const { transaction } = useTransaction()
  const { approve, getAllowance } = useFantomERC20()
  const [tokenList, setTokenList] = useState(null)
  const [fromChain, setFromChain] = useState(chainId)
  const [toChain, setToChain] = useState(chainId == 250 ? 43114 : 250)
  const [selectedToken, setSelectedToken] = useState<BridgeToken>(null)
  const [isApproved, setIsApproved] = useState(true)
  const [amount, setAmount] = useState("")
  const [inputError, setInputError] = useState(null)
  const [bridgeTxHash, setBridgeTxHash] = useState(
    window.localStorage.getItem("BridgeTxHash")
  )
  const [bridgeStatus, setBridgeStatus] = useState(0)

  const {
    ContractAddress,
    symbol,
    Decimals,
    balance,
    MinimumSwap,
    MaximumSwap,
    type,
  } = selectedToken || {}

  const validateAmount = (amount: string) => {
    if (selectedToken && balance) {
      balance.then((resolvedBalance: BigNumber) => {
        if (
          resolvedBalance &&
          BigNumber.from(unitToWei(amount, Decimals)).gt(resolvedBalance)
        ) {
          return setInputError(i18n._(t`Insufficient Funds`))
        }
        if (parseFloat(amount) < parseFloat(MinimumSwap)) {
          return setInputError(i18n._(t`Below Minimum`))
        }
        if (parseFloat(amount) > parseFloat(MaximumSwap)) {
          return setInputError(i18n._(t`Above Maximum`))
        }
        return setInputError(null)
      })
    }
  }

  const handleSetAmount = (value: string) => {
    validateAmount(value)
    setAmount(value)
  }

  useEffect(() => {
    validateAmount(amount)
  }, [selectedToken])

  // TODO: FIX //
  const isBridgeTxPending = false
  //  transaction[bridgeTxHash] && transaction[bridgeTxHash].status === "pending";
  const isBridgeTxCompleted = false
  // transaction[bridgeTxHash] && transaction[bridgeTxHash].status === "completed";

  const {
    sendTx: handleApproveToken,
    isPending: isApprovePending,
    isCompleted: isApproveCompleted,
  } = useSendTransaction(() =>
    approve(selectedToken.ContractAddress, selectedToken.router)
  )

  const handleBridgeAction = async () => {
    const isStableType =
      type === "anySwapOutUnderlying" ||
      type === "anySwapOut(address,address,uint256,uint256)" ||
      type === "anySwapOutNative(address,address,uint256)";
    const isNative = symbol !== "FTM" && !ContractAddress;

    let tx;
    if (isNative) {
      console.log("NATIVE BRIDGE")
      tx = await bridgeNativeMethod(
        selectedToken,
        unitToWei(amount, Decimals).toString()
      )
    } else if (isStableType) {
      console.log("STABLE BRIDGE")
      tx = await bridgeStableMethod(
        selectedToken,
        unitToWei(amount, Decimals).toString()
      )
    } else {
      console.log("BRIDGE")
      tx = await bridgeMethod(
        selectedToken,
        unitToWei(amount, Decimals).toString()
      )
    }

    if (tx) {
      window.localStorage.setItem("BridgeTxHash", tx)
      setBridgeTxHash(tx)
      // TODO announce is not a public api endpoint
      // announceTransaction(tx, fromChainId, toChainId)
    }
  }

  const resetTransactionStatus = () => {
    window.localStorage.removeItem("BridgeTxHash")
    setBridgeTxHash(null)
  }

  useEffect(() => {
    connectToChain(fromChain)
  }, [fromChain])

  useEffect(() => {
    if (chainId !== fromChain) {
      return;
    }
    if (selectedToken?.needApprove === "true" && amount) {
      getAllowance(selectedToken.ContractAddress, selectedToken.router).then(
        (allowance) => {
          if (
            allowance.gte(
              amount
                ? BigNumber.from(unitToWei(amount, selectedToken.decimals))
                : selectedToken.balance
            )
          )
            return setIsApproved(true)
          return setIsApproved(false)
        }
      )
    }
    return setIsApproved(true)
  }, [selectedToken, isApproveCompleted, chainId])

  useEffect(() => {
    let interval: any;
    if (bridgeTxHash && !interval) {
      const fetchStatus = () =>
        getTransactionStatus(bridgeTxHash)
          .then((response) => {
            if (!response?.data?.info) {
              return;
            }
            return setBridgeStatus(response.data.info.status)
          })
          .catch((err) => console.error(err))

      interval = setInterval(() => fetchStatus(), 10_000)
    }
    if (!bridgeTxHash) {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [bridgeTxHash])

  return (
    // <Container id="bridge-page" maxWidth="2xl" className={`space-y-4 mt-4`}>
    <DoubleGlowShadowV2>
      {/* <SwapLayoutCard> */}
      <div className={`grid p-1 mt-4 space-y-2 rounded rounded-2xl bg-dark-1000`}>
        <DonateBanner chainId={chainId} />
        <div
          className={`w-full grid grid-cols-2 p-4 rounded rounded-2xl border border-2 border-purple`}
        >
          <div className={`w-full`}>
            <TokenStats />
          </div>
          <Image src={BRIDGE_BANNER}
            height={180}
            width={1080}
            alt={'bridge banner'}
          />
        </div>
        <div className={`grid`}>
          {/* <div className={`my-2 border border-2 border-[${getChainColor(chainId)}]`}/> */}
          <div className={`my-1`} />
          <SwapDropdown />
          {/* <div className={`my-2 border border-2 border-[${getChainColor(chainId)}]`}/> */}
          {/* </div> */}
          <FadeInOut>
            <div className={`flex rounded rounded-2xl bg-dark-1000 border border-${getChainColorCode(chainId)} border-4 mt-4 p-2`}>
              {/* START: TRANSACTION POP-UP */}
              {bridgeTxHash && (
                <ContentBox
                  style={{
                    background: "#821fff",
                    color: "white",
                    fontFamily: "proxima-nova, sans-serif",
                    borderRadius: "8px",
                    position: "fixed",
                    right: "2rem",
                    top: "8rem",
                    zIndex: 100,
                    padding: "1rem",
                  }}
                >
                  <Column style={{}}>
                    <Typo2 style={{ fontWeight: "bold" }}>Bridge Transaction</Typo2>
                    <div />
                    <Typo2>
                      {i18n._(t`Hash: `)}
                      <a
                        href={`https://anyswap.net/explorer/tx?params=${bridgeTxHash}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {formatAddress(bridgeTxHash)}
                      </a>
                    </Typo2>
                    {bridgeStatus > 0 && (
                      <Typo2>
                        {transactionStatusMapping[bridgeStatus] || "Unknown"}
                      </Typo2>
                    )}
                    <div />
                    <OverlayButton
                      style={{ padding: 0 }}
                      onClick={() => resetTransactionStatus()}
                    >
                      <Typo2 style={{ fontWeight: "bold" }}>Close</Typo2>
                    </OverlayButton>
                  </Column>
                </ContentBox>
              )}
              {/* END: TRANSACTION POP-UP */}
              <Column style={{ width: "100%" }}>
                <>
                  <ChainSelection
                    setTokenList={setTokenList}
                    connectToChain={setFromChain}
                    bridgeToChain={setToChain} />
                  <div />
                  <div />
                  <BridgeTokenList
                    tokenList={tokenList}
                    setSelectedToken={setSelectedToken}
                    fromChain={fromChain}
                    toChain={toChain}
                    amount={amount}
                    setAmount={handleSetAmount}
                    inputError={inputError}
                    isBridgeTxCompleted={isBridgeTxCompleted} />
                  <div className="h-px my-6 bg-dark-1000"></div>
                  <div className={`flex flex-col bg-dark-1000 p-3 border rounded rounded-2xl border-${getChainColorCode(chainId)} w-full space-y-1 sm:p-2`}>
                    {/* <div className="flex justify-between">
                        <Typography className="text-white" fontFamily={'medium'}>
                          {i18n._(t`Bridgeable`)}
                        </Typography>
                        <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                          {selectedToken
                            ? `${formatSimpleValue(
                              selectedToken.MinimumSwap
                            )} - ${formatSimpleValue(
                              selectedToken.MaximumSwap
                            )} ${selectedToken.symbol}`
                            : "-"}
                        </Typography>
                      </div> */}
                    <div>
                      {/* <div className={`border border-green mt-1 mb-1`} /> */}
                      <Typography className={`text-lg font-bold text-center bg-dark-900 border border-[${getChainColor(toChain)}] p-2 rounded rounded-xl`}>
                        {`Bridgeable Range`}

                      </Typography>
                      {/* <div className={`border border-green mt-1 mb-1`} /> */}
                    </div>

                    <div className="flex justify-between">
                      <Typography className="text-white" fontFamily={'medium'}>
                        {i18n._(t`Minimum`)}
                      </Typography>
                      <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                        {selectedToken
                          ? `${formatSimpleValue(selectedToken.MinimumSwap)} ${selectedToken.symbol}`
                          : "-"}
                      </Typography>
                    </div>

                    <div className="flex justify-between">
                      <Typography className="text-white" fontFamily={'medium'}>
                        {i18n._(t`Maximum`)}
                      </Typography>
                      <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                        {selectedToken
                          ? `${formatSimpleValue(selectedToken.MaximumSwap)} ${selectedToken.symbol}`
                          : "-"}
                      </Typography>
                    </div>

                    <div>
                      <Typography className={`text-lg font-bold text-center bg-dark-900 border border-avaxRed p-2 rounded rounded-xl`}>
                        {'~'}
                        {selectedToken
                          ? `${formatSimpleValue(
                            // selectedToken.MinimumSwapFee
                            selectedToken.SwapFeeRate * 100
                          )}% Fee`
                          : "Loading Fee..."}

                      </Typography>
                    </div>

                    <div className="flex justify-between">
                      <Typography className="text-white" fontFamily={'medium'}>
                        {i18n._(t`Minimum`)}
                      </Typography>
                      <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                        {selectedToken
                          ? `${formatSimpleValue(
                            selectedToken.MinimumSwapFee
                          )} ${selectedToken.symbol}`
                          : "-"}
                      </Typography>
                    </div>

                    <div className="flex justify-between">
                      <Typography className="text-white" fontFamily={'medium'}>
                        {i18n._(t`Maximum`)}
                      </Typography>
                      <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                        {selectedToken
                          ? `${formatSimpleValue(
                            selectedToken.MaximumSwapFee
                          )} ${selectedToken.symbol}`
                          : "-"}
                      </Typography>
                    </div>

                    <div className="flex justify-center">
                      <Typography className="text-white text-xs">
                        {selectedToken
                          ? <i> {i18n._(t`Amounts over`)} {formatSimpleValue(
                            selectedToken.BigValueThreshold
                          )} {selectedToken.symbol}  {i18n._(t`may take up to 12hrs`)}.</i>
                          : ""}
                      </Typography>
                    </div>

                  </div>
                  <div className="mt-8" />
                  <ButtonComponent variant="outlined" color={getChainColorCode(chainId)} onClick={handleApproveToken} className="mb-2">
                    {isApprovePending
                      ? i18n._(t`Approving`)
                      : isApproveCompleted
                        ? i18n._(t`Approve Successful`)
                        : i18n._(t`Approve ${selectedToken?.symbol}`)}
                  </ButtonComponent>

                  {isApproved && (

                    <ButtonComponent
                      disabled={inputError ||
                        !amount ||
                        chainId !== fromChain}
                      variant="filled"
                      color={getChainColorCode(chainId)}
                      onClick={handleBridgeAction}
                    >
                      {isBridgeTxPending
                        ? i18n._(t`Broadcasting Transaction`)
                        : `Bridge ${selectedToken?.symbol}`
                      }
                    </ButtonComponent>
                  )}

                  <div className="mt-4" />
                </>
              </Column>
            </div>
            <div />
          </FadeInOut>
        </div>
      </div>
      {/* </SwapLayoutCard> */}
      {/* </div> */}
    </DoubleGlowShadowV2>
  )
}

// const Divider: React.FC<any> = ({ padding = "2rem" }) => {
//   return (
//     <div
//       style={{
//         width: `calc(100% + ${padding} + ${padding})`,
//         marginLeft: `-${padding}`,
//         height: "1px",
//         backgroundColor: "#232F46",
//       }}
//     />
//   )
// }

export const StyledOverlayButton = styled(OverlayButton)`
:hover {
  // background-color: #b365ff;
}
`;

export default Bridge;