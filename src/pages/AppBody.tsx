import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 2.5rem 70px;
  overflow:auto;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    padding: 0rem 0px;
  `};
`

const BodyContent = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  bottom: 0;
  left: 320px;
  padding: 0rem 0px;
  overflow: auto;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    overflow:auto;
    padding: 16px;
    left:0;
    bottom:65px;
  `};
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return (
    <BodyContent>
      <BodyWrapper>{children}</BodyWrapper>
    </BodyContent>
  )
}
