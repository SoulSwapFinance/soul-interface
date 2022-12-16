import { style } from '@vanilla-extract/css'

import { sprinkles, vars } from './sprinkles.css'

export const center = 
// 
  {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

// TYPOGRAPHY
export const headlineLarge = { fontWeight: 'semibold', fontSize: '36', lineHeight: '44' }
export const headlineMedium = { fontWeight: 'semibold', fontSize: '28', lineHeight: '36' }
export const headlineSmall = { fontWeight: 'semibold', fontSize: '20', lineHeight: '28' }

export const subhead = { fontWeight: 'medium', fontSize: '16', lineHeight: '24' }
export const subheadSmall = { fontWeight: 'medium', fontSize: '14', lineHeight: '14' }

export const body = { fontWeight: 'normal', fontSize: '16', lineHeight: '24' }
export const bodySmall = { fontWeight: 'normal', fontSize: '14', lineHeight: '20' }
export const caption = { fontWeight: 'normal', fontSize: '12', lineHeight: '16' }
export const badge = { fontWeight: 'semibold', fontSize: '10', lineHeight: '12' }

export const buttonTextMedium = { fontWeight: 'semibold', fontSize: '16', lineHeight: '20' }
export const buttonTextSmall = { fontWeight: 'semibold', fontSize: '14', lineHeight: '16' }

export const commonButtonStyles = 
  [
  {
    borderRadius: '12',
    transition: '250',
  },
  {
    border: 'none',
    ':hover': {
      cursor: 'pointer',
    },
    ':disabled': {
      cursor: 'auto',
    },
  },
]

export const buttonMedium = [
  buttonTextMedium,
  commonButtonStyles,
  {
    backgroundColor: 'accentAction',
    color: 'explicitWhite',
  },
  {
    padding: '14px 18px',
    ':disabled': {
      opacity: '0.3',
    },
  },
]

const magicalGradient = {
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      inset: '-1px',
      background: 'linear-gradient(91.46deg, #4673FA 0%, #9646FA 100.13%) border-box',
      borderColor: 'transparent',
      WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);',
      WebkitMaskComposite: 'xor;',
      maskComposite: 'exclude',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: 'inherit',
      pointerEvents: 'none',
    },
  },
}

export const magicalGradientOnHover = [
  magicalGradient,
  {
    selectors: {
      '&::before': {
        opacity: '0',
        WebkitTransition: 'opacity 0.25s ease',
        MozTransition: 'opacity 0.25s ease',
        msTransition: 'opacity 0.25s ease',
        transition: 'opacity 0.25s ease-out',
      },
      '&:hover::before': {
        opacity: '1',
      },
    },
  },
]

export const lightGrayOverlayOnHover = [
  {
    transition: '250',
  },
  {
    ':hover': {
      background: vars.color.lightGrayOverlay,
    },
  },
]