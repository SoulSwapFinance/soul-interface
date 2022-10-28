import getConfig from 'next/config'
import { useMediaQuery } from 'react-responsive'

// import tailwindConfig from './tailwind'

// const breakpoints = tailwindConfig.theme.screens

export function useBreakpoint<K extends string>(breakpointKey: K) {
  const { publicRuntimeConfig } = getConfig()
  const { breakpoints } = publicRuntimeConfig

  const bool = useMediaQuery({
    query: `(min-width: ${breakpoints[breakpointKey]})`,
  })
  const capitalizedKey = breakpointKey[0].toUpperCase() + breakpointKey.substring(1)
  type Key = `is${Capitalize<K>}`
  return {
    [`is${capitalizedKey}`]: bool,
  } as Record<Key, boolean>
}
