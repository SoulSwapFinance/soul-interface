import '@zag-js/focus-visible'

// import { style } from '@vanilla-extract/css'

const hideFocusRingsDataAttribute = '[data-js-focus-visible] &:focus:not([data-focus-visible-added]'

export const base = {
  boxSizing: 'border-box',
  selectors: {
    [`${hideFocusRingsDataAttribute}`]: {
      outline: 'none',
    },
  },
  verticalAlign: 'baseline',
  WebkitTapHighlightColor: 'transparent',
}

const list = {
  listStyle: 'none',
}

const quote = {
  quotes: 'none',
  selectors: {
    '&:before, &:after': {
      content: "''",
    },
  },
}

const table = {
  borderCollapse: 'collapse',
  borderSpacing: 0,
}

const appearance = {
  appearance: 'none',
}

const field = [
  appearance,
  {
    '::placeholder': {
      opacity: 1,
    },
    outline: 'none',
  },
]

const mark = {
  backgroundColor: 'transparent',
  color: 'inherit',
}

const select = [
  field,
  {
    ':disabled': {
      opacity: 1,
    },
    selectors: {
      '&::-ms-expand': {
        display: 'none',
      },
    },
  },
]

const input = [
  field,
  {
    selectors: {
      '&::-ms-clear': {
        display: 'none',
      },
      '&::-webkit-search-cancel-button': {
        WebkitAppearance: 'none',
      },
      '&::-webkit-inner-spin-button, &::-webkit-inner-spin-button ': {
        WebkitAppearance: 'none',
      },
    },
    WebkitAppearance: 'none',
    MozAppearance: 'textfield',
    ':focus': {
      outline: 'none',
    },
  },
]

const a = {
  textDecoration: 'none',
}

export const element = {
  a,
  blockquote: quote,
  input,
  mark,
  ol: list,
  q: quote,
  select,
  table,
  textarea: field,
  ul: list,
}