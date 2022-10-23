import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { soulswapDexes } from 'constants/dexes'
// import { ELASTIC_NOT_SUPPORTED } from 'constants/v2'
import { useActiveWeb3React } from 'services/web3'
import useLiquiditySources from 'hooks/useAggregatorStats'

import { updateAllDexes } from '.'
import { AppDispatch } from '../index'

export default function Updater(): null {
  const dispatch = useDispatch<AppDispatch>()

  const { chainId } = useActiveWeb3React()
  const { data: dexes } = useLiquiditySources(chainId)

  // filterout kyberswap dexes, will hardcode
  const normalizeDexes = useMemo(() => {
    const temp =
      dexes?.map(item => ({ ...item, id: item.dexId })).filter(item => !item.dexId.includes('soulswap')) || []
      // dexes?.map(item => ({ ...item, id: item.dexId })).filter(item => !item.dexId.includes('kyberswap')) || []
    const isSupportkSElastic = false // !ELASTIC_NOT_SUPPORTED[chainId || 1]
    return [...temp, ...soulswapDexes.filter(item => (isSupportkSElastic ? true : item.id !== 'soulswap'))]
    // return [...temp, ...soulswapDexes.filter(item => (isSupportkSElastic ? true : item.id !== 'kyberswapv2'))]
  }, [dexes, chainId])

  useEffect(() => {
    if (chainId && normalizeDexes.length) {
      dispatch(
        updateAllDexes({
          chainId,
          dexes: normalizeDexes,
        }),
      )
    }
  }, [normalizeDexes, chainId, dispatch])

  return null
}