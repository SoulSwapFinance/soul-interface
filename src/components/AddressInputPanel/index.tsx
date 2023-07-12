import React, { FC, useCallback } from 'react'
import useENS from 'hooks/useENS'
import { getChainColorCode } from 'constants/chains'
import { useActiveWeb3React } from 'services/web3'

interface AddressInputPanelProps {
  id?: string
  value: string
  onChange: (value: string) => void
  selectChainId?: any
}

const AddressInputPanel: FC<AddressInputPanelProps> = ({ id, value, onChange }) => {
  const { chainId } = useActiveWeb3React()
  const { address, loading } = useENS(value)

  const handleInput = useCallback(
    (event) => {
      const input = event.target.value
      const withoutSpaces = input.replace(/\s+/g, '')
      onChange(withoutSpaces)
    },
    [onChange]
  )

  const error = Boolean(value.length > 0 && !loading && !address)

  return (
    <div
      className={`flex flex-row bg-dark-800 rounded items-center h-[68px] ${
        error ? 'border border-red border-opacity-50' : ''
      }`}
      id={id}
    >
      <div className="flex justify-between w-full sm:w-2/5 px-5">
        <span className="text-[18px] text-primary">{`Send to:`}</span>
        <span 
          className={`text-${getChainColorCode(chainId)} text-sm underline cursor-pointer`}
          onClick={() => onChange(null)}>
          {`Remove`}
        </span>
      </div>
      <div className="flex w-full h-full sm:w-3/5 border-2 border-dark-800 rounded-r">
        <input
          className="p-3 w-full h-full flex overflow-ellipsis font-bold recipient-address-input bg-dark-900 rounded placeholder-low-emphesis"
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          placeholder="Wallet Address or ENS name"
          pattern="^(0x[a-fA-F0-9]{40})$"
          onChange={handleInput}
          value={value}
        />
      </div>
    </div>
  )
}

export default AddressInputPanel
