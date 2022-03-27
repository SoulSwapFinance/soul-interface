
import AssetBalances from 'features/portfolio/AssetBalances/AssetBalances'
import { useLPTableConfig } from './useLPTableConfig'
// import { useTridentLiquidityPositions } from 'services/graph'
import { useLiquidityPositions } from 'services/graph'
import { useActiveWeb3React } from 'services/web3'
import React from 'react'

export const LiquidityPositionsBalances = () => {
  const { account, chainId } = useActiveWeb3React()

  const liquidityPositions = useLiquidityPositions({
    chainId,
    variables: { where: { user: account?.toLowerCase(), balance_gt: 0 } },
    shouldFetch: !!chainId && !!account,
  })

  const { config } = useLPTableConfig(liquidityPositions)
  return <AssetBalances config={config} />
}