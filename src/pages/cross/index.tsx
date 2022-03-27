import React, { useEffect, useMemo, useRef, useState, VFC } from "react";
import SDK, {
  BLOCKCHAIN_NAME,
  Configuration,
  InstantTrade,
  WalletProvider,
  InsufficientFundsError,
  CrossChainTrade,
  InsufficientLiquidityError,
} from "rubik-sdk";
import ChevronIcon from "assets/icons/icons/chevron.svg";
import ArrowDownIcon from "assets/icons/icons/arrow-down.svg";
import Spinner from "assets/icons/icons/spinner.svg";
import StarIcon from "assets/icons/icons/star.svg";
import CheckCircle from "assets/icons/icons/check-circle.svg";
import { BigNumber as EthersBigNumber, ethers } from "ethers";
import ierc20Abi from "constants/abis/soulswap/ERCs/IERC20.json";
import erc20Abi from "constants/abis/erc20.json";
import { FANTOM, AVALANCHE, BINANCE, Chain, CHAINS, ETHEREUM, MOONRIVER, POLYGON, Token } from "features/cross/chains";
import { useActiveWeb3React } from "services/web3/hooks";
import { Button } from "components/Button";
import { useWalletModalToggle } from "state/application/hooks";
import Image from 'next/image'

// interface Cross {
//   from: { chain: Chain; token: Token };
//   to: { chain: Chain; token: Token };
// }
// function getLastExchange(): Cross {
//   const lastExchange = JSON.parse(localStorage.getItem("cross"));
//   if (!lastExchange) {
//     return undefined;
//   }

//   const fromChain = CHAINS.find(c => c.chainId === lastExchange.from.chain);
//   const fromToken = fromChain.tokens.find(t => t.id === lastExchange.from.token);
//   const toChain = CHAINS.find(c => c.chainId === lastExchange.to.chain);
//   const toToken = toChain.tokens.find(t => t.id === lastExchange.to.token);
//   return { from: { chain: fromChain, token: fromToken }, to: { chain: toChain, token: toToken } };
// }

export default function Cross() {

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
      mainRpc: 'https://bsc-dataseed.binance.org',
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
      mainRpc: 'https://mainnet.infura.io/v3',
    },
    [BLOCKCHAIN_NAME.FANTOM]: {
      mainRpc: 'https://rpcapi.fantom.network',
    },
  },
};

const FTM = FANTOM.tokens.find(t => t.id === "fantom");
const SOUL = FANTOM.tokens.find(t => t.id === "soul");

function setLastExchange(from: { chain: Chain; token: Token }, to: { chain: Chain; token: Token }) {
  localStorage.setItem(
    "cross",
    JSON.stringify({
      from: { chain: from.chain.chainId, token: from.token.id },
      to: { chain: to.chain.chainId, token: to.token.id },
    }),
  );
}


  const lastExchange = useMemo(() => {
    return { from: { chain: FANTOM, token: FTM }, to: { chain: FANTOM, token: SOUL } }
    // return getLastExchange() ?? { from: { chain: FANTOM, token: FTM }, to: { chain: FANTOM, token: HEC } };
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

  const [configuration, setConfiguration] = useState(rubicConfiguration);
  const [rubic, setRubic] = useState<SDK>(null);
  useEffect(() => {
    SDK.createSDK(configuration).then(setRubic);
  }, []);

  const { account, chainId } = useActiveWeb3React()
  const [wallet, setWallet] = useState<WalletProvider>(null);
  const toggleWalletModal = useWalletModalToggle()

  useEffect(() => {
    if (!account) {
      return;
    }
    setWallet({
      address: account,
      chainId: chainId,
      core: this.window.ethereum, // ?
    });
  }, [account, chainId]);

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

  // TODO: fix below
  // useEffect(() => {
  //   if (web3.connection === Web3Connection.ConnectedWrongChain) {
  //     web3.switchChain();
  //   }
  // }, [web3]);

  const [decimals, setDecimals] = useState<number>(18);

  const provider = useMemo(() => new ethers.providers.JsonRpcProvider(fromChain.rpc[0]), [fromChain]);

  async function getBalance(): Promise<EthersBigNumber> {
    if (account) {
      return EthersBigNumber.from(0);
    }
    if (from.isNative) {
      return await provider.getBalance(account);
    }
    const ierc20 = new ethers.Contract(from.address, ierc20Abi.abi, provider);
    try {
      return await ierc20.balanceOf(account);
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

      const erc20 = new ethers.Contract(from.address, erc20Abi, provider);
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
  }, [from, provider, account]);

  useEffect(() => {
    if (!rubic) {
      return;
    }

    let disposed = false;
    async function run() {
      // Debouncing to avoid hitting CoinGecko and RPCs on every keystroke.
      // await sleep(300 / 1000);

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
        setFromUsd(newFromUsd.multipliedBy(newTrade.from.tokenAmount).toString());
        setToUsd(newToUsd.multipliedBy(newTrade.to.tokenAmount).toString());
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
  return (
    <>
      {/* <Confirmation
        show={showConfirmation}
        onClose={() => setShowConfirmation("hide")}
        from={from}
        to={to}
        fromUsd={fromUsd}
        toUsd={toUsd}
        trade={trade}
      /> */}
      {/* <TokenSelect
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
      /> */}
      {/* <TokenSelect
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
      /> */}

      <div className="mt-30px text-sm padding-20px ml-auto mr-auto max-w-[45px] bg-dark-900 border-radius-[12px]">
        <div className="flex w-full bg-dark-800 justify-rig">
          <Button className="token-select-button" onClick={() => setShowSelectFrom(true)}>
            <div className="token-and-chain-logo">
              <Image className="token-logo" src={from.logo} width="42" height="42" alt={from.name} />
              <Image
                className="chain-logo"
                // style={{ backgroundColor: fromChain.color }}
                src={fromChain.logo}
                alt={fromChain.name}
              />
            </div>
            {from.symbol}
            <ChevronIcon width="10" height="10" />
          </Button>
          <input
            ref={amountRef}
            placeholder="0.0"
            className="amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.currentTarget.value)}
          />
          <span className="usd">{fromUsd ? `$${fromUsd}` : "—"}</span>
          <div className="controls">
            <Button onClick={async () => setAmount(ethers.utils.formatUnits(await getBalance(), decimals))}>MIN</Button>
            <div className="vr" />
            <Button
              onClick={async () => setAmount(ethers.utils.formatUnits(await getBalance(), decimals))}
              disabled={!account}
            >
              MAX
            </Button>
          </div>
        </div>
        <div className="swap">
          <Spinner className="spinner" style={{ opacity: loading ? "1" : "0" }} />
          <Button
            onClick={() => {
              setAmount(trade?.to.tokenAmount.toString() ?? "");
              setFromChain(toChain);
              setToChain(fromChain);
              setFrom(to);
              setTo(from);
            }}
          >
            <ArrowDownIcon height="15" width="15" />
          </Button>
        </div>
        <div className="input">
          <Button className="token-select-button" onClick={() => setShowSelectTo(true)}>
            <div className="token-and-chain-logo">
              <Image className="token-logo" 
              src={to.logo} width="42" height="42" alt={to.name} 
              />
              <Image
                className="chain-logo"
                // style={{ backgroundColor: toChain.color }}
                src={toChain.logo}
                alt={toChain.name}
              />
            </div>
            {to.symbol}
            <ChevronIcon width="10" height="10" />
          </Button>
          <div className="amount">
            {trade ? trade.to.tokenAmount : canBuy ? "—" : "No liquidity"}
          </div>
          <span className="usd">{toUsd ? `$${toUsd}` : "—"}</span>
        </div>
        <TradeDetail trade={trade} />
        {account && (
          <Button
            className="swap-button"
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
        {/* {web3.connection === Web3Connection.ConnectedWrongChain && (
          <Button
            className="swap-button"
            onClick={async () => {
              await web3.switchChain();
            }}
          >
            Switch to {fromChain.name}
          </Button>
        )} */}
      {!account && (
        <Button color="deepPurple" onClick={toggleWalletModal}>
          Connect Wallet
        </Button>
        )}
      </div>
    </>
  );
}

interface TradeDetailProps {
  trade?: InstantTrade | CrossChainTrade;
}
function isCrossChainTrade(trade: InstantTrade | CrossChainTrade): trade is CrossChainTrade {
  return "transitFeeToken" in trade;
}
const TradeDetail: VFC<TradeDetailProps> = ({ trade }) => {
  let min: string;
  if (trade) {
    if (isCrossChainTrade(trade)) {
      min = `${trade.toTokenAmountMin} ${trade.to.symbol}`;
    } else {
      min = `${trade.toTokenAmountMin.tokenAmount} ${trade.to.symbol}`;
    }
  }

  return (
    <div className="mt-20px justify-end">
      <div className="detail">
        <div>Minimum Received:</div>
        <div>{min || "—"}</div>
      </div>
      <div className="detail">
        <div>Price:</div>
        <div>
          {trade ? (
            <div>
              1 {trade.to.symbol} = {trade.to.price.dividedBy(trade.from.price)}{" "}
              {trade.from.symbol}
            </div>
          ) : (
            <div>&mdash;</div>
          )}
        </div>
      </div>
      {/* <div className="detail">
        <div>Slippage:</div>
        <div>{trade ? `${trade.slippageTolerance * 100}%` : "—"}</div>
      </div> */}
    </div>
  );
};

// interface TokenSelectProps {
//   show: boolean;
//   chain: Chain;
//   onClose: (selection?: { token: Token; chain: Chain }) => void;
// }
// const TokenSelect: React.VFC<TokenSelectProps> = ({ show, onClose, chain }) => {
//   const [filter, setFilter] = useState("");
//   const [selectedChainId, setSelectedChainId] = useState(chain.chainId);
//   const selectedChain = useMemo(() => CHAINS.find(c => c.chainId === selectedChainId), [selectedChainId, CHAINS]);
//   const input = useRef<HTMLInputElement>(null);
//   const tokensList = useRef<HTMLDivElement>(null);
//   const normalizedFilter = filter.trim().toLowerCase();
//   const filteredTokens = selectedChain.tokens.filter(({ name, symbol, address }) => {
//     const isNameMatch = name.toLowerCase().includes(normalizedFilter);
//     const isSymbolMatch = symbol.toLowerCase().includes(normalizedFilter);
//     const isAddressMatch = address.startsWith(normalizedFilter) || address.startsWith("0x" + normalizedFilter);
//     return isNameMatch || isSymbolMatch || isAddressMatch;
//   });
//   const [isShowingChainSelect, showChainSelect] = useState(false);

//   useEffect(() => {
//     if (!show) {
//       return;
//     }

//     input.current?.focus();

//     const escape = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         onClose();
//       }
//     };
//     window.addEventListener("keydown", escape);
//     return () => {
//       window.removeEventListener("keydown", escape);
//     };
//   }, [show]);

//   useEffect(() => {
//     if (!show) {
//       setTimeout(() => {
//         setFilter("");
//         setSelectedChainId(chain.chainId);
//         showChainSelect(false);
//         tokensList.current?.scrollTo({ top: 0 });
//       }, 100);
//     }
//   }, [show]);

//   return (
//     <div className="token-select-overlay" style={{ opacity: show ? 1 : 0, pointerEvents: show ? "unset" : "none" }}>
//       <div className="token-select-background" onClick={() => onClose()} />
//       <div className="token-select-modal" style={{ transform: `translate(-50%, calc(-50% + ${show ? 0 : 30}px))` }}>
//         <div
//           className="chain-select"
//           style={{
//             transform: isShowingChainSelect ? "translateX(0)" : "translateX(100%)",
//             pointerEvents: show && isShowingChainSelect ? "all" : "none",
//           }}
//         >
//           <div className="chains-title">Select a chain</div>
//           <div className="chains">
//             {CHAINS.map((chain, i) => (
//               <Button
//                 key={chain.chainId}
//                 onClick={() => {
//                   setSelectedChainId(chain.chainId);
//                   tokensList.current?.scrollTo({ top: 0 });
//                   showChainSelect(false);
//                   setFilter("");
//                 }}
//                 className="chain"
//                 style={{ backgroundColor: chain.color }}
//               >
//                 <Image src={chain.logo} alt="chain logo" width="24" height="24" />
//                 <div style={{ flexGrow: 1, textAlign: "left" }}>{chain.name}</div>
//                 {chain.chainId === selectedChainId && <CheckCircle width="16" height="16" style={{ color: "white" }} />}
//               </Button>
//             ))}
//           </div>
//         </div>
//         <div
//           className="token-select"
//           style={{
//             transform: isShowingChainSelect ? "translateY(50px)" : "",
//             opacity: isShowingChainSelect ? 0 : 1,
//             pointerEvents: show ? "all" : "none",
//           }}
//         >
//           <div className="token-select-head">
//             <Button
//               className="selected-chain"
//               style={{ backgroundColor: selectedChain.color }}
//               onClick={() => showChainSelect(true)}
//             >
//               <Image src={selectedChain.logo} alt="selected chain logo" width="24" height="24" />
//               <div style={{ flexGrow: 1, textAlign: "left" }}>{selectedChain.name}</div>
//               <ChevronIcon width="13" height="13" style={{ color: "white", marginTop: 2 }} />
//             </Button>

//             <form
//               onSubmit={e => {
//                 e.preventDefault();
//                 onClose({ token: filteredTokens[0], chain: selectedChain });
//               }}
//             >
//               <input
//                 ref={input}
//                 className="tokens-filter"
//                 placeholder={`Search ${selectedChain.name} tokens`}
//                 value={filter}
//                 onChange={e => setFilter(e.currentTarget.value)}
//               />
//             </form>
//           </div>
//           <div className="tokens-list" ref={tokensList}>
//             {filteredTokens.map(token => (
//               <div key={token.address} onClick={() => onClose({ token, chain: selectedChain })}>
//                 <Image src={token.logo} alt="token logo" width="24" height="24" />
//                 <div className="token-name">{token.name}</div>
//                 {token.favorite && <StarIcon width="16" height="16" className="token-favorite" />}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// interface ConfirmationProps {
//   show: "hide" | "show" | "poor";
//   onClose: (selection?: Token) => void;
//   from: Token;
//   to: Token;
//   fromUsd: string | undefined;
//   toUsd: string | undefined;
//   trade?: InstantTrade | CrossChainTrade;
// }
// const Confirmation: React.VFC<ConfirmationProps> = ({ show, onClose, from, to, fromUsd, toUsd, trade }) => {
//   const input = useRef<HTMLInputElement>(null);
//   useEffect(() => {
//     if (!show) {
//       return;
//     }

//     input.current?.focus();

//     const escape = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         onClose();
//       }
//     };
//     window.addEventListener("keydown", escape);
//     return () => {
//       window.removeEventListener("keydown", escape);
//     };
//   }, [show]);

//   return (
//     <div
//       className="confirmation-overlay"
//       style={{ opacity: show !== "hide" ? 1 : 0, pointerEvents: show !== "hide" ? "unset" : "none" }}
//     >
//       <div className="confirmation-background" onClick={() => onClose()} />
//       <div
//         className="confirmation"
//         style={{ transform: `translate(-50%, calc(-50% + ${show !== "hide" ? 0 : 30}px))` }}
//       >
//         <div className="transaction">
//           <div className="transaction-side">
//             <div className="transaction-token">
//               <Image src={from.logo} alt="from token logo" width="16" height="16" />
//               {from.symbol}
//               <span style={{ flexGrow: 1 }} />
//               <span className="usd">${fromUsd ?? "0"}</span>
//             </div>
//             <div className="transaction-amount" style={{ color: show === "poor" ? "#e80625" : undefined }}>
//               {trade ? trade.from.tokenAmount : "n/a"}
//             </div>
//           </div>
//           <div className="transaction-direction">
//             <ArrowDownIcon width="42" height="42" />
//           </div>
//           <div className="transaction-side">
//             <div className="transaction-token">
//               <Image src={to.logo} alt="to token logo" width="16" height="16" />
//               {to.symbol}
//               <span style={{ flexGrow: 1 }} />
//               <span className="usd">${toUsd ?? "0"}</span>
//             </div>
//             <div className="transaction-amount">{trade ? trade.to.tokenAmount : "n/a"}</div>
//           </div>
//         </div>
//         {show === "poor" && <div className="poor-prompt">Your wallet does not have enough ${from.symbol}</div>}
//         {show === "show" && (
//           <div className="confirmation-prompt">
//             Confirm this transaction in {window.ethereum.isMetaMask ? "MetaMask" : "your wallet"}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
