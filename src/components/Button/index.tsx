import React from 'react'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { darken, lighten } from 'polished'

import { classNames } from '../../functions'
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'

const SIZE = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-4 py-2 text-base',
  default: 'px-4 py-3 text-base',
  lg: 'px-6 py-4 text-base',
  none: 'p-0 text-base',
}

const FLEXED = {
  default: 'bg-transparent opacity-80 hover:opacity-100',
  red: 'bg-red bg-opacity-80 flex rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  blue: 'bg-blue bg-opacity-80 flex rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  ftmBlue: 'bg-ftmBlue bg-opacity-80 flex rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  ethBlue: 'bg-ethBlue bg-opacity-80 flex rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  avaxRed: 'bg-avaxRed bg-opacity-80 flex rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  binanceGold: 'bg-binanceGold bg-opacity-80 flex rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  moonriverTeal: 'bg-moonriverTeal bg-opacity-80 flex rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  maticPurple: 'bg-maticPurple bg-opacity-80 flex rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  pink: 'bg-gradient-to-r from-pink to-opaque-pink flex rounded text-high-emphesis opacity-80 hover:opacity-100 disabled:bg-opacity-80',
  purple: 'bg-gradient-to-r from-purple to-opaque-purple flex rounded text-high-emphesis opacity-80 hover:opacity-100 disabled:bg-opacity-80',
  deepPurple: 'bg-gradient-to-r from-deepPurple to-opaque-purple flex rounded text-high-emphesis opacity-80 hover:opacity-100 disabled:bg-opacity-80',
  yellow: 'bg-gradient-to-r from-yellow to-opaque-yellow flex rounded text-high-emphesis opacity-80 hover:opacity-100 disabled:bg-opacity-80',
  gray: 'border rounded shadow-sm focus:ring-2 focus:ring-offset-2 bg-dark-700 bg-opacity-80 flex text-primary border-dark-800 hover:bg-opacity-100 focus:ring-offset-dark-700 focus:ring-dark-800 disabled:bg-opacity-80',
  greydient: 'bg-gradient-to-r from-purple to-opaque-blue to-purple flex text-center rounded text-high-emphesis opacity-80 hover:opacity-100 disabled:bg-opacity-80',
  green: 'bg-green bg-opacity-80 flex rounded text-high-emphesis hover:bg-opacity-160 disabled:bg-opacity-80',
  'light-green': 'bg-yellow bg-opacity-80 flex rounded text-dark-900 hover:bg-opacity-100 disabled:bg-opacity-80',
  gradient:
    'flex text-high-emphesis transition duration-1000 ease-in-out text-high-emphesis bg-gradient-to-r from-light-purple via-dark-purple to-purple opacity-80 hover:opacity-100 disabled:bg-opacity-80',
}

const FILLED = {
  default: 'bg-transparent opacity-80 hover:opacity-100',
  red: 'bg-red bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  blue: 'bg-blue bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  ftmBlue: 'bg-ftmBlue bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  ethBlue: 'bg-ethBlue bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  avaxRed: 'bg-avaxRed bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  binanceGold: 'bg-binanceGold bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  moonriverTeal: 'bg-moonriverTeal bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  maticPurple: 'bg-maticPurple bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  pink: 'bg-pink bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  purple: 'bg-purple bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  deepPurple: 'bg-deepPurple bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  yellow: 'bg-yellow bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  gold: 'bg-gold bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  gray: 'border rounded shadow-sm focus:ring-2 focus:ring-offset-2 bg-dark-700 bg-opacity-80 w-full text-primary border-dark-800 hover:bg-opacity-100 focus:ring-offset-dark-700 focus:ring-dark-800 disabled:bg-opacity-80',
  green: 'bg-green bg-opacity-80 w-full rounded text-high-emphesis hover:bg-opacity-100 disabled:bg-opacity-80',
  gradient:
    'w-full text-high-emphesis bg-gradient-to-r from-blue to-purple opacity-80 hover:opacity-100 disabled:bg-opacity-80',
  gradientBluePurple:
    'w-full text-high-emphesis bg-gradient-to-r from-blue to-purple opacity-80 hover:opacity-100 disabled:bg-opacity-80',
    gradientPurpleBlue:
    'w-full text-high-emphesis bg-gradient-to-r from-purple to-blue opacity-80 hover:opacity-100 disabled:bg-opacity-80',
    black: 'bg-transparent opacity-95 hover:opacity-100',
}

const OUTLINED = {
  default: 'bg-transparent opacity-80 hover:opacity-100',
  red: 'bg-red bg-opacity-20 outline-red rounded text-red hover:bg-opacity-40 disabled:bg-opacity-20',
  blue: 'bg-blue bg-opacity-20 outline-blue rounded text-blue hover:bg-opacity-40 disabled:bg-opacity-20',
  ftmBlue: 'bg-ftmBlue bg-opacity-20 outline-ftmBlue rounded text-ftmBlue hover:bg-opacity-40 disabled:bg-opacity-20',
  ethBlue: 'bg-ethBlue bg-opacity-20 outline-ethBlue rounded text-ethBlue hover:bg-opacity-40 disabled:bg-opacity-20',
  avaxRed: 'bg-avaxRed bg-opacity-20 outline-avaxRed rounded text-avaxRed hover:bg-opacity-40 disabled:bg-opacity-20',
  binanceGold: 'bg-binanceGold bg-opacity-20 outline-binanceGold rounded text-binanceGold hover:bg-opacity-40 disabled:bg-opacity-20',
  moonriverTeal: 'bg-moonriverTeal bg-opacity-20 outline-moonriverTeal rounded text-moonriverTeal hover:bg-opacity-40 disabled:bg-opacity-20',
  maticPurple: 'bg-maticPurple bg-opacity-20 outline-maticPurple rounded text-maticPurple hover:bg-opacity-40 disabled:bg-opacity-20',
  pink: 'bg-pink bg-opacity-20 outline-pink rounded text-pink hover:bg-opacity-40 disabled:bg-opacity-20',
  purple: 'bg-purple bg-opacity-20 outline-purple rounded text-purple hover:bg-opacity-40 disabled:bg-opacity-20',
  deepPurple: 'bg-deepPurple bg-opacity-20 outline-purple rounded text-purple hover:bg-opacity-40 disabled:bg-opacity-20',
  yellow: 'bg-yellow bg-opacity-20 outline-purple rounded text-yellow hover:bg-opacity-40 disabled:bg-opacity-20',
  gray: 'bg-dark-700 bg-opacity-20 outline-gray rounded text-gray hover:bg-opacity-40 disabled:bg-opacity-20',
  green: 'bg-green bg-opacity-20 border border-green rounded text-green hover:bg-opacity-40 disabled:bg-opacity-20',
  gradient:
    'border border-transparent border-gradient-r-blue-purple-dark-900 opacity-80 hover:opacity-100 disabled:bg-opacity-20',
}

const BORDERED = {
  default: 'border w-full border-transparent hover:border-purple bg-purple bg-opacity-40 outline-purple rounded text-purple hover:bg-opacity-40 disabled:bg-opacity-20',
  black: 'border w-full border-transparent hover:border-black bg-dark-1000 rounded text-white font-bold font-lg hover:bg-opacity-80 disabled:bg-opacity-60',
  blue: 'border w-full border-transparent hover:border-blue bg-blue bg-opacity-40 outline-blue rounded text-blue hover:bg-opacity-40 disabled:bg-opacity-20',
  ftmBlue: 'border w-full border-transparent hover:border-ftmBlue bg-ftmBlue bg-opacity-40 outline-ftmBlue rounded text-ftmBlue hover:bg-opacity-40 disabled:bg-opacity-20',
  ethBlue: 'border w-full border-transparent hover:border-ethBlue bg-ethBlue bg-opacity-40 outline-ethBlue rounded text-ethBlue hover:bg-opacity-40 disabled:bg-opacity-20',
  avaxRed: 'border w-full border-transparent hover:border-avaxRed bg-avaxRed bg-opacity-40 outline-avaxRed rounded text-avaxRed hover:bg-opacity-40 disabled:bg-opacity-20',
  binanceGold: 'border w-full border-transparent hover:border-binanceGold bg-avaxRed bg-opacity-40 outline-binanceGold rounded text-binanceGold hover:bg-opacity-40 disabled:bg-opacity-20',
  moonriverTeal: 'border w-full border-transparent hover:border-moonriverTeal bg-moonriverTeal bg-opacity-40 outline-moonriverTeal rounded text-moonriverTeal hover:bg-opacity-40 disabled:bg-opacity-20',
  maticPurple: 'border w-full border-transparent hover:border-maticPurple bg-maticPurple bg-opacity-40 outline-maticPurple rounded text-maticPurple hover:bg-opacity-40 disabled:bg-opacity-20',
  deepPurple: 'border w-full border-transparent hover:border-deepPurple bg-deepPurple bg-opacity-40 outline-deepPurple rounded text-deepPurple hover:bg-opacity-40 disabled:bg-opacity-20',
  purple: 'border w-full border-transparent hover:border-purple bg-purple bg-opacity-40 outline-purple rounded text-purple hover:bg-opacity-40 disabled:bg-opacity-20',
  yellow: 'border w-full border-transparent hover:border-yellow bg-yellow bg-opacity-40 outline-yellow rounded text-yellow hover:bg-opacity-40 disabled:bg-opacity-20',
}

const EMPTY = {
  default:
    'flex bg-transparent justify-center items-center disabled:opacity-50 disabled:cursor-auto bg-opacity-80 hover:bg-opacity-100',
}

const LINK = {
  default: 'text-primary hover:text-high-emphesis focus:text-high-emphesis whitespace-nowrap focus:ring-0',
  blue: 'text-blue text-opacity-80 hover:text-opacity-100 focus:text-opacity-100 whitespace-nowrap focus:ring-0',
  ethBlue: 'text-ethBlue text-opacity-80 hover:text-opacity-100 focus:text-opacity-100 whitespace-nowrap focus:ring-0',
  ftmBlue: 'text-ftmBlue text-opacity-80 hover:text-opacity-100 focus:text-opacity-100 whitespace-nowrap focus:ring-0',
  avaxRed: 'text-avaxRed text-opacity-80 hover:text-opacity-100 focus:text-opacity-100 whitespace-nowrap focus:ring-0',
  binanceGold: 'text-binanceGold text-opacity-80 hover:text-opacity-100 focus:text-opacity-100 whitespace-nowrap focus:ring-0',
  maticPurple: 'text-maticPurple text-opacity-80 hover:text-opacity-100 focus:text-opacity-100 whitespace-nowrap focus:ring-0',
}

const VARIANT = {
  outlined: OUTLINED,
  bordered: BORDERED,
  filled: FILLED,
  empty: EMPTY,
  link: LINK,
  flexed: FLEXED,
}

export type ButtonColor = 'blue' | 'ftmBlue' | 'avaxRed' | 'ethBlue' | 'binanceGold' | 'moonriverTeal' | 'maticPurple' | 'pink' | 'purple' | 'gradient' | 'gray' | 'default' | 'red' | 'green' | 'yellow'

export type ButtonSize = 'xs' | 'sm' | 'lg' | 'default' | 'none' | 'nobase'

export type ButtonVariant = 'outlined' | 'bordered' | 'filled' | 'empty' | 'link' | 'flexed'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor
  size?: ButtonSize
  variant?: ButtonVariant
  ref?: React.Ref<HTMLButtonElement>
}

const Base = styled(RebassButton)<{
  padding?: string
  width?: string
  height?: string
  maxWidth?: string
  borderRadius?: string
  altDisabledStyle?: boolean
}>`
  padding: ${({ padding }) => (padding ? padding : '1rem')};
  width: ${({ width }) => (width ? width : '100%')};
  height: ${({ height }) => (height ? height : '54px')};
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : '320px')};
  font-weight: 500;
  text-align: center;
  border-radius: 12px;
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: auto;
  }
  > * {
    user-select: none;
  }
`

export const ButtonPrimary = styled(Base)`
  background: ${({ theme }) => theme.primary1};
  color: white;
  &:focus {
    opacity: 0.91;
  }
  &:hover {
    opacity: 0.92;
  }
  &:active {
    opacity: 0.93;
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? theme.primary1 : theme.bg3)};
    color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? 'white' : theme.text3)};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.5' : '0.5')};
  }
`

export const ButtonLight = styled(Base)`
  background-color: ${({ theme }) => theme.primary5};
  color: ${({ theme }) => theme.primaryText1};
  font-size: 16px;
  font-weight: 500;
  &:focus {
    opacity: 0.91;
  }
  &:hover {
    opacity: 0.92;
  }
  &:active {
    opacity: 0.93;
  }
  :disabled {
    opacity: 0.4;
    :hover {
      cursor: auto;
      background-color: ${({ theme }) => theme.primary5};
      box-shadow: none;
      border: 1px solid transparent;
      outline: none;
    }
  }
`

export function Button({
  children,
  className = undefined,
  color = 'default',
  size = 'default',
  variant = 'filled',
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <button
      className={classNames(
        VARIANT[variant][color],
        variant !== 'empty' && SIZE[size],
        'rounded disabled:cursor-not-allowed focus:outline-none',
        // 'rounded focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed font-medium',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export function ButtonConfirmed({
  confirmed,
  disabled,
  ...rest
}: { confirmed?: boolean; disabled?: boolean } & ButtonProps) {
  if (confirmed) {
    return (
      <Button
        variant="outlined"
        color="green"
        size="lg"
        className={classNames(disabled && 'cursor-not-allowed', 'border opacity-50')}
        disabled={disabled}
        {...rest}
      />
    )
  } else {
    return <Button color={disabled ? 'gray' : 'purple'} size="lg" disabled={disabled} {...rest} />
  }
}

export function ButtonError({
  error,
  disabled,
  size = 'default',
  ...rest
}: {
  error?: boolean
  disabled?: boolean
} & ButtonProps) {
  if (error) {
    return <Button disabled={disabled} color="red" {...rest} />
  } else {
    return <Button color={disabled ? 'gray' : 'purple'} disabled={disabled} {...rest} />
  }
}
