import { useEffect, useState } from 'react'

const isClient = typeof window !== 'undefined'

export function getIsMobile() {
  return isClient ? window.innerWidth < 600 : false
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(getIsMobile)

  useEffect(() => {
    function handleResize() {
      setIsMobile(getIsMobile())
    }

    if (isClient) {
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
    return undefined
  }, [])

  return isMobile
}