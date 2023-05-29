import { getChainColorCode } from 'constants/chains'
import { Input as PercentInput } from '../PercentInput'
import React, { useState } from 'react'
import { ChainId } from 'sdk'

interface PercentInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  id: string
  chainId: ChainId
}

export default function PercentInputPanel({ value, onUserInput, id, chainId }: PercentInputPanelProps) {
  const [ clicked, setClicked ] = useState(false)
  
  return (
    <div id={id} className={`p-2 rounded bg-${getChainColorCode(chainId)} ${!clicked ? 'animate-pulse' : ''}`}
      onSelect={() => setClicked(true)}
    >
      <div className="flex flex-col justify-between sm:space-y-0 sm:flex-row">
        {/* <div className="w-full text-white sm:w-2/5" style={{ margin: 'auto 0px' }}>
          Amount to Remove
        </div> */}
        <div className="flex items-center w-full p-3 space-x-3 text-xl font-bold rounded bg-dark-900 sm:w-3/5">
          <PercentInput
            className="token-amount-input"
            value={value}
            onUserInput={(val) => {
              onUserInput(val)
            }}
            align="right"
          />
          <div className="pl-2 text-xl font-bold">%</div>
        </div>
      </div>
    </div>
  )
}
