import useRestApi from "./useRestApi";

export const COINGECKO_BASEURL = "https://api.coingecko.com/api/v3";

export enum COINGECKO_METHODS {
  GET_PRICE = "/simple/price",
  GET_MARKET_CHART = "/coins",
}

const useCoingeckoApi = () => {
  const { get } = useRestApi(COINGECKO_BASEURL);

  const getPrice = (tokens: string[], currency: "usd" | "eur" = "usd") => {
    return get({
      path: COINGECKO_METHODS.GET_PRICE,
      queryParams: [
        ["vs_currencies", currency],
        ["ids", tokens.join(",")],
      ],
    });
  };

  const getMarketHistory = (
    code: string,
    days = 3,
    currency: "usd" | "eur" = "usd"
  ) => {
    return get({
      path: COINGECKO_METHODS.GET_MARKET_CHART,
      params: [code, "market_chart"],
      queryParams: [
        ["vs_currency", currency],
        ["days", days],
      ],
    });
  };

  return {
    getPrice,
    getMarketHistory,
  };
};

export default useCoingeckoApi;