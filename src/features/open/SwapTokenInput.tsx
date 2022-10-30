import React, { useEffect, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import Column from "components/Column";
import Row from "components/Row";
import InputError from "components/InputError";
import InputCurrency from "components/InputCurrency";
import TokenSelectButton from "components/TokenSelectModal";
import {
  toFormattedBalance,
  weiToMaxUnit,
  weiToUnit,
} from "utils/conversion";
import useFantomNative from "hooks/useFantomNative";
import { useActiveWeb3React } from "services/web3";
import { SubmitButton } from "features/summoner/Styles";
import { getChainColor } from "constants/chains";

const SwapTokenInput: React.FC<any> = ({
    inputValue,
    setInputValue,
    token,
    setToken,
    tokenList,
    // title = "Amount",
    disableMaximum,
    disabledInput,
  }) => {
    // const { color } = useContext(ThemeContext);
    const { account, chainId } = useActiveWeb3React()
    // const userTokenBalance = Number(useUserTokenInfo(account, token?.address).userTokenInfo.balance)
    const { getBalance } = useFantomNative();
    const [error, setError] = useState(null);
    const [tokenBalance, setTokenBalance] = useState(BigNumber.from(0));
    const [formattedTokenBalance, setFormattedTokenBalance] = useState<any>([
      "0",
      "0",
    ]);
    const [maximum, setMaximum] = useState(null);
  
    const handleSetMax = () => {
      setError(null);
      setInputValue(
        weiToMaxUnit(
          tokenBalance
            .sub(
              BigNumber.from(10).pow(
                token?.address === "0x0000000000000000000000000000000000000000"
                  ? token?.decimals
                  : 1
              )
            )
            .toString(),
          token?.decimals
        )
      );
    };
    
    const handleSetHalf = () => {
      setError(null);
      setInputValue(
        weiToMaxUnit(
          tokenBalance
          .div(2)
            .sub(
              BigNumber.from(10).pow(
                token?.address === "0x0000000000000000000000000000000000000000"
                  ? token?.decimals
                  : 1
              )
            )
            .toString(),
          token?.decimals
        )
      );
    };
  
    const handleTokenChange = (token: any) => {
      setError(null);
      setToken(token);
    };
  
    useEffect(() => {
      if (token) {
        setTokenBalance(BigNumber.from(token.balanceOf));
      } else setFormattedTokenBalance(
        toFormattedBalance(
          weiToUnit(BigNumber.from(token.balanceOf), token.decimals)
        )
      );
      if (!disableMaximum) {
        setMaximum(weiToMaxUnit(token.balanceOf, token.decimals));
      }
    }, [token])
  
    return (
      <Column
      style={{ width: '100%' }}
      >
        <Row
          style={{
            backgroundColor: "#000000",
            borderRadius: "12px",
            height: "64px",
            alignItems: "center",
          }}
        >
          <InputCurrency
            disabled={disabledInput}
            value={inputValue}
            max={maximum}
            handleValue={setInputValue}
            handleError={setError}
            token={token}
          />
          <Row
            style={{ flex: 0.2, alignItems: "right" }}
          >
            <Row
              style={{
                backgroundColor: "#000000",
                borderRadius: "12px",
                height: "64px",
                alignItems: "center",
              }}
            >
              <TokenSelectButton
                currentToken={token}
                ftmBalance={BigNumber.from(tokenBalance)}
                assets={tokenList}
                setTokenSelected={handleTokenChange}
                includeNative={false}
              />
            </Row>
          </Row>
        </Row>
        {error && <InputError error={error} />}
        {!disabledInput && (
          <div className="grid grid-cols-2 gap-1 mt-1">
          
          <SubmitButton
            fontSize="16px"
            primaryColor={getChainColor(chainId)}
            variant="bordered"
            onClick={handleSetHalf}
          >
            {"50%"}
          </SubmitButton>
          <SubmitButton
            fontSize="16px"
            primaryColor={getChainColor(chainId)}
            variant="bordered"
            onClick={handleSetMax}
          >
            {"MAX"}
          </SubmitButton>
          </div>
        )}
      </Column>
    );
  };

  export default SwapTokenInput