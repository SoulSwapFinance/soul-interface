import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import Image from 'next/image'
import { Button } from "components/Button";
import { Input } from "components/index";
import Modal from "components/DefaultModal";
import Row from "components/Row";
import { classNames } from "functions/styling";
import { Chain, CHAINS, Token } from "features/cross/chains";

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
    const [showChainSelect, setShowChainSelect] = useState(false);
  
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
          setShowChainSelect(false);
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
            className={classNames(showChainSelect ? "w-full h-full top-0 left-0 z-10 bg-dark-1100" : "hidden")}
          >
  
            {/* CHAIN SELECTION */}
            <Modal
              isOpen={showChainSelect}
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
                      setShowChainSelect(false);
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
        </div>
     {/* TOKEN + CHAIN MODAL */}
        <div
          className="flex flex-cols border-radius-[8px] w-[100%] h-[100%] bg-dark-1100"
          style={{
            transform: showChainSelect ? "translateY(50px)" : "",
            opacity: showChainSelect ? 0 : 1,
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
                style={{ backgroundColor: selectedChain?.color }}
                onClick={() => setShowChainSelect(true)}
              >
                <div className="grid grid-cols-1 w-[33%]">
                  <Image
                    src={selectedChain?.logo}
                    width={36} height={36}
                    alt={selectedChain?.name + ' logo'}
                    className={"w-full justify-center"}
                  />
                </div>
                <div style={{ flexGrow: 1, fontSize: "24px", textAlign: "center" }}>{selectedChain?.name}</div>
              </Button>

              {/* SEARCH BAR */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  onClose({ token: filteredTokens[0], chain: selectedChain });
                }}
              >
                <div className="w-[100%] my-6" />
                <Input
                  ref={input}
                  className="w-[100%] border border-unset border-radius-[4px] text-black mb-1"
                  placeholder={`Search ${selectedChain.name} Tokens`}
                  value={filter}
                  onChange={e => setFilter(e.currentTarget.value)}
                />
              </form>
              <div className="w-[100%] my-6" />

              {/* SELECT TOKEN LIST */}
              {/* {filter && */}
              <div
                className="grid grid-cols-1 bg-dark-1100 justify-center w-[95%]"
                ref={tokensList}>
                {filteredTokens.map(token => (
                  <div className="flex border border-2 m-0.5 
                    border-dark-1000 rounded rounded-3xl bg-black font-bold justify-between"
                    key={token.address} onClick={() => onClose({ token, chain: selectedChain })}>
                    <Row style={{ gap: "1rem", alignItems: "center" }}>
                      <Image src={token.logo} width={36} height={36} alt={token.name + ' logo'} />
                      <Row
                        style={{
                          width: "98%",
                          justifyContent: "space-between",
                        }}
                      >
                        {`${token.name} (${token.symbol})`}
                      </Row>
                    </Row>
                  </div>
                ))}
              </div>
              {/* } */}
            </div>
          </Modal>
        </div>
    </div>
    )
}

export default TokenSelect