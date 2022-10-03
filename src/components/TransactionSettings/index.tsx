import { ExclamationIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Percent } from 'sdk'
import { DEFAULT_DEADLINE_FROM_NOW } from '../../constants'
import { classNames } from 'functions'
import { useSetUserSlippageTolerance, useUserSlippageTolerance, useUserTransactionTTL } from 'state/user/hooks'
import React, { FC, useState } from 'react'

import { Button } from '../Button'
import QuestionHelper from '../QuestionHelper'
import Typography from '../Typography'
import { getChainColorCode } from 'constants/chains'
import { useActiveWeb3React } from 'services/web3'

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}

export interface TransactionSettingsProps {
  placeholderSlippage?: Percent // varies according to the context in which the settings dialog is placed
}

const TransactionSettings: FC<TransactionSettingsProps> = ({ placeholderSlippage }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const userSlippageTolerance = useUserSlippageTolerance()
  const setUserSlippageTolerance = useSetUserSlippageTolerance()
  const [deadline, setDeadline] = useUserTransactionTTL()

  const [slippageInput, setSlippageInput] = useState('')
  const [slippageError, setSlippageError] = useState<SlippageError | false>(false)
  const [deadlineInput, setDeadlineInput] = useState('')
  const [deadlineError, setDeadlineError] = useState<DeadlineError | false>(false)

  function parseSlippageInput(value: string) {
    // populate what the user typed and clear the error
    setSlippageInput(value)
    setSlippageError(false)

    if (value.length === 0) {
      setUserSlippageTolerance('auto')
    } else {
      const parsed = Math.floor(Number.parseFloat(value) * 100)

      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5000) {
        setUserSlippageTolerance('auto')
        if (value !== '.') {
          setSlippageError(SlippageError.InvalidInput)
        }
      } else {
        setUserSlippageTolerance(new Percent(parsed, 10_000))
      }
    }
  }

  const tooLow = userSlippageTolerance !== 'auto' && userSlippageTolerance.lessThan(new Percent(5, 10_000))
  const tooHigh = userSlippageTolerance !== 'auto' && userSlippageTolerance.greaterThan(new Percent(1, 100))

  function parseCustomDeadline(value: string) {
    // populate what the user typed and clear the error
    setDeadlineInput(value)
    setDeadlineError(false)

    if (value.length === 0) {
      setDeadline(DEFAULT_DEADLINE_FROM_NOW)
    } else {
      try {
        const parsed: number = Math.floor(Number.parseFloat(value) * 60)
        if (!Number.isInteger(parsed) || parsed < 60 || parsed >= Number.MAX_SAFE_INTEGER) {
          setDeadlineError(DeadlineError.InvalidInput)
        } else {
          setDeadline(parsed)
        }
      } catch (error) {
        console.error(error)
        setDeadlineError(DeadlineError.InvalidInput)
      }
    }
  }

  return (
    <div className="flex flex-cols gap-2">
      <div className="grid gap-2">
        <div className="flex items-center">
          <Typography variant="xs" weight={700} className="text-high-emphesis">
            {i18n._(t`Slippage`)}
          </Typography>

          <QuestionHelper
            text={i18n._(
              t`Transactions revert if price changes unfavorably by more than this percentage.`
            )}
          />
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={classNames(
              !!slippageError
                ? 'border-red/60'
                : tooLow || tooHigh
                  ? 'border-yellow/60'
                  : userSlippageTolerance !== 'auto'
                    ? `border-${getChainColorCode(chainId)}`
                    : 'border-dark-800',
              'border-2 h-[36px] flex items-center px-2 rounded bg-dark-1000/40'
            )}
            tabIndex={-1}
          >
            <div className="flex items-center justify-between">
              {tooLow || tooHigh ? <ExclamationIcon className="text-yellow" width={24} /> : null}
              <input
                id="text-slippage"
                className={classNames(
                  slippageError ? 'text-red' : '',
                  'bg-transparent placeholder-low-emphesis min-w-0 w-full font-bold'
                )}
                placeholder={placeholderSlippage?.toFixed(2)}
                value={
                  slippageInput.length > 0
                    ? slippageInput
                    : userSlippageTolerance === 'auto'
                      ? ''
                      : userSlippageTolerance.toFixed(2)
                }
                onChange={(e) => parseSlippageInput(e.target.value)}
                onBlur={() => {
                  setSlippageInput('')
                  setSlippageError(false)
                }}
                color={slippageError ? 'red' : ''}
              />
              %
            </div>
            <div>
            </div>
          </div>
          <Button
            height="2rem"
            size="sm"
            color={userSlippageTolerance === 'auto' ? `${getChainColorCode(chainId)}` : 'gray'}
            variant="filled"
            onClick={() => parseSlippageInput('')}
          >
            {i18n._(t`Auto`)}
          </Button>
        </div>
        {/* <div> */}
        {/* </div> */}
        {slippageError || tooLow || tooHigh ? (
          <Typography
            className={classNames(
              slippageError === SlippageError.InvalidInput ? 'text-red' : 'text-yellow',
              'font-medium flex items-center space-x-2'
            )}
            variant="xs"
            weight={700}
          >
            <div>
              {slippageError === SlippageError.InvalidInput
                ? i18n._(t`Invalid Slippage`)
                : slippageError === SlippageError.RiskyLow
                  ? i18n._(t`Failure Risk`)
                  : i18n._(t`Frontrun Risk`)}
            </div>
          </Typography>
        ) : null}
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Typography variant="xs" weight={700} className="text-high-emphesis">
            {i18n._(t`Deadline`)}
          </Typography>

          <QuestionHelper text={i18n._(t`Transaction reverts if pending past deadline.`)} />
        </div>
        <div className="flex items-center gap-2">
          <input
            className={classNames(
              deadlineError ? 'text-red' : '',
              'font-bold bg-transparent placeholder-low-emphesis bg-dark-1000/40 border-2 border-dark-800 rounded px-3 py-2 max-w-[100px] focus:border-blue'
            )}
            placeholder={(DEFAULT_DEADLINE_FROM_NOW / 60).toString()}
            value={
              deadlineInput.length > 0
                ? deadlineInput
                : deadline === DEFAULT_DEADLINE_FROM_NOW
                  ? ''
                  : (deadline / 60).toString()
            }
            onChange={(e) => parseCustomDeadline(e.target.value)}
            onBlur={() => {
              setDeadlineInput('')
              setDeadlineError(false)
            }}
            color={deadlineError ? 'red' : ''}
          />
          <Typography variant="sm" weight={700} className="text-secondary">
            {i18n._(t`minutes`)}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default TransactionSettings