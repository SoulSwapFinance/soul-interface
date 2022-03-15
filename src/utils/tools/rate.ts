import { ethers } from 'ethers'

export function getExchangeRate(inputValue, inputDecimals, outputValue, outputDecimals, invert = false) {
  try {
    if (
      inputValue &&
      (inputDecimals || inputDecimals === 0) &&
      outputValue &&
      (outputDecimals || outputDecimals === 0)
    ) {
      const factor = ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18))

      if (invert) {
        return inputValue
          .mul(factor)
          .div(outputValue)
          .mul(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(outputDecimals)))
          .div(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(inputDecimals)))
      } else {
        return outputValue
          .mul(factor)
          .div(inputValue)
          .mul(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(inputDecimals)))
          .div(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(outputDecimals)))
      }
    }
  } catch {}
}
