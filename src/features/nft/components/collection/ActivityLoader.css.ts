import { loadingBlock } from 'features/nft/css/loading.css'
import { sprinkles } from 'features/nft/css/sprinkles.css'

export const loadingSquare = [
  loadingBlock,
  // sprinkles(
    {
    width: '60',
    height: '60',
    borderRadius: '8',
  },
]

export const loadingSliver = [
  loadingBlock,
  // sprinkles(
    {
    height: '16',
    borderRadius: 'round',
  },
  {
    width: '108px',
  },
]