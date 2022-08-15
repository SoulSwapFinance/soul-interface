import React, { useEffect, useMemo, useRef, useState, FC } from "react";
import Image from "next/image";
import SDK, {
  BLOCKCHAIN_NAME,
  Configuration,
  InstantTrade,
  WalletProvider,
  InsufficientFundsError,
  CrossChainTrade,
  InsufficientLiquidityError,
  RubicSdkError,
} from "rubik-sdk";
import { sleep } from "utils/sleep";
import { ArrowDownIcon, ArrowRightIcon } from '@heroicons/react/solid'
import { BigNumber as EthersBigNumber, ethers } from "ethers";
import { FANTOM, AVALANCHE, BINANCE, Chain, CHAINS, ETHEREUM, POLYGON, Token } from "features/cross/chains";
import { ERC20_ABI } from "constants/abis/erc20";
import { useActiveWeb3React } from "services/web3";
import { useUserInfo, useUserTokenInfo } from "hooks/useAPI";
import { Button } from "components/Button";
import { useNetworkModalToggle, useWalletModalToggle } from "state/application/hooks";
import { OverlayButton } from "components/index";
import useSendTransaction from "hooks/useSendTransaction"
import Typography from "components/Typography";
import { formatNumber } from "functions/format";
import { classNames } from "functions/styling";
import InputCurrencyBox from "pages/bridge/components/InputCurrencyBox";
import Container from "components/Container";
import DoubleGlowShadowV2 from "components/DoubleGlowShadowV2";
import HeaderNew from "features/trade/HeaderNew";
import { SwapLayoutCard } from "layouts/SwapLayout";
import Modal from "components/DefaultModal";
import { ChainId } from "sdk";
import { useETHBalances } from "state/wallet/hooks";
import NetworkModal from "modals/NetworkModal";
import { useCurrency } from 'hooks/Tokens'
import { AutoColumn } from "components/Column";
import useFantomERC20 from "hooks/useFantomERC20"
import Row from "components/Row";
import ModalHeader from "components/Modal/Header";

interface Exchange {
  from: { chain: Chain; token: Token };
  to: { chain: Chain; token: Token };
}

export function getLastExchange(): Exchange {
  const lastExchange = JSON.parse(localStorage.getItem("exchange"));
  if (!lastExchange) {
    return undefined;
  }

  const fromChain = CHAINS.find(c => c.chainId === lastExchange.from.chain);
  const fromToken = fromChain.tokens.find(t => t.id === lastExchange.from.token);
  const toChain = CHAINS.find(c => c.chainId === lastExchange.to?.chain);
  const toToken = toChain?.tokens.find(t => t.id === lastExchange.to?.token);
  return { from: { chain: fromChain, token: fromToken }, to: { chain: toChain, token: toToken } };
}

function setLastExchange(from: { chain: Chain; token: Token }, to: { chain: Chain; token: Token }) {
  localStorage.setItem(
    "exchange",
    JSON.stringify({
      from: { chain: from.chain.chainId, token: from.token.id },
      to: { chain: to?.chain.chainId, token: to?.token?.id },
    }),
  );
}

const NATIVE_ADDRESS = "0x0000000000000000000000000000000000000000";

const RUBIC_CHAIN_BY_ID = new Map([
  [FANTOM.chainId, BLOCKCHAIN_NAME.FANTOM],
  // [MOONRIVER.chainId, BLOCKCHAIN_NAME.MOONRIVER],
  [POLYGON.chainId, BLOCKCHAIN_NAME.POLYGON],
  [AVALANCHE.chainId, BLOCKCHAIN_NAME.AVALANCHE],
  [ETHEREUM.chainId, BLOCKCHAIN_NAME.ETHEREUM],
  [BINANCE.chainId, BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN],
]);

const rubicConfiguration: Configuration = {
  rpcProviders: {
    [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
      mainRpc: BINANCE.rpc[0],
    },
    // [BLOCKCHAIN_NAME.MOONRIVER]: {
    //   mainRpc: MOONRIVER.rpc[0],
    // },
    [BLOCKCHAIN_NAME.POLYGON]: {
      mainRpc: POLYGON.rpc[0],
    },
    [BLOCKCHAIN_NAME.AVALANCHE]: {
      mainRpc: AVALANCHE.rpc[0],
    },
    [BLOCKCHAIN_NAME.ETHEREUM]: {
      mainRpc: ETHEREUM.rpc[0],
    },
    [BLOCKCHAIN_NAME.FANTOM]: {
      mainRpc: FANTOM.rpc[0],
    },
  },
};

const FTM = FANTOM.tokens.find(t => t.id === "fantom");
const DAI = FANTOM.tokens.find(t => t.id === "dai");

export default function Exchange() {
  const lastExchange = useMemo(() => {
    return getLastExchange() ?? { from: { chain: FANTOM, token: FTM }, to: { chain: FANTOM, token: DAI } };
  }, []);
  const [from, setFrom] = useState<Token>(lastExchange.from.token);
  const [to, setTo] = useState<Token>(lastExchange.to?.token);
  const [fromChain, setFromChain] = useState<Chain>(lastExchange.from.chain);
  const [toChain, setToChain] = useState<Chain>(lastExchange.to?.chain);
  const [fromUsd, setFromUsd] = useState<string>();
  const [toUsd, setToUsd] = useState<string>();
  const [amount, setAmount] = useState("");
  const [fromBalance, setBalance] = useState("");
  const [trade, setTrade] = useState<InstantTrade | CrossChainTrade | undefined>(undefined);
  const [canBuy, setCanBuy] = useState(true);
  const [loading, setLoading] = useState(false);
  const toggleWalletModal = useWalletModalToggle()
  const { approve, getAllowance } = useFantomERC20()
  const [configuration, setConfiguration] = useState(rubicConfiguration);
  const [rubic, setRubic] = useState<SDK>(null);
  useEffect(() => {
    SDK.createSDK(configuration).then(setRubic);
  }, []);

  const { account, chainId } = useActiveWeb3React()
  const { userInfo } = useUserInfo()
  const { userTokenInfo } = useUserTokenInfo(account, from.address)

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  let nativeBalance = //userEthBalance ?
    fromChain?.chainId == ChainId.FANTOM ? (Number(userInfo.nativeBalance) * 1E18).toFixed(0)
      : 0
  // Number(userEthBalance) 

  const [wallet, setWallet] = useState<WalletProvider>(null);

  const fromCurrency = useCurrency(from?.address)
  const toCurrency = useCurrency(to?.address)

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
      };

      const userBalance = await getBalance()
      const balance = Number(userBalance) / 10 ** (from?.decimals ? from?.decimals : 18)
      const nativeBalance = fromChain?.chainId == ChainId.FANTOM 
        ? (Number(userInfo.nativeBalance) * 1E18).toFixed(0)
        : balance
        
      setConfiguration(newConfiguration);
      if (rubic) {
        await rubic.updateConfiguration(newConfiguration);
      }

      setBalance(balance.toString());
    }
    update();
  }, [rubic, wallet]);

  // useEffect(() => {
  // if (web3.connection === Web3Connection.ConnectedWrongChain) {
  // web3.switchChain();
  // }
  //   if (chainId !== fromChain.chainId)
  //   <div
  //   className="flex items-center justify-center px-4 py-2 font-semibold text-white border rounded bg-opacity-80 border-red bg-red hover:bg-opacity-100"
  //   onClick={toggleWalletModal}
  // ></div>
  // }, []);

  const [decimals, setDecimals] = useState<number>(18);

  const provider = useMemo(() => new ethers.providers.JsonRpcProvider(fromChain.rpc[0]), [fromChain]);

  async function getBalance(): Promise<EthersBigNumber> {
    if (!account) {
      return EthersBigNumber.from(0);
    }
    if (from.isNative) {
      return EthersBigNumber.from(nativeBalance);
    }
    const IER20 = new ethers.Contract(from.address, ERC20_ABI, provider);
    try {
      return await IER20.balanceOf(account);
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

      const erc20 = new ethers.Contract(from.address, ERC20_ABI, provider);
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
          fromChain.chainId === toChain?.chainId
            ? rubic.instantTrades
              .calculateTrade(
                {
                  address: from.isNative ? NATIVE_ADDRESS : from.address,
                  blockchain: RUBIC_CHAIN_BY_ID.get(fromChain.chainId),
                },
                amount,
                to?.isNative ? NATIVE_ADDRESS : to?.address,
              )
              .then((trades: InstantTrade[]): InstantTrade => trades[0])
              
            : rubic.crossChain.calculateTrade(
            // (1) fromToken
              {
              address: from.isNative ? NATIVE_ADDRESS : from.address,
              blockchain: RUBIC_CHAIN_BY_ID.get(fromChain.chainId),
              },
              // (2) fromAmount
              amount,
              // (3) toToken
              {
              address: to?.isNative ? NATIVE_ADDRESS : to?.address,
              blockchain: RUBIC_CHAIN_BY_ID.get(toChain?.chainId),
              },
              // (4) options (optional)
            )
            // .then((trades: CrossChainTrade[]): CrossChainTrade => trades[0])

        const newTrade = await tradeRequest;
        const [newFromUsd, newToUsd] = await Promise.all([
          // the USD value of (from) being _sold_.
          from.isNative
            ? rubic.cryptoPriceApi.getNativeCoinPrice(RUBIC_CHAIN_BY_ID.get(fromChain.chainId))
            : rubic.cryptoPriceApi.getErc20TokenPrice({
              address: from.address,
              blockchain: RUBIC_CHAIN_BY_ID.get(fromChain.chainId),
            }),

          // the USD value of (to) being _bought_.
          to?.isNative
            ? rubic.cryptoPriceApi.getNativeCoinPrice(RUBIC_CHAIN_BY_ID.get(toChain?.chainId))
            : rubic.cryptoPriceApi.getErc20TokenPrice({
              address: to?.address,
              blockchain: RUBIC_CHAIN_BY_ID.get(toChain?.chainId),
            }),
        ]);
        if (disposed) {
          return;
        }

        setTrade(newTrade);
        setLoading(false);
        setFromUsd((Number(newFromUsd) * Number(newTrade.from.tokenAmount)).toString())
        setToUsd((Number(newToUsd) * Number((newTrade.to?.tokenAmount))).toString())
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

    const isTradingSameToken = fromChain.chainId === toChain?.chainId && from.id === to?.id;
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

  const [showConfirmation, setShowConfirmation] = useState<"hide" | "show" | "poor">("hide");
  const [showFromChainSelect, setShowFromChainSelect] = useState(false);
  const [showToChainSelect, setShowToChainSelect] = useState(false);
  const [showSelectFrom, setShowSelectFrom] = useState(false);
  const [showSelectTo, setShowSelectTo] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);
  const fromAmount = fromUsd ? Number(trade?.from.tokenAmount) : 0
  const toAmount = toUsd ? Number(trade?.to?.tokenAmount) : 0
  const deltaUsd = fromUsd > toUsd ? Number(fromUsd) - Number(toUsd) : 0
  const deltaPercent = 100 * deltaUsd / Number(fromUsd)
  // const [fromToken, setFromToken] = useState(null);
  // const [toToken, setToToken] = useState(null);
  const toggleNetworkModal = useNetworkModalToggle()
  const wrongNetwork = fromChain.chainId != chainId ? true : false

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
              setBalance("");
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
                await trade?.swap({
                  onConfirm: (_hash: any) => setShowConfirmation("hide"),
                });
              } catch (e) {
                if (e instanceof InsufficientFundsError) {
                  setShowConfirmation("poor");
                } else {
                  console.error(e);
                  setShowConfirmation("hide");
                }
              }
            }}
            style={{ borderColor: toChain?.color, backgroundColor: toChain?.color }}

          >
            I UNDERSTAND THESE TERMS
          </Button>
        </div>
      </Modal>
      }

      <Container id="cross-page" maxWidth="2xl" className="space-y-4">
        <DoubleGlowShadowV2>
          <div className="p-4 mt-4 space-y-4 rounded bg-dark-1000" style={{ zIndex: 1 }}>
            <div className="px-2">
              <HeaderNew />
            </div>
            <SwapLayoutCard>
              {/*  [F] TOKEN SELECTOR */}
              {/*    [F] CHAIN LOGO   */}
              <div
                className="grid grid-cols-1 rounded bg-dark-1000 border border-4 w-full"
                style={{ borderColor: fromChain?.color }}
              >
                {wrongNetwork &&
                  <div
                    className="grid grid-cols-2 items-center border-4 rounded border-dark-1000 bg-dark-1000 hover:bg-dark-900 whitespace-nowrap text-md justify-center font-bold cursor-pointer select-none pointer-events-auto"
                    onClick={() => toggleNetworkModal()}
                  >
                    <div
                      className="hidden lg:flex lg:rounded lg:rounded-2xl lg:m-2 lg:text-center lg:text-lg lg:justify-center lg:p-3 lg:border"
                      style={{ borderColor: fromChain.color }}
                    >
                      Switch to {fromChain?.name} Network
                    </div>
                    <div
                      className="lg:hidden flex rounded rounded-2xl m-1 text-center text-lg justify-center p-2 border"
                      style={{ borderColor: fromChain.color }}
                    >
                      Switch Network
                    </div>
                    <Image
                      src={fromChain.logo}
                      alt="Switch Network"
                      className="flex align-center justify-center"
                      // style={{ backgroundColor: fromChain.color }}
                      width="42" height="42"
                    // width="22px" height="22px" 
                    />
                    <NetworkModal />
                    {/* {NETWORK_LABEL[chainId]} */}
                  </div>
                }
                <div
                  className={"flex w-full border border-4"}
                  style={{ borderColor: fromChain.color }}
                />
                <Image
                  className="flex align-center justify-center"
                  width="36" height="36"
                  style={{ backgroundColor: fromChain.color }}
                  src={fromChain.logo}
                  alt={fromChain.name}
                  onClick={() => setShowSelectFrom(true)}
                >
                </Image>
                <div
                  className={"flex w-full border border-4"}
                  style={{ borderColor: fromChain.color }}
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
                      {from.symbol}
                  </div>
                </Button>
                <div
                  className={"flex w-full border border-2"}
                  style={{ borderColor: fromChain.color }}
                />
                <div className="grid grid-cols-1">

                  <div className={`flex flex-col p-3 w-full space-y-1 bg-dark-1000`}
                  >
                    <div className="flex justify-center">
                      <Typography className={classNames('text-lg font-bold', 'text-white')} weight={600} fontFamily={'semi-bold'}>
                        {trade
                          ? `${formatNumber(Number(trade?.from.tokenAmount), false, true)} ${from.symbol} (${formatNumber(fromUsd, true, true)}) `
                          : "0 ($0.00)"}
                      </Typography>
                    </div>
                  </div>
                  <div
                    className={"flex w-full border border-2"}
                    style={{ borderColor: fromChain.color }}
                  />
                  <InputCurrencyBox
                    disabled={!from}
                    value={amount}
                    setValue={async (amount) => await setAmount(amount)}
                    // max={async () => setAmount(ethers.utils.formatUnits(await getBalance(), decimals))}
                    variant="new"
                  />
                  <Button
                    onClick={async () => setAmount(ethers.utils.formatUnits(await
                      getBalance(), decimals))}>
                    <div className="flex w-full text-sm justify-end font-bold">
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
                // onClick={handleSwap}
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
                          className="text-high-emphesis hover:text-white"
                          style={{ color: toChain?.color }}
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
                >
                </Image>
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
                      {trade
                        ? `${formatNumber(Number(trade?.to?.tokenAmount), false, true)} ${to?.symbol} (${formatNumber(toUsd, true, true)})`
                        : "0 ($0.00)"}
                    </Typography>
                  </div>
                </div>
              </div>

              <div
                className="flex p-2 justify-center gap-6 text-lg text-center bg-dark-1000 font-bold"
                style={{ color: fromChain.color }}
              >
                {formatNumber(fromAmount, false, true)} {from.symbol} ({formatNumber(fromUsd, true, true)})
                <div
                  className="flex"
                  style={{ color: 'white' }}
                >

                  <ArrowRightIcon className="m-2 border border-2 rounded" height="21px" />

                </div>

                <div
                  className="flex"
                  style={{ color: toChain?.color }}
                >
                  {formatNumber(toAmount, false, true)} {to?.symbol} ({formatNumber(toUsd, true, true)})
                </div>
              </div>

              {/* HIGH-SLIPPAGE WARNING */}
              {trade &&
                <div
                  className={deltaPercent < 20 ? 'hidden' : `flex flex-col rounded gap-4 bg-dark-1000 p-3 font-bold w-full space-y-1`}
                // style={{ backgroundColor: deltaPercent > 20 ? 'black' : toChain?.color}}
                >
                  <div
                    className="flex font-bold justify-center">
                    <Typography className={classNames('text-xl font-bold', 'font-bold text-white')} weight={600} fontFamily={'semi-bold'}>
                        Warning High-Slippage
                    </Typography>
                  </div>
                </div>
              }
              <div
                className={`flex flex-col rounded gap-4 bg-dark-1000 p-3 font-bold w-full space-y-1`}
              >
                <div
                  className="flex font-bold justify-center">
                  <Typography className={classNames('text-xl font-bold', 'font-bold text-white')} weight={600} fontFamily={'semi-bold'}>
                    {`Slippage: ${formatNumber(Number(deltaPercent), false, true)}%`}
                  </Typography>
                </div>
              </div>
                <TradeDetail trade={trade} />
              <div
                className="rounded border border-2"
                style={{ borderColor: toChain?.color, backgroundColor: toChain?.color }}

              >
              
                <Button
                  className="h-[60px]"
                  variant="bordered"
                  color="black"
                  onClick={ 
                    async () => 
                   {
                      await 
                      setShowConfirmationModal(true)
                    } 
                  }
                  style={{ opacity: trade ? 1 : 0.5, cursor: trade ? "pointer" : "not-allowed" }}
                  disabled={trade == undefined}
                >
                  { "Confirm Swap" }
                  {/* {fromChain.chainId === toChain?.chainId ? "Swap" : "Swap Crosschain"} */}
                </Button>
              </div>
            </SwapLayoutCard>
          </div>
        </DoubleGlowShadowV2>
      </Container>
    </>
  );
}

interface TradeDetailProps {
  trade?: InstantTrade | CrossChainTrade;
}
function isCrossChainTrade(trade: InstantTrade | CrossChainTrade): trade is CrossChainTrade {
  return "transitFeeToken" in trade;
}
const TradeDetail: FC<TradeDetailProps> = ({ trade }) => {
  let min: string;
  if (trade) {
    if (isCrossChainTrade(trade)) {
      min = `${formatNumber(Number(trade.toTokenAmountMin), false, true)} ${trade.to?.symbol}`;
    } else {
      // @ts-ignore
      min = `${formatNumber(Number(trade.toTokenAmountMin.tokenAmount), false, true)} ${trade.to?.symbol}`;
    }
  }

  return (
    <div className="flex">
    </div>
  );
};

interface TokenSelectProps {
  show: boolean;
  chain: Chain;
  onClose: (selection?: { token: Token; chain: Chain }) => void;
}
const TokenSelect: React.FC<TokenSelectProps> = ({ show, onClose, chain }) => {
  const [filter, setFilter] = useState("");
  const [selectedChainId, setSelectedChainId] = useState(chain.chainId);
  const selectedChain = useMemo(() => CHAINS.find(c => c.chainId === selectedChainId), [selectedChainId, CHAINS]);
  const input = useRef<HTMLInputElement>(null);
  const tokensList = useRef<HTMLDivElement>(null);
  const normalizedFilter = filter.trim().toLowerCase();
  const filteredTokens = selectedChain.tokens.filter(({ name, symbol, address }) => {
    const isNameMatch = name.toLowerCase().includes(normalizedFilter);
    const isSymbolMatch = symbol.toLowerCase().includes(normalizedFilter);
    const isAddressMatch = address.startsWith(normalizedFilter) || address.startsWith("0x" + normalizedFilter);
    return isNameMatch || isSymbolMatch || isAddressMatch;
  });
  const [isShowingChainSelect, showChainSelect] = useState(false);

  useEffect(() => {
    if (!show) {
      return;
    }

    input.current?.focus();

    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("keydown", escape);
    };
  }, [show]);

  useEffect(() => {
    if (!show) {
      setTimeout(() => {
        setFilter("");
        setSelectedChainId(chain.chainId);
        showChainSelect(false);
        tokensList.current?.scrollTo({ top: 0 });
      }, 100);
    }
  }, [show]);

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
                    setSelectedChainId(chain.chainId);
                    tokensList.current?.scrollTo({ top: 0 });
                    showChainSelect(false);
                    setFilter("");
                  }}
                  variant="bordered"
                  color="black"
                  className={classNames(chain.chainId === selectedChainId && `border border-2 border-white`, "flex border border-transparent hover:border-white align-center w-[100%]")}
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
            borderColor={selectedChain?.color}
          >
            <div className="bg-dark-900 rounded padding-[10px]">
              <Button
                className="flex p-[10px] w-[100%] gap-[8px] align-center items-center"
                variant="bordered"
                color="black"
                style={{ backgroundColor: selectedChain.color }}
                onClick={() => showChainSelect(true)}
              >
                <div className="grid grid-cols-1 w-[33%]">
                <Image 
                  src={selectedChain.logo} 
                  width="36" height="36" 
                  alt={selectedChain.name + ' logo'} 
                  className={"w-full justify-center"}
                />
                </div>
                <div style={{ flexGrow: 1, fontSize: "24px", textAlign: "center" }}>{selectedChain.name}</div>
              </Button>

              {/* SEARCH BAR */}
              {/* <form
                onSubmit={e => {
                  e.preventDefault();
                  onClose({ token: filteredTokens[0], chain: selectedChain });
                }}
              >
                <Input
                  ref={input}
                  className="w-[100%] border border-unset border-radius-[4px] text-black mb-2"
                  placeholder={`Search ${selectedChain.name} tokens`}
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
                    key={token.address} onClick={() => onClose({ token, chain: selectedChain })}>
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
  );
};