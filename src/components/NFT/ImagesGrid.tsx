import { paths } from 'nfnt-client-sdk/dist/types/api'
import { optimizeImage } from 'features/nft/lib/optimizeImage'
import React, { FC } from 'react'
import Image from 'next/image'

type Props = {
  sample_images: NonNullable<
    paths['/collections/{collection}/attributes/explore/v2']['get']['responses']['200']['schema']['attributes']
  >[0]['sampleImages']
  value: NonNullable<
    paths['/collections/{collection}/attributes/explore/v2']['get']['responses']['200']['schema']['attributes']
  >[0]['value']
}

const ImagesGrid: FC<Props> = ({ sample_images, value }) => {
  return (
    <>
      {!!sample_images && sample_images.length > 0 ? (
        <div className="grid grid-cols-[1fr_1fr_25%] items-center gap-1.5">
          {sample_images.length > 1 ? (
            // SMALLER IMAGE, HAS SIDE IMAGES
            <Image
              src={optimizeImage(sample_images[0], 250)}
              className="col-span-2 w-full rounded object-cover"
              width="224"
              height="224"
              alt={'sample image'}
            />
          ) : (
            // BIG IMAGE, NO SIDE IMAGES
            <Image
              src={optimizeImage(sample_images[0], 300)}
              className="col-span-2 w-full rounded object-contain"
              width="300"
              height="300"
              alt={'sample image'}
            />
          )}
          {sample_images.length > 1 && (
            <div className="flex h-full flex-col gap-1">
              {sample_images.slice(1).map((image) => (
                <Image
                  key={image}
                  src={optimizeImage(image, 70)}
                  width="70"
                  height="70"
                  className="w-[70px] rounded"
                  alt={'sample image'}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-w-1 aspect-h-1 relative">
          <Image
           src="https://via.placeholder.com/250" width="250" height="250" alt={'placeholder image'} />
        </div>
      )}
    </>
  )
}

export default ImagesGrid
