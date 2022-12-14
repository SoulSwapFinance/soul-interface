import { buttonTextMedium } from 'features/nft/css/common.css'
import { loadingAsset } from 'features/nft/css/loading.css'
import { sprinkles, vars } from 'features/nft/css/sprinkles.css'

export const baseActivitySwitcherToggle = [
  buttonTextMedium,
  // sprinkles(
    {
    position: 'relative',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '8',
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

export const selectedActivitySwitcherToggle = [
  baseActivitySwitcherToggle,
  // sprinkles(
    {
    color: 'textPrimary',
  },
  {
    ':after': {
      content: '',
      position: 'absolute',
      background: vars.color.textPrimary,
      width: '100%',
      height: '2px',
      left: '0px',
      right: '0px',
      bottom: '-9px',
    },
  },
]

export const styledLoading = [
  loadingAsset,
  {
    width: 58,
    height: 20,
  },
]