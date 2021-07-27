import { useBentoBoxContract } from './useContract'
import { useEffect, useState } from 'react'
import { SPELL } from '../constants'
import { BigNumber } from 'ethers'

export default function useMeowshiPerSpell() {
  const bentoboxContract = useBentoBoxContract()
  const [state, setState] = useState<[BigNumber, BigNumber]>([BigNumber.from('0'), BigNumber.from('0')])

  useEffect(() => {
    if (!bentoboxContract) return
    ;(async () => {
      const toShare = await bentoboxContract.toShare(SPELL.address, '1'.toBigNumber(SPELL.decimals), false)
      const toAmount = await bentoboxContract.toAmount(SPELL.address, '1'.toBigNumber(SPELL.decimals), false)
      setState([toShare, toAmount])
    })()
  }, [bentoboxContract])

  return state
}
