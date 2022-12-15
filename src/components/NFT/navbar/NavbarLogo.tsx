import Link from 'next/link'
import { FC } from 'react'
import Image from 'next/image'
import { useActiveWeb3React } from 'services/web3'

const NAVBAR_LOGO = process.env.NEXT_PUBLIC_NAVBAR_LOGO
const SOURCE_ID = process.env.NEXT_PUBLIC_SOURCE_ID
const DESKTOP_NAVBAR_LOGO = process.env.NEXT_PUBLIC_DESKTOP_NAVBAR_LOGO
const NAVBAR_LOGO_LINK = process.env.NEXT_PUBLIC_NAVBAR_LOGO_LINK

type Props = {
  variant?: 'desktop' | 'mobile' | undefined
  className?: string
}

const NavbarLogo: FC<Props> = ({ variant, className }) => {
  const logo = NAVBAR_LOGO || '/nfnt-small-brand.png'
  const desktopLogo = DESKTOP_NAVBAR_LOGO || 'https://soul.sh/title-logo.png'
  const logoAlt = SOURCE_ID ? `${SOURCE_ID} Logo` : 'SoulSwap Logo'
  const mobileVariant = variant == 'mobile'
  const desktopVariant = variant == 'desktop'
  const { chainId, library } = useActiveWeb3React()
  const isFantom = chainId == 250
  const CHAIN_ID = chainId

  return (
    <Link href={NAVBAR_LOGO_LINK || '/'}>
      <a
        className={`relative inline-flex flex-none items-center gap-1 ${className}`}
      >
        <Image
          src={logo}
          alt={logoAlt}
          width={24}
          height={24}
          className={`h-9 w-auto ml-0 ${!variant ? 'md:hidden' : ''} ${
            desktopVariant ? 'hidden' : ''
          } ${mobileVariant ? 'block' : ''}`}
        />
        <Image
          src={desktopLogo}
          alt={logoAlt}
          width={24}
          height={24}
          className={`h-9 w-auto md:block ${
            !variant ? 'hidden md:block' : ''
          } ${mobileVariant ? 'hidden' : ''} ${desktopVariant ? 'block' : ''}`}
        />
        {isFantom && (
          <div
            className={`reservoir-tiny inline rounded-[4px] bg-[#FFD700] p-1 py-[2px]
          ${
            !variant || desktopVariant
              ? 'md:absolute md:left-[-50px] md:bottom-[8px]'
              : ''
          }
          `}
          >
            Fantom Opera
          </div>
        )}
      </a>
    </Link>
  )
}

export default NavbarLogo
