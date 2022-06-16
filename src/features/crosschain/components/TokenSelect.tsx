import { StarIcon } from "@heroicons/react/solid";
import { Chain, CHAINS, Token } from "features/crosschain/helpers/Chains";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle } from "react-feather";

interface TokenSelectProps {
    show: boolean;
    chain: Chain;
    onClose: (selection?: { token: Token; chain: Chain }) => void;
}

const DEFAULT_CHAIN_LOGO = 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=003'

export const TokenSelect: React.VFC<TokenSelectProps> = ({ show, onClose, chain }) => {
    const [filter, setFilter] = useState("");
    const [selectedChainId, setSelectedChainId] = useState(chain?.chainId);
    const selectedChain = useMemo(() => CHAINS.find(c => c.chainId === selectedChainId), [selectedChainId, CHAINS]);
    const input = useRef<HTMLInputElement>(null);
    const tokensList = useRef<HTMLDivElement>(null);
    const normalizedFilter = filter.trim().toLowerCase();
    const filteredTokens = selectedChain?.tokens.filter(({ name, symbol, address }) => {
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
          setSelectedChainId(chain?.chainId);
          showChainSelect(false);
          tokensList.current?.scrollTo({ top: 0 });
        }, 100);
      }
    }, [show]);
  
    return (
      // TokenSelectOverlay
      <div className="fixed w-full h-full" style={{ opacity: show ? 1 : 0, pointerEvents: show ? "unset" : "none" }}>
        {/* TokenSelectBackground */}
        <div className="absolute w-full h-full bg-dark-900" onClick={() => onClose()} />
        {/* TokenSelectModal */}
        <div className="fixed h-[95px] border top-[50%] left-[50%] w-full max-h-[768px] max-w-[280px]" style={{ transform: `translate(-50%, calc(-50% + ${show ? 0 : 30}px))` }}>
          {/* ChainSelect */}
          <div
            className="absolute w-full h-full bg-dark-800"
            style={{
              transform: isShowingChainSelect ? "translateX(0)" : "translateX(100%)",
              pointerEvents: show && isShowingChainSelect ? "all" : "none",
            }}
          >
            <div className="chains-title">Select Chain</div>
            <div className="chains">
              {CHAINS.map((chain, i) => (
                <button
                  key={chain.chainId}
                  onClick={() => {
                    setSelectedChainId(chain.chainId);
                    tokensList.current?.scrollTo({ top: 0 });
                    showChainSelect(false);
                    setFilter("");
                  }}
                  className="chain"
                  style={{ backgroundColor: chain.color }}
                >
                  <img src={chain.logo} width="24" height="24" />
                  <div style={{ flexGrow: 1, textAlign: "left" }}>{chain.name}</div>
                  {chain.chainId === selectedChainId && 
                  <CheckCircle width="16" height="16" style={{ color: "white" }} />
                  }
                </button>
              ))}
            </div>
          </div>
          <div
            className="token-select"
            style={{
              transform: isShowingChainSelect ? "translateY(50px)" : "",
              opacity: isShowingChainSelect ? 0 : 1,
              pointerEvents: show ? "all" : "none",
            }}
          >
            <div className="token-select-head">
              <button
                className="selected-chain"
                style={{ backgroundColor: selectedChain?.color }}
                onClick={() => showChainSelect(true)}
              >
                <img src={selectedChain?.logo || DEFAULT_CHAIN_LOGO} width="24" height="24" />
                <div style={{ flexGrow: 1, textAlign: "left" }}>{selectedChain?.name || 'FANTOM'}</div>
                {/* TODO */}
                {/* <ChevronIcon width="13" height="13" style={{ color: "white", marginTop: 2 }} /> */}
              </button>
  
              <form
                onSubmit={e => {
                  e.preventDefault();
                  onClose({ token: filteredTokens[0], chain: selectedChain });
                }}
              >
                <input
                  ref={input}
                  className="tokens-filter"
                  placeholder={`Search ${selectedChain?.name || 'FANTOM'} tokens`}
                  value={filter}
                  onChange={e => setFilter(e.currentTarget.value)}
                />
              </form>
            </div>
            <div className="tokens-list" ref={tokensList}>
              {filteredTokens?.map(token => (
                <div key={token.address} onClick={() => onClose({ token, chain: selectedChain })}>
                  <img src={token.logo} width="24" height="24" />
                  <div className="token-name">{token.name}</div>
                  {token.favorite && <StarIcon width="16" height="16" className="token-favorite" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };