import { ChainId, Token } from 'sdk'
import { useLayoutEffect, useState } from 'react'

import Vibrant from 'node-vibrant'
import { hex } from 'wcag-contrast'
import { shade } from 'polished'
import { uriToHttp } from 'functions/convert'

async function getColorFromToken(token: Token): Promise<string | null> {
  if (token.chainId === ChainId.FANTOM && token.address === '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E') { // dai
    return Promise.resolve('#FAAB14')
  }

  const path = `https://raw.githubusercontent.com/SoulSwapFinance/assets/prod/blockchains/fantom/assets/${token.address}/logo.png`

  return Vibrant.from(path)
    .getPalette()
    .then((palette) => {
      if (palette?.Vibrant) {
        let detectedHex = palette.Vibrant.hex
        let AAscore = hex(detectedHex, '#FFF')
        while (AAscore < 3) {
          detectedHex = shade(0.005, detectedHex)
          AAscore = hex(detectedHex, '#FFF')
        }
        return detectedHex
      }
      return null
    })
    .catch(() => null)
}

async function getColorFromUriPath(uri: string): Promise<string | null> {
  const formattedPath = uriToHttp(uri)[0]

  return Vibrant.from(formattedPath)
    .getPalette()
    .then((palette) => {
      if (palette?.Vibrant) {
        return palette.Vibrant.hex
      }
      return null
    })
    .catch(() => null)
}

export function useColor(token?: Token) {
  const [color, setColor] = useState('#0094ec')

  useLayoutEffect(() => {
    let stale = false

    if (token) {
      getColorFromToken(token).then((tokenColor) => {
        if (!stale && tokenColor !== null) {
          setColor(tokenColor)
        }
      })
    }

    return () => {
      stale = true
      setColor('#0094ec')
    }
  }, [token])

  return color
}

export function useListColor(listImageUri?: string) {
  const [color, setColor] = useState('#0094ec')

  useLayoutEffect(() => {
    let stale = false

    if (listImageUri) {
      getColorFromUriPath(listImageUri).then((color) => {
        if (!stale && color !== null) {
          setColor(color)
        }
      })
    }

    return () => {
      stale = true
      setColor('#0094ec')
    }
  }, [listImageUri])

  return color
}
