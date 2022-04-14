import Container from 'components/Container'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import React, { FC } from 'react'

import DefaultLayout from './Default'

export interface Card {
  children?: any
}

export const SwapLayoutCard: FC<Card> = ({ children }) => {
  return (
    <div className="flex flex-col gap-3 p-2 pt-4 rounded-[18px] bg-dark-900 shadow-md shadow-dark-1000">
      {children}
    </div>
  )
}

export interface Layout {
  children?: React.ReactChild
  id: string
}

export const Layout: FC<Layout> = ({ children, id }) => {
  return (
    <DefaultLayout>
      <Container id={id} className="justify-center py-4" maxWidth="2xl">
        <DoubleGlowShadowV2>{children}</DoubleGlowShadowV2>
      </Container>
    </DefaultLayout>
  )
}

type SwapLayout = (id: string) => FC
export const SwapLayout: SwapLayout = (id: string) => {
  return (props) => <Layout id={id} {...props} />
}