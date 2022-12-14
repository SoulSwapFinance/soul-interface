export const container = [
  // sprinkles(
    {
    overflow: 'auto',
    height: 'viewHeight',
    paddingTop: '4',
    // marginLeft: { sm: '8', md: '48' },
  },
  {
    width: '308px',
    paddingRight: '8px',
    paddingBottom: '96px',
    '@media': {
      [`(max-width: ${600 - 1}px)`]: {
        width: 'auto',
        height: 'auto',
        paddingBottom: '0px',
      },
    },
    selectors: {
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  },
]

export const rowHover = [
  {
    ':hover': {
      // background: themeVars.colors.backgroundInteractive,
      borderRadius: 12,
    },
  },
]

export const row = [
  // sprinkles(
    {
    display: 'flex',
    paddingRight: '16',
    cursor: 'pointer',
    fontSize: '16',
    lineHeight: '20',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '12',
    paddingTop: '10',
    paddingBottom: '10',
  },
]

export const subRowHover = {
  ':hover': {
    // background: themeVars.colors.backgroundInteractive,
  },
}

export const borderTop = 
// sprinkles(
  {
  borderTopStyle: 'solid',
  borderTopColor: 'backgroundOutline',
  borderTopWidth: '1px',
}

export const borderBottom =
// sprinkles(
  {
  borderBottomStyle: 'solid',
  borderBottomColor: 'backgroundOutline',
  borderBottomWidth: '1px',
}

export const detailsOpen = 
// 
  [
  borderTop,
  
  // sprinkles(
    {
    overflow: 'hidden',
    marginTop: '2',
    marginBottom: '2',
  },
]

export const MAX_FILTER_DROPDOWN_HEIGHT = 302

export const filterDropDowns = 
// 
  [
  borderBottom,
  
  // sprinkles(
    {
    paddingLeft: '0',
    paddingBottom: '8',
  },
  {
    maxHeight: `${MAX_FILTER_DROPDOWN_HEIGHT}px`,
    '::-webkit-scrollbar': { display: 'none' },
    scrollbarWidth: 'none',
  },
]

export const chevronIcon = {
  marginLeft: -1,
}

export const chevronContainer = 
// 
  [
  
  // sprinkles(
    {
    color: 'textSecondary',
    display: 'inline-block',
    height: '28',
    width: '28',
    transition: '250',
  },
  {
    marginRight: -1,
  },
]
