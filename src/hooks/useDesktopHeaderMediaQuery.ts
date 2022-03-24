import getConfig from 'next/config'
import { useMediaQuery } from 'react-responsive'
const { publicRuntimeConfig } = getConfig()

const useDesktopHeaderMediaQuery = () => {
  const { breakpoints } = publicRuntimeConfig
  // return useMediaQuery({ query: `(min-width: lg` })
  return useMediaQuery({ query: `(min-width: 460px` })
}

export const useTouchDeviceMediaQuery = () => {
  return useMediaQuery({ query: `(hover: none) and (pointer: coarse)` })
}

export default useDesktopHeaderMediaQuery