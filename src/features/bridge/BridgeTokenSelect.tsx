import React, { useEffect, useState } from 'react';
import { i18n } from "@lingui/core"
import { t } from "@lingui/macro"
import { OverlayButton, Typo1, Typo2 } from "components"
// import Column from "components/Column"
import Loader from "components/Loader"
import { getChainColor, getChainColorCode } from "constants/chains"
import useModal from "hooks/useModal"
import Image from 'next/image'
import Row from "components/Row";
import { weiToUnit } from "../../utils/conversion"
import Scrollbar from 'components/Scrollbar';

export const BalancePromiseToUnit: React.FC<any> = ({ promise, decimals }) => {
  const [value, setValue] = useState(null)
  useEffect(() => {
    promise.then((resolvedValue: any) => {
      if (resolvedValue) {
        setValue(resolvedValue)
      }
    })
  }, [promise])

  return (
    <Row style={{ alignItems: "center" }}>
      <Typo2 style={{ width: "12rem", textAlign: "end", paddingRight: "0rem" }}>
        {value ? weiToUnit(value, decimals) : "..."}
      </Typo2>
    </Row>
  )
}

export const BridgeTokenSelectModal: React.FC<any> = ({
  tokens,
  selectToken,
  onDismiss,
  chainId,
  // toChain
}) => {
  return (
    <Scrollbar className={`m-[12%] sm:max-w-[60%]`}>
      <div>
        <div className={`grid grid-cols-1 sm:p-3 bg-dark-1000 border-[${getChainColor(chainId)}] items-center border border-4 rounded rounded-2xl`}>
          {/* <div> */}
          {tokens &&
            tokens.map((token: any) => {
              return (
                <div
                  className={`my-1 rounded rounded-xl hover:border hover:border-2 hover:border-${getChainColorCode(chainId)}`}
                  key={"token-select-" + token.name}
                  onClick={() => {
                    selectToken(token)
                    onDismiss()
                  }}
                // style={{ padding: ".5rem" }}
                >
                  <div className={`flex justify-between gap-4`}
                  // style={{
                  //   width: "100%",
                  //   justifyContent: "space-between",
                  // }}
                  >
                    <div
                      className={`flex mx-6`}
                    // style={{ gap: "1rem", alignItems: "center" }}
                    >
                      <Image
                        alt="token logo"
                        height={36}
                        width={36}
                        src={token.logoUrl}
                      />
                    </div>
                    <div className={`flex font-bold mt-1 text-center`}>
                      {`${token.symbol}`}
                    </div>

                    <div
                      className={`flex mx-6`}
                    >
                      <BalancePromiseToUnit
                        promise={token.balance}
                        decimals={token.Decimals}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </Scrollbar>
  )
}

const BridgeTokenSelect: React.FC<any> = ({ tokens, selected, selectToken, chainId, toChain }) => {
  const [onPresentSelectTokenModal] = useModal(
    <BridgeTokenSelectModal tokens={tokens} selectToken={selectToken} chainId={chainId} toChain={toChain} />,
    "bridge-token-select-modal"
  )

  return (
    <OverlayButton
      style={{ padding: 0 }}
      disabled={!tokens || !tokens.length}
      onClick={() => tokens && tokens.length && onPresentSelectTokenModal()}
    >
      <div className={`grid grid-cols-1 w-full justify-center text-center mt-3 mb-3 font-bold text-${getChainColorCode(toChain)} border border-[${getChainColor(toChain)}] rounded rounded-2xl bg-dark-1000`}>
        {`Bridge Token`}
        <div className={`flex w-full p-1 border border-2 border-[${getChainColor(toChain)}] rounded rounded-2xl bg-dark-800`}>
          <div
            className={`grid grid-cols-1 w-full justify-center`}
          >
            {selected ? (
              <div
                className={`grid grid-cols-2 w-full mt-2 justify-center`}
              >
                <div>
                  <Image
                    alt="token logo"
                    height={40}
                    width={40}
                    src={selected.logoUrl}
                  />
                </div>
                <div
                  className={`flex font-bold m-1.5 text-lg`}
                >
                  {selected.symbol}
                </div>
              </div>
            ) : tokens && tokens.length ? (
              <Typo1>{i18n._(t`Select Token`)}</Typo1>
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </div>
    </OverlayButton>
  )
}

export default BridgeTokenSelect