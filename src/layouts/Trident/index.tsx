import Background, { BackgroundVariant } from 'components/Background'
import Container, { MaxWidth } from 'components/ContainerFlow'
import Footer from 'components/Footer'
import Header from 'components/Header'
import Main from 'components/Main'
import Popups from 'components/Popups'
import { classNames } from 'functions'
import React, { FC } from 'react'

interface TridentHeaderProps {
  children?: any
  className?: string
  pattern?: BackgroundVariant
  maxWidth?: MaxWidth
  condensed?: boolean
}

export const TridentHeader: FC<TridentHeaderProps> = ({
  children,
  className,
  pattern,
  maxWidth = '7xl',
  condensed,
}) => {
  return (
    <header className="relative w-full flex flex-col justify-center items-center">
      <Background variant={pattern} />
      <Container
        maxWidth={maxWidth}
        className={classNames('flex flex-col gap-5 z-[1] p-6 lg:py-10', condensed && 'py-5', className)}
      >
        {children}
      </Container>
    </header>
  )
}

interface TridentBodyProps {
  children?: any
  className?: string
  maxWidth?: MaxWidth
}

export const TridentBody: FC<TridentBodyProps> = ({ children, className, maxWidth = '7xl' }) => {
  return (
    <Main>
      <Container maxWidth={maxWidth} className={classNames('flex flex-col gap-10 z-[1] p-6 lg:py-10', className)}>
        {children}
      </Container>
    </Main>
  )
}

interface Props {
  children?: any
}

const TridentLayout: FC<Props> = ({ children = [] }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col items-center w-full flex-grow">
        <div className="w-full flex-grow flex flex-col">{children}</div>
        <Popups />
      </div>
      <Footer />
    </div>
  )
}

export default TridentLayout