import AssetBalances from 'features/portfolio/AssetBalances/AssetBalances'
import { useLPTableConfig } from 'features/portfolio/AssetBalances/liquidityPositions/useLPTableConfig'
// import { useTridentLiquidityPositions } from 'services/graph'
import { useActiveWeb3React } from 'services/web3'
import React from 'react'

export const LiquidityPositionsBalances = () => {
  const { account, chainId } = useActiveWeb3React()

  // const { data: positions } = useTridentLiquidityPositions({
  //   chainId,
  //   variables: { where: { user: account?.toLowerCase(), balance_gt: 0 } },
  //   shouldFetch: !!chainId && !!account,
  // })

  // const { config } = useLPTableConfig(positions)
  // return <AssetBalances config={config} />
}
