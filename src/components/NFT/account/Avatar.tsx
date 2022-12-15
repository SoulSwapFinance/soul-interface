import { FC } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import Image from 'next/image'

type Props = {
  address: string | undefined
  avatar?: string | null | undefined
  size?: number
}

const Avatar: FC<Props> = ({ address, avatar, size = 24 }) => {
  return avatar ? (
    <div
      className="overflow-hidden rounded-full"
      style={{
        height: size,
        width: size,
      }}
    >
      <Image
      height={32}
      width={32}
        className="object-fit h-full w-full"
        src={avatar}
        alt={'ENS Avatar'}
      />
    </div>
  ) : (
    <Jazzicon diameter={size} seed={jsNumberForAddress(address || '')} />
  )
}

export default Avatar
