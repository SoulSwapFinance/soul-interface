import {Button, ButtonProps } from 'components/Button'
import React, { FC } from 'react'

export interface ModalActionProps extends ButtonProps {
  main?: boolean
}

const ModalAction: FC<ModalActionProps> = ({ children, disabled, main = false, ...props }) => {
  return (
    <Button {...props} size="sm" color="purple" disabled={disabled} variant={main ? 'filled' : 'empty'}>
      {children}
    </Button>
  )
}

export default ModalAction