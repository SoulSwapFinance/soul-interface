import React from 'react'
import Image from '../Image'

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const SoulLogo = () => {
  return (
    <>
      {/* <div className="mt-4 mb-4 sm:hidden"></div> */}
      <div className="mt-4 mb-4 sm:hidden"></div>
      <div className="flex justify items-center mt-8 mb-12 hidden sm:block" style={{ minHeight: 40 }}>
        {/* <Image src="https://soul.sh/title-logo.png" alt="SoulPower" width={600} height={100} /> */}
        {/* <Image src="/title-soul-halfs.png" alt="SoulPower" width={1020} height={360} /> */}
        {/* <Image src="/offering.gif" alt="offering soul" width={600} height={300} /> */}
        {/* <Image src="/sliced.gif" alt="offering soul" width={1080} height={200} /> */}

        {/* <iframe src="https://media.giphy.com/media/26wdcnG8UP85vOtGw/giphy-downsized-large.gif" width="1080" height="360" frameBorder="0" allowFullScreen></iframe><p></p> */}

      </div>
    </>
  )
}

export default SoulLogo
