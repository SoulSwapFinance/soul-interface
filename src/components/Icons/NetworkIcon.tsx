import { ChainId } from 'sdk'
import React, { FC, useMemo } from 'react'

import { NETWORK_CIRCLE_ICON, NETWORK_NAKED_ICON } from './network'

interface Props extends React.ComponentProps<'svg'> {
  type?: 'naked' | 'circle'
  chainId: ChainId
}

export const NetworkIcon: FC<Props> = ({ type = 'circle', chainId, ...props }) => {
  const Icon = useMemo(() => {
    if (type === 'naked') {
      return NETWORK_NAKED_ICON[chainId ?? ChainId.FANTOM]
    }

    return NETWORK_CIRCLE_ICON[chainId ?? ChainId.FANTOM]
  }, [chainId, type])

  if (Icon) return <Icon {...props} />
  return <></>
}
