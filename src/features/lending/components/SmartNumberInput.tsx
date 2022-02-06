import { BigNumber } from '@ethersproject/bignumber'
import React from 'react'
import { ArrowDownRight, ArrowUpRight } from 'react-feather'

import { Button } from 'components/Button'
import Input from 'components/Input'
import { formatNumber } from 'functions/format'

type SmartNumberInputProps = {
  color: 'blue' | 'purple'
  token: any
  value: string
  setValue: any

  useCoffinTitleDirection: 'up' | 'down'
  useCoffinTitle: string
  useCoffin: boolean
  setUseCoffin: any

  maxTitle?: string
  max: number
  pinMax?: boolean
  setPinMax?: any
  showMax?: boolean
  disabled?: boolean
  switchDisabled?: boolean
}

export default function SmartNumberInput({
  color = 'blue',
  token,
  value,
  setValue,

  useCoffinTitleDirection = 'down',
  useCoffinTitle = '',
  useCoffin,
  setUseCoffin,

  maxTitle = 'Max',
  max,
  pinMax = false,
  setPinMax,
  showMax = false,
  disabled = false,
  switchDisabled = false,
}: SmartNumberInputProps) {
  return (
    <>
      <div className="flex items-center justify-between my-4">
        <div className="flex items-center text-base text-secondary">
          <span>
            {useCoffinTitleDirection == 'down' ? (
              <ArrowDownRight size="1rem" style={{ display: 'inline' }} />
            ) : (
              <ArrowUpRight size="1rem" style={{ display: 'inline' }} />
            )}
          </span>
          <span className="mx-2">{useCoffinTitle}</span>
          <span>
            <Button
              variant="outlined"
              size="xs"
              color={color}
              className={'disabled:cursor-not-allowed focus:ring focus:ring-' + color}
              onClick={() => {
                setUseCoffin(!useCoffin)
              }}
              disabled={switchDisabled}
            >
              {useCoffin ? 'CoffinBox' : 'Wallet'}
            </Button>
          </span>
        </div>
        <div className="text-base text-right text-secondary" style={{ display: 'inline', cursor: 'pointer' }}>
          {maxTitle} {formatNumber(max / 10 ** token.tokenInfo.decimals)}
        </div>
      </div>

      <div className="relative flex items-center w-full mb-4">
        <Input.Numeric
          className={
            'w-full p-3 bg-dark-700 rounded disabled:cursor-not-allowed disabled:bg-dark-1000 disabled:ring disabled:ring-dark-800 focus:ring focus:ring-' +
            color
          }
          value={value}
          onUserInput={setValue}
          onFocus={() => {
            if (pinMax) {
              setValue('')
            }
            if (setPinMax) {
              setPinMax(false)
            }
          }}
          disabled={disabled}
        />
        {showMax && Number(max) > 0 && (
          <Button
            variant="outlined"
            size="xs"
            color={color}
            onClick={() => {
              if (setPinMax) {
                setPinMax(true)
              } else {
                setValue(max / 10 ** token.tokenInfo.decimals)
              }
            }}
            className={'absolute right-4 focus:ring focus:ring-' + color}
          >
            MAX
          </Button>
        )}
      </div>
    </>
  )
}