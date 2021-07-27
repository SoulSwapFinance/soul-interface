import { useBentoBoxContract } from './useContract'
import { useEffect, useState } from 'react'
import { SPELL } from '../constants'
import { BigNumber } from 'ethers'
import { ChainId } from '@soulswap/sdk'

export default function useMeowshiPerSpell() {
  const bentoboxContract = useBentoBoxContract()
  const [state, setState] = useState<[BigNumber, BigNumber]>([BigNumber.from('0'), BigNumber.from('0')])

  useEffect(() => {
    if (!bentoboxContract) return
    ;(async () => {
      const toShare = await bentoboxContract.toShare(
        SPELL[ChainId.FANTOM_TESTNET],
        '1'.toBigNumber(SPELL[ChainId.FANTOM_TESTNET].decimals),
        false
      )
      const toAmount = await bentoboxContract.toAmount(
        SPELL[ChainId.FANTOM_TESTNET],
        '1'.toBigNumber(SPELL[ChainId.FANTOM_TESTNET].decimals),
        false
      )
      setState([toShare, toAmount])
    })()
  }, [bentoboxContract])

  return state
}
