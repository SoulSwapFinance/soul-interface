import React, { FC } from 'react'
import Mobile from 'components/Header/Mobile'
import useDesktopHeaderMediaQuery from 'hooks/useDesktopHeaderMediaQuery'

import Desktop from './Desktop'

const Header: FC = () => {
  const isDesktop = useDesktopHeaderMediaQuery()

  return <>{isDesktop ? <Desktop /> : <Mobile />}</>
}

export default Header