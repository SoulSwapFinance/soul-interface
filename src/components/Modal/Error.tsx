import Typography from 'components/Typography'
import { classNames } from 'functions'
import React, { FC } from 'react'

export interface ModalActionErrorProps {
  className?: string
  children?: React.ReactNode
}

const ModalError: FC<ModalActionErrorProps> = ({ className = '', children }) => {
  if (!children) return <></>

  return (
    <Typography variant="xs" weight={700} className={classNames('text-center text-red', className)}>
      {children}
    </Typography>
  )
}

export default ModalError
