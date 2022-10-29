import { FC } from 'react'
import { Link } from 'components/Link'
import { classNames } from 'functions'
import { useRouter } from 'next/router'

export interface NavItemProps {
  href: string
  label: string
  external?: boolean
}

export const NavItem: FC<NavItemProps> = ({ href, label, external }) => {
  const { basePath } = useRouter()

  if (external) {
    return (
      <Link.External href={href} className="decoration-transparent">
        <span
          className={classNames(
            href.includes(basePath) ? 'text-slate-50' : 'text-slate-300',
            'text-sm font-semibold text-slate-400 hover:text-slate-50 cursor-pointer'
          )}
        >
          {label}
        </span>
      </Link.External>
    )
  }

  return (
    <Link.Internal href={href} className="decoration-transparent" passHref>
      <a>
        <span
          className={classNames(
            href.includes(basePath) ? 'text-slate-50' : 'text-slate-300',
            'text-sm font-semibold text-slate-400 hover:text-slate-50 cursor-pointer'
          )}
        >
          {label}
        </span>
      </a>
    </Link.Internal>
  )
}
