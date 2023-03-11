import { classNames } from 'functions'
import React from 'react'

export const TestInput = React.memo(
  ({
    value,
    onUserInput,
    placeholder,
    className = 'flex w-full h-full p-3 font-bold rounded overflow-ellipsis recipient-address-input bg-dark-900 placeholder-low-emphesis',
    align,
    fontSize = '12px',
    ...rest
  }: {
    value: string
    onUserInput: (input: string) => void
    error?: boolean
    fontSize?: string
    align?: 'right' | 'left'
  } & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) => {
    return (
      <>
        <input
          value={value}
          onChange={(event) => {
            onUserInput(event.target.value.replace(/\s+/g, ''))
          }}
          // universal input options
          inputMode="text"
          title="Input Text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          placeholder="Enter Text"
          pattern="^(0x[a-fA-F0-9]{40})$"
          type="text"
          className={classNames(
            align === 'right' && 'text-right',
            'font-medium bg-transparent whitespace-nowrap overflow-ellipsis flex-auto',
            className
          )}
          style={{ fontSize }}
          {...rest}
        />
      </>
    )
  }
)

TestInput.displayName = 'TestInput'

export default TestInput

// const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group