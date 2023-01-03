import React, { useEffect, useMemo, useRef, useState, FC } from "react";
import Image from "next/image";
import SDK, {
  // BLOCKCHAIN_NAME,
  Configuration,
  InstantTrade,
  WalletProvider,
  InsufficientFundsError,
  InsufficientLiquidityError,
  UserRejectError
} from "rubic-sdk";
import { sleep } from "utils/sleep";
import { ArrowDownIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import { BigNumber as EthersBigNumber, ethers } from "ethers";
import { FANTOM, AVALANCHE, BINANCE, Chain, CHAINS, ETHEREUM, POLYGON, MOONRIVER, Token } from "features/cross/chains";
import { ERC20_ABI } from "constants/abis/erc20";
import { useActiveWeb3React } from "services/web3";
// import { useUserInfo } from "hooks/useAPI";
import { Button } from "components/Button";
// import { useNetworkModalToggle } from "state/application/hooks";
import { Input, OverlayButton } from "components/index";
import Typography from "components/Typography";
import { formatNumber, formatPercent } from "functions/format";
import { classNames } from "functions/styling";
import InputCurrencyBox from "components/Bridge/InputCurrencyBox";
import Container from "components/Container";
import DoubleGlowShadowV2 from "components/DoubleGlowShadowV2";
// import SwapHeader from "features/swap/SwapHeader";
import SwapDropdown from "features/swap/SwapDropdown"

import { SwapLayoutCard } from "layouts/SwapLayout";
// import Modal from "components/DefaultModal";
// import { useETHBalances } from "state/wallet/hooks";
import NetworkModal from "modals/NetworkModal";
import { AutoColumn } from "components/Column";
import Row from "components/Row";
// import ModalHeader from "components/Modal/Header";
import { WrappedCrossChainTrade } from "rubic-sdk/lib/features/cross-chain/providers/common/models/wrapped-cross-chain-trade";
import { useMulticallContract } from "hooks/useContract";
import { getLastExchange, setLastExchange } from "utils/rubic/hooks";
import { AVAX, CHAIN_BY_ID, FTM, NATIVE_ADDRESS, rubicConfiguration } from "utils/rubic/configuration";
import { ChainId } from "sdk";
import TokenSelect from "features/cross/components/TokenSelect";
import NavLink from "components/NavLink";
// import { SubmitButton } from "features/summoner/Styles";
import { getChainColor, getChainColorCode } from "constants/chains";
// import { BalancePromiseToUnit } from "pages/bridge";

export default function Exchange() {
  const { account, chainId } = useActiveWeb3React()

  const lastExchange = useMemo(() => {
    // return getLastExchange() ?? 
    return {
      from: {
        chain: chainId == ChainId.FANTOM ? FANTOM : AVALANCHE,
        token: chainId == ChainId.FANTOM ? FTM : AVAX
      },
      to: {
        chain: chainId == ChainId.FANTOM ? AVALANCHE : FANTOM,
        token: chainId == ChainId.FANTOM ? AVAX : FTM
      }
    };
  }, []);
  const [providerAddress, setProvider] = useState('')
  const [wallet, setWallet] = useState<WalletProvider>(null)

  const [from, setFrom] = useState<Token>(lastExchange.from.token);
  const [to, setTo] = useState<Token>(lastExchange.to?.token);
  const [fromChain, setFromChain] = useState<Chain>(lastExchange.from.chain);
  const [toChain, setToChain] = useState<Chain>(lastExchange.to?.chain);
  const [fromUsd, setFromUsd] = useState<string>('0');
  const [toUsd, setToUsd] = useState<string>('0');
  const [outputAmount, setOutputAmount] = useState<string>();
  const [amount, setAmount] = useState("");
  const [fromBalance, setBalance] = useState("");
  const [trade, setTrade] = useState<InstantTrade | WrappedCrossChainTrade>(undefined);
  const [canBuy, setCanBuy] = useState(true);
  const [loading, setLoading] = useState(false);
  const [configuration, setConfiguration] = useState(rubicConfiguration);
  const [rubic, setRubic] = useState<SDK>(null);

  useEffect(() => {
    SDK.createSDK(configuration).then(setRubic);
  }, []);

  useEffect(() => {
    if (!account) {
      return
    }
    setWallet({
      address: account,
      chainId: chainId,
      // @ts-ignore
      core: window.ethereum,
    });
  }, []);

  useEffect(() => {
    async function update() {
      const newConfiguration: Configuration = {
        ...configuration,
        walletProvider: wallet || undefined,
        providerAddress: '0xFd63Bf84471Bc55DD9A83fdFA293CCBD27e1F4C8'
      };

      const userBalance = await getBalance()
      const balance = Number(userBalance) / 10 ** (from?.decimals ? from?.decimals : 18)

      setConfiguration(newConfiguration);
      if (rubic) {
        await rubic.updateConfiguration(newConfiguration);
      }
      setProvider('0xFd63Bf84471Bc55DD9A83fdFA293CCBD27e1F4C8')
      setBalance(balance.toString());
    }
    update();
  }, [rubic, wallet, providerAddress]);

  const [decimals, setDecimals] = useState<number>(18);
  const provider = useMemo(() => new ethers.providers.JsonRpcProvider(fromChain?.rpc[0]), [fromChain]);

  const MulticallContract = useMulticallContract()
  const nativeBalance = MulticallContract.getEthBalance(account)

  async function getBalance(): Promise<EthersBigNumber> {
    if (!account) {
      return EthersBigNumber.from(0);
    }
    if (from?.isNative) {
      return nativeBalance
    }
    const IERC20 = new ethers.Contract(from?.address, ERC20_ABI, provider);
    try {
      return await IERC20.balanceOf(account);
    } catch (e) {
      return EthersBigNumber.from(0);
    }
  }

  useEffect(() => {
    if (!account || !from) {
      return;
    }

    let disposed = false;
    async function run() {
      if (from.isNative) {
        setDecimals(18);
        return;
      }

      const erc20 = new ethers.Contract(from?.address, ERC20_ABI, provider);
      try {
        const decimals = await erc20.decimals();
        if (disposed) {
          return;
        }
        setDecimals(decimals);
      } catch (e) { }
    }

    run();
    return () => {
      disposed = true;
    };
  }, [from, provider]);

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
                address: from.isNative ? NATIVE_ADDRESS : from.address,
                blockchain: CHAIN_BY_ID.get(fromChain?.chainId),
              },
              amount,
              to?.isNative ? NATIVE_ADDRESS : to?.address,
            )
              .then((trades: InstantTrade[]): InstantTrade => trades[0])
            : rubic.crossChain.calculateTrade(
              // (1) fromToken
              {
                address: from.isNative ? NATIVE_ADDRESS : from.address,
                blockchain: CHAIN_BY_ID.get(fromChain?.chainId),
              },
              // (2) fromAmount
              amount,
              // (3) toToken
              {
                address: to?.isNative ? NATIVE_ADDRESS : to?.address,
                blockchain: CHAIN_BY_ID.get(toChain.chainId),
              },
              // (4) options (optional)
            )
              .then((trades: WrappedCrossChainTrade[]): WrappedCrossChainTrade => trades[0])

        const newTrade = await tradeRequest;
        const [newFromUsd, newToUsd] = await Promise.all([
          // the USD value of (from) being _sold_.
          from.isNative
            ? rubic.cryptoPriceApi.getNativeCoinPrice(CHAIN_BY_ID.get(fromChain?.chainId))
            : rubic.cryptoPriceApi.getErc20TokenPrice({
              address: from.address,
              blockchain: CHAIN_BY_ID.get(fromChain?.chainId),
            }),

          // the USD value of (to) being _bought_.
          to?.isNative
            ? rubic.cryptoPriceApi.getNativeCoinPrice(CHAIN_BY_ID.get(toChain?.chainId))
            : rubic.cryptoPriceApi.getErc20TokenPrice({
              address: to?.address,
              blockchain: CHAIN_BY_ID.get(toChain?.chainId),
            }),
        ])
        if (disposed) {
          return;
        }

        if (newTrade instanceof InstantTrade) {
          setTrade(newTrade);
          setFromUsd((Number(newFromUsd) * Number(newTrade.from.tokenAmount)).toString())
          setToUsd((Number(newToUsd) * Number((newTrade.to?.tokenAmount))).toString())
        } else {
          setTrade(newTrade);
          setFromUsd((Number(newFromUsd) * Number(newTrade.trade.from?.tokenAmount)).toString())
          setToUsd((Number(newToUsd) * Number((newTrade.trade.to?.tokenAmount))).toString())
          setOutputAmount(Number(newTrade.trade.to?.tokenAmount).toString())
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
    setTrade(undefined);
    setFromUsd(undefined);
    setToUsd(undefined);
    setCanBuy(true);

    const isTradingSameToken = fromChain?.chainId === toChain?.chainId && from.id === to?.id;
    if (amount && parseFloat(amount) > 0 && !isTradingSameToken) {
      setLoading(true);
      run();
      return () => {
        disposed = true;
      };
    } else {
      setLoading(false);
    }
  }, [from, fromChain, to, toChain, amount, rubic]);

  useEffect(() => {
    setLastExchange({ chain: fromChain, token: from }, { chain: toChain, token: to });
  }, [from, fromChain, to, toChain]);

  const [showConfirmation, setShowConfirmation] = useState<"hide" | "show" | "poor" | "min" | "rej">("hide");
  const [showSelectFrom, setShowSelectFrom] = useState(false);
  const [showSelectTo, setShowSelectTo] = useState(false);
  // const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);
  const fromAmount = amount ? Number(amount) : 0
  const toAmount = outputAmount ? Number(outputAmount) : 0
  const deltaUsd = Number(fromUsd) > Number(toUsd)
    ? Number(fromUsd) - Number(toUsd) : 0
  const deltaPercent = 100 * deltaUsd / Number(fromUsd)
  // const toggleNetworkModal = useNetworkModalToggle()
  const wrongNetwork = fromChain?.chainId != chainId ? true
    : false
  const sameNetworkError = fromChain?.chainId == toChain.chainId ? true : false

  return (
    <>
      {showSelectFrom &&
        <div>
          <TokenSelect
            show={showSelectFrom}
            chain={fromChain}
            onClose={f => {
              setShowSelectFrom(false);
              if (!f) {
                return;
              }
              setFrom(f.token);
              setFromChain(f.chain);
              setAmount("");
              // setBalance("");
              amountRef.current?.select();
            }}
          />
        </div>
      }

      {showSelectTo &&
        <div>
          <TokenSelect
            show={showSelectTo}
            chain={toChain}
            onClose={t => {
              setShowSelectTo(false);
              if (!t) {
                return;
              }
              setTo(t.token);
              setToChain(t.chain);
            }}
          />
        </div>
      }

    <Container id="cross-page" maxWidth="2xl" className="space-y-4 mt-4">
      <DoubleGlowShadowV2>
        <SwapLayoutCard>
        {/* <div className="p-4 px-2 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}> */}
          <SwapDropdown />
            {/* <SwapHeader /> */}
              {/*  [F] TOKEN SELECTOR */}
              {/*    [F] CHAIN LOGO   */}
              <div
                className="grid grid-cols-1 rounded bg-dark-1000 border border-4 w-full"
                style={{ borderColor: fromChain?.color }}
              >
                {wrongNetwork &&
                  <div
                    className="grid grid-cols-2 items-center border-4 rounded border-dark-1000 bg-dark-1000 hover:bg-dark-900 whitespace-nowrap text-md justify-center font-bold cursor-pointer select-none pointer-events-auto"
                    // onClick={() => toggleNetworkModal()}
                  >
                    <div
                      className
                      ={classNames(
                        "hidden lg:flex lg:rounded lg:rounded-2xl lg:m-2",
                        "lg:text-center lg:text-lg lg:justify-center lg:p-3",
                        "lg:border"
                      )}
                      style={{ borderColor: fromChain?.color }}
                    >
                      Switch to {fromChain?.name} Network
                    </div>
                    <div
                      className="lg:hidden flex rounded rounded-2xl m-1 text-center text-lg justify-center p-2 border"
                      style={{ borderColor: fromChain?.color }}
                    >
                      Switch Network
                    </div>
                    <Image
                      src={fromChain?.logo}
                      alt="Switch Network"
                      className="flex align-center justify-center"
                      // style={{ backgroundColor: fromChain.color }}
                      width="42" height="42"
                    />
                    <NetworkModal switchNetwork={() => fromChain.chainId} />
                    {/* {NETWORK_LABEL[chainId]} */}
                  </div>
                }
                <div
                  className={"flex w-full border border-4"}
                  style={{ borderColor: fromChain?.color }}
                />
                <Image
                  className="flex align-center justify-center"
                  width="36" height="36"
                  style={{ backgroundColor: fromChain?.color }}
                  src={fromChain?.logo}
                  alt={fromChain?.name}
                  onClick={() => setShowSelectFrom(true)}
                >
                </Image>
                <div
                  className={"flex w-full border border-4"}
                  style={{ borderColor: fromChain?.color }}
                />
                <Button
                  className="grid grid-cols-2 bg-dark-2000 max-h-[86px] w-full justify-between"
                  onClick={() => setShowSelectFrom(true)}
                  variant={'outlined'}
                  color={'black'}
                >
                  <div className="">
                    <Image className="block object-fit:contain object-position:center items-center"
                      src={from?.logo}
                      width="48" height="48"
                      alt={from?.name}
                    />
                  </div>

                  <div className="flex justify-center mt-2 font-bold text-2xl">
                    {from?.symbol}
                  </div>
                </Button>
                <div
                  className={"flex w-full border border-2"}
                  style={{ borderColor: fromChain?.color }}
                />
                <div className="grid grid-cols-1">

                  <div className={`flex flex-col p-3 w-full space-y-1 bg-dark-1000`}
                  >
                    <div className="flex justify-center">
                      <Typography className={classNames('text-lg font-bold', 'text-white')} weight={600} fontFamily={'semi-bold'}>
                        {trade && Number(fromUsd) > 0 && Number(toUsd) > 0
                          ? `${formatNumber(Number(fromAmount), false, true)} ${from?.symbol} (${formatNumber(Number(fromUsd), true, true)})`
                          : trade && Number(fromUsd) > 0
                            ? `${formatNumber(Number(fromAmount), false, true)} ${from?.symbol} (${formatNumber(Number(fromUsd), true, true)})`
                            : trade && Number(toUsd) > 0
                              ? `${formatNumber(Number(fromAmount), false, true)} ${from?.symbol} (${formatNumber(Number(toUsd) + 1, true, true)})`
                              : trade && Number(fromUsd) == 0 && Number(toUsd) == 0
                                ? `${formatNumber(Number(fromAmount), false, true)} ${from?.symbol}`
                                : "0 ($0.00)"
                        }
                      </Typography>
                    </div>
                  </div>
                  <div
                    className={"flex w-full border border-2"}
                    style={{ borderColor: fromChain?.color }}
                  />
                  <InputCurrencyBox
                    disabled={!from}
                    value={amount}
                    setValue={async (amount) => await setAmount(amount)}
                    variant="new"
                  />
                  <Button
                    onClick={
                      async () => {
                        await setAmount(
                          ethers.utils.formatUnits(await
                            getBalance(), decimals)
                        )
                      }
                    }>
                    <div className="flex w-full text-xs justify-end font-bold">
                      MAX
                      {/* : {
                        fromBalance
                          ? formatNumber(fromBalance, false, true)
                          : '0'} */}
                    </div>
                  </Button>
                </div>
              </div>

              {/* // ARROW DOWN ICON  */}

              {/* [2] TO TOKEN SELECTOR */}
              {/* [T] NETWORK LOGO */}

              <Row style={{ justifyContent: "center", alignItems: "center" }}>
                <div style={{ height: "1px", width: "100%" }} />
                <OverlayButton
                  style={{ padding: 0 }}
                >
                  <AutoColumn justify="space-between" className="py-0 -my-6 py-6">
                    <div className="flex justify-center z-0">
                      <div
                        role="button"
                        className="p-2.5 rounded-full bg-dark-1000 border border-2 shadow-md"
                        style={{ borderColor: fromChain?.color }}
                      >
                        <ArrowDownIcon
                          width={24}
                          className={classNames("text-high-emphesis hover:text-white", `text-[${toChain?.color}]`)}
                        />
                      </div>
                    </div>
                  </AutoColumn>
                </OverlayButton>
                <div style={{ height: "1px", width: "1000%" }} />
              </Row>

              <div
                className="grid grid-cols-1 rounded bg-dark-1000 border border-4 w-full"
                style={{ borderColor: toChain?.color }}
              >
                <div
                  className={"flex w-full border border-4"}
                  style={{ borderColor: toChain?.color }}
                />
                <Image
                  className="flex align-center justify-center"
                  width="36" height="36"
                  style={{ backgroundColor: toChain?.color }}
                  src={toChain?.logo}
                  alt={toChain?.name}
                  onClick={() => setShowSelectTo(true)}
                />
                <div
                  className={"flex w-full border border-4"}
                  style={{ borderColor: toChain?.color }}
                />
                <Button
                  className="grid grid-cols-2 bg-dark-2000 max-h-[86px] w-full justify-between"
                  onClick={() => setShowSelectTo(true)}
                  variant={'outlined'}
                  color={'black'}
                >
                  <div className="">
                    <Image
                      className="block object-fit:contain object-position:center items-center"
                      src={to?.logo} width="48" height="48" alt={to?.name}
                    />
                  </div>
                  <div className="flex justify-center mt-2 font-bold text-2xl">
                    {to?.symbol}
                  </div>
                </Button>
                <div
                  className={"flex w-full border border-2"}
                  style={{ borderColor: toChain?.color }}
                />
                <div className={`flex flex-col gap-4 bg-dark-1000 p-3 w-full space-y-1`}
                >
                  <div className="flex justify-center">
                    <Typography className={classNames('sm:text-lg text-md font-bold', 'text-white')} weight={600} fontFamily={'semi-bold'}>
                      {trade && Number(fromUsd) > 0 && Number(toUsd) > 0
                        ? `${formatNumber(Number(toAmount), false, true)} ${to?.symbol} (${formatNumber(Number(toUsd), true, true)})`
                        : trade && Number(fromUsd) > 0
                          ? `${formatNumber(Number(toAmount), false, true)} ${to?.symbol} (${formatNumber(Number(fromUsd) - 1, true, true)})`
                          : trade && Number(fromUsd) == 0 && Number(toUsd) == 0
                            ? `${formatNumber(Number(toAmount), false, true)} ${to?.symbol}`
                            : "0 ($0.00)"
                      }
                    </Typography>
                  </div>
                </div>
              </div>

              <div
                className=
                {classNames("flex p-2 justify-center gap-6 text-lg text-center",
                  "bg-dark-1000 font-bold", `text-[${fromChain?.color}]`
                )}
              >
                {trade && Number(fromUsd) > 0 && Number(toUsd) > 0
                  ? `${formatNumber(Number(fromAmount), false, true)} ${from?.symbol} (${formatNumber(Number(fromUsd), true, true)})`
                  : trade && Number(fromUsd) > 0
                    ? `${formatNumber(Number(fromAmount), false, true)} ${from?.symbol} (${formatNumber(Number(fromUsd), true, true)})`
                    : trade && Number(toUsd) > 0
                      ? `${formatNumber(Number(fromAmount), false, true)} ${from?.symbol} (${formatNumber(Number(toUsd) + 1, true, true)})`
                      : trade && Number(fromUsd) == 0 && Number(toUsd) == 0
                        ? `${formatNumber(Number(fromAmount), false, true)} ${from?.symbol}`
                        : "0 ($0.00)"
                }
                <div
                  className="flex text-white"
                >

                  <ArrowRightIcon className="m-2 border border-2 rounded" height="21px" />

                </div>

                <div
                  className={classNames("flex", `text-[${toChain?.color}]`)}
                >
                  {trade && Number(fromUsd) > 0 && Number(toUsd) > 0
                    ? `${formatNumber(Number(toAmount), false, true)} ${to?.symbol} (${formatNumber(Number(toUsd), true, true)})`
                    : trade && Number(fromUsd) > 0
                      ? `${formatNumber(Number(toAmount), false, true)} ${to?.symbol} (${formatNumber(Number(fromUsd) - 1, true, true)})`
                      : trade && Number(fromUsd) == 0 && Number(toUsd) == 0
                        ? `${formatNumber(Number(toAmount), false, true)} ${to?.symbol}`
                        : "0 ($0.00)"
                  }
                </div>
              </div>

              {/* HIGH-SLIPPAGE WARNING */}
              {trade && !sameNetworkError &&
                <div
                  className={deltaPercent < 20 ? 'hidden' : `flex flex-col rounded gap-4 bg-dark-1000 p-3 font-bold w-full space-y-1`}
                >
                  <div
                    className="flex font-bold justify-center">
                    <Typography className={classNames('text-xl font-bold', 'font-bold text-white')} weight={600} fontFamily={'semi-bold'}>
                      Warning: High-Slippage
                    </Typography>
                  </div>
                </div>
              }

              {/* SLIPPAGE AMOUNT */}
              {trade && !sameNetworkError && deltaPercent > 0 &&
                <div
                  className={`flex flex-col rounded gap-4 bg-dark-1000 p-3 font-bold w-full space-y-1`}
                >
                  <div
                    className="flex font-bold justify-center">
                    <Typography className={classNames('text-xl font-bold', 'font-bold text-white')} weight={600} fontFamily={'semi-bold'}>
                      Slippage: {formatPercent(Number(deltaPercent))}
                    </Typography>
                  </div>
                </div>
              }

              {trade && showConfirmation == "min" &&
                <div
                  className={`flex flex-col rounded gap-4 bg-dark-1000 p-3 font-bold w-full space-y-1`}
                // style={{ backgroundColor: deltaPercent > 20 ? 'black' : toChain?.color}}
                >
                  <div
                    className="flex justify-center">
                    <Typography className={classNames('text-sm sm:text-lg md:text-xl', 'text-white')} weight={600} fontFamily={'semi-bold'}>
                      Swap Not Confirming? Try Increasing Amount.
                    </Typography>
                  </div>
                </div>
              }

              {trade && showConfirmation == "rej" &&
                <div
                  className={`flex flex-col rounded gap-4 bg-dark-1000 p-3 font-bold w-full space-y-1`}
                // style={{ backgroundColor: deltaPercent > 20 ? 'black' : toChain?.color}}
                >
                  <div
                    className="flex font-bold justify-center text-[#E84142]">
                    <Typography className={classNames('text-xl font-bold', 'font-bold text-white')} weight={600} fontFamily={'semi-bold'}>
                      User Rejected Transaction
                    </Typography>
                  </div>
                </div>
              }

              {trade && sameNetworkError &&
                <NavLink href="/swap">
                  <Button
                    variant='bordered'
                    color='black'
                    className={`text-${getChainColorCode(chainId)}`}
                  // primaryColor={`${getChainColor(chainId)}`}
                  >
                    <Typography className={classNames('text-xl font-bold', `font-bold text-${getChainColor(chainId)}`)} weight={600} fontFamily={'semi-bold'}>
                      Click Here for Direct Swaps
                    </Typography>
                  </Button>
                </NavLink>
              }

              {trade && showConfirmation == "poor" &&
                <div
                  className={`flex flex-col rounded gap-4 bg-dark-1000 p-3 font-bold w-full space-y-1`}
                >
                  <div
                    className="flex font-bold justify-center text-[#E84142]">
                    <Typography className={classNames('text-xl font-bold', 'font-bold text-white')} weight={600} fontFamily={'semi-bold'}>
                      Warning: Insufficient Funds
                    </Typography>
                  </div>
                </div>
              }
              <TradeDetail
                trade={trade}
              />
              <div
                className={classNames(sameNetworkError ? `hidden` : `rounded border border-2`)}
                style={{ borderColor: toChain?.color, backgroundColor: toChain?.color }}
              >
                <Button
                  className="h-[60px]"
                  variant="bordered"
                  color="black"
                  onClick={
                    async () => {
                      setShowConfirmation("show")
                      try {
                        if (trade instanceof InstantTrade) {
                          await trade.swap({
                            onConfirm: (_hash: any) => setShowConfirmation("hide")
                          })
                        } else {
                          await trade.trade.swap({
                            onConfirm: (_hash: any) => setShowConfirmation("hide")
                          })
                        }
                      } catch (e) {
                        if (e instanceof InsufficientFundsError || e.message == 'insufficient balance for transfer') {
                          setShowConfirmation("poor");
                        } else if (e instanceof UserRejectError) {
                          setShowConfirmation("rej");
                        } else if (e
                          && e.message != 'insufficient balance for transfer') {
                          setShowConfirmation("min");
                        } else {
                          console.error(e);
                          setShowConfirmation("hide");
                        }
                      }
                    }
                  }
                  style={{ opacity: trade ? 1 : 0.5, cursor: trade ? "pointer" : "not-allowed" }}
                  disabled={trade == undefined}
                >
                  {!trade
                    ? "Fetching best price..."
                    : trade
                      ? "Submit Swap"
                      : 'Enter Amount'
                  }
                </Button>
              </div>
              {/* </div> */}
              </SwapLayoutCard>
        </DoubleGlowShadowV2>
      </Container>
          {/* </div> */}
            {/*  */}
    </>
  );


}


interface TradeDetailProps {
  trade?: InstantTrade | WrappedCrossChainTrade;
}

function isCrossChainTrade(trade: InstantTrade | WrappedCrossChainTrade): trade is WrappedCrossChainTrade {
  return;
}

const TradeDetail: FC<TradeDetailProps> = ({ trade }) => {
  let min: string;
  if (trade) {
    if (isCrossChainTrade(trade)) {
      min = `${formatNumber(Number(trade.trade?.toTokenAmountMin), false, true)} ${trade.trade?.to?.symbol}`;
    } else {
      min = `${formatNumber(Number(trade.toTokenAmountMin?.tokenAmount), false, true)} ${trade.to?.symbol}`;
    }
  }

  return (
    <div className="flex">
    </div>
  );
};