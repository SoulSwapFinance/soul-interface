import { RowBetween, RowFixed } from '../../components/Row'

import { AutoColumn } from '../../components/Column'
import React from 'react'

function TradeSummary() {
  return (
    <>
      <AutoColumn style={{ padding: '0 16px' }} className="text-sm">
        <RowBetween>
          <RowFixed>
            <div className="text-secondary">Pooled Tokens</div>
          </RowFixed>
          <RowFixed>
            <div className="text-white">
              1.576 →&nbsp;
              <span className="text-green">1.787 FTM/SOUL SLP</span>
            </div>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <div className="text-secondary">% Share</div>
          </RowFixed>
          <RowFixed>
            <div className="text-white">
              &lt; 0.01% →&nbsp;
              <span className="text-green">0.01%</span>
            </div>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <div className="text-secondary">Liquidity Provider Fee</div>
          </RowFixed>
          <RowFixed>
            <div className="text-white">0.00283 FTM</div>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <div className="text-secondary">Network Fee</div>
          </RowFixed>
          <RowFixed>
            <div className="text-white">0.008654 FTM</div>
          </RowFixed>
        </RowBetween>
      </AutoColumn>
    </>
  )
}

export interface AdvancedLiquidityDetailsProps {
  show?: boolean
}

export function AdvancedLiquidityDetails() {
  return (
    <AutoColumn gap="0px">
      <TradeSummary />
    </AutoColumn>
  )
}

export default AdvancedLiquidityDetails
