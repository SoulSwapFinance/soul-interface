import { BigNumber } from "@ethersproject/bignumber";
import { Currency, JSBI, Percent } from "sdk";
import Notify from 'bnc-notify'
import { ethers } from 'ethers'
import { Pair, Token } from "sdk";
import { TokenAddressMap } from "state/lists/hooks";
export * from './tools/axios'
export * from './tools/getPrice'
export * from './tools/rate'


export function ASSERT(f: () => boolean, t?: string) {
    if (!f() && t) console.error(t);
  }
  
  export function closeValues(a: number, b: number, accuracy: number): boolean {
    if (accuracy === 0) return a === b;
    if (a < 1 / accuracy) return Math.abs(a - b) <= 10;
    return Math.abs(a / b - 1) < accuracy;
  }
  
// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10_000))
}


  export function calcSquareEquation(
    a: number,
    b: number,
    c: number
  ): [number, number] {
    const D = b * b - 4 * a * c;
    console.assert(D >= 0, `Discriminant is negative! ${a} ${b} ${c}`);
    const sqrtD = Math.sqrt(D);
    return [(-b - sqrtD) / 2 / a, (-b + sqrtD) / 2 / a];
  }
  
  // returns such x > 0 that f(x) = out or 0 if there is no such x or f defined not everywhere
  // hint - approximation of x to spead up the algorithm
  // f assumed to be continues monotone growth function defined everywhere
  export function revertPositive(
    f: (x: number) => number,
    out: number,
    hint = 1
  ) {
    try {
      if (out <= f(0)) return 0;
      let min, max;
      if (f(hint) > out) {
        min = hint / 2;
        while (f(min) > out) min /= 2;
        max = min * 2;
      } else {
        max = hint * 2;
        while (f(max) < out) max *= 2;
        min = max / 2;
      }
  
      while (max / min - 1 > 1e-4) {
        const x0: number = (min + max) / 2;
        const y0 = f(x0);
        if (out === y0) return x0;
        if (out < y0) max = x0;
        else min = x0;
      }
      return (min + max) / 2;
    } catch (e) {
      return 0;
    }
  }
  
  export function getBigNumber(
    value: number
  ): BigNumber {
    const v = Math.abs(value)
    if (v < Number.MAX_SAFE_INTEGER) return BigNumber.from(Math.round(value));
  
    const exp = Math.floor(Math.log(v) / Math.LN2);
    console.assert(exp >= 51, "Internal Error 314");
    const shift = exp - 51;
    const mant = Math.round(v / Math.pow(2, shift));
    const res = BigNumber.from(mant).mul(BigNumber.from(2).pow(shift));
    return value > 0 ? res : res.mul(-1);
  }
  
  // amount must be a BigNumber, {base,display}Decimals must be Numbers
export function amountFormatter(amount, baseDecimals = 18, displayDecimals = 3, useLessThan = true) {
  try {
    // if balance is falsy, return undefined
    if (!amount) {
      return undefined
    }

    if (displayDecimals > baseDecimals) {
      return amountFormatter(amount, baseDecimals, baseDecimals, useLessThan)
    }

    const zero = ethers.constants.Zero
    if (baseDecimals > 18 || displayDecimals > 18 || displayDecimals > baseDecimals) {
      throw Error(`Invalid combination of baseDecimals '${baseDecimals}' and displayDecimals '${displayDecimals}.`)
    }
    // if amount is 0, return
    else if (amount.isZero()) {
      return '0'
    }
    // amount is negative
    else if (amount.lt(zero)) {
      return `-${amountFormatter(zero.sub(amount), baseDecimals, displayDecimals, useLessThan)}`
    }
    // amount > 0
    else {
      // amount of 'wei' in 1 'ether'
      const baseAmount = ethers.BigNumber.from(10).pow(ethers.BigNumber.from(baseDecimals))

      const minimumDisplayAmount = baseAmount.div(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(displayDecimals)))

      // if balance is less than the minimum display amount
      if (amount.lt(minimumDisplayAmount)) {
        return useLessThan
          ? `<${ethers.utils.formatUnits(minimumDisplayAmount, baseDecimals)}`
          : `${ethers.utils.formatUnits(amount, baseDecimals)}`
      }
      // if the balance is greater than the minimum display amount
      else {
        const stringAmount = ethers.utils.formatUnits(amount, baseDecimals)

        // if there isn't a decimal portion
        if (!stringAmount.match(/\./)) {
          return stringAmount
        }
        // if there is a decimal portion
        else {
          const [wholeComponent, decimalComponent] = stringAmount.split('.')
          const roundUpAmount = minimumDisplayAmount.div(ethers.constants.Two)
          const roundedDecimalComponent = ethers.BigNumber.from(decimalComponent.padEnd(baseDecimals, '0'))
            .add(roundUpAmount)
            .toString()
            .padStart(baseDecimals, '0')
            .substring(0, displayDecimals)

          // decimals are too small to show
          if (roundedDecimalComponent === '0'.repeat(displayDecimals)) {
            return wholeComponent
          }
          // decimals are not too small to show
          else {
            return `${wholeComponent}.${roundedDecimalComponent.toString().replace(/0*$/, '')}`
          }
        }
      }
    }
  } catch {
    return undefined
  }
}

export const trackTx = (hash, chainId) => {
  if (process.env.REACT_APP_BLOCK_NATIVE) {
    const notify = Notify({
      dappId: process.env.REACT_APP_BLOCK_NATIVE, // [String] The API key created by step one above
      networkId: chainId, // [Integer] The Ethereum network ID your Dapp uses.
    })
    // Track Tx progress
    notify.hash(hash)
  }
}

export function safeAccess(object, path) {
  return object
    ? path.reduce(
        (accumulator, currentValue) => (accumulator && accumulator[currentValue] ? accumulator[currentValue] : null),
        object
      )
    : null
}

export function trimVerboseDecimals(number: string): string {
  const decimalIndex = number.indexOf(".");
  if (decimalIndex === -1) {
    return number;
  }
}

export function prettyDisplayNumber(number: BigNumber): string {
  if (number.gte(1000)) {
    return number.toFixed(0);
  } else if (number.gt(1)) {
    return number.toFixed(2);
  } else {
    return trimVerboseDecimals(number.toFixed(0));
  }
}

export function isTokenOnList(defaultTokens: TokenAddressMap, currency: Currency): boolean {
  let veri = true
  currency.isNative ? veri = true : veri = Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address])
  return veri
}

export function isPairOnList(pairs: Pair[], pair?: Pair): boolean {
  if (!pair) return false
  return !!pairs.find(loopedPair => loopedPair
    // .equals(
      = pair
      // )
    )
}