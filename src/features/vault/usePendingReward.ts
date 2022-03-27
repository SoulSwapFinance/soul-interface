import { useAlcxRewarderContract, useComplexRewarderContract } from '../../hooks/useContract'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { ChainId } from '../../sdk'
import { Chef } from './enum'
import { Fraction } from '../../entities/bignumber/Fraction'
import { getContract } from '../../functions'
import { useActiveWeb3React } from 'services/web3'
import { useBlockNumber } from '../../state/application/hooks'

const REWARDERS = {
  [ChainId.ETHEREUM]: 'some'
}

// const useRewarderContract = (farm) => {
//     const { chainId } = useActiveWeb3React()
//     const aclxRewarder = useAlcxRewarderContract()
//     const useComplexRewarderContract = useComplexRewarderContract()
//     // const rewarderContract = await getContract(
//     //     rewarderAddress ? rewarderAddress : undefined,
//     //     ALCX_REWARDER_ABI,
//     //     library!,
//     //     undefined
//     // )
// }

const usePending = (farm) => {
  const [balance, setBalance] = useState<string>('0')

  const { chainId, account, library } = useActiveWeb3React()
  const currentBlockNumber = useBlockNumber()

  const aclxRewarder = useAlcxRewarderContract()

  const complexRewarder = useComplexRewarderContract(farm?.rewarder?.id)

  const contract = useMemo(
    () => ({
      [ChainId.ETHEREUM]: aclxRewarder
    }),
    [aclxRewarder]
  )

  useEffect(() => {
    async function fetchPendingReward() {
      try {
        const pending = await contract[chainId]?.pendingTokens(farm.id, account, '0')
        // todo: do not assume [0] or that rewardToken has 18 decimals
        const formatted = Fraction.from(BigNumber.from(pending?.rewardAmounts[0]), BigNumber.from(10).pow(18)).toString(
          18
        )
        setBalance(formatted)
      } catch (error) {
        console.error(error)
      }
    }
    // id = 0 is evaluated as false
    if (
      account &&
      aclxRewarder &&
      farm &&
      library &&
      (farm.chef === Chef.SUMMONER_V2 || farm.chef === Chef.MINICHEF)
    ) {
      fetchPendingReward()
    }
  }, [account, currentBlockNumber, aclxRewarder, complexRewarder, farm, library, contract, chainId])

  return balance
}

export default usePending
