import Container from 'components/Container'
import DoubleGlowShadow from 'components/DoubleGlowShadow'
import React, { FC } from 'react'

import DefaultLayout from './Default'

export interface Layout {
  id: string
}

export const SwapLayoutCard: FC = ({ children }) => {
  return (
    <div className="flex flex-col gap-3 p-2 pt-4 rounded-[18px] bg-dark-800 shadow-md shadow-dark-1000">
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

type SwapLayout = (id: string) => FC
export const SwapLayout: SwapLayout = (id: string) => {
  return (props) => <Layout id={id} {...props} />
}