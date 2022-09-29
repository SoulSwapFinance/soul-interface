import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { ChainId } from 'sdk'
import { useSoulSwapContract } from 'hooks/useContract'
import { useActiveWeb3React } from 'services/web3'
import { signERC2612Permit } from 'eth-permit'
import { useCallback } from 'react'
import ReactGA from 'react-ga'

import LPToken from './LPToken'

const useSoulSwap = (version: 'v1' | 'v2' = 'v2') => {
  const { chainId, library, account } = useActiveWeb3React()
  const sushiRoll = useSoulSwapContract(version)
  const ttl = 60 * 20

  let from = ''

  if (chainId === ChainId.ETHEREUM) {
    from = 'Uniswap'
  } else if (chainId === ChainId.BSC) {
    from = 'PancakeSwap'
  }

  const migrate = useCallback(
    async (lpToken: LPToken, amount: BigNumber) => {
      if (sushiRoll) {
        const deadline = Math.floor(new Date().getTime() / 1000) + ttl
        const args = [lpToken.tokenA.address, lpToken.tokenB.address, amount, Zero, Zero, deadline]

        const gasLimit = await soulSwap.estimateGas.migrate(...args)
        const tx = soulSwap.migrate(...args, {
          gasLimit: gasLimit.mul(120).div(100),
        })

        ReactGA.event({
          category: 'Migrate',
          action: `${from}->SoulSwap`,
          label: 'migrate',
        })

        return tx
      }
    },
    [sushiRoll, ttl, from]
  )

  const migrateWithPermit = useCallback(
    async (lpToken: LPToken, amount: BigNumber) => {
      if (account && soulSwap) {
        const deadline = Math.floor(new Date().getTime() / 1000) + ttl
        const permit = await signERC2612Permit(
          library,
          lpToken.address,
          account,
          soulSwap.address,
          amount.toString(),
          deadline
        )
        const args = [
          lpToken.tokenA.address,
          lpToken.tokenB.address,
          amount,
          Zero,
          Zero,
          deadline,
          permit.v,
          permit.r,
          permit.s,
        ]

        const gasLimit = await soulSwap.estimateGas.migrateWithPermit(...args)
        const tx = await soulSwap.migrateWithPermit(...args, {
          gasLimit: gasLimit.mul(120).div(100),
        })

        ReactGA.event({
          category: 'Migrate',
          action: `${from}->SoulSwap`,
          label: 'migrateWithPermit',
        })

        return tx
      }
    },
    [account, library, soulSwap, ttl, from]
  )

  return {
    migrate,
    migrateWithPermit,
  }
}

export default useSoulSwap