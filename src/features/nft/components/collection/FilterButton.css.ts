import { loadingAsset } from 'features/nft/css/loading.css'
import { sprinkles, themeVars, vars } from 'features/nft/css/sprinkles.css'

export const filterButton = 
// sprinkles(
  {
  backgroundColor: 'textTertiary',
  color: 'textPrimary',
}

export const filterButtonExpanded = {
  background: vars.color.backgroundInteractive,
  // color: themeVars.colors.textPrimary,
}

export const filterButtonLoading = [
  loadingAsset,
  // sprinkles(
    {
    height: '44',
    width: '100',
  },
]