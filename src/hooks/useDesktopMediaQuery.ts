import getConfig from 'next/config'
import { useMediaQuery } from 'react-responsive'
const { publicRuntimeConfig } = getConfig()

// const LG_BREAKPOINT = '1360px'

const useDesktopMediaQuery = () => {
  const { breakpoints } = publicRuntimeConfig
  // return useMediaQuery({ query: `(min-width: lg` })
  return useMediaQuery({ query: `(min-width: ${breakpoints.lg}` })
  // return useMediaQuery({ query: `(min-width: ${LG_BREAKPOINT}` })
}

export const useTouchDeviceMediaQuery = () => {
  return useMediaQuery({ query: `(hover: none) and (pointer: coarse)` })
}

export default useDesktopMediaQuery