import { buttonTextMedium } from 'features/nft/css/common.css'
import { loadingBlock } from 'features/nft/css/loading.css'
import { css } from 'styled-components/macro'
import { MOBILE_MEDIA_BREAKPOINT, SMALL_MEDIA_BREAKPOINT, XLARGE_MEDIA_BREAKPOINT } from 'theme/components'

export const bannerImage = { objectFit: 'cover' }

export const baseActivitySwitcherToggle = [
  buttonTextMedium,
  // sprinkles(
    {
    position: 'relative',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  {
    lineHeight: '24px',
  },
]

export const activitySwitcherToggle = [
  baseActivitySwitcherToggle,
  // sprinkles(
    {
    color: 'textSecondary',
  },
]

export const loadingBanner = [
  loadingBlock,
  // sprinkles(
    {
    width: 'full',
    height: '100',
  },
]

export const noCollectionAssets = 
// sprinkles(
  {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '40',
}

export const ScreenBreakpointsPaddings = css`
  @media screen and (min-width: ${XLARGE_MEDIA_BREAKPOINT}) {
    padding-left: 48px;
    padding-right: 48px;
  }

  @media screen and (max-width: ${XLARGE_MEDIA_BREAKPOINT}) {
    padding-left: 26px;
    padding-right: 26px;
  }

  @media screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    padding-left: 20px;
    padding-right: 20px;
  }

  @media screen and (max-width: ${MOBILE_MEDIA_BREAKPOINT}) {
    padding-left: 16px;
    padding-right: 16px;
  }
`