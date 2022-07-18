import { useMedia } from 'react-use'

export const MEDIA_WIDTHS = {
    upToExtraSmall: 500,
    upToSmall: 720,
    upToMedium: 960,
    upToLarge: 1280,
}

export const useIsMobileByMedia = () => useMedia(`(max-width: ${MEDIA_WIDTHS['upToMedium']}px)`)