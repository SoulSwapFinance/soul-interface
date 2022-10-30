import React, { FC, useEffect, useState } from "react";
import Column from "components/Column";
import Spacer from "components/Spacer";
import {
  ContentBox,
  OverlayButton,
  Typo1,
  Typo3,
} from "components";
import Row from "components/Row";
import Image from 'next/image'
import useApiData from "hooks/useApiData";
import useCoingeckoApi, {
  COINGECKO_BASEURL,
  COINGECKO_METHODS,
} from "hooks/useCoinGeckoAPI";
import { formatDate } from "functions";
import Chart from "components/Aggregator/Chart";

const TokenChart: FC<any> = ({ showChart, activeTokens, refetchTimer, width }) => {
  const { getMarketHistory } = useCoingeckoApi();
  const { apiData } = useApiData();
  const [interval, setInterval] = useState("15m");
  const [chartData, setChartData] = useState(null);
  const [pricePoint, setPricePoint] = useState(null);
  const [priceTime, setPriceTime] = useState(null);

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

      {showChart &&
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

const SwapRoute: FC<any> = ({ route, tokenList, activeTokens }) => {
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
      <Row
        style={{ justifyContent: "space-between", alignItems: "center" }}
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

export default TokenChart