import Mobile from 'components/Header/Mobile'
import useDesktopMediaQuery from 'hooks/useDesktopMediaQuery'
import React, { FC } from 'react'
import styled from 'styled-components'

import Desktop from './Desktop'

const Header: FC = () => {
  const isDesktop = useDesktopMediaQuery()

  return <>{ isDesktop ? <Desktop /> : <Mobile /> }</>
}

export default Header