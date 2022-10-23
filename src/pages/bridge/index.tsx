import React, { useEffect, useState } from "react";
import Row from "../../components/Row";
import {
  Button
} from "components/index";
import { Button as ButtonComponent } from 'components/Button'
import Column, { AutoColumn } from "../../components/Column";
import styled from "styled-components";
import {
  chainToNetworkInfoMap,
  supportedChainsForBridge,
  transactionStatusMapping,
} from "../../utils/bridge";
// import DropDownButton from "../../components/DropDownButton";
import useBridgeApi from "../../hooks/useBridgeApi";
import useMultiChain from "../../hooks/useMultiChain";
import Modal from "./components/Modal";
// import ModalTitle from "./components/ModalTitle";
import ModalContent from "./components/ModalContent";
import Scrollbar from "../../components/Scrollbar";
import useModal from "../../hooks/useModal";
import InputCurrencyBox from "./components/InputCurrencyBox";
import { AddressZero } from "@ethersproject/constants";
import {
  formatSimpleValue,
  unitToWei,
  weiToUnit,
} from "../../utils/conversion";
import { formatAddress, loadERC20Contract } from "../../utils/wallet";
import useBridge from "../../hooks/useBridge";
import useSendTransaction from "../../hooks/useSendTransaction";
import useFantomERC20 from "../../hooks/useFantomERC20";
import DoubleGlowShadowV2 from "components/DoubleGlowShadowV2";
import { BigNumber } from "@ethersproject/bignumber";
import Loader from "../../components/Loader";
import FadeInOut from "../../components/AnimationFade";
import { ContentBox, OverlayButton, Typo1, Typo2, Typo3 } from "components/index";
import InputError from "components/Input/Error";
import { useActiveWeb3React } from "services/web3";
import { ArrowDownIcon } from "@heroicons/react/solid";
import Image from 'next/image'
import Typography from "components/Typography";
import SwapHeader from "features/swap/SwapHeader";
import Container from "components/Container";
import NavLink from "components/NavLink";
// import { NETWORK_ICON, NETWORK_LABEL } from "config/networks";
// import NetworkModal from "modals/NetworkModal";
// import { useNetworkModalToggle } from "state/application/hooks";
import Web3Network from "components/Web3Network";
import { getChainColor, getChainColorCode } from "constants/chains";

const ChainSelect: React.FC<any> = ({ selectChain, chains }) => {
  return (
    <ContentBox
      style={{
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: "black",
        borderRadius: "8px",
        padding: "1rem",
      }}
    >
      <Column style={{ gap: "1rem" }}>
        {chains.map((chainId: number) => {
          return (
            <OverlayButton
              key={`select-${chainId}`}
              onClick={() => {
                selectChain(chainId);
              }}
            >
              <Row style={{ gap: "1rem", alignItems: "center" }}>                
                <Image
                  alt="chain logo"
                  height="30px"
                  width="30px"
                  src={chainToNetworkInfoMap[chainId].image}
                />
                <Typo2 style={{ fontWeight: "bold" }}>
                  {chainToNetworkInfoMap[chainId].name}
                </Typo2>
              </Row>
            </OverlayButton>
          );
        })}
      </Column>
    </ContentBox>
  );
};

// const ChainSelector: React.FC<any> = ({
//   text,
//   chains,
//   selected,
//   selectChain,
// }) => {
//   return (
//     <Column style={{ width: "100%" }}>
//       <Typo2 style={{ color: "#84888d" }}>{text}</Typo2>
//       <div />
//       <DropDownButton
//         width="100%"
//         DropDown={() => ChainSelect({ selectChain, chains })}
//         dropdownTop={65}
//       >
//         <ContentBox
//           style={{
//             boxSizing: "border-box",
//             width: "100%",
//             backgroundColor: "black",
//             padding: "1rem",
//           }}
//         >
//           <Row style={{ gap: "1rem", alignItems: "center" }}>
//             <Image
//               alt="chain logo"
//               height="30px"
//               width="30px"
//               src={chainToNetworkInfoMap[selected].image}
//             />
//             <Typo2 style={{ fontWeight: "bold" }}>
//               {chainToNetworkInfoMap[selected].name}
//             </Typo2>
//           </Row>
//         </ContentBox>
//       </DropDownButton>
//     </Column>
//   );
// };

const ChainSelection: React.FC<any> = ({
  setTokenList,
  connectToChain,
  bridgeToChain,
}) => {
  const { chainId, account, connector, deactivate, library } = useActiveWeb3React()

  const [fromChain, setFromChain] = useState(chainId);
  const [toChain, setToChain] = useState(250);
  const { getBridgeTokens } = useBridgeApi();
  const { forceSwap, DEFAULT_PROVIDERS } = useMultiChain();

  const getBalance = async (address: string, provider: any) => {
    if (address === AddressZero || !address) {
      return provider.getBalance(account);
    }

    const contract = await loadERC20Contract(address, provider);
    return contract.balanceOf(account);
  };

  useEffect(() => {
    connectToChain(fromChain);
  }, [fromChain]);

  useEffect(() => {
    bridgeToChain(toChain);
  }, [toChain]);

  useEffect(() => {
    setTokenList(null);
    getBridgeTokens(toChain, fromChain)?.then((tokenList) => {
      if (tokenList?.length) {
        const tokenOrder = [
          "FTM",
          "WFTM",
          "USDC",
          "USDT",
          "fUSDT",
          "DAI",
          "MIM",
          "ETH",
          "WETH",
          "BTC",
          "WBTC",
          "MATIC",
          "AVAX",
          "BNB",
        ];
        if (tokenList?.length && account) {
          const stickyTokens = tokenOrder
            .map((symbol) => {
              return tokenList.find(
                (token: any) =>
                  token.symbol.toLowerCase() === symbol.toLowerCase()
              );
            })
            .filter((item: any) => item);
          const restOfTokens = tokenList.filter(
            (token: any) => !stickyTokens.includes(token)
          );

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
            };
          });
          setTokenList(tokensAndBalances);
        }
      }
    });
  }, [fromChain, toChain, account]);

  const handleSetFromChain = (chainId: number) => {
    if (chainId !== 250) {
      setToChain(250);
    }
    if (chainId === toChain) {
      setToChain(chainId === 250 ? 1 : 250);
    }
    setFromChain(chainId);
  };

  const handleSetToChain = (chainId: number) => {
    if (chainId !== 250) {
      setFromChain(250);
    }
    if (chainId === fromChain) {
      setFromChain(chainId === 250 ? 1 : 250);
    }
    setToChain(chainId);
    // V2 (BELOW)
    // setToChain(chainId == 250 ? 1 : chainId);

  };
  const handleSwap = () => {
    const fromChainOld = fromChain;
    const toChainOld = toChain;

    setFromChain(toChainOld);
    setToChain(fromChainOld);
  };

  return (
    <Column>
  {/* // TODO: RE-ENABLE // */}
      <div className="flex">
        {/* <ChainSelector
          selected={chainId}
          selectChain={handleSetFromChain}
          chains={supportedChainsForBridge.filter(
            (chainId) => chainId !== fromChain
          )}
        /> */}
         <NetworkSelector
          chains={
            supportedChainsForBridge.filter(
            (chainId) => chainId !== fromChain
          )}
          selected={fromChain}
          selectChain={handleSetFromChain}
        />
        {/* <div className="flex"> */}
        { chainId != fromChain &&
          <Web3Network />
        }
        {/* </div> */}
        {/* {chainId !== fromChain && (
          <>
            <div className="ml-2" />
            <ButtonComponent
              variant="outlined"
              color={getChainColorCode(chainId)}
              onClick={() => forceSwap(fromChain)}
            >
            <div className="ml-2 mr-2 text-white font-bold">
                {`${chainId}`}
              </div>
            </ButtonComponent>
          </>
        )} */}
      </div>
      <div />
      <Row style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ height: "1px", width: "100%" }} />
          <OverlayButton style={{ padding: 0 }} onClick={handleSwap}>
              <AutoColumn justify="space-between" className="py-2 -my-4 py-4">
                  <div className="flex justify-center mt-2.5 mb-2.5 z-0">
                    <div
                      role="button"
                      className={`p-1.5 rounded-full bg-dark-1000 border shadow-md border-dark-700 hover:border-${getChainColorCode(chainId)}`}
                    >
                      <ArrowDownIcon width={14} className="text-high-emphesis hover:text-white" />
                    </div>
                  </div>
                </AutoColumn>
          </OverlayButton>
        <div style={{ height: "1px", width: "100%" }} />
      </Row>
      <div className="flex">
      {/* <ChainSelector
        selected={toChain}
        selectChain={handleSetToChain}
        chains={supportedChainsForBridge.filter(
          (chainId) => chainId !== toChain
        )}
      /> */}
      <div className="w-full justify-center">
      <NetworkSelector
          chains={
            supportedChainsForBridge.filter(
            (chainId) => chainId !== toChain
          )}
          selected={toChain}
          selectChain={handleSetToChain}
        />
      </div>
    </div>
    </Column>
  );
};

const TokenSelector: React.FC<any> = ({ tokens, selected, selectToken }) => {
  const [onPresentSelectTokenModal] = useModal(
    <BridgeTokenSelectModal tokens={tokens} selectToken={selectToken} />,
    "bridge-token-select-modal"
  );

  return (
    <Column style={{ width: "100%", flex: 1 }}>
      <OverlayButton
        style={{ padding: 0 }}
        disabled={!tokens || !tokens.length}
        onClick={() => tokens && tokens.length && onPresentSelectTokenModal()}
      >
        <ContentBox
          style={{
            boxSizing: "border-box",
            width: "100%",
            backgroundColor: "black",
            padding: "1rem",
            height: "64px",
          }}
        >
          <Row style={{ gap: "1rem", alignItems: "center" }}>
            {selected ? (
              <>
                <Image
                  alt="token logo"
                  height="30px"
                  width="30px"
                  src={selected.logoUrl}
                />
                <Typo2 style={{ fontWeight: "bold" }}>{selected.symbol}</Typo2>
              </>
            ) : tokens && tokens.length ? (
              <Typo1>Select Token </Typo1>
            ) : (
              <Loader />
            )}
          </Row>
        </ContentBox>
      </OverlayButton>
    </Column>
  );
};

const NetworkSelector: React.FC<any> = ({ chains, selected, selectChain }) => {
  const [onPresentSelectNetworkModal] = useModal(
    <BridgeNetworkSelectModal chains={chains} selectChain={selectChain} />,
    "bridge-token-select-modal"
  );

  return (
    <Column style={{ width: "100%", flex: 1 }}>
      <OverlayButton
        style={{ padding: 0 }}
        disabled={!chains || !chains.length}
        onClick={() => chains && chains.length && onPresentSelectNetworkModal()}
      >
        <ContentBox
          style={{
            boxSizing: "border-box",
            width: "100%",
            backgroundColor: "black",
            padding: "1rem",
            height: "64px",
          }}
        >
          <Row style={{ gap: "1rem", alignItems: "center" }}>
            {selected ? (
              <>
                <Image
                  alt="token logo"
                  height="30px"
                  width="30px"
                  src={chainToNetworkInfoMap[selected].image}
                />
                <Typo2 style={{ fontWeight: "bold" }}>{chainToNetworkInfoMap[selected].name}</Typo2>
              </>
            ) : chains && chains.length ? (
              <Typo1>Select Network </Typo1>
            ) : (
              <Loader />
            )}
          </Row>
        </ContentBox>
      </OverlayButton>
    </Column>
  );
};

// function SelectNetworkModal(): JSX.Element | null {
//   const { chainId } = useActiveWeb3React()
//   const toggleNetworkModal = useNetworkModalToggle()

//   if (!chainId) return null

//   return (
//     <div
//     className="flex items-center rounded border-2 border-dark-800 hover:border-dark-700 bg-dark-1000 hover:bg-dark-900 whitespace-nowrap text-md justify-center font-bold cursor-pointer select-none pointer-events-auto"
//     onClick={() => toggleNetworkModal()}
//     >
//       <div className="flex items-center grid-flow-col items-center justify-center bg-dark-1000 h-[36px] w-[36px] text-sm rounded pointer-events-auto auto-cols-max text-secondary">
//         <Image src={NETWORK_ICON[chainId]} alt="Switch Network" className="rounded-md" width="22px" height="22px" />
//       </div>
//       <NetworkModal />
//       { NETWORK_LABEL[chainId] }
//     </div>
//   )
// }

const BridgeTokenSelectModal: React.FC<any> = ({
  tokens,
  selectToken,
  onDismiss,
}) => {
  return (
    <Modal
      style={{ padding: "2px 0.5px", maxHeight: "80vh" }}
      onDismiss={onDismiss}
    >
      {/* <ModalTitle text="Select Token" /> */}
      <div />
      <ModalContent style={{ padding: "8px 0px" }}>
        <Column>
         
          <Scrollbar style={{ height: "60vh" }}>
            <Column>
              {tokens &&
                tokens.map((token: any) => {
                  return (
                    <StyledOverlayButton
                      key={"token-select-" + token.name}
                      onClick={() => {
                        selectToken(token);
                        onDismiss();
                      }}
                      style={{ padding: ".5rem" }}
                    >
                      <Row
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Row style={{ gap: "1rem", alignItems: "center" }}>
                         <Image
                            alt="token logo"
                            height="30px"
                            width="30px"
                            src={token.logoUrl}
                          />
                          <Typo2 style={{ fontWeight: "bold" }}>
                            {token.symbol}
                          </Typo2>
                        </Row>
                        <BalancePromiseToUnit
                          promise={token.balance}
                          decimals={token.Decimals}
                        />
                      </Row>
                    </StyledOverlayButton>
                  );
                })}
            </Column>
          </Scrollbar>
        </Column>
      </ModalContent>
    </Modal>
  );
};

const BridgeNetworkSelectModal: React.FC<any> = ({
  chains,
  selectChain,
  onDismiss,
}) => {
  return (
    <Modal
      style={{ padding: "2px 0.5px", maxHeight: "80vh" }}
      onDismiss={onDismiss}
    >
      {/* <ModalTitle text="Select Token" /> */}
      <div />
      <ModalContent style={{ padding: "8px 0px" }}>
        <Column>
         
          <Scrollbar style={{ height: "60vh" }}>
            <Column>
              {chains &&
                chains.map((chains: any) => {
                  return (
                    <StyledOverlayButton
                      key={"network-select-" + chainToNetworkInfoMap[chains].name}
                      onClick={() => {
                        selectChain(chains);
                        onDismiss();
                      }}
                      style={{ padding: ".5rem" }}
                    >
                      <Row
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Row style={{ gap: "1rem", alignItems: "center" }}>
                         <Image
                            alt="network logo"
                            height="30px"
                            width="30px"
                            src={chainToNetworkInfoMap[chains].image}
                          />
                          <Typo2 style={{ fontWeight: "bold" }}>
                            {chainToNetworkInfoMap[chains].name}
                          </Typo2>
                        </Row>
                      </Row>
                    </StyledOverlayButton>
                  );
                })}
            </Column>
          </Scrollbar>
        </Column>
      </ModalContent>
    </Modal>
  );
};

export const BalancePromiseToUnit: React.FC<any> = ({ promise, decimals }) => {
  const [value, setValue] = useState(null);
  useEffect(() => {
    promise.then((resolvedValue: any) => {
      if (resolvedValue) {
        setValue(resolvedValue);
      }
    });
  }, [promise]);

  return (
    <Row style={{ alignItems: "center" }}>
      <Typo2 style={{ width: "12rem", textAlign: "end", paddingRight: "0rem" }}>
        {value ? weiToUnit(value, decimals) : "..."}
      </Typo2>
    </Row>
  );
};

const BridgeTokenList: React.FC<any> = ({
  tokenList,
  fromChain,
  toChain,
  setSelectedToken,
  amount,
  setAmount,
  inputError,
  isBridgeTxCompleted,
}) => {
  const { account } = useActiveWeb3React()
  const [token, setToken] = useState(null);
  const [fromTokenBalance, setFromTokenBalance] = useState(null);
  const [toTokenBalance, setToTokenBalance] = useState(null);

  const handleSetToken = (value: any) => {
    setFromTokenBalance(null);
    setToTokenBalance(null);
    setToken(value);
  };

  useEffect(() => {
    if (tokenList && tokenList.length) {
      setFromTokenBalance(null);
      setToTokenBalance(null);
      return setToken(tokenList[0]);
    }
  }, [tokenList]);

  useEffect(() => {
    setSelectedToken(token);
    setAmount("");

    if (token) {
      Promise.all([token.balance, token.balanceTo]).then(
        ([fromBalance, toBalance]) => {
          setFromTokenBalance(fromBalance || BigNumber.from(0));
          setToTokenBalance(toBalance || BigNumber.from(0));
          setSelectedToken({
            ...token,
            // balance: fromBalance || BigNumber.from(0),
            // balanceTo: toBalance || BigNumber.from(0),
          });
        }
      );
      return;
    }
  }, [token, account, isBridgeTxCompleted]);

  return (
    <div className="grid justify-center">
      <Row style={{ gap: "1rem" }}>
        <div className="my-1" />
        <Row style={{ flex: 2, paddingLeft: "1rem" }}>
          {inputError ? (
            <InputError error={inputError} fontSize="14px" />
          ) : (
            <div />
          )}
        </Row>
      </Row>
      <div />
      <div className="hidden sm:flex">
      <div className={`grid grid-cols-2 gap-1 mt-2 mb-2 rounded p-0 border border-dark-1000 hover:border-${getChainColorCode(fromChain?.chainId)} w-full`}>
        <TokenSelector
          tokens={tokenList}
          selected={token}
          selectToken={handleSetToken}
        />
        <div className="flex">
          <InputCurrencyBox
            disabled={!token}
            value={amount}
            setValue={setAmount}
            max={
              token && fromTokenBalance
                ? weiToUnit(fromTokenBalance, token?.Decimals)
                : 0
            }
            variant="new"
          />
        </div>
      </div>
      </div>
      <div className="flex sm:hidden">
      <div className={`grid grid-cols gap-1 mt-2 mb-2 rounded p-0 border border-dark-1000 hover:border-${getChainColorCode(fromChain?.chainId)} w-full`}>
        <TokenSelector
          tokens={tokenList}
          selected={token}
          selectToken={handleSetToken}
        />
        <div style={{ flex: 2 }} className="mt-2">
          <InputCurrencyBox
            disabled={!token}
            value={amount}
            setValue={setAmount}
            max={
              token && fromTokenBalance
                ? weiToUnit(fromTokenBalance, token?.Decimals)
                : 0
            }
            variant="new"
          />
        </div>
      </div>
      </div>
      
      <div className="my-2" />

      <div className="flex justify-between">
          <Typography className="text-white" fontFamily={'medium'}>
          Balance on {chainToNetworkInfoMap[fromChain].name}
          </Typography>
          <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
          {token && fromTokenBalance
            ? ` ${weiToUnit(fromTokenBalance, token.Decimals) + ' ' + token.symbol}`
            : "-"}
          </Typography>
      </div>
      <div className="flex justify-between">
          <Typography className="text-white" fontFamily={'medium'}>
          Balance on {chainToNetworkInfoMap[toChain].name}
          </Typography>
          <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
          {token && toTokenBalance
            ? ` ${weiToUnit(toTokenBalance, token.DecimalsTo) + ' ' + token.symbol}`
            : "-"}
          </Typography>
      </div>
     </div>
  );
};

const Bridge: React.FC<any> = () => {
  const { chainId, account, connector, deactivate, library } = useActiveWeb3React()
  const { setToChain: connectToChain } = useMultiChain();
  const { bridgeStableMethod, bridgeNativeMethod, bridgeMethod } = useBridge();
  const { getTransactionStatus } = useBridgeApi();
  // const { transaction } = useTransaction();
  const { approve, getAllowance } = useFantomERC20();
  const [tokenList, setTokenList] = useState(null);
  const [fromChain, setFromChain] = useState(chainId);
  const [toChain, setToChain] = useState(chainId == 250 ? 43114 : 250);
  const [selectedToken, setSelectedToken] = useState(null);
  const [isApproved, setIsApproved] = useState(true);
  const [amount, setAmount] = useState("");
  const [inputError, setInputError] = useState(null);
  const [bridgeTxHash, setBridgeTxHash] = useState(
    window.localStorage.getItem("BridgeTxHash")
  );
  const [bridgeStatus, setBridgeStatus] = useState(0);

  const {
    ContractAddress,
    symbol,
    Decimals,
    balance,
    MinimumSwap,
    MaximumSwap,
    type,
  } = selectedToken || {};

  const validateAmount = (amount: string) => {
    if (selectedToken && balance) {
      balance.then((resolvedBalance: BigNumber) => {
        if (
          resolvedBalance &&
          BigNumber.from(unitToWei(amount, Decimals)).gt(resolvedBalance)
        ) {
          return setInputError("Insufficient Funds");
        }
        if (parseFloat(amount) < parseFloat(MinimumSwap)) {
          return setInputError("Below Minimum");
        }
        if (parseFloat(amount) > parseFloat(MaximumSwap)) {
          return setInputError("Above Maximum");
        }
        return setInputError(null);
      });
    }
  };

  const handleSetAmount = (value: string) => {
    validateAmount(value);
    setAmount(value);
  };

  useEffect(() => {
    validateAmount(amount);
  }, [selectedToken]);

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
  );

  const handleBridgeAction = async () => {
    const isStableType =
      type === "anySwapOutUnderlying" ||
      type === "anySwapOut(address,address,uint256,uint256)" ||
      type === "anySwapOutNative(address,address,uint256)";
    const isNative = symbol !== "FTM" && !ContractAddress;

    let tx;
    if (isNative) {
      console.log("NATIVE BRIDGE");
      tx = await bridgeNativeMethod(
        selectedToken,
        unitToWei(amount, Decimals).toString()
      );
    } else if (isStableType) {
      console.log("STABLE BRIDGE");
      tx = await bridgeStableMethod(
        selectedToken,
        unitToWei(amount, Decimals).toString()
      );
    } else {
      console.log("BRIDGE");
      tx = await bridgeMethod(
        selectedToken,
        unitToWei(amount, Decimals).toString()
      );
    }

    if (tx) {
      window.localStorage.setItem("BridgeTxHash", tx);
      setBridgeTxHash(tx);
      // TODO announce is not a public api endpoint
      // announceTransaction(tx, fromChainId, toChainId);
    }
  };

  const resetTransactionStatus = () => {
    window.localStorage.removeItem("BridgeTxHash");
    setBridgeTxHash(null);
  };

  useEffect(() => {
    connectToChain(fromChain);
  }, [fromChain]);

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
            return setIsApproved(true);
          return setIsApproved(false);
        }
      );
    }
    return setIsApproved(true);
  }, [selectedToken, isApproveCompleted, chainId]);

  useEffect(() => {
    let interval: any;
    if (bridgeTxHash && !interval) {
      const fetchStatus = () =>
        getTransactionStatus(bridgeTxHash)
          .then((response) => {
            if (!response?.data?.info) {
              return;
            }
            return setBridgeStatus(response.data.info.status);
          })
          .catch((err) => console.error(err));

      interval = setInterval(() => fetchStatus(), 10_000);
    }
    if (!bridgeTxHash) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [bridgeTxHash]);

  return (
    <Container id="bridge-page" maxWidth="2xl" className="space-y-4">
      <DoubleGlowShadowV2>
      <div className="p-4 mt-4 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}>          
        <div className="px-2">
    <SwapHeader />
    </div>
    <FadeInOut>
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
              {"Hash: "}
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
      <Row style={{ width: "100%", justifyContent: "center" }}>
        <div className={`flex -4 border border-dark-900 hover:border-${getChainColorCode(chainId)} bg-dark-900 p-2 rounded w-full`}>
          <Column style={{ width: "100%" }}>
            <div />
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
              <div />
              <div />
              <div className="h-px my-6 bg-dark-1000"></div>
              <div className={`flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-${getChainColorCode(chainId)} w-full space-y-1`}>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    Bridgeable Range
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
                </div>

                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    Minimum Amount
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {selectedToken
                      ? `${formatSimpleValue(selectedToken.MinimumSwap)} ${selectedToken.symbol}`
                      : "-"}
                  </Typography>
                </div>

                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    Maximum Amount
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {selectedToken
                      ? `${formatSimpleValue(selectedToken.MaximumSwap)} ${selectedToken.symbol}`
                      : "-"}
                  </Typography>
                </div>

                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    Fee (Minimum)
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {'~'}
                    {selectedToken
                      ? `${formatSimpleValue(
                        selectedToken.MinimumSwapFee
                      )} ${selectedToken.symbol}`
                      : "-"}
                  </Typography>
                </div>

                <div className="flex justify-center">
                  <Typography className="text-white text-xs">
                    {selectedToken
                      ? <i>Amounts over {formatSimpleValue(
                        selectedToken.BigValueThreshold
                      )} {selectedToken.symbol} may take up to 12hrs.</i>
                      : ""}
                  </Typography>
                </div>

              </div>
              <div className="mt-8" />
              <ButtonComponent variant="outlined" color={getChainColorCode(chainId)} onClick={handleApproveToken} className="mb-2">
                {isApprovePending
                  ? "Approving"
                  : isApproveCompleted
                    ? "Approve successful"
                    : "Approve Token"}
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
                    ? "Broadcasting Transaction"
                    : "Bridge Token"}
                </ButtonComponent>
              )}
            
              <div className="mt-4" />
            </>
          </Column>
        </div>
      </Row>
      <div />
    </FadeInOut>
  </div>
</DoubleGlowShadowV2>
</Container>
  );
};

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
//   );
// };

export const StyledOverlayButton = styled(OverlayButton)`
  :hover {
    background-color: #b365ff;
  }
`;

export default Bridge;