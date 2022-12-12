import { style } from '@vanilla-extract/css'
import { buttonTextSmall } from 'features/nft/css/common.css'
import { sprinkles } from 'features/nft/css/sprinkles.css'

export const bagContainer = style([
  sprinkles({
    position: 'fixed',
    bottom: '72',
    left: '16',
    right: '16',
    background: 'backgroundModule',
    padding: '8',
    zIndex: 'dropdown',
    borderRadius: '8',
    justifyContent: 'space-between',
  }),
])

export const viewBagButton = style([
  buttonTextSmall,
  sprinkles({
    color: 'explicitWhite',
    backgroundColor: 'accentAction',
    paddingY: '8',
    paddingX: '18',
    borderRadius: '12',
    cursor: 'pointer',
  }),
])