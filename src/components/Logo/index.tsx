import { IconProps } from 'react-feather'
import React, { CSSProperties, FC, useState } from 'react'

import Image from '../Image'
import { classNames } from 'functions'
import { cloudinaryLoader } from 'functions/cloudinary'
import { NETWORKS_INFO } from 'constants/networks'
import { ChainId } from 'sdk'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

export type LogoProps = {
  srcs: string[]
  width: string | number
  height: string | number
  alt?: string
} & IconProps

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const Logo: FC<LogoProps> = ({ srcs, width = 24, height = 24, alt = '', className, ...rest }) => {
  const [, refresh] = useState<number>(0)
  const src = srcs.find((src) => !BAD_SRCS[src])
  return (
    <div className="rounded">
      <Image
        unoptimized
        src={src || 'https://raw.githubusercontent.com/SoulSwapFinance/icons/prod/token/unknown.png'}
        loader={cloudinaryLoader}
        onError={() => {
          if (src) BAD_SRCS[src] = true
          refresh((i) => i + 1)
        }}
        width={width}
        height={height}
        alt={alt}
        layout="fixed"
        className={classNames('rounded', className)}
        {...rest}
      />
    </div>
  )
}

export function NetworkLogo({ chainId, style = {} }: { chainId: ChainId; style?: CSSProperties }) {
  const { iconDark } = NETWORKS_INFO[chainId]
  const iconSrc = iconDark
  if (!iconSrc) return null
  return <img 
    src={iconSrc} 
    alt="Switch Network" 
    style={style} 
  />
}


export default Logo
