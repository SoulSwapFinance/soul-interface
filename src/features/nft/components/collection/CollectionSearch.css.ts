import { style } from '@vanilla-extract/css'
import { loadingAsset } from 'features/nft/css/loading.css'
import { sprinkles } from 'features/nft/css/sprinkles.css'

export const filterButtonLoading = style([
  loadingAsset,
  sprinkles({
    border: 'none',
  }),
])