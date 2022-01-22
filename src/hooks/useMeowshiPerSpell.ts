import { useBentoBoxContract } from './useContract'
import { useEffect, useState } from 'react'
import { ENCHANT } from '../constants'
import { BigNumber } from 'ethers'
import { ChainId } from '../sdk'

export default function useMeowshiPerSpell() {
  const bentoboxContract = useBentoBoxContract()
  const [state, setState] = useState<[BigNumber, BigNumber]>([BigNumber.from('0'), BigNumber.from('0')])

  useEffect(() => {
    if (!bentoboxContract) return
    ;(async () => {
      const toShare = await bentoboxContract.toShare(
        ENCHANT[ChainId.FANTOM],
        '1',
        // .toBigNumber(ENCHANT[ChainId.FANTOM].decimals),
        false
      )
      const toAmount = await bentoboxContract.toAmount(
        ENCHANT[ChainId.FANTOM],
        '1',
        // .toBigNumber(ENCHANT[ChainId.FANTOM].decimals),
        false
      )
      setState([toShare, toAmount])
    })()
  }, [bentoboxContract])

  return state
}
