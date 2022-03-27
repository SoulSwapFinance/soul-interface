import { classNames } from 'functions'
import React, { FC, forwardRef } from 'react'

export type TypographyWeight = 300 | 400 | 500 | 600 | 700

const WEIGHTS = {
  300: 'font-light',
  400: 'font-medium',
  500: 'font-medium',
  600: 'font-semibold',
  700: 'font-bold',
}

export type TypographyVariant = 'hero' | 'h1' | 'h2' | 'h3' | 'lg' | 'base' | 'sm' | 'xs' | 'xxs'

const VARIANTS = {
  hero: 'text-hero leading-[4rem]',
  h1: 'text-4xl leading-[28px]',
  h2: 'text-3xl tracking-[-0.02em]',
  h3: 'text-2xl leading-7 tracking-[-0.01em]',
  lg: 'text-lg leading-6',
  base: 'text-base leading-5',
  sm: 'text-sm leading-5',
  xs: 'text-xs leading-4',
  xxs: 'text-[0.625rem] leading-[1.2]',
}

export type TypographyLineHeight = 14 | 16 | 20 | 24 | 28 | 32 | 36 | 48

const LINE_HEIGHTS = {
  14: 'leading-14',
  16: 'leading-4',
  20: 'leading-5',
  24: 'leading-6',
  28: 'leading-7',
  32: 'leading-8',
  36: 'leading-9',
  48: 'leading-48',
}

export type TypographyFontFamily = 'regular' | 'medium' | 'semi-bold' | 'bold'

const FONT_FAMILIES = {
  regular: '',
  medium: 'medium',
  'semi-bold': 'semi-bold',
  bold: 'bold',
}
export interface TypographyProps extends React.AllHTMLAttributes<React.ReactHTML> {
  variant?: TypographyVariant
  fontFamily?: TypographyFontFamily
  weight?: TypographyWeight
  lineHeight?: TypographyLineHeight
  component?: keyof React.ReactHTML
  textColor?: string
  className?: string
  clickable?: boolean
}

const Typography: FC<TypographyProps> = forwardRef(
  (
    {
      variant = 'base',
      weight = 400,
      lineHeight = 20,
      fontFamily='regular',
      component = 'div',
      className = 'currentColor',
      textColor = '',
      clickable = false,
      children = [],
      onClick = undefined,
      ...rest
    },
    ref
  ) => {
    return React.createElement(
      component,
      {
        className: classNames(
          VARIANTS[variant],
          FONT_FAMILIES[fontFamily],
          WEIGHTS[weight],
          LINE_HEIGHTS[lineHeight],
          textColor,
          onClick ? 'cursor-pointer select-none' : '',
          className
        ),
        onClick,
        ...rest,
        ref,
      },
      children
    )
  }
)

export default Typography
