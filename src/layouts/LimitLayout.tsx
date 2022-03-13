import Container from 'components/Container'
import DoubleGlowShadow from 'components/DoubleGlowShadow'
import React, { FC } from 'react'

import DefaultLayout from './Default'

export interface Layout {
  id: string
}

export const LimitLayoutCard: FC = ({ children }) => {
  return (
    <div className="flex flex-col p-2 pt-4 rounded-[18px] bg-dark-900 shadow-md shadow-dark-1000">
      {children}
    </div>
  )
}

export const Layout: FC<Layout> = ({ children, id }) => {
  return (
    <DefaultLayout>
      <Container id={id} className="justify-center py-4" maxWidth="2xl">
        <DoubleGlowShadow>{children}</DoubleGlowShadow>
      </Container>
    </DefaultLayout>
  )
}

type LimitLayout = (id: string) => FC
export const LimitLayout: LimitLayout = (id: string) => {
  return (props) => <Layout id={id} {...props} />
}