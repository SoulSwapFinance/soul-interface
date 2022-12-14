import { subheadSmall } from 'features/nft/css/common.css'

import { sprinkles, themeVars, vars } from '../../../css/sprinkles.css'

export const section = 
  // sprinkles(
  [{
    // paddingLeft: { sm: '16', lg: '0' },
    // paddingRight: { sm: '16', lg: '0' },
  },
  { maxWidth: '1000px', margin: '0 auto' },
]

export const ethIcon = {
  marginBottom: '-3px',
}

export const subRowHover = [
  subheadSmall,
  {
    ':hover': {
      // background: themeVars.colors.backgroundInteractive,
    },
  },
]

export const verifiedBadge = {
  height: '12px',
  width: '12px',
  marginLeft: '2px',
  marginBottom: '-2px',
  boxSizing: 'border-box',
}

/* From [contractAddress] */
export const dropDown = {
  width: '190px',
}

export const activeDropDown = {
  boxShadow: vars.color.dropShadow,
}

export const activeDropDownItems = {
  boxShadow: '0 14px 16px 0 rgba(70, 115, 250, 0.4)',
}

export const collectionFilterBubbleText = {
  whiteSpace: 'nowrap',
  maxWidth: '100px',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
}