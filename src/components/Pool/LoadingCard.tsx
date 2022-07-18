import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { Box, Flex } from 'rebass/styled-components'
import styled from 'styled-components'
import DoubleCurrencyLogo from '../DoubleLogo'

const BaseCard = styled(Box)<{
    padding?: string
    border?: string
    borderRadius?: string
  }>`
    width: 100%;
    border-radius: 16px;
    padding: 1.25rem;
    padding: ${({ padding }) => padding};
    border: ${({ border }) => border};
    border-radius: ${({ borderRadius }) => borderRadius ?? '8px'};
  `

export const DarkCard = styled(BaseCard)<{ selectable?: boolean }>`
  background-image: linear-gradient(180deg, rgba(41, 38, 67, 0) 0%, rgba(68, 65, 99, 0.5) 100%);
  position: relative;
  cursor: ${props => (props.selectable ? 'pointer' : 'auto')};
  z-index: 0;
  position: relative;
  ::before {
    background-color: ${props => props.theme.darkest};
    content: '';
    z-index: -1;
    top: 1px;
    left: 1px;
    bottom: 1px;
    right: 1px;
    position: absolute;
    border-radius: 8px;
  }
`
export function LoadingCard() {
  return (
    <Card>
      <Flex alignItems="center" flexDirection="row" justifyContent="space-between">
        <Flex style={{ gap: '8px' }} flexDirection="column">
          <DoubleCurrencyLogo 
            // spaceBetween={0} 
            // marginLeft={0} marginRight={14} top={0} 
            // loading size={30} 
            />
          <Skeleton height="18px" width="90px" />
          <Skeleton height="22px" width="100px" />
        </Flex>
        <Flex style={{ gap: '8px' }} alignItems="flex-end" flexDirection="column">
          <Skeleton height="10px" width="70px" />
          <Skeleton height="20px" width="35px" />
          <Skeleton height="20px" width="48px" />
        </Flex>
      </Flex>
    </Card>
  )
}

const Card = styled(DarkCard)`
  height: 147px;
  padding: 16px;
  min-width: 240px;
`