import React, { FC } from 'react'
import useDesktopHeaderMediaQuery from 'hooks/useDesktopHeaderMediaQuery'
import Dropdown from './Dropdown'

const Header: FC = () => {
  return <>{<Dropdown />}</>
}

export default Header