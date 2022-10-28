import { Link } from 'components/Link'
import { classNames } from 'functions/styling'
import { FC } from 'react'
// import { Theme } from '../types'

interface Caption {
  className?: string
  theme?: any //Theme
}

export const Caption: FC<Caption> = ({ className, theme }) => {
  return (
    <div
      className={classNames(
        className,
        theme.secondary.default,
        theme.secondary.hover,
        'flex items-center justify-center gap-2 cursor-pointer'
      )}
    >
      <Link.Internal href="https://exchange.soulswap.finance" passHref={true}>
        <a
          className={classNames(
            theme.secondary.default,
            theme.secondary.hover,
            'text-xs select-none w-full flex justify-center mt-1.5 -mb-1.5'
          )}
        >
          {/* <SoulIcon width={16} height={16} className="mr-1 hover:animate-spin hover:text-pink" /> */}
          Powered by <span className="ml-1 font-bold">Soul</span>
        </a>
      </Link.Internal>
    </div>
  )
}
