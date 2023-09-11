import React, { useEffect, useRef, useState } from 'react'
import { Text } from 'rebass'
import styled, { css } from 'styled-components'

import Tooltip from 'components/Tooltip'
import { DEFAULT_SLIPPAGES, MAX_DEGEN_SLIPPAGE_IN_BIPS, MAX_NORMAL_SLIPPAGE_IN_BIPS } from 'constants/index'
import useMixpanel, { MIXPANEL_TYPE } from 'hooks/useMixpanel'
// import { useDegenModeManager } from 'state/user/hooks'
import { formatSlippage } from 'utils/swap/slippage'

const parseSlippageInput = (str: string): number => Math.round(Number.parseFloat(str) * 100)
const getSlippageText = (rawSlippage: number) => {
  const isCustom = !DEFAULT_SLIPPAGES.includes(rawSlippage)
  if (!isCustom) {
    return ''
  }

  return formatSlippage(rawSlippage, false)
}

const EmojiContainer = styled.span`
  flex: 0 0 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
        display: none;
  `}
`

const slippageOptionCSS = css`
  height: 100%;
  padding: 0;
  border-radius: 20px;
  border: 1px solid transparent;

  background-color: ${({ theme }) => theme.tabBackground};
  color: ${({ theme }) => theme.subText};
  text-align: center;

  font-size: 12px;
  font-weight: 400;
  line-height: 16px;

  outline: none;
  cursor: pointer;

  :hover {
    border-color: ${({ theme }) => theme.bg4};
  }
  :focus {
    border-color: ${({ theme }) => theme.bg4};
  }

  &[data-active='true'] {
    background-color: ${({ theme }) => theme.tabActive};
    color: ${({ theme }) => theme.text};
    border-color: ${({ theme }) => theme.primary};

    font-weight: 500;
  }

  &[data-warning='true'] {
    border-color: ${({ theme }) => theme.warning};
  }
`

const CustomSlippageOption = styled.div`
  ${slippageOptionCSS};

  flex: 0 0 24%;

  display: inline-flex;
  align-items: center;
  padding: 0 4px;
  column-gap: 2px;
  flex: 1;

  transition: all 150ms linear;

  &[data-active='true'] {
    color: ${({ theme }) => theme.text};
    font-weight: 500;
  }

  &[data-warning='true'] {
    border-color: ${({ theme }) => theme.warning};

    ${EmojiContainer} {
      color: ${({ theme }) => theme.warning};
    }
  }
`

const CustomInput = styled.input`
  width: 100%;
  height: 100%;
  border: 0px;
  border-radius: inherit;

  color: inherit;
  background: transparent;
  outline: none;
  text-align: right;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  &::placeholder {
    font-size: 12px;
  }
  @media only screen and (max-width: 375px) {
    font-size: 10px;
  }
`

export type Props = {
  rawSlippage: number
  setRawSlippage: (value: number) => void
  isWarning: boolean
  defaultRawSlippage: number
}
const CustomSlippageInput: React.FC<Props> = ({ rawSlippage, setRawSlippage, isWarning, defaultRawSlippage }) => {
  const [tooltip, setTooltip] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { mixpanelHandler } = useMixpanel()
//   CROSSCHAIN TODO: add
//   const [isDegenMode] = useDegenModeManager()
  const isDegenMode = false

  // rawSlippage = 10
  // slippage shown to user: = 10 / 10_000 = 0.001 = 0.1%
  const [rawText, setRawText] = useState(getSlippageText(rawSlippage))

  const isCustomOptionActive = !DEFAULT_SLIPPAGES.includes(rawSlippage)

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTooltip('')
    const value = e.target.value

    if (value === '') {
      setRawText(value)
      setRawSlippage(defaultRawSlippage)
      return
    }

    const numberRegex = /^(\d+)\.?(\d{1,2})?$/
    if (!value.match(numberRegex)) {
      e.preventDefault()
      return
    }

    const parsedValue = parseSlippageInput(value)
    if (Number.isNaN(parsedValue)) {
      e.preventDefault()
      return
    }

    const maxSlippage = isDegenMode ? MAX_DEGEN_SLIPPAGE_IN_BIPS : MAX_NORMAL_SLIPPAGE_IN_BIPS
    if (parsedValue > maxSlippage) {
      setTooltip(`Max is ${formatSlippage(maxSlippage)}`)
      e.preventDefault()
      return
    }

    setRawText(value)
    setRawSlippage(parsedValue)
  }

  const handleCommitChange = () => {
    setTooltip('')
    setRawText(getSlippageText(rawSlippage))
    mixpanelHandler(MIXPANEL_TYPE.SLIPPAGE_CHANGED, { new_slippage: Number(formatSlippage(rawSlippage, false)) })
  }

  const handleKeyPressInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key
    if (key === '.' || ('0' <= key && key <= '9')) {
      return
    }

    if (key === 'Enter') {
      inputRef.current?.blur()
      return
    }

    e.preventDefault()
  }

  useEffect(() => {
    if (inputRef.current !== document.activeElement) {
      setRawText(getSlippageText(rawSlippage))
      setTooltip('')
    }
  }, [rawSlippage])

  return (
    <Tooltip text={tooltip} show={!!tooltip} placement="bottom" 
    // width="fit-content"
    >
      <CustomSlippageOption data-active={isCustomOptionActive} data-warning={isCustomOptionActive && isWarning}>
        {isCustomOptionActive && isWarning && (
          <EmojiContainer>
            <span role="img" aria-label="warning">
              ⚠️
            </span>
          </EmojiContainer>
        )}
        <CustomInput
          ref={inputRef}
          placeholder={`Custom`}
          value={rawText}
          onChange={handleChangeInput}
          onKeyPress={handleKeyPressInput}
          onBlur={handleCommitChange}
        />
        <Text
          as="span"
          sx={{
            flex: '0 0 12px',
          }}
        >
          %
        </Text>
      </CustomSlippageOption>
    </Tooltip>
  )
}

export default CustomSlippageInput