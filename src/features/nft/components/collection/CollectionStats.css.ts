import { headlineSmall, subheadSmall } from 'features/nft/css/common.css'
import { loadingAsset, loadingBlock } from 'features/nft/css/loading.css'

import { vars } from '../../css/sprinkles.css'

export const statsText = [
    {
    // marginTop: { sm: '8', md: '40' },
    // marginBottom: { sm: '0', md: '28' },
  },
  {
    '@media': {
      [`(max-width: ${600 - 1}px)`]: {
        marginLeft: '68px',
      },
    },
  },
]

export const baseCollectionImage =
  {
  left: '0',
  borderStyle: 'solid',
  borderWidth: '4px',
  borderColor: 'backgroundSurface',
  borderRadius: 'round',
  position: 'absolute',
}

export const collectionImage = 
// style(
  [
  baseCollectionImage,
  {
    width: '143px',
    height: '143px',
    verticalAlign: 'top',
    top: '-118px',
    boxShadow: vars.color.cardDropShadow,
    '@media': {
      [`(max-width: ${600 - 1}px)`]: {
        width: '60px',
        height: '60px',
        borderWidth: '2px',
        top: '-20px',
      },
    },
  },
]

export const statsLabel = [
  subheadSmall,

    {
    color: 'textSecondary',
    whiteSpace: 'nowrap',
  },
  {
    lineHeight: '20px',
  },
]

export const statsValue = [
  headlineSmall,
  {
    lineHeight: '24px',
    whiteSpace: 'nowrap',
  },
]

export const statsValueLoading = [
  loadingAsset,
    {
    width: '60',
    height: '20',
    marginTop: '8',
  },
]

export const statsLabelLoading = [
  loadingAsset,
    {
    width: '60',
    height: '16',
  },
]

export const descriptionLoading = [
  loadingAsset,
    {
    height: '20',
  },
  {
    maxWidth: 'min(calc(100% - 112px), 600px)',
  },
]

export const collectionImageIsLoadingBackground =
  [
  collectionImage,
    {
    backgroundColor: 'backgroundSurface',
  },
]

export const collectionImageIsLoading = 
  [
  loadingBlock,
  collectionImage,
    {
    borderStyle: 'solid',
    borderWidth: '4px',
    borderColor: 'backgroundSurface',
  },
]

export const nameTextLoading = 
  [
  loadingAsset,
    {
    height: '32',
  },
  {
    width: 236,
  },
  ]