// import ms from 'ms.macro'
import { SortDropdown } from 'features/nft/components/common/SortDropdown'
import { Column, Row } from 'features/nft/components/Flex'
import { NumericInput } from 'features/nft/components/layout/Input'
import { bodySmall, buttonTextMedium, caption } from 'features/nft/css/common.css'
import { useSellAsset } from 'features/nft/hooks'
import { DropDownOption } from 'features/nft/types'
import { pluralize } from 'features/nft/utils/roundAndPluralize'
import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle } from 'react-feather'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme/components/text'

let SIXTY_SECONDS = 60 * 100 // ms`60 seconds`
let ONE_HUNDRED_EIGHTY_DAYS = 180 * 86_400 * 100 // ms`180 days`
let ONE_HOUR = 60 * 60 * 100 // ms`1 hour`
const ModalWrapper = styled(Column)`
  gap: 4px;
  position: relative;
`

const InputWrapper = styled(Row)<{ isInvalid: boolean }>`
  padding: 12px 8px 12px 12px;
  border: 1px solid;
  position: relative;
  height: 44px;
  border-radius: 8px;
  border-color: ${({ isInvalid, theme }) => (isInvalid ? theme.accentCritical : theme.backgroundOutline)};
`

const DropdownWrapper = styled(ThemedText.BodyPrimary)`
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  height: min-content;
  width: 80px;
  &:hover {
    background-color: ${({ theme }) => theme.backgroundInteractive};
  }
  border-radius: 12px;
  padding: 8px;
`

const ErrorMessage = styled(Row)`
  color: ${({ theme }) => theme.accentCritical};
  gap: 4px;
  position: absolute;
  top: 44px;
`

const WarningIcon = styled(AlertTriangle)`
  width: 16px;
  color: ${({ theme }) => theme.accentCritical};
`

enum Duration {
  hour = 'hour',
  day = 'day',
  week = 'week',
  month = 'month',
}

enum ErrorState {
  valid,
  empty,
  overMax,
}

export const SetDurationModal = () => {
  const [duration, setDuration] = useState(Duration.day)
  const [displayDuration, setDisplayDuration] = useState(Duration.day)
  const [amount, setAmount] = useState(7)
  const [errorState, setErrorState] = useState(ErrorState.valid)
  const setGlobalExpiration = useSellAsset((state) => state.setGlobalExpiration)
  const setCustomExpiration = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(!!event.target.value.length ? parseFloat(event.target.value) : 0)
    setDuration(displayDuration)
  }
  const selectDuration = (duration: Duration) => {
    setDuration(duration)
    setDisplayDuration(duration)
  }
  const durationOptions: DropDownOption[] = useMemo(
    () => [
      {
        displayText: 'Hours',
        onClick: () => selectDuration(Duration.hour),
      },
      {
        displayText: 'Days',
        onClick: () => selectDuration(Duration.day),
      },
      {
        displayText: 'Weeks',
        onClick: () => selectDuration(Duration.week),
      },
      {
        displayText: 'Months',
        onClick: () => selectDuration(Duration.month),
      },
    ],
    []
  )
  useEffect(() => {
    const expiration = convertDurationToExpiration(amount, duration)
    if (expiration * 1000 - Date.now() < SIXTY_SECONDS) setErrorState(ErrorState.empty)
    else if (expiration * 1000 - Date.now() > ONE_HUNDRED_EIGHTY_DAYS) setErrorState(ErrorState.overMax)
    else setErrorState(ErrorState.valid)
    setGlobalExpiration(expiration)
  }, [amount, duration, setGlobalExpiration])

  return (
    <ModalWrapper>
      <InputWrapper isInvalid={errorState !== ErrorState.valid}>
        <NumericInput
          // borderStyle="none"
          // width="32"
          // marginRight="4"
          // backgroundColor="none"
          // flexShrink="0"
          // color={{ placeholder: 'textSecondary', default: 'textPrimary' }}
          as="input"
          type="number"
          pattern="[0-9]"
          className={bodySmall}
          value={amount}
          onChange={setCustomExpiration}
        />
        <DropdownWrapper className={buttonTextMedium}>
          <SortDropdown
            dropDownOptions={durationOptions}
            mini
            miniPrompt={displayDuration + (displayDuration === duration ? pluralize(amount) : 's')}
            left={38}
            top={38}
          />
        </DropdownWrapper>
      </InputWrapper>
      {errorState !== ErrorState.valid && (
        <ErrorMessage className={caption}>
          {' '}
          <WarningIcon /> {errorState === ErrorState.overMax ? 'Maximum 6 months' : 'Set duration'}
        </ErrorMessage>
      )}
    </ModalWrapper>
  )
}

const convertDurationToExpiration = (amount: number, duration: Duration) => {
  const durationFactor = () => {
    switch (duration) {
      case Duration.hour:
        return 1
      case Duration.day:
        return 24
      case Duration.week:
        return 24 * 7
      default: // month
        return 24 * 30
    }
  }
  return Math.round((Date.now() + ONE_HOUR * durationFactor() * amount) / 1000)
}