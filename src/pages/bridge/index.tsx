import React, { useContext, useEffect, useState } from "react";
import Row from "../../components/Row";
import {
  Button
} from "./components/components";
import Column from "../../components/Column";
import styled, { ThemeContext } from "styled-components";
// import Spacer from "../../components/Spacer";
import {
  chainToNetworkInfoMap,
  supportedChainsForBridge,
  transactionStatusMapping,
} from "../../utils/bridge";
import DropDownButton from "../../components/DropDownButton";
import useBridgeApi from "../../hooks/useBridgeApi";
import useMultiChain from "../../hooks/useMultiChain";
import Modal from "./components/Modal";
import ModalTitle from "./components/ModalTitle";
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
import { BigNumber } from "@ethersproject/bignumber";
import Loader from "../../components/Loader";
import FadeInOut from "../../components/AnimationFade";
import { ContentBox, OverlayButton, Typo1, Typo2, Typo3 } from "./components/components";
import InputError from "components/Input/Error";
import { useActiveWeb3React } from "services/web3";

const ChainSelect: React.FC<any> = ({ selectChain, chains }) => {
  const { color } = useContext(ThemeContext);
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
                <img
                  style={{ height: "30px", width: "30px" }}
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

const ChainSelector: React.FC<any> = ({
  text,
  chains,
  selected,
  selectChain,
}) => {
  const { color } = useContext(ThemeContext);
  return (
    <Column style={{ width: "100%" }}>
      <Typo2 style={{ color: "#84888d" }}>{text}</Typo2>
      {/* <Spacer size="xs" /> */}
      <div />
      <DropDownButton
        width="100%"
        DropDown={() => ChainSelect({ selectChain, chains })}
        dropdownTop={65}
      >
        {/*<OverlayButton style={{ padding: 0 }}>*/}
        <ContentBox
          style={{
            boxSizing: "border-box",
            width: "100%",
            backgroundColor: "black",
            padding: "1rem",
          }}
        >
          <Row style={{ gap: "1rem", alignItems: "center" }}>
            <img
              style={{ height: "30px", width: "30px" }}
              src={chainToNetworkInfoMap[selected].image}
            />
            <Typo2 style={{ fontWeight: "bold" }}>
              {chainToNetworkInfoMap[selected].name}
            </Typo2>
          </Row>
        </ContentBox>
        {/*</OverlayButton>*/}
      </DropDownButton>
    </Column>
  );
};

const ChainSelection: React.FC<any> = ({
  setTokenList,
  connectToChain,
  bridgeToChain,
}) => {
  const { chainId, account, connector, deactivate, library } = useActiveWeb3React()

  const [fromChain, setFromChain] = useState(250);
  const [toChain, setToChain] = useState(1);
  const { getBridgeTokens } = useBridgeApi();
  const { forceSwap, DEFAULT_PROVIDERS } = useMultiChain();

  const getBalance = async (address: string, provider: any) => {
    if (address === AddressZero || !address) {
      // return provider.getBalance(walletContext.activeWallet.address);
      return provider.getBalance(account);
    }

    const contract = await loadERC20Contract(address, provider);
    // return contract.balanceOf(walletContext.activeWallet.address);
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
        // if (tokenList?.length && walletContext.activeWallet.address) {
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
  }, [fromChain, toChain, account]); // walletContext.activeWallet.address

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
  };

  const handleSwap = () => {
    const fromChainOld = fromChain;
    const toChainOld = toChain;

    setFromChain(toChainOld);
    setToChain(fromChainOld);
  };
  return (
    <Column>
      <ChainSelector
        text="From Chain"
        selected={fromChain}
        selectChain={handleSetFromChain}
        chains={supportedChainsForBridge.filter(
          (chainId) => chainId !== fromChain
        )}
      />
      {/* {walletContext.activeWallet.chainId !== fromChain && ( */}
      {chainId !== fromChain && (
        <>
          {/* <Spacer size="xs" /> */}
          <div />
          <OverlayButton
            style={{ textAlign: "start" }}
            onClick={() => forceSwap(fromChain)}
          >
            <InputError
              error={"Please switch your web3 wallet to use the above chain"}
              fontSize="18px"
            />
          </OverlayButton>
        </>
      )}
      {/* <Spacer size="lg" /> */}
      <div />
      <Row style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ height: "1px", width: "100%" }} />
        <OverlayButton style={{ padding: 0 }} onClick={handleSwap}>
          <Row
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: "64px",
              width: "64px",
              border: "1px solid #67748B",
              borderRadius: "50%",
            }}
          >
            <img alt="swap" style={{ height: "20px" }} src={"https://raw.githubusercontent.com/BunsDev/fWallet-interface/main/packages/app/src/assets/img/symbols/Swap.svg"} />
          </Row>
        </OverlayButton>
        <div style={{ height: "1px", width: "100%" }} />
      </Row>
      {/* <Spacer size="lg" /> */}
      <div />
      <ChainSelector
        text="To Chain"
        selected={toChain}
        selectChain={handleSetToChain}
        chains={supportedChainsForBridge.filter(
          (chainId) => chainId !== toChain
        )}
      />
      {/* <Spacer /> */}
      <div />
    </Column>
  );
};

const TokenSelector: React.FC<any> = ({ tokens, selected, selectToken }) => {
  const { color } = useContext(ThemeContext);
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
                <img
                  style={{ height: "30px", width: "30px" }}
                  src={selected.logoUrl}
                />
                <Typo2 style={{ fontWeight: "bold" }}>{selected.symbol}</Typo2>
              </>
            ) : tokens && tokens.length ? (
              <Typo1>Select token </Typo1>
            ) : (
              <Loader />
            )}
          </Row>
        </ContentBox>
      </OverlayButton>
    </Column>
  );
};

const BridgeTokenSelectModal: React.FC<any> = ({
  tokens,
  selectToken,
  onDismiss,
}) => {
  const { color } = useContext(ThemeContext);
  return (
    <Modal
      style={{ padding: "20px 24px", maxHeight: "80vh" }}
      onDismiss={onDismiss}
    >
      <ModalTitle text="Select token" />
      {/* <Spacer /> */}
      <div />
      <ModalContent style={{ padding: "16px 0px" }}>
        <Column>
          <Row
            style={{
              justifyContent: "space-between",
              padding: "0 1rem .5rem 1rem",
            }}
          >
            <Typo3
              style={{
                textAlign: "left",
                width: "8rem",
                color: color.greys.grey(),
              }}
            >
              TOKEN NAME
            </Typo3>
            <Typo3
              style={{
                textAlign: "right",
                width: "8rem",
                color: color.greys.grey(),
              }}
            >
              BALANCE
            </Typo3>
          </Row>
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
                      style={{ padding: ".8rem" }}
                    >
                      <Row
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Row style={{ gap: "1rem", alignItems: "center" }}>
                          <img
                            style={{ height: "30px", width: "30px" }}
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

const BalancePromiseToUnit: React.FC<any> = ({ promise, decimals }) => {
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
      <Typo2 style={{ width: "5rem", textAlign: "end", paddingRight: ".5rem" }}>
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
  const { chainId, account, connector, deactivate, library } = useActiveWeb3React()
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
  }, [token, account, isBridgeTxCompleted]); // walletContext.activeWallet.address

  return (
    <Column>
      <Row style={{ gap: "1rem" }}>
        <Typo2 style={{ flex: 1, color: "#84888d" }}>{"Token to Bridge"}</Typo2>
        <Row style={{ flex: 2, paddingLeft: "1rem" }}>
          {inputError ? (
            <InputError error={inputError} fontSize="14px" />
          ) : (
            // <Spacer />
            <div />
          )}
        </Row>
      </Row>
      {/* <Spacer size="xs" /> */}
      <div />
      <Row style={{ gap: "1rem" }}>
        <TokenSelector
          tokens={tokenList}
          selected={token}
          selectToken={handleSetToken}
        />
        <div style={{ flex: 2 }}>
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
      </Row>
      {/* <Spacer /> */}
      <div />
      <Row style={{ justifyContent: "space-between" }}>
        <Typo2 style={{ color: "#84888d" }}>
          Balance on {chainToNetworkInfoMap[fromChain].name}
        </Typo2>
        <Row>
          <Typo2>
            {token && fromTokenBalance
              ? weiToUnit(fromTokenBalance, token.Decimals)
              : "-"}
          </Typo2>
          {/* <Spacer /> */}
          <div />
        </Row>
      </Row>
      <Row style={{ justifyContent: "space-between" }}>
        <Typo2 style={{ color: "#84888d" }}>
          Balance on {chainToNetworkInfoMap[toChain].name}
        </Typo2>
        <Row>
          <Typo2>
            {token && toTokenBalance
              ? weiToUnit(toTokenBalance, token.DecimalsTo)
              : "-"}
          </Typo2>
          {/* <Spacer /> */}
          <div />
        </Row>
      </Row>
    </Column>
  );
};

const Bridge: React.FC<any> = () => {
  const { chainId, account, connector, deactivate, library } = useActiveWeb3React()
  const { color } = useContext(ThemeContext);
  const { setToChain: connectToChain } = useMultiChain();
  const { bridgeStableMethod, bridgeNativeMethod, bridgeMethod } = useBridge();
  // const { getTransactionStatus } = useBridgeApi();
  // const { transaction } = useTransaction();
  const { approve, getAllowance } = useFantomERC20();
  const [tokenList, setTokenList] = useState(null);
  const [fromChain, setFromChain] = useState(250);
  const [toChain, setToChain] = useState(1);
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
          return setInputError("Insufficient funds");
        }
        if (parseFloat(amount) < parseFloat(MinimumSwap)) {
          return setInputError("Below minimum amount");
        }
        if (parseFloat(amount) > parseFloat(MaximumSwap)) {
          return setInputError("Above maximum amount");
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
   // transaction[bridgeTxHash] && transaction[bridgeTxHash].status === "pending";
  const isBridgeTxCompleted = false
    // transaction[bridgeTxHash] &&
    // transaction[bridgeTxHash].status === "completed";

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
    // if (walletContext.activeWallet.chainId !== fromChain) {
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
  }, [selectedToken, isApproveCompleted, chainId]); // walletContext.activeWallet.chainId

  useEffect(() => {
    let interval: any;
    if (bridgeTxHash && !interval) {
      const fetchStatus = () =>
      //  TODO  //
        // getTransactionStatus(bridgeTxHash)
        //   .then((response) => {
        //     if (!response?.data?.info) {
        //       return;
        //     }
        //     return setBridgeStatus(response.data.info.status);
        //   })
        //   .catch((err) => console.error(err));

      interval = setInterval(() => fetchStatus(), 10_000);
    }
    if (!bridgeTxHash) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [bridgeTxHash]);

  return (
    <FadeInOut>
      {bridgeTxHash && (
        <ContentBox
          style={{
            background: "blue",
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
            <Typo2 style={{ fontWeight: "bold" }}>Bridge transaction</Typo2>
            {/* <Spacer size="xs" /> */}
            <div />
            <Typo2>
              {"Hash: "}
              <a
                href={`https://anyswap.net/explorer/tx?params=${bridgeTxHash}`}
                target="_blank"
              >
                {formatAddress(bridgeTxHash)}
              </a>
            </Typo2>
            {bridgeStatus > 0 && (
              <Typo2>
                {transactionStatusMapping[bridgeStatus] || "Unknown"}
              </Typo2>
            )}
            {/* <Spacer size="sm" /> */}
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
        <ContentBox style={{ width: "600px" }}>
          <Column style={{ width: "100%" }}>
            <Row style={{ justifyContent: "space-between" }}>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Bridge
              </div>
              <div
                style={{
                  borderRadius: "34px",
                  backgroundColor: "black",
                }}
              >
                {/* <Row style={{ justifyContent: "space-between", gap: "1rem" }}>
                  <Typo3
                    style={{ color: "#67748B", padding: ".5rem 0 .5rem 1rem" }}
                  >
                    Powered by multichain
                  </Typo3>
                  <img src={multichainImg} />
                </Row> */}
              </div>
            </Row>
            {/* <Spacer /> */}
            <div />
            {/* {walletContext.activeWallet.providerType === "hardware" ? (
              <Typo1>
                Hardware wallet is unsupported. Use any of the other wallet
                types to use the bridge.
              </Typo1>
            ) : ( */}
              <>
                <ChainSelection
                  setTokenList={setTokenList}
                  connectToChain={setFromChain}
                  bridgeToChain={setToChain}
                />
                {/* <Spacer /> */}
                <div />
                <Divider />
                {/* <Spacer size="lg" /> */}
                <div />
                <BridgeTokenList
                  tokenList={tokenList}
                  setSelectedToken={setSelectedToken}
                  fromChain={fromChain}
                  toChain={toChain}
                  amount={amount}
                  setAmount={handleSetAmount}
                  inputError={inputError}
                  isBridgeTxCompleted={isBridgeTxCompleted}
                />
                {/* <Spacer /> */}
                <div />
                <Divider />
                {/* <Spacer size="lg" /> */}
                <div />
                <ContentBox
                  style={{
                    backgroundColor: "black",
                    padding: "1.5rem",
                  }}
                >
                  <Column style={{ width: "100%", gap: ".5rem" }}>
                    <Row style={{ justifyContent: "space-between" }}>
                      <Typo2 style={{ color: "#84888d" }}>
                        Current Bridgeable Range
                      </Typo2>
                      <Typo2>
                        {selectedToken
                          ? `${formatSimpleValue(
                              selectedToken.MinimumSwap
                            )} - ${formatSimpleValue(
                              selectedToken.MaximumSwap
                            )} ${selectedToken.symbol}`
                          : "-"}
                      </Typo2>
                    </Row>
                    <Row style={{ justifyContent: "space-between" }}>
                      <Typo2 style={{ color: "#84888d" }}>
                        Max bridge amount
                      </Typo2>
                      <Typo2
                        style={{
                          color:
                            inputError === "Above maximum amount"
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {selectedToken
                          ? `${formatSimpleValue(selectedToken.MaximumSwap)} ${
                              selectedToken.symbol
                            }`
                          : "-"}
                      </Typo2>
                    </Row>
                    <Row style={{ justifyContent: "space-between" }}>
                      <Typo2 style={{ color: "#84888d" }}>
                        Min Bridge amount
                      </Typo2>
                      <Typo2
                        style={{
                          color:
                            inputError === "Below minimum amount"
                              ? "red"
                              : "inherit",
                        }}
                      >
                        {selectedToken
                          ? `${formatSimpleValue(selectedToken.MinimumSwap)} ${
                              selectedToken.symbol
                            }`
                          : "-"}
                      </Typo2>
                    </Row>
                    <Row style={{ justifyContent: "space-between" }}>
                      <Typo2 style={{ color: "#84888d" }}>Minimum fee</Typo2>
                      <Typo2>
                        {selectedToken
                          ? `${formatSimpleValue(
                              selectedToken.MinimumSwapFee
                            )} ${selectedToken.symbol}`
                          : "-"}
                      </Typo2>
                    </Row>
                  </Column>
                </ContentBox>
                {/* <Spacer /> */}
                <div />
                <Typo3>
                  {selectedToken
                    ? `* Amounts greater than ${formatSimpleValue(
                        selectedToken.BigValueThreshold
                      )} ${selectedToken.symbol} could
                  take up to 12 hours`
                    : ""}
                </Typo3>
                {/* <Spacer /> */}
                <div />
                {isApproved ? (
                  <Button
                    disabled={
                      inputError ||
                      !amount ||
                      // walletContext.activeWallet.chainId !== fromChain
                      chainId !== fromChain
                    }
                    variant="primary"
                    onClick={handleBridgeAction}
                  >
                    {isBridgeTxPending
                      ? "Broadcasting transaction"
                      : "Bridge Token"}
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleApproveToken}>
                    {isApprovePending
                      ? "Approving"
                      : isApproveCompleted
                      ? "Approve successful"
                      : "Approve Token"}
                  </Button>
                )}
              </>
            {/* )} */}
          </Column>
        </ContentBox>
      </Row>
      {/* <Spacer /> */}
      <div />
    </FadeInOut>
  );
};

const Divider: React.FC<any> = ({ padding = "2rem" }) => {
  return (
    <div
      style={{
        width: `calc(100% + ${padding} + ${padding})`,
        marginLeft: `-${padding}`,
        height: "1px",
        backgroundColor: "#232F46",
      }}
    />
  );
};

const StyledOverlayButton = styled(OverlayButton)`
  :hover {
    background-color: ${(props) => props.theme.color.primary.semiWhite(0.1)};
  }
`;

export default Bridge;