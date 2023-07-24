import React, { FC, HTMLProps, useCallback } from 'react'

import ReactGA from 'react-ga'
import { classNames } from '../../functions'

const COLOR = {
  default: 'text-primary hover:text-high-emphesis focus:text-high-emphesis',
  blue: 'text-blue opacity-80 hover:opacity-100 focus:opacity-100',
  purple: 'text-purple opacity-80 hover:opacity-100 focus:opacity-100',
  ftmBlue: 'text-ftmBlue opacity-100 hover:opacity-100 focus:opacity-100',
  ethBlue: 'text-ethBlue opacity-100 hover:opacity-100 focus:opacity-100',
  btcOrange: 'text-btcOrange opacity-100 hover:opacity-100 focus:opacity-100',
  usdcBlue: 'text-usdcBlue opacity-100 hover:opacity-100 focus:opacity-100',
  avaxRed: 'text-avaxRed opacity-100 hover:opacity-100 focus:opacity-100',
  binanceGold: 'text-binanceGold opacity-100 hover:opacity-100 focus:opacity-100',
  moonriverTeal: 'text-moonriverTeal opacity-100 hover:opacity-100 focus:opacity-100',
  maticPurple: 'text-maticPurple opacity-100 hover:opacity-100 focus:opacity-100',
}

interface ExternalLinkProps extends Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> {
  href: string
  startIcon?: JSX.Element
  endIcon?: JSX.Element
}

const ExternalLink: FC<ExternalLinkProps> = ({
  target = '_blank',
  href,
  children,
  rel = 'noopener noreferrer',
  className = '',
  color = 'default',
  startIcon = undefined,
  endIcon = undefined,
  ...rest
}) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      // don't prevent default, don't redirect if it's a new tab
      if (target === '_blank' || event.ctrlKey || event.metaKey) {
        ReactGA.outboundLink({ label: href }, () => {
          console.debug('Fired outbound link event', href)
        })
      } else {
        event.preventDefault()
        // send a ReactGA event and then trigger a location change
        ReactGA.outboundLink({ label: href }, () => {
          window.location.href = href
        })
      }
    },
    [href, target]
  )

  return (
    <a
      target={target}
      rel={rel}
      href={href}
      onClick={handleClick}
      className={classNames(
        'text-baseline whitespace-nowrap',
        COLOR[color],
        (startIcon || endIcon) && 'space-x-1 flex items-center justify-center',
        className
      )}
      {...rest}
    >
      {startIcon && startIcon}
      {children}
      {endIcon && endIcon}
    </a>
  )
}

export default ExternalLink
