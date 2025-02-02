import { ChainId } from 'sdk'
import React from 'react'
import { useLiquidityPositions } from 'hooks/getPrices'
import { formatNumber } from 'functions'
import Loader from 'components/Loader'
import Image from 'next/image'
import dynamic from 'next/dynamic'

interface LiquidityPositionsProps {
  account: string
  chainId: ChainId
}

const LiquidityPositionsComponent: React.FC<LiquidityPositionsProps> = ({ account, chainId }) => {
  const { positions, loading } = useLiquidityPositions({
    variables: { where: { user: account?.toLowerCase(), balance_gt: 0 } },
    shouldFetch: !!chainId && !!account,
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <Loader size="24px" />
      </div>
    )
  }

  if (!positions || positions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="text-lg text-low-emphesis">No liquidity positions found</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 text-sm font-medium text-secondary md:grid-cols-4">
        <div>Pool</div>
        <div className="text-right">Share</div>
        <div className="hidden text-right md:block">Value</div>
        <div className="text-right">Actions</div>
      </div>
      <div className="space-y-2">
        {positions.map((position, i) => (
          <div 
            key={i} 
            className="grid grid-cols-3 py-4 px-4 rounded bg-dark-900 md:grid-cols-4"
          >
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Image 
                  src={position.token0.logoURI} 
                  className="w-5 h-5 rounded-full" 
                  alt={position.token0.symbol}
                  width={20}
                  height={20}
                />
                <Image 
                  src={position.token1.logoURI} 
                  className="w-5 h-5 rounded-full" 
                  alt={position.token1.symbol}
                  width={20}
                  height={20}
                />
              </div>
              <div className="text-sm font-medium">
                {position.token0.symbol}/{position.token1.symbol}
              </div>
            </div>
            <div className="flex items-center justify-end">
              <div className="text-sm font-medium">
                {formatNumber(position.poolShare, false, true)}%
              </div>
            </div>
            <div className="hidden items-center justify-end md:flex">
              <div className="text-sm font-medium">
                ${formatNumber(position.value)}
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2">
              <button 
                onClick={() => window.location.href = `/exchange/add/${position.token0.address}/${position.token1.address}`}
                className="px-3 py-1 text-sm rounded-full bg-blue hover:bg-blue/90"
              >
                Add
              </button>
              <button 
                onClick={() => window.location.href = `/exchange/remove/${position.token0.address}/${position.token1.address}`}
                className="px-3 py-1 text-sm rounded-full bg-pink hover:bg-pink/90"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Export the non-dynamic version for static rendering
export { LiquidityPositionsComponent }

// Export the dynamic version as default for client-side rendering
export default dynamic(() => Promise.resolve(LiquidityPositionsComponent), {
  ssr: false,
})
