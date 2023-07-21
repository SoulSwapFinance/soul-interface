import Link, { LinkProps } from 'next/link'
import React, { Children } from 'react'

import { useRouter } from 'next/router'

const NavLink = ({ children, exact = false, activeClassName = 'text-high-emphesis', ...props }) => {
  const { asPath, pathname, route, query, basePath } = useRouter()
  const child = Children.only(children)
  const childClassName = child.props.className || ''

  // pages/index.js will be matched via props.href
  // pages/about.js will be matched via props.href
  // pages/[slug].js will be matched via props.as

  const isActive = exact
    ? (props.as || props.href.pathname || props.href) === asPath
    : asPath.startsWith(props.as || props.href.pathname || props.href)

  const className = isActive ? `${childClassName} ${activeClassName}`.trim() : childClassName

  // console.log({ asPath, pathname, route, query })

  return (
    <Link
      // legacyBehavior={true}
      href={props.href} {...props}
    >
      {React.cloneElement(child, {
        className: className || null,
      })}
    </Link>
  )
}

export default NavLink
