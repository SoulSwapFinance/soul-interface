import React, { useEffect, useMemo, useRef, useState, FC, VFC } from "react";
import Image from "next/image";
import SDK, {
  BLOCKCHAIN_NAME,
  Configuration,
  InstantTrade,
  WalletProvider,
  InsufficientFundsError,
  CrossChainTrade,
  InsufficientLiquidityError,
} from "rubik-sdk";
import { sleep } from "utils/sleep";
import { ArrowDownIcon, CheckIcon, ChevronDownIcon, StarIcon } from '@heroicons/react/solid'
import { BigNumber as EthersBigNumber, ethers } from "ethers";
import { FANTOM, AVALANCHE, BINANCE, Chain, CHAINS, ETHEREUM, MOONRIVER, POLYGON, Token } from "constants/cross/Chains";
import { prettyDisplayNumber } from "utils";
import { ERC20_ABI } from "constants/abis/erc20";
import { useActiveWeb3React } from "services/web3";
import { useUserInfo } from "hooks/useAPI";
import { Spinner } from "components/Spinner";
import { Button } from "components/Button";
import { useWalletModalToggle } from "state/application/hooks";
import { i18n } from "@lingui/core";
import { TokenSelectOverlay } from "features/cross/crossStyles";
import Typography from "components/Typography";
import { formatNumber } from "functions/format";
import { classNames } from "functions/styling";
import { t } from "@lingui/macro";
import InputCurrencyBox from "pages/bridge/components/InputCurrencyBox";
import Container from "components/Container";
import DoubleGlowShadowV2 from "components/DoubleGlowShadowV2";
import HeaderNew from "features/trade/HeaderNew";
import { SwapLayoutCard } from "layouts/SwapLayout";
import Modal from "components/DefaultModal";
import ModalBody from "components/Modal/Body";
interface Exchange {
  from: { chain: Chain; token: Token };
  to: { chain: Chain; token: Token };
}
function getLastExchange(): Exchange {
  const lastExchange = JSON.parse(localStorage.getItem("exchange"));
  if (!lastExchange) {
    return undefined;
  }

  const fromChain = CHAINS.find(c => c.chainId === lastExchange.from.chain);
  const fromToken = fromChain.tokens.find(t => t.id === lastExchange.from.token);
  const toChain = CHAINS.find(c => c.chainId === lastExchange.to.chain);
  const toToken = toChain.tokens.find(t => t.id === lastExchange.to.token);
  return { from: { chain: fromChain, token: fromToken }, to: { chain: toChain, token: toToken } };
}

function setLastExchange(from: { chain: Chain; token: Token }, to: { chain: Chain; token: Token }) {
  localStorage.setItem(
    "exchange",
    JSON.stringify({
      from: { chain: from.chain.chainId, token: from.token.id },
      to: { chain: to.chain.chainId, token: to.token.id },
    }),
  );
}

const NATIVE_ADDRESS = "0x0000000000000000000000000000000000000000";

const RUBIC_CHAIN_BY_ID = new Map([
  [FANTOM.chainId, BLOCKCHAIN_NAME.FANTOM],
  [MOONRIVER.chainId, BLOCKCHAIN_NAME.MOONRIVER],
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
    [BLOCKCHAIN_NAME.MOONRIVER]: {
      mainRpc: MOONRIVER.rpc[0],
    },
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
const SOUL = FANTOM.tokens.find(t => t.id === "soul");

export default function Exchange() {
  const lastExchange = useMemo(() => {
    return getLastExchange() ?? { from: { chain: FANTOM, token: FTM }, to: { chain: FANTOM, token: SOUL } };
  }, []);
  const [from, setFrom] = useState<Token>(lastExchange.from.token);
  const [to, setTo] = useState<Token>(lastExchange.to.token);
  const [fromChain, setFromChain] = useState<Chain>(lastExchange.from.chain);
  const [toChain, setToChain] = useState<Chain>(lastExchange.to.chain);
  const [fromUsd, setFromUsd] = useState<string>();
  const [toUsd, setToUsd] = useState<string>();
  const [amount, setAmount] = useState("");
  const [trade, setTrade] = useState<InstantTrade | CrossChainTrade | undefined>(undefined);
  const [canBuy, setCanBuy] = useState(true);
  const [loading, setLoading] = useState(false);
  const toggleWalletModal = useWalletModalToggle()

  const [configuration, setConfiguration] = useState(rubicConfiguration);
  const [rubic, setRubic] = useState<SDK>(null);
  useEffect(() => {
    SDK.createSDK(configuration).then(setRubic);
  }, []);
  const { account, chainId } = useActiveWeb3React()
  const {userInfo} = useUserInfo()
  const nativeBalance = (Number(userInfo.nativeBalance) * 1E18).toFixed(0)
  const [wallet, setWallet] = useState<WalletProvider>(null);

/// IMPORTS FROM BRIDGE ///

  // const handleSetFromChain = (chainId: number) => {
  //   if (chainId !== 250) {
  //     setToChain(lastExchange.to.chain[250]);
  //   }
  //   if (chainId === toChain.chainId) {
  //     setToChain(chainId === 250 ? lastExchange.to.chain[1].chainId : lastExchange.to.chain[250].chainId);
  //   }
  //   setFromChain(fromChain);
  // };

  // const handleSetToChain = (chainId: number) => {
  //   if (chainId !== 250) {
  //     setFromChain(lastExchange.to.chain[250]);
  //   }
  //   if (chainId === fromChain.chainId) {
  //     setFromChain(chainId === 250 ? lastExchange.from.chain[1].chainId : lastExchange.from.chain[250].chainId);
  //   }
  //   setToChain(toChain);
  //   // V2 (BELOW)
  //   // setToChain(chainId == 250 ? 1 : chainId);

  // };
  // const handleSwap = () => {
  //   const fromChainOld = fromChain;
  //   const toChainOld = toChain;

  //   setFromChain(toChainOld);
  //   setToChain(fromChainOld);
  // };
  
  ////////////////////////////////////////////////////////////////

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
      setConfiguration(newConfiguration);
      if (rubic) {
        await rubic.updateConfiguration(newConfiguration);
      }
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
      } catch (e) {}
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
      // Debouncing to avoid hitting CoinGecko and RPCs on every keystroke.
      await sleep(300 / 1000);

      if (disposed) {
        return;
      }

      try {
        const tradeRequest =
          fromChain.chainId === toChain.chainId
            ? rubic.instantTrades
                .calculateTrade(
                  {
                    blockchain: RUBIC_CHAIN_BY_ID.get(fromChain.chainId),
                    address: from.isNative ? NATIVE_ADDRESS : from.address,
                  },
                  amount,
                  to.isNative ? NATIVE_ADDRESS : to.address,
                )
                .then((trades: InstantTrade[]): InstantTrade => trades[0])
            : rubic.crossChain.calculateTrade(
                {
                  address: from.isNative ? NATIVE_ADDRESS : from.address,
                  blockchain: RUBIC_CHAIN_BY_ID.get(fromChain.chainId),
                },
                amount,
                {
                  address: to.isNative ? NATIVE_ADDRESS : to.address,
                  blockchain: RUBIC_CHAIN_BY_ID.get(toChain.chainId),
                },
              );

        const newTrade = await tradeRequest;
        const [newFromUsd, newToUsd] = await Promise.all([
          // Get the USD value of what's being _sold_.
          from.isNative
            ? rubic.cryptoPriceApi.getNativeCoinPrice(RUBIC_CHAIN_BY_ID.get(fromChain.chainId))
            : rubic.cryptoPriceApi.getErc20TokenPrice({
                address: from.address,
                blockchain: RUBIC_CHAIN_BY_ID.get(fromChain.chainId),
              }),

          // Get the USD value of what's being _bought_.
          to.isNative
            ? rubic.cryptoPriceApi.getNativeCoinPrice(RUBIC_CHAIN_BY_ID.get(toChain.chainId))
            : rubic.cryptoPriceApi.getErc20TokenPrice({
                address: to.address,
                blockchain: RUBIC_CHAIN_BY_ID.get(toChain.chainId),
              }),
        ]);
        if (disposed) {
          return;
        }

        setTrade(newTrade);
        setLoading(false);
        setFromUsd((Number(newFromUsd) * Number(newTrade.from.tokenAmount)).toString())
        setToUsd((Number(newToUsd) * Number((newTrade.to.tokenAmount))).toString())
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

    const isTradingSameToken = fromChain.chainId === toChain.chainId && from.id === to.id;
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
  const [showSelectFrom, setShowSelectFrom] = useState(false);
  const [showSelectTo, setShowSelectTo] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);
  const deltaUsd = fromUsd > toUsd ? Number(fromUsd) - Number(toUsd) : 0
  const deltaPercent = 100 * deltaUsd / Number(fromUsd)

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
    {/* <Container> */}
    <div className="flex flex-col justify-center mt-4 bg-dark-800">
    <SwapLayoutCard>
    <div className="px-2 bg-dark-800">
  <HeaderNew />
  </div>
    <DoubleGlowShadowV2>
      <div className="ml-auto mr-auto max-w-[45ch] bg-dark-800 p-12">
        <div className="relative w-full bg-dark-900">
          <button className="flex align-center bg-dark-1000 w-full justify-center p-[20px]" onClick={() => setShowSelectFrom(true)}>
            <div className="relative mr-[5px]">
              <Image className="block object-fit:contain object-position:center items-center" src={from.logo} width="42" height="42" alt={from.name} />
              <Image
                className="flex align-center rounded justify-center absolute m-[2px] p-[3px] h-[20px] w-[20px]"
                width="16" height="16"
                style={{ backgroundColor: fromChain.color }}
                src={fromChain.logo}
                alt={fromChain.name}
              />
            </div>
          </button>        
          <div className="relative w-full bg-dark-900">
          <button className="flex align-center bg-dark-1000 w-full justify-center p-[20px]" onClick={() => setShowSelectTo(true)}>
            <div className="relative mr-[5px]">
              <Image className="block object-fit:contain object-position:center items-center" src={to.logo} width="42" height="42" alt={to.name} />
              <Image
                className="flex align-center rounded justify-center absolute m-[2px] p-[3px] h-[20px] w-[20px]"
                width="16" height="16"
                style={{ backgroundColor: toChain.color }}
                src={toChain.logo}
                alt={toChain.name}
              />
            </div>
            {/* {to.symbol} */}
          </button>
          
          <div className="amount">
          <InputCurrencyBox
            value={amount}
            setValue={async (amount) => await setAmount(amount)}
            // onChange={async () => setAmount(ethers.utils.formatUnits(await getBalance(), decimals))}
            max={async () => setAmount(ethers.utils.formatUnits(await getBalance(), decimals))
            }
            variant="new"
          />
      {/* <div className="flex justify-between"> */}
        </div>
          <div className="flex flex-col gap-4 bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-dark-600 w-full space-y-1">
      {/* <div className={classNames("flex justify-center text-xl mb-2 font-bold text-dark-600")}> Cross Swap Details </div> */}
      <div className="flex justify-between">
                  {/* <Typography className="text-white" fontFamily={'medium'}>
                    Send
                  </Typography> */}
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {amount
                      ? `${formatNumber(amount, false, true)} ${from.symbol}`
                      : "0"}
                    {` (${formatNumber(fromUsd, true, true)})`}
                  </Typography>
                  <Typography 
                    className={``} 
                    style={{ backgroundColor: fromChain.color }}
                    fontFamily={'medium'}>
                    {fromChain.name}
                  </Typography>
                </div>
                <div className="my-4 mx-6 border border-dark-600"/>
                <div className="flex justify-between">
                  <Typography className={classNames(deltaPercent > 20 ? 'text-red' : 'text-white')} weight={600} fontFamily={'semi-bold'}>
                    {trade
                      ? `${formatNumber(Number(trade?.to.tokenAmount), false, true)} ${to.symbol} (${formatNumber(toUsd, true, true)}) `
                      : "0"}
                  </Typography>
                  <Typography 
                    className={``} 
                    style={{ backgroundColor: toChain.color }}
                    fontFamily={'medium'}>                      
                    {toChain.name}
                  </Typography>
                </div>
        </div>
          </div>
        </div>
        <TradeDetail trade={trade} />
        {account && (
          <Button
            className="mt-8"
			variant="filled"
			color="gradient"
            onClick={async () => {
              setShowConfirmation("show");
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
            style={{ opacity: trade ? 1 : 0.5, cursor: trade ? "pointer" : "not-allowed" }}
            disabled={trade == undefined}
          >
            {fromChain.chainId === toChain.chainId ? "Swap" : "Bridge"}
          </Button>
        )}
        {/* {chainId !== fromChain.chainId && (
          <button
            className="bg-dark-900"
            onClick={async () => {
              handleSetFromChain(chainId);
            }}
          >
            Switch to {fromChain.name}
          </button>
        )} */}
        {/* {!account && (
          <button
            className="bg-dark-900"
            onClick={async () => {
              try {
                await account;
              } catch (e) {
                // Ignore "modal closed by user" exceptions.
              }
            }}
          >
            Connect Wallet
          </button>
        )} */}
      </div>
      </DoubleGlowShadowV2>
      </SwapLayoutCard>
      </div>
      {/* </Container> */}
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
  let receive: string;
  if (trade) {
    if (isCrossChainTrade(trade)) {
      receive = `${formatNumber(Number(trade.toTokenAmountMin), false, true)} ${trade.to.symbol}`;
    } else {
      receive = `${formatNumber(trade.toTokenAmountMin.tokenAmount, false, true)} ${trade.to.symbol}`;
    }
  }

  return (
    <div className="flex mt-[20px]">
      {/* <div className="flex justify-between"> */}
      <div className="h-px my-2 bg-dark-1000" />
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
      /* <div className={classNames(show ? "grid h-[95px] w-[100%] max-h-[768px] max-w-[28ch]" : 'hidden')} */
        style={{ transform: `translate(-50%, calc(-50% + ${show ? 0 : 30}px))` }}
        /* // style={{ transform: `translate(0%, calc(0% + ${show ? 360 : 30}px))` }} */
        >
        <div
          className={classNames(isShowingChainSelect ? "w-full h-full top-0 left-0 z-10 bg-dark-1100" : "hidden")}
          style={{
            // transform: isShowingChainSelect ? "translateX(0)" : "hidden",
            // pointerEvents: show && isShowingChainSelect ? "all" : "none",
          }}
        >
          {/* CHAIN SELECTION */}
          <Modal
          isOpen={isShowingChainSelect} onDismiss={() => onClose()}
          >
          <div className="flex justify-center">
            {CHAINS.map((chain, i) => (
              <button
                key={chain.chainId}
                onClick={() => {
                  setSelectedChainId(chain.chainId);
                  tokensList.current?.scrollTo({ top: 0 });
                  showChainSelect(false);
                  setFilter("");
                }}
                className={classNames(chain.chainId === selectedChainId && `border border-2 border-white`, "flex border border-transparent hover:border-white align-center w-[100%]")}
                style={{ backgroundColor: chain.color }}
              >
                <div className={classNames('m-1 p-1')}>
                <Image src={chain.logo} width={'64'} height="64" alt={ chain.name + ' logo'}/>
                {/* <div style={{ flexGrow: 1, textAlign: "center" }}>{chain.name}</div> */}
                </div>
              </button>
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
          <Modal isOpen={true} onDismiss={() => onClose()}>
          <div className="bg-dark-900 padding-[10px]">
            <button
              className="flex p-[10px] w-[100%] gap-[8px] align-center items-center"
              style={{ backgroundColor: selectedChain.color }}
              onClick={() => showChainSelect(true)}
              >
              <Image src={selectedChain.logo} width="24" height="24" alt={selectedChain.name + ' logo'}/>
              <div style={{ flexGrow: 1, textAlign: "left" }}>{selectedChain.name}</div>
              {/* <ChevronDownIcon width="13" height="13" style={{ color: "white", marginTop: 2 }} /> */}
            </button>

            <form
              onSubmit={e => {
                e.preventDefault();
                onClose({ token: filteredTokens[0], chain: selectedChain });
              }}
              >
              {/* SEARCH BAR */}
              <input
                ref={input}
                className="w-[100%] border border-unset border-radius-[4px] text-black mb-2"
                placeholder={`Search ${selectedChain.name} tokens`}
                value={filter}
                onChange={e => setFilter(e.currentTarget.value)}
                />
            </form>
          
          {/* SELECT TOKEN LIST */}
          <div className="grid grid-cols-8 bg-dark-1100 w-[100%] justify-center h-[100%]" ref={tokensList}>
            {filteredTokens.map(token => (
              <div className="grid m-1 bg-dark-1100" key={token.address} onClick={() => onClose({ token, chain: selectedChain })}>
                <Image src={token.logo} width="48" height="48" alt={token.name + ' logo'}/>
                {/* <div className="flex text-xs">{token.symbol}</div> */}
                {/* {token.favorite && <StarIcon width="16" height="16" className="token-favorite" />} */}
              </div>
            ))}
            </div>
          </div>
            </Modal>
        </div>
      </div>
    </div>
  );
};
