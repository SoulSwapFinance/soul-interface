import { Contract } from "@ethersproject/contracts"
import { useMemo } from "react"
import { CurrencyAmount, JSBI } from "sdk"
import { useActiveWeb3React } from "services/web3"
import { NEVER_RELOAD, useSingleCallResult } from "state/multicall/hooks"
import { useToken } from "./Tokens"

export function useTokenInfo(tokenContract?: Contract | null) {
    // const { account, chainId } = useActiveWeb3React()
    // const vaults = useVaults()
  
    const _totalSupply = useSingleCallResult(tokenContract ? tokenContract : null, 'totalSupply')?.result
  
    const _burnt = useSingleCallResult(
      tokenContract ? tokenContract : null,
      'balanceOf',
      ['0x000000000000000000000000000000000000dEaD'],
      NEVER_RELOAD
    )?.result?.[0]
  
    let lockedInVaults = JSBI.BigInt(0)
  
    // vaults
    //   .filter((r) => r.lockupDuration > 0)
    //   .forEach((r) => {
    //     lockedInVaults = JSBI.add(lockedInVaults, JSBI.BigInt(r.totalLp.toString())) // TODO: fix
    //   })
  
    const totalSupply = _totalSupply ? JSBI.BigInt(_totalSupply.toString()) : JSBI.BigInt(0)
    const burnt = _burnt ? JSBI.BigInt(_burnt.toString()) : JSBI.BigInt(0)
  
    const circulatingSupply = JSBI.subtract(JSBI.subtract(totalSupply, burnt), lockedInVaults)
  
    const token = useToken(tokenContract?.address)
  
    return useMemo(() => {
      if (!token) {
        return {
          totalSupply: '0',
          burnt: '0',
          circulatingSupply: '0',
          lockedInVaults: '0',
        }
      }
  
      return {
        totalSupply: CurrencyAmount.fromRawAmount(token, totalSupply).toFixed(0),
        burnt: CurrencyAmount.fromRawAmount(token, burnt).toFixed(0),
        vaults: CurrencyAmount.fromRawAmount(token, lockedInVaults).toFixed(0),
        circulatingSupply: CurrencyAmount.fromRawAmount(token, circulatingSupply).toFixed(0),
      }
    }, [totalSupply, burnt, circulatingSupply, token, lockedInVaults])
  }