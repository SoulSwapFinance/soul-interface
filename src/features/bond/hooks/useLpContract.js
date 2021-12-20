import { ethers } from 'ethers'

import { usePairContract, useHelperContract } from './useContract'

function useLpContract(tokenAddress, token0, token1, token0Address, token1Address) {
  const contract = usePairContract(tokenAddress)
  const farmHelperContract = useHelperContract()

  const lpBalValue = async () => {
    try {
      const result = await farmHelperContract?.fetchTokenRateBals()

      const ftmPrice = result?.[1] / (result?.[0] / 10 ** 12)
      const soulPrice = (result?.[2] / result?.[3]) * ftmPrice
      const seancePrice = (result?.[4] / result?.[5]) * ftmPrice
      const ethPrice = (result?.[8] / result?.[9]) * ftmPrice

      // console.log(
      //   'usdcPerFtm:',
      //   ftmPrice,
      //   'soulPrice:',
      //   soulPrice,
      //   'seancePrice:',
      //   seancePrice,
      //   'ethPrice:',
      //   ethPrice
      // )

      //   const balance = await contract.balanceOf(address)

      //   const _token0 = IToken(lpToken).token0();
      //   const _token1 = IToken(lpToken).token1();
      const token0Contract = await contract.balanceOf(token0Address)
      const token1Contract = await contract.balanceOf(token1Address)

      let lpValue


      // get how many of token0 and token1 go into 1 LP tokens
      // baseAmount = base token (token0 or token1) * 2
      // holdingValue = baseAmount * base token price (i.e, ftmPrice)

      // if: stablecoin
      if (
        token0 == 'FUSD' ||
        token1 == 'FUSD' ||
        token0 == 'USDC' ||
        token1 == 'USDC' ||
        token0 == 'FUSDT' ||
        token1 == 'FUSDT' ||
        token0 == 'GFUSDT' ||
        token1 == 'GFUSDT' ||
        token0 == 'DAI' ||
        token1 == 'DAI'
      ) {
        if (token0 == 'FUSD' || token0 == 'USDC' || token0 == 'FUSDT' || token0 == 'GFUSDT' || token0 == 'DAI') {
          lpValue = token0Contract.balanceOf(lpToken) * 2
        } else {
          lpValue = token1Contract.balanceOf(lpToken) * 2
        }
        // else if: base token
      } else if (token0 == 'WFTM' || token1 == 'WFTM') {
        if (token0 == 'WFTM') {
          lpValue = token0Contract.balanceOf(lpToken) * 2 * ftmPrice
        } else {
          lpValue = token1Contract.balanceOf(lpToken) * 2 * ftmPrice
        }
      } else if (token0 == 'SOUL' || token1 == 'SOUL') {
        if (token0 == 'SOUL') {
          lpValue = token0Contract.balanceOf(lpToken) * 2 * soulPrice
        } else {
          lpValue = token1Contract.balanceOf(lpToken) * 2 * soulPrice
        }
      } else if (token0 == 'SEANCE' || token1 == 'SEANCE') {
        if (token0 == 'SEANCE') {
          lpValue = token0Contract.balanceOf(lpToken) * 2 * seancePrice
        } else {
          lpValue = token1Contract.balanceOf(lpToken) * 2 * seancePrice
        }
      } else if (token0 == 'WETH' || token1 == 'WETH') {
        if (token0 == 'WETH') {
          lpValue = token0Contract.balanceOf(lpToken) * 2 * ethPrice
        } else {
          lpValue = token1Contract.balanceOf(lpToken) * 2 * ethPrice
        }
      }

      return lpValue
    } catch (e) {
      console.log(e)
      // alert(e.message)
    }
  }

  return {
    lpBalValue,
  }
}

export default useLpContract
