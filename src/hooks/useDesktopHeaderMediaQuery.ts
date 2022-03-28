import getConfig from 'next/config'
import { useMediaQuery } from 'react-responsive'

const useDesktopHeaderMediaQuery = () => {
  return useMediaQuery({ query: `(min-width: 500px` })
}

export const useTouchDeviceMediaQuery = () => {
  return useMediaQuery({ query: `(hover: none) and (pointer: coarse)` })
}

export default useDesktopHeaderMediaQuery