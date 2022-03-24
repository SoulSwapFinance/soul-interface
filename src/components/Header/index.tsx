import React, { FC } from 'react'
import useDesktopHeaderMediaQuery from 'hooks/useDesktopHeaderMediaQuery'
import Mobile from 'components/Header/Mobile'
import Desktop from './Desktop'

const Header: FC = () => {
  const isDesktop = useDesktopHeaderMediaQuery()

  return <>{isDesktop ? <Desktop /> : <Mobile />}</>
}

export default Header