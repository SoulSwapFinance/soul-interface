import React, { FC } from 'react'
import { classNames } from 'functions/styling'
import NextImage from 'next/legacy/image'
import { getOptimizedMedia, isMediaVideo } from 'features/academy/lib/media'

interface ImageProps {
  quality?: number
  height?: number
  width?: number
  layout?: 'fill' | 'responsive'
  objectFit?: 'cover' | 'contain'
  className?: string
  image: any
  // image: UploadFileEntity
}

export const Image: FC<ImageProps> = ({
  quality = 100,
  width,
  height,
  image,
  className,
  layout = 'fill',
  objectFit = 'cover',
}) => {
  if (!image?.attributes || !image?.attributes.url) {
    return <></>
  }

  if (isMediaVideo(image.attributes.provider_metadata)) {
    return (
      <video
        autoPlay={true}
        loop
        className={classNames(className, '!my-0')}
        {...(width && { width })}
        {...(height && { height })}
        style={{ objectFit: 'cover', height }}
      >
        <source src={getOptimizedMedia({ metadata: image.attributes.provider_metadata })} />
      </video>
    )
  }

  const { width: _width, height: _height, alternativeText } = image.attributes

  return (
    <NextImage
      quality={quality}
      className={className}
      layout={layout}
      width={width || _width || 640}
      height={height || _height || 400}
      objectFit={objectFit}
      src={getOptimizedMedia({ metadata: image.attributes.provider_metadata, width, height })}
      alt={alternativeText || ''}
    />
  )
}