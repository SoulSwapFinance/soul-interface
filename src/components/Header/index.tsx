import React, { FC } from 'react'
import useDesktopHeaderMediaQuery from 'hooks/useDesktopHeaderMediaQuery'
import Mobile from 'components/Header/Mobile'
import DesktopV2 from './DesktopV2'

const Header: FC = () => {
  const isDesktop = useDesktopHeaderMediaQuery()

  return <>{isDesktop ? <DesktopV2 /> : <Mobile />}</>
}

export default Header