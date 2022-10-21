import { BigNumber, parseFixed } from "@ethersproject/bignumber";
import { formatBytes32String } from "@ethersproject/strings";

export const formatStringToBytes32 = (value: string) => {
  return formatBytes32String(value);
};

export const formatHexToBN = (value: string) => {
  return BigNumber.from(value);
};
export const formatHexToInt = (value: string) => {
  return parseInt(value, 16);
};

export const weiToUnit = (value: BigNumber, decimals = 18) => {
  if (!value?._isBigNumber) {
    console.warn(`[weiToUnit] ${value} is not of type BigNumber`);
    return;
  }
  const result = value.mul(10000).div(BigNumber.from(10).pow(decimals));
  return result.toNumber() / 10000;
};

export const weiToMaxUnit = (value: string, decimals = 18) => {
  let safeValue = BigNumber.from(value).toString();
  // Fill wei with leading 0's if needed
  if (safeValue.length < decimals) {
    const fill = decimals - safeValue.length;
    safeValue = Array(fill).fill("0").join("") + safeValue;
  }
  return (
    safeValue.toString().substr(0, safeValue.length - decimals) +
    "." +
    safeValue.toString().substr(safeValue.length - decimals)
  );
  // return parseFloat(value) / Math.pow(10, decimals);
};

export const hexToUnit = (value: string, decimals = 18) => {
  const bn = BigNumber.from(value);
  return weiToUnit(bn, decimals);
};

export const unitToWei = (value: string, decimals = 18) => {
  if (!(parseFloat(value) > 0)) {
    return BigNumber.from(0);
  }

  return parseFixed(
    value.length > decimals ? value.substr(0, decimals) : value.toString(),
    decimals
  );
};

export const toFormattedBalance = (
  value: string | number,
  toFixed = 2
): [string, string] => {
  const formatThousands = (value: number) => {
    let valueLeft = value;
    let formatted = "";
    while (valueLeft >= 1000) {
      formatted =
        "," +
        valueLeft.toString().substr(valueLeft.toString().length - 3) +
        formatted;
      valueLeft = parseInt((valueLeft / 1000).toString());
    }

    return valueLeft.toString() + formatted;
  };
  const full = value.toString();
  const parts = full.toString().split(".");

  return [
    formatThousands(parseInt(parts[0], 10)) === "NaN"
      ? "0"
      : formatThousands(parseInt(parts[0], 10)),
    parts[1] ? `.${parts[1].substr(0, toFixed)}` : ".00",
  ];
};

export const toCurrencySymbol = (currency: string) => {
  if (currency.toLowerCase() === "usd") return "$";
  if (currency.toLowerCase() === "eur") return "€";
};

export const millisecondsToTimeUnit = (millis: number) => {
  const seconds = millis / 1000;
  if (seconds < 60 * 60) {
    return `${Math.round(seconds / 60)} ${seconds < 60 ? "minute" : "minutes"}`;
  }
  if (seconds < 60 * 60 * 24) {
    return `${Math.round(seconds / (60 * 60))} ${
      seconds < 60 * 60 ? "hour" : "hours"
    }`;
  }
  if (seconds < 60 * 60 * 24 * 365) {
    return `${Math.round(seconds / (60 * 60 * 24))} ${
      seconds < 60 * 60 * 24 ? "day" : "days"
    }`;
  }
};

export const formatSimpleValue = (value: number) => {
  const stringValue = value.toString();
  const hasDecimals = stringValue.includes(".");
  const splitValue = stringValue.split(".");
  let result = "";
  // @ts-ignore
  const doFormat = (value: string) => {
    if (value.length > 3) {
      const take = value.slice(-3);
      result = result ? `${take},${result}` : take;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return doFormat(value.substr(0, value.length - 3));
    }
    result = result
      ? `${value},${result}${
          splitValue[1] ? `.${splitValue[1]}` : hasDecimals ? "." : ""
        }`
      : `${splitValue[0]}${
          splitValue[1] ? `.${splitValue[1]}` : hasDecimals ? "." : ""
        }`;
    return;
  };
  doFormat(splitValue[0]);

  return result;
};