import React, { useContext, useEffect, useState } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import Column from "components/Column";
import Spacer from "components/Spacer";
import { getAccountAssets, getAccountBalance } from "utils/account";
import {
  Button,
  ContentBox,
  Heading3,
  OverlayButton,
  Typo1,
  Typo2,
  Typo3,
} from "components";
import Row from "components/Row";
import InputError from "components/InputError";
import Image from 'next/image'
import useOpenOceanApi, {
  OOToken,
  OPENOCEAN_BASEURL,
  OPENOCEAN_METHODS,
} from "hooks/useOpenOceanAPI";
import useApiData from "hooks/useApiData";
// import walletSymbol from "assets/icons/wallet.svg";
import FormattedValue from "components/FormattedBalance";
import InputCurrency from "components/InputCurrency";
import TokenSelectButton from "components/TokenSelectModal";
import useFantomApi, { FantomApiMethods } from "hooks/useFantomAPI";
import useFantomApiData from "hooks/useFantomAPIData";
// import useWalletProvider from "hooks/useWalletProvider";
import {
  toFormattedBalance,
  unitToWei,
  weiToMaxUnit,
  weiToUnit,
} from "utils/conversion";
import SwapImg from "assets/icons/Swap.svg";
import useFantomNative from "hooks/useFantomNative";
import useFantomERC20 from "hooks/useFantomERC20";
// import config from "features/aggregator/config";
import useSendTransaction from "hooks/useSendTransaction";
import useCoingeckoApi, {
  COINGECKO_BASEURL,
  COINGECKO_METHODS,
} from "hooks/useCoinGeckoAPI";
import Chart from "components/Aggregator/Chart";
// import { formatDate } from "utils/common";
import FadeInOut from "components/AnimationFade";
import useDetectResolutionType from "hooks/useDetectResolutionType";
import { formatDate } from "functions/format";
import { useActiveWeb3React } from "services/web3";
import { ChainId, OPEN_OCEAN_EXCHANGE_ADDRESS, Token, WNATIVE } from "sdk";
import { useUserTokenInfo } from "hooks/useAPI";
import { Toggle } from "components/Toggle";
import { classNames } from "functions";
import { DoubleGlowShadowV2 } from "components/DoubleGlow";
import Container from "components/Container";
import SwapHeader from "features/swap/SwapHeader";
import { SwapLayoutCard } from "layouts/SwapLayout";
import { SubmitButton } from "features/summoner/Styles";
import { getChainColor, getChainColorCode } from "constants/chains";

const SwapTokenInput: React.FC<any> = ({
  inputValue,
  setInputValue,
  token,
  setToken,
  tokenList,
  title = "Amount",
  disableMaximum,
  disabledInput,
  // refetchTimer,
}) => {
  // const { color } = useContext(ThemeContext);
  // const { getTokenBalance } = useFantomERC20();
  const { account, chainId } = useActiveWeb3React()
  // const userTokenBalance = Number(useUserTokenInfo(account, token?.address).userTokenInfo.balance)
  // const { getBalance } = useFantomNative();
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
  const handleTokenChange = (token: any) => {
    setError(null);
    setToken(token);
  };

  useEffect(() => {
    if (token) {
      setTokenBalance(BigNumber.from(token.balanceOf));
      // setTokenBalance(BigNumber.from(userTokenBalance));
    } else setFormattedTokenBalance(
      toFormattedBalance(
        weiToUnit(BigNumber.from(token.balanceOf), token.decimals)
      )
    );
    if (!disableMaximum) {
      setMaximum(weiToMaxUnit(token.balanceOf, token.decimals));
      // setMaximum(weiToMaxUnit(userTokenBalance, token.decimals));
    }
  }, [token])

  // useEffect(() => {
  //   if (token) {
  //     if (token.address === "0x0000000000000000000000000000000000000000") {
  //       return getBalance().then((balance: any) => {
  //         setFormattedTokenBalance(toFormattedBalance(weiToUnit(balance)));
  //       });
  //     }
  //     return getTokenBalance(token.address).then((tokenBalance) =>
  //       setFormattedTokenBalance(
  //         toFormattedBalance(weiToUnit(tokenBalance, token.decimals))
  //       )
  //     );
  //   }
  // }, [token, refetchTimer]);


  return (
    <Column 
    // style={{ width: '100%' }}
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
        {/* <Row 
        style={{ flex: 1, alignItems: "center"}}
        > */}
          <Spacer size="md" />
          <Row
        style={{
          backgroundColor: "#000000",
          borderRadius: "12px",
          height: "64px",
          alignItems: "center",
        }}
      >
         {!disabledInput && (
            <SubmitButton
              fontSize="16px"
              primaryColor={getChainColor(chainId)}
              // color={'grey'}
              padding="6px"
              style={{ flex: 1, marginLeft: '5rem', marginRight: '2.5rem' }}
              // variant="tertiary"
              variant="outlined"
              onClick={handleSetMax}
            >
              {"MAX"}
            </SubmitButton>
          )}
          <TokenSelectButton
            // chainId = {chainId}
            currentToken={token}
            ftmBalance={BigNumber.from(tokenBalance)}
            assets={tokenList}
            setTokenSelected={handleTokenChange}
            includeNative={false}
          />
          </Row>

          <Spacer size="lg" />
        </Row>
      {/* </Row> */}
      { error && <InputError error={error} /> }
    </Column>
  );
};

const SwapTokensContent: React.FC<any> = ({
  tokenList,
  setActiveTokens,
  setSwapRoute,
  refetchTimer,
}) => {
  // const { color } = useContext(ThemeContext);
  // const { walletContext } = useWalletProvider();
  const { account, chainId } = useActiveWeb3React()
  const { sendTx } = useFantomNative();
  const { getSwapQuote, getQuote } = useOpenOceanApi();
  const { getPrice } = useCoingeckoApi();
  const { apiData } = useApiData();
  const OOQuoteData =
    apiData[OPENOCEAN_BASEURL + OPENOCEAN_METHODS.GET_QUOTE]?.response?.data
      ?.data;
  const OOSwapQuoteData =
    apiData[OPENOCEAN_BASEURL + OPENOCEAN_METHODS.GET_SWAP_QUOTE]?.response
      ?.data?.data;
  const tokenPriceData =
    apiData[COINGECKO_BASEURL + COINGECKO_METHODS.GET_PRICE]?.response?.data;

  const [inToken, setInToken] = useState(null);
  const [outToken, setOutToken] = useState(null);
  const { getAllowance, approve } = useFantomERC20();

  const [inTokenAmount, setInTokenAmount] = useState("1")
  // const [inTokenDecimals, setInTokenDecimals] = useState(18);
  const [outTokenAmount, setOutTokenAmount] = useState("");
  const [estimatedGas, setEstimatedGas] = useState(null);
  const [priceImpact, setPriceImpact] = useState(null);
  const [minReceived, setMinReceived] = useState(null);
  const [allowance, setAllowance] = useState(BigNumber.from(0));

  const hasAllowance = (value: BigNumber) => {
    // if (inTokenDecimals) {
    if (inToken && inToken.decimals) {
      if (inToken?.address === "0x0000000000000000000000000000000000000000") {
        if (isApproveCompleted) {
          resetApproveTx();
        }
        return true;
      }
      return value.gte(unitToWei(inTokenAmount, inToken.decimals));
    }
    return false;
  };

  const {
    sendTx: handleApprove,
    isPending: isApprovePending,
    isCompleted: isApproveCompleted,
    reset: resetApproveTx,
  } = useSendTransaction(() =>
    approve(
      inToken?.address,
      OPEN_OCEAN_EXCHANGE_ADDRESS[chainId],
      unitToWei(inTokenAmount, inToken.decimals).toString()
    )
  );

  const {
    sendTx: handleSwap,
    isPending: isSwapPending,
    isCompleted: isSwapCompleted,
    reset: resetSwapTx,
  } = useSendTransaction(() =>
    sendTx(
      OOSwapQuoteData.to,
      Math.floor(OOSwapQuoteData.estimatedGas * 1.5),
      +OOSwapQuoteData.gasPrice * 2,
      OOSwapQuoteData.data,
      OOSwapQuoteData.inToken.address ===
        "0x0000000000000000000000000000000000000000"
        ? OOSwapQuoteData.value
        : null
    )
  );

  const handleSwapInOut = () => {
    setInTokenAmount("1");
    setOutTokenAmount("");
    setEstimatedGas(null);
    setMinReceived(null);
    setPriceImpact(null);
    setInToken(outToken);
    setOutToken(inToken);
  };

  useEffect(() => {
    if (tokenList) {
      setInToken(tokenList?.find((token: OOToken) => token.symbol === "FTM"));
      setOutToken(tokenList.find((token: OOToken) => token.symbol === "USDC"));
    }
  }, [tokenList]);

  useEffect(() => {
    if (inToken && outToken) {
      setActiveTokens([inToken, outToken]);
    }
  }, [inToken, outToken]);

  useEffect(() => {
    setOutTokenAmount("");
    setMinReceived(null);
    setPriceImpact(null);
    if (inTokenAmount === "") {
      setEstimatedGas(null);
    }
  }, [inTokenAmount]);

  useEffect(() => {
    if (inToken) {
      setInTokenAmount("1");
      setOutTokenAmount("");
    }
  }, [inToken]);

  useEffect(() => {
    let timeout: any;
    if (isSwapCompleted) {
      timeout = setTimeout(() => {
        setInTokenAmount("1");
        setOutTokenAmount("");
        resetSwapTx();
      }, 20_000);
    }
    return () => clearTimeout(timeout);
  }, [isSwapCompleted]);

  useEffect(() => {
    if (inToken && outToken && parseFloat(inTokenAmount) > 0) {
      getQuote(inToken, outToken, inTokenAmount, 2);
      getSwapQuote(
        inToken,
        outToken,
        inTokenAmount,
        2,
        account
      );
    }
  }, [inToken, outToken, inTokenAmount, refetchTimer]);

  useEffect(() => {
    if (
      inToken &&
      outToken &&
      OOSwapQuoteData &&
      parseFloat(inTokenAmount) > 0
    ) {
      getPrice([inToken.code, outToken.code], "usd");
    }
  }, [inToken, outToken, OOSwapQuoteData]);

  useEffect(() => {
    if (inToken && outToken && parseFloat(inTokenAmount) > 0) {
      if (inToken.address === "0x0000000000000000000000000000000000000000") {
        return;
      }
      getAllowance(
        inToken?.address,
        OPEN_OCEAN_EXCHANGE_ADDRESS[chainId],
      ).then((result) => {
        setAllowance(result);
      });
    }
  }, [inToken, outToken, inTokenAmount, isApproveCompleted, refetchTimer]);

  useEffect(() => {
    if (
      OOSwapQuoteData &&
      outToken?.decimals &&
      parseFloat(inTokenAmount) > 0
    ) {
      // Only update if the data fetched is still representative
      if (
        parseFloat(inTokenAmount).toFixed(4) ===
        parseFloat(
          weiToUnit(BigNumber.from(OOSwapQuoteData.inAmount)).toString()
        ).toFixed(4)
      ) {
        // setOutTokenAmount(
        //   weiToUnit(
        //     BigNumber.from(OOSwapQuoteData.outAmount),
        //     outToken.decimals
        //   ).toString()
        // );

        setMinReceived(
          weiToUnit(
            BigNumber.from(OOSwapQuoteData.minOutAmount),
            outToken.decimals
          ).toString()
        );
        setEstimatedGas(
          weiToUnit(
            BigNumber.from(OOSwapQuoteData.estimatedGas).mul(
              BigNumber.from(OOSwapQuoteData.gasPrice)
            )
          ).toString()
        );
      }
    }
  }, [OOSwapQuoteData]);

  useEffect(() => {
    if (OOQuoteData && outToken?.decimals && parseFloat(inTokenAmount) > 0) {
      if (
        parseFloat(inTokenAmount).toFixed(4) ===
        parseFloat(OOQuoteData.inAmount).toFixed(4)
      ) {
        setOutTokenAmount(OOQuoteData.outAmount);

        setSwapRoute(OOQuoteData.path);
      }
    }
  }, [OOQuoteData]);

  useEffect(() => {
    if (
      OOSwapQuoteData &&
      tokenPriceData &&
      parseFloat(inTokenAmount) > 0 &&
      parseFloat(outTokenAmount) > 0
    ) {
      const inTokenAmount = weiToUnit(
        BigNumber.from(OOSwapQuoteData?.inAmount),
        inToken?.decimals
      );
      const outTokenAmount = weiToUnit(
        BigNumber.from(OOSwapQuoteData?.outAmount),
        outToken?.decimals
      );
      const inTokenPrice = tokenPriceData[inToken.data] ? tokenPriceData[inToken?.code]["usd"] : '-'
      const outTokenPrice = tokenPriceData[outToken.data] ? tokenPriceData[outToken?.code]["usd"] : '-'
      // console.log(inTokenAmount, outTokenAmount, inTokenPrice, outTokenPrice);
      const priceImpact =
        (inTokenAmount * inTokenPrice - outTokenAmount * outTokenPrice) /
        (inTokenAmount * inTokenPrice);

      setPriceImpact(priceImpact * 100);
    }
  }, [OOSwapQuoteData, tokenPriceData]);

  return (
      <Column style={{ width: "100%" }}>
        {inToken && (
          <SwapTokenInput
            inputValue={inTokenAmount}
            setInputValue={setInTokenAmount}
            tokenList={tokenList}
            setToken={setInToken}
            token={inToken}
            // title={"Pay"}
            refetchTimer={refetchTimer}
            disabledInput={isSwapPending || isSwapCompleted}
          />
        )}

          <Spacer size="sm" />
        <Row style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{ height: "1px", width: "100%", backgroundColor: "#000000" }}
          />
          <OverlayButton style={{ padding: 0 }} onClick={handleSwapInOut}>
            <Row
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: "32px",
                width: "32px",
                border: "1px solid #67748B",
                borderRadius: "50%",
              }}
            >
              <Image alt="swap" style={{ height: "20px" }} src={SwapImg} />
            </Row>
          </OverlayButton>
          <div
            style={{ height: "1px", width: "100%", backgroundColor: "#000000" }}
          />
        </Row>
        <Spacer size="sm" />
        {outToken && (
          <SwapTokenInput
            inputValue={outTokenAmount}
            setInputValue={setOutTokenAmount}
            disabledInput={true}
            tokenList={tokenList}
            setToken={setOutToken}
            token={outToken}
            // title={"Receive"}
            refetchTimer={refetchTimer}
          />
        )}
        <Spacer
          size="lg"
        />
        {hasAllowance(allowance) ? (
          <Button
            variant="primary"
            onClick={handleSwap}
            disabled={isSwapPending || isSwapCompleted || !minReceived}
          >
            {isSwapPending
              ? "Swapping..."
              : isSwapCompleted
                ? "Swap successful"
                : !minReceived
                  ? "Fetching best price..."
                  : "Swap"}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleApprove}
            disabled={isApproveCompleted || isApprovePending}
          >
            {isApprovePending
              ? "Approving..."
              : isApproveCompleted
                ? "Approved!"
                : "Approve"}
          </Button>
        )}
        <Spacer
          size="lg"
        />
        <ContentBox style={{ backgroundColor: "#000000" }}>
          <Column style={{ width: "100%", gap: "1rem" }}>
            <Typo2
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>Estimated Cost</div>
              {estimatedGas ? (
                <FormattedValue
                  formattedValue={toFormattedBalance(estimatedGas.toString())}
                  tokenSymbol={"FTM"}
                />
              ) : (
                "-"
              )}
            </Typo2>
            <Typo2
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>Price Impact</div>
              {priceImpact ? (
                <FormattedValue
                  formattedValue={toFormattedBalance(priceImpact.toString())}
                  tokenSymbol={"%"}
                />
              ) : (
                "-"
              )}
            </Typo2>
            <Typo2
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>Minimum Received</div>
              {minReceived ? (
                <FormattedValue
                  formattedValue={toFormattedBalance(minReceived.toString())}
                  tokenSymbol={outToken?.symbol}
                />
              ) : (
                "-"
              )}
            </Typo2>
          </Column>
        </ContentBox>
      </Column>
  );
};

const TokenChart: React.FC<any> = ({ showChart = false, activeTokens, refetchTimer, width }) => {
  const { getMarketHistory } = useCoingeckoApi();
  const { apiData } = useApiData();
  const { chainId } = useActiveWeb3React()
  const [interval, setInterval] = useState("15m");
  const [chartData, setChartData] = useState(null);
  const [pricePoint, setPricePoint] = useState(null);
  const [priceTime, setPriceTime] = useState(null);
  // const [showChart, setShowChart] = useState(false)

  const handleCrosshairData = (data: any[]) => {
    setPricePoint(data[1] ? data[1] : chartData[chartData.length - 1].value);
    setPriceTime(data[0] ? data[0] : chartData[chartData.length - 1].time);
  };

  const inTokenChartData =
    apiData[
      COINGECKO_BASEURL +
      COINGECKO_METHODS.GET_MARKET_CHART +
      `/${activeTokens[0]?.code}/market_chart`
    ]?.response?.data;
  const outTokenChartData =
    apiData[
      COINGECKO_BASEURL +
      COINGECKO_METHODS.GET_MARKET_CHART +
      `/${activeTokens[1]?.code}/market_chart`
    ]?.response?.data;

  const intervalToDays = {
    "5m": 1,
    "15m": 3,
    "30m": 7,
    "1h": 14,
    "1d": 30,
  } as any;

  useEffect(() => {
    if (activeTokens[0]?.code !== "null" && activeTokens[1]?.code !== "null") {
      getMarketHistory(activeTokens[0]?.code, intervalToDays[interval], "usd");
      getMarketHistory(activeTokens[1]?.code, intervalToDays[interval], "usd");
      return;
    }
    setChartData(null);
  }, [activeTokens, interval, refetchTimer]);

  useEffect(() => {
    if (inTokenChartData && outTokenChartData) {
      const inReversed = inTokenChartData.prices.reverse();
      const outReversed = outTokenChartData.prices.reverse();

      const graphDataReversed = inReversed.map(
        (dataPoint: any[], index: number) => {
          if (outReversed.length > index) {
            return {
              time: parseInt((dataPoint[0] / 1000).toString()),
              value: dataPoint[1] / outReversed[index][1],
            };
          }
          return null;
        }
      );
      const graphData = graphDataReversed
        .filter((data: any) => data !== null)
        .reverse();

      setChartData(graphData);
      setPricePoint(graphData[graphData.length - 1].value);
      setPriceTime(graphData[graphData.length - 1].time);
      // setShowChart(true)
    }
  }, [inTokenChartData, outTokenChartData]);

  useEffect(() => {
    if (!chartData) {
      setPricePoint(null);
      setPriceTime(null);
      // setShowChart(false)
    }
  }, [chartData]);

  return (
    <div className="grid">

      { showChart &&
        <Column>
          <Row style={{ justifyContent: "space-between" }}>
            <Column>
              <Row>
                <Image
                  alt={`${activeTokens[0]?.symbol} icon`}
                  width="40px" height={"40px"}
                  style={{ height: "40px", width: "40px", zIndex: 2 }}
                  src={activeTokens[0]?.icon}
                />
                <Spacer
                size="lg"
                />
                <Image
                  alt={`${activeTokens[1]?.symbol} icon`}
                  width="40px" height={"40px"}
                  src={activeTokens[1]?.icon}
                  style={{ height: "40px", width: "40px", marginLeft: "-.5rem" }}
                />
                <Spacer />
                {activeTokens[0]?.symbol}
                <Spacer
                  size="xs"
                />
                /
                <Spacer
                  size="xs"
                />
                {activeTokens[1]?.symbol}
              </Row>
              <Spacer
                size="sm"
              />
              <Row>
                {["5m", "15m", "30m", "1h", "1d"].map((selectInterval) => {
                  return (
                    <OverlayButton
                      key={`interval-${selectInterval}`}
                      onClick={() => setInterval(selectInterval)}
                    >
                      <Typo1
                        style={{
                          // justifyContent: 'space-between',
                          fontWeight:
                            selectInterval === interval ? "bold" : "normal",
                        }}
                      >
                        {selectInterval}
                      </Typo1>
                    </OverlayButton>
                  );
                })}
              </Row>
            </Column>
            <Column 
            style={{ alignItems: "center" }}
            >
              {pricePoint ? pricePoint.toFixed(6) : ""}
              <Spacer
                size="sm"
              />
              <Typo1>
                {priceTime ? formatDate(new Date(priceTime * 1000)) : ""}
              </Typo1>
            </Column>
          </Row>
          {chartData && showChart && (
            <div key={width + (chartData?.length || 0)}>
              <Chart data={chartData} handleCrossHairData={handleCrosshairData} />
            </div>
          )}
        </Column>
      }
    </div>
  )
}

const SwapRoute: React.FC<any> = ({ route, tokenList, activeTokens }) => {
  const RouteBox = (part: any, first: boolean) => {
    const token = tokenList.find(
      (token: any) =>
        token.address.toLowerCase() ===
        (first ? part.from.toLowerCase() : part.to.toLowerCase())
    );
    return (
      <div className="flex justify-between">
      <ContentBox
        key={`route-column-${part.parts}-${part.dexes[0].dex}-${token?.symbol}`}
        style={{ padding: ".5rem", width: "100%" }}
        >
        <Row style={{ alignItems: "center" }}>
          <Image
            alt={`${token?.symbol} icon`}
            width="36px" height={"36px"} style={{ height: "36px", width: "36px" }} src={token?.icon} />
          <Spacer
            size="lg"
            />
          <Column>
            <Typo3 style={{ fontWeight: "bold" }}>{token.symbol}</Typo3>
            <Typo3>{part.dexes[0].dex}</Typo3>
          </Column>
        </Row>
      </ContentBox>
    </div>
    );
  };

  return (
    <Column style={{ width: "100%" }}>
      {/* <Heading3>Routing</Heading3>
      <Spacer
        size="xs"
      /> */}
      <Row 
        style={ { justifyContent: "space-between", alignItems: "center" }}
        >
        <Row style={{ alignItems: "center" }}>
          <Image
            alt={`${activeTokens[0]?.symbol} logo`}
            width="40px" height={"40px"}
            style={{ height: "40px", width: "40px" }}
            src={activeTokens[0]?.icon}
          />
          <Spacer
            size="sm"
          />
          <div
            style={{ width: "1px", height: "30px", backgroundColor: "#232F46" }}
          />
        </Row>
        <Column style={{ gap: ".2rem" }}>
          {route?.routes?.map((routePart: any) => {
            return (
              <Row
                key={`route-row-${routePart.parts}`}
                style={{
                  gap: ".2rem",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                {routePart.subRoutes.map((subRoutePart: any, index: number) => {
                  return RouteBox(subRoutePart, index === 0);
                })}
              </Row>
            );
          })}
        </Column>
        <Row style={{ alignItems: "center" }}>
          <div
            style={{ width: "1px", height: "30px", backgroundColor: "#232F46" }}
          />
          <Spacer
            size="sm"
          />
          <Image
            alt={`${activeTokens[1]?.symbol} logo`}
            width="40px" height={"40px"}
            style={{ height: "40px", width: "40px" }}
            src={activeTokens[1]?.icon}
          />
        </Row>
      </Row>
    </Column>
  );
};

const Aggregator: React.FC<any> = () => {
  const { getTokenList } = useOpenOceanApi();
  // const { walletContext } = useWalletProvider();
  const { account, chainId } = useActiveWeb3React()
  const { apiData: fantomApiData } = useFantomApiData();
  const { width } = useDetectResolutionType();
  const { apiData } = useApiData();
  const [tokenList, setTokenList] = useState(null);
  const [showChart, setShowChart] = useState(false)
  const [activeTokens, setActiveTokens] = useState(
    [tokenList?.find((token: OOToken) => token.symbol === "FTM"),
    tokenList?.find((token: OOToken) => token.symbol === "USDC")]
    // {
    //   address: "0x0000000000000000000000000000000000000000",
    //   code: "fantom",
    //   decimals: 18,
    //   icon:
    //     "https://ethapi.openocean.finance/logos/fantom/0x0000000000000000000000000000000000000000.png",
    //   symbol: "FTM",
    // },
    // {
    //   address: "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
    //   code: "usd-coin",
    //   decimals: 6,
    //   icon:
    //     "https://ethapi.openocean.finance/logos/fantom/0x04068da6c83afcfa0e13ba15a6696662335d5b75.png",
    //   symbol: "USDC",
    // },
  )
  const [swapRoute, setSwapRoute] = useState(null);
  const [refetchTimer, setRefetchTimer] = useState(0);
  const activeAddress = account ? account.toLowerCase() : null
  // walletContext.activeWallet.address
  //   ? walletContext.activeWallet.address.toLowerCase()
  //   : null;

  useFantomApi(
    FantomApiMethods.getAssetsListForAccount,
    {
      owner: activeAddress,
    },
    activeAddress
    // 5000
  );
  useFantomApi(
    FantomApiMethods.getAccountBalance,
    {
      address: activeAddress,
    },
    activeAddress
    // 5000
  );

  const assetsListData = fantomApiData[
    FantomApiMethods.getAssetsListForAccount
  ].get(activeAddress)?.data;
  const accountFantomBalanceData = fantomApiData[
    FantomApiMethods.getAccountBalance
  ].get(activeAddress)?.data;
  const OOTokenListData =
    apiData[OPENOCEAN_BASEURL + OPENOCEAN_METHODS.GET_TOKENLIST]?.response?.data
      ?.data;

  useEffect(() => {
    let interval: any;
    let times = 0;
    if (!interval) {
      interval = setInterval(() => {
        times += 1;
        setRefetchTimer(times);
      }, 300_000);
    }

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getTokenList();
  }, []);
  useEffect(() => {
    if (assetsListData && OOTokenListData && accountFantomBalanceData) {
      const fantomBalance = getAccountBalance(accountFantomBalanceData);
      const accountAssets = getAccountAssets(assetsListData);
      setTokenList(
        OOTokenListData.map((OOToken: OOToken) => {
          const accountToken = accountAssets.find(
            (token) =>
              token.address.toLowerCase() === OOToken.address.toLowerCase()
          );
          return {
            ...OOToken,
            balanceOf:
              OOToken.address === "0x0000000000000000000000000000000000000000"
                ? fantomBalance
                : accountToken
                  ? accountToken.balanceOf
                  : "0x0",
            logoURL: OOToken.icon,
          };
        })
      );
    }
  }, [assetsListData, OOTokenListData, accountFantomBalanceData]);

  //https://api.coingecko.com/api/v3/coins/beethoven-x/market_chart?vs_currency=usd&days=60
  return (
    <Container id="aggregator-page" maxWidth="2xl" className="space-y-4">
      <DoubleGlowShadowV2>
        <div className="p-4 mt-4 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}>
          <div className="px-2">
            <SwapHeader />
          </div>
          <SwapLayoutCard>
            <FadeInOut>
              <div className="flex">
              <Row
                style={{
                  gap: "2rem",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <SwapTokensContent
                  tokenList={tokenList}
                  setActiveTokens={setActiveTokens}
                  setSwapRoute={setSwapRoute}
                  refetchTimer={refetchTimer}
                />
                <Column style={{ flex: 2, minWidth: "100%" }}>
                <div className={classNames(chainId == ChainId.FANTOM ? `flex flex-cols-2 gap-0 text-white justify-end` : 'hidden')}>
                <Toggle
                  id="toggle-button"
                  optionA="Chart"
                  optionB="Chart"
                  isActive={showChart}
                  toggle={
                    showChart
                      ? () => {
                        setShowChart(false)
                      }
                      : () => {
                        setShowChart(true)
                      }
                  }
                />
              </div>
                  { showChart &&
                  <TokenChart
                    showChart={showChart}
                    width={width}
                    activeTokens={activeTokens}
                    refetchTimer={refetchTimer}
                  />
                  }
                  <Spacer />
                  <SwapRoute
                    route={swapRoute}
                    tokenList={tokenList}
                    activeTokens={activeTokens}
                  />
                </Column>
              </Row>
              </div>
              <Spacer />
            </FadeInOut>
          </SwapLayoutCard>
        </div>
      </DoubleGlowShadowV2>
    </Container>
  );
};

export default Aggregator;
